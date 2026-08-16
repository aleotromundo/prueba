import { describe, expect, it } from "vitest";
import { mapStellariumSelection } from "./StellariumPlanetarium";

describe("selección del planetario Stellarium", () => {
  it("mapea cuerpos del sistema solar a sus fichas en español", () => {
    expect(mapStellariumSelection("NAME Jupiter")).toMatchObject({ name: "Júpiter", symbol: "♃" });
    expect(mapStellariumSelection("Sun")).toMatchObject({ name: "Sol", symbol: "☉" });
    expect(mapStellariumSelection("Moon")).toMatchObject({ name: "Luna", symbol: "☽" });
  });

  it("conserva los nombres de objetos profundos desconocidos", () => {
    expect(mapStellariumSelection("M 42")).toMatchObject({ name: "M 42", symbol: "✦" });
  });

  it("devuelve null cuando no hay selección", () => {
    expect(mapStellariumSelection(null)).toBeNull();
  });
});
