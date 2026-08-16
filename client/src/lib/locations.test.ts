import { describe, expect, it } from "vitest";
import { findLocalLocations } from "./locations";

describe("localidades locales", () => {
  it("encuentra Montevideo sin depender de una API", () => {
    const matches = findLocalLocations("Montevideo, Uruguay");
    expect(matches[0]).toMatchObject({ name: "Montevideo", timezone: "America/Montevideo" });
  });

  it("devuelve una lista vacía para una localidad desconocida", () => {
    expect(findLocalLocations("Ciudad inexistente")).toEqual([]);
  });
});
