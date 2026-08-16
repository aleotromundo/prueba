import { cp, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const outputRoot = resolve("public");
const routes = ["carta-natal", "sinastria", "transitos", "retorno-solar", "ascendente", "guia", "cielo-en-vivo"];
const indexFile = resolve(outputRoot, "index.html");

for (const route of routes) {
  const routeDir = resolve(outputRoot, route);
  await mkdir(routeDir, { recursive: true });
  await cp(indexFile, resolve(routeDir, "index.html"));
}

console.log(`Generated ${routes.length} Vercel SPA route fallbacks in ${outputRoot}`);
