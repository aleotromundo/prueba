import { describe, expect, it, vi } from "vitest";

vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(async () => ({
    choices: [{ message: { content: "## Lectura\nTu carta combina curiosidad y presencia creativa." } }],
  })),
}));

import { invokeLLM } from "./_core/llm";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("ai.interpretChart", () => {
  it("envía el contexto calculado y devuelve una lectura en texto", async () => {
    const caller = appRouter.createCaller({
      user: undefined,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    });

    const result = await caller.ai.interpretChart({
      chart: {
        ascendant: "Escorpio 0° 04′",
        planets: [{ name: "Sol", sign: "Géminis", degree: "24° 07′", house: 8, retrograde: false }],
        aspects: [{ first: "Sol", second: "Mercurio", name: "Conjunción", orb: 1.8 }],
        dominants: ["Luna", "Sol", "Venus"],
      },
      messages: [{ role: "user", content: "Dame una síntesis." }],
    });

    expect(result).toContain("curiosidad");
    expect(invokeLLM).toHaveBeenCalledOnce();
    expect(vi.mocked(invokeLLM).mock.calls[0]?.[0].messages).toHaveLength(3);
  });
});
