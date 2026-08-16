import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

type GeoResult = {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  ai: router({
    interpretChart: publicProcedure
      .input(z.object({
        chart: z.object({
          ascendant: z.string().max(120),
          planets: z.array(z.object({
            name: z.string().max(40),
            sign: z.string().max(40),
            degree: z.string().max(40),
            house: z.number().int().min(1).max(12),
            retrograde: z.boolean(),
          })).max(12),
          aspects: z.array(z.object({
            first: z.string().max(40),
            second: z.string().max(40),
            name: z.string().max(40),
            orb: z.number().min(0).max(20),
          })).max(18),
          dominants: z.array(z.string().max(40)).max(5),
        }),
        messages: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string().trim().min(1).max(2000),
        })).max(10),
      }))
      .mutation(async ({ input }) => {
        const context = JSON.stringify(input.chart);
        const response = await invokeLLM({
          maxTokens: 1200,
          messages: [
            {
              role: "system",
              content: "Eres la guía editorial de AstroNexo. Responde en español rioplatense claro, cálido y responsable. Interpreta la carta como lenguaje simbólico de reflexión, nunca como diagnóstico, certeza científica, predicción determinista ni sustituto de asesoramiento profesional. Usa solo los datos entregados. No inventes posiciones. Organiza las respuestas con títulos breves y párrafos concretos. Si el usuario pregunta algo fuera de la carta, dilo con honestidad.",
            },
            {
              role: "system",
              content: `Datos calculados de la carta natal (fuente de verdad, no modificar): ${context}`,
            },
            ...input.messages,
          ],
        });
        const content = response.choices[0]?.message?.content;
        if (typeof content === "string") return content;
        if (Array.isArray(content)) return content.filter((part) => part.type === "text").map((part) => part.text).join("\n");
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "La interpretación no devolvió contenido legible." });
      }),
  }),
  geocode: router({
    search: publicProcedure
      .input(z.object({ query: z.string().trim().min(3).max(120) }))
      .mutation(async ({ input }) => {
        try {
          const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
          url.searchParams.set("name", input.query);
          url.searchParams.set("count", "6");
          url.searchParams.set("language", "es");
          const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
          if (!response.ok) throw new Error("Location lookup failed");
          const data = (await response.json()) as { results?: GeoResult[] };
          return (data.results ?? []).map((result) => ({
            name: result.name,
            country: result.country ?? "",
            admin1: result.admin1 ?? "",
            latitude: result.latitude,
            longitude: result.longitude,
            timezone: result.timezone,
          }));
        } catch {
          throw new TRPCError({
            code: "BAD_GATEWAY",
            message: "No pudimos encontrar lugares en este momento. Intenta con ciudad y país.",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
