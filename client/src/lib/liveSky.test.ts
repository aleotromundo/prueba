import { describe, expect, it } from "vitest";
import { Body, Equator, Horizon, Observer } from "astronomy-engine";

describe("cielo en vivo", () => {
  it("calcula coordenadas horizontales locales para el Sol", () => {
    const date = new Date("2026-08-16T20:00:00.000Z");
    const observer = new Observer(-34.9011, -56.1645, 0);
    const equator = Equator(Body.Sun, date, observer, true, true);
    const horizon = Horizon(date, observer, equator.ra, equator.dec, "normal");

    expect(Number.isFinite(horizon.azimuth)).toBe(true);
    expect(Number.isFinite(horizon.altitude)).toBe(true);
    expect(horizon.azimuth).toBeGreaterThanOrEqual(0);
    expect(horizon.azimuth).toBeLessThan(360);
    expect(horizon.altitude).toBeGreaterThanOrEqual(-90);
    expect(horizon.altitude).toBeLessThanOrEqual(90);
  });
});
