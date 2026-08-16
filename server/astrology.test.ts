import { describe, expect, it } from "vitest";
import {
  calculateChart,
  calculateSolarReturn,
  circularDistance,
  normalizeAngle,
  signAt,
  type BirthProfile,
} from "../client/src/lib/astrology";

const profile: BirthProfile = {
  date: "1991-06-15",
  time: "14:30",
  location: {
    name: "Montevideo",
    country: "Uruguay",
    latitude: -34.9011,
    longitude: -56.1645,
    timezone: "America/Montevideo",
  },
};

describe("motor astrológico", () => {
  it("normaliza ángulos y asigna los signos correspondientes", () => {
    expect(normalizeAngle(-15)).toBe(345);
    expect(circularDistance(355, 5)).toBe(10);
    expect(signAt(61).name).toBe("Géminis");
  });

  it("genera una carta con diez cuerpos, doce casas y ascendente válido", () => {
    const chart = calculateChart(profile);
    expect(chart.planets).toHaveLength(10);
    expect(chart.houses).toHaveLength(12);
    expect(chart.ascendant).toBeGreaterThanOrEqual(0);
    expect(chart.ascendant).toBeLessThan(360);
    expect(chart.planets.every((planet) => planet.house >= 1 && planet.house <= 12)).toBe(true);
  });

  it("encuentra un retorno solar cercano a la longitud solar natal", () => {
    const natal = calculateChart(profile);
    const returnData = calculateSolarReturn(profile, 2026);
    const natalSun = natal.planets.find((planet) => planet.name === "Sol");
    const returnSun = returnData.chart.planets.find((planet) => planet.name === "Sol");
    expect(natalSun).toBeDefined();
    expect(returnSun).toBeDefined();
    expect(circularDistance(natalSun!.longitude, returnSun!.longitude)).toBeLessThan(0.01);
  });
});
