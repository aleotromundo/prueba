import { Body, Ecliptic, EclipticGeoMoon, GeoVector, SiderealTime } from "astronomy-engine";

export type LocationChoice = {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

export type BirthProfile = {
  date: string;
  time: string;
  location: LocationChoice;
};

export type ZodiacSign = {
  name: string;
  symbol: string;
  element: "Fuego" | "Tierra" | "Aire" | "Agua";
};

export type PlanetPosition = {
  name: string;
  symbol: string;
  longitude: number;
  sign: ZodiacSign;
  degreeInSign: number;
  retrograde: boolean;
  house: number;
};

export type Aspect = {
  first: PlanetPosition;
  second: PlanetPosition;
  name: "Conjunción" | "Sextil" | "Cuadratura" | "Trígono" | "Quincuncio" | "Oposición";
  symbol: string;
  angle: number;
  orb: number;
  tone: "armónico" | "dinámico" | "neutro";
};

export type NatalChart = {
  profile: BirthProfile;
  instant: Date;
  planets: PlanetPosition[];
  ascendant: number;
  ascendantSign: ZodiacSign;
  houses: number[];
  aspects: Aspect[];
  dominants: { name: string; symbol: string; score: number }[];
};

export const ZODIAC: ZodiacSign[] = [
  { name: "Aries", symbol: "♈︎", element: "Fuego" },
  { name: "Tauro", symbol: "♉︎", element: "Tierra" },
  { name: "Géminis", symbol: "♊︎", element: "Aire" },
  { name: "Cáncer", symbol: "♋︎", element: "Agua" },
  { name: "Leo", symbol: "♌︎", element: "Fuego" },
  { name: "Virgo", symbol: "♍︎", element: "Tierra" },
  { name: "Libra", symbol: "♎︎", element: "Aire" },
  { name: "Escorpio", symbol: "♏︎", element: "Agua" },
  { name: "Sagitario", symbol: "♐︎", element: "Fuego" },
  { name: "Capricornio", symbol: "♑︎", element: "Tierra" },
  { name: "Acuario", symbol: "♒︎", element: "Aire" },
  { name: "Piscis", symbol: "♓︎", element: "Agua" },
];

const PLANETS: { body: Body; name: string; symbol: string; weight: number }[] = [
  { body: Body.Sun, name: "Sol", symbol: "☉", weight: 6 },
  { body: Body.Moon, name: "Luna", symbol: "☽", weight: 6 },
  { body: Body.Mercury, name: "Mercurio", symbol: "☿", weight: 3 },
  { body: Body.Venus, name: "Venus", symbol: "♀", weight: 4 },
  { body: Body.Mars, name: "Marte", symbol: "♂", weight: 4 },
  { body: Body.Jupiter, name: "Júpiter", symbol: "♃", weight: 3 },
  { body: Body.Saturn, name: "Saturno", symbol: "♄", weight: 3 },
  { body: Body.Uranus, name: "Urano", symbol: "♅", weight: 2 },
  { body: Body.Neptune, name: "Neptuno", symbol: "♆", weight: 2 },
  { body: Body.Pluto, name: "Plutón", symbol: "♇", weight: 2 },
];

const ASPECT_DEFINITIONS: { name: Aspect["name"]; symbol: string; angle: number; orb: number; tone: Aspect["tone"] }[] = [
  { name: "Conjunción", symbol: "☌", angle: 0, orb: 8, tone: "neutro" },
  { name: "Sextil", symbol: "⚹", angle: 60, orb: 5, tone: "armónico" },
  { name: "Cuadratura", symbol: "□", angle: 90, orb: 7, tone: "dinámico" },
  { name: "Trígono", symbol: "△", angle: 120, orb: 7, tone: "armónico" },
  { name: "Quincuncio", symbol: "⚻", angle: 150, orb: 3, tone: "dinámico" },
  { name: "Oposición", symbol: "☍", angle: 180, orb: 8, tone: "dinámico" },
];

function celestialLongitude(body: Body, date: Date) {
  if (body === Body.Moon) return EclipticGeoMoon(date).lon;
  return Ecliptic(GeoVector(body, date, true)).elon;
}

export function normalizeAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}

export function circularDistance(first: number, second: number) {
  const difference = Math.abs(normalizeAngle(first) - normalizeAngle(second));
  return difference > 180 ? 360 - difference : difference;
}

export function signAt(longitude: number) {
  return ZODIAC[Math.floor(normalizeAngle(longitude) / 30)] ?? ZODIAC[0];
}

export function formatDegree(degree: number) {
  const normalized = normalizeAngle(degree);
  const whole = Math.floor(normalized % 30);
  const minutes = Math.round(((normalized % 30) - whole) * 60);
  return `${whole}° ${String(minutes).padStart(2, "0")}′`;
}

function getTimezoneOffsetMinutes(date: Date, timeZone: string) {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
  })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;
  const match = name?.match(/(?:GMT|UTC)([+-])(\d{1,2})(?::?(\d{2}))?/);
  if (!match) return 0;
  const sign = match[1] === "+" ? 1 : -1;
  return sign * (Number(match[2]) * 60 + Number(match[3] ?? 0));
}

export function localDateTimeToUtc(date: string, time: string, timeZone: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  const assumedUtc = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  const offset = getTimezoneOffsetMinutes(assumedUtc, timeZone);
  return new Date(assumedUtc.getTime() - offset * 60_000);
}

function obliquityOfEcliptic(date: Date) {
  const centuries = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / (36525 * 86400000);
  return 23.439291 - 0.0130042 * centuries;
}

export function calculateAscendant(date: Date, latitude: number, longitude: number) {
  const lst = normalizeAngle(SiderealTime(date) * 15 + longitude) * (Math.PI / 180);
  const phi = latitude * (Math.PI / 180);
  const epsilon = obliquityOfEcliptic(date) * (Math.PI / 180);
  const longitudeRadians = Math.atan2(
    -Math.cos(lst),
    Math.sin(lst) * Math.cos(epsilon) + Math.tan(phi) * Math.sin(epsilon),
  );
  return normalizeAngle((longitudeRadians * 180) / Math.PI + 180);
}

function houseOf(longitude: number, ascendant: number) {
  return Math.floor(normalizeAngle(longitude - ascendant) / 30) + 1;
}

export function calculateAspects(first: PlanetPosition[], second: PlanetPosition[] = first, crossChart = false) {
  const aspects: Aspect[] = [];
  first.forEach((planet, firstIndex) => {
    second.forEach((candidate, secondIndex) => {
      if (!crossChart && secondIndex <= firstIndex) return;
      const separation = circularDistance(planet.longitude, candidate.longitude);
      const match = ASPECT_DEFINITIONS.find((definition) => Math.abs(separation - definition.angle) <= definition.orb);
      if (!match) return;
      aspects.push({
        first: planet,
        second: candidate,
        name: match.name,
        symbol: match.symbol,
        angle: match.angle,
        orb: Math.abs(separation - match.angle),
        tone: match.tone,
      });
    });
  });
  return aspects.sort((a, b) => a.orb - b.orb);
}

function calculateDominants(planets: PlanetPosition[], ascendant: number) {
  return planets
    .map((planet, index) => {
      const base = PLANETS[index]?.weight ?? 2;
      const angularity = Math.max(0, 4 - Math.floor(circularDistance(planet.longitude, ascendant) / 30));
      const luminaryBonus = planet.name === "Sol" || planet.name === "Luna" ? 2 : 0;
      return { name: planet.name, symbol: planet.symbol, score: base + angularity + luminaryBonus };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export function calculateChart(profile: BirthProfile, instantOverride?: Date): NatalChart {
  const instant = instantOverride ?? localDateTimeToUtc(profile.date, profile.time, profile.location.timezone);
  const ascendant = calculateAscendant(instant, profile.location.latitude, profile.location.longitude);
  const planets = PLANETS.map((planet) => {
    const longitude = normalizeAngle(celestialLongitude(planet.body, instant));
    const future = normalizeAngle(celestialLongitude(planet.body, new Date(instant.getTime() + 86400000)));
    const delta = normalizeAngle(future - longitude);
    return {
      name: planet.name,
      symbol: planet.symbol,
      longitude,
      sign: signAt(longitude),
      degreeInSign: longitude % 30,
      retrograde: delta > 180,
      house: houseOf(longitude, ascendant),
    };
  });
  return {
    profile,
    instant,
    planets,
    ascendant,
    ascendantSign: signAt(ascendant),
    houses: Array.from({ length: 12 }, (_, index) => normalizeAngle(ascendant + index * 30)),
    aspects: calculateAspects(planets),
    dominants: calculateDominants(planets, ascendant),
  };
}

function angularDifference(first: number, second: number) {
  const diff = normalizeAngle(first - second);
  return diff > 180 ? diff - 360 : diff;
}

export function calculateSolarReturn(profile: BirthProfile, year: number) {
  const natalInstant = localDateTimeToUtc(profile.date, profile.time, profile.location.timezone);
  const targetLongitude = normalizeAngle(celestialLongitude(Body.Sun, natalInstant));
  const [month, day] = profile.date.split("-").slice(1).map(Number);
  const origin = Date.UTC(year, month - 1, day, 12) - 3 * 86400000;
  let best = new Date(origin);
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let hour = 0; hour <= 144; hour += 1) {
    const candidate = new Date(origin + hour * 3600000);
    const distance = Math.abs(angularDifference(celestialLongitude(Body.Sun, candidate), targetLongitude));
    if (distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  }
  let left = best.getTime() - 2 * 3600000;
  let right = best.getTime() + 2 * 3600000;
  for (let iteration = 0; iteration < 28; iteration += 1) {
    const first = left + (right - left) / 3;
    const second = right - (right - left) / 3;
    const firstDistance = Math.abs(angularDifference(celestialLongitude(Body.Sun, new Date(first)), targetLongitude));
    const secondDistance = Math.abs(angularDifference(celestialLongitude(Body.Sun, new Date(second)), targetLongitude));
    if (firstDistance < secondDistance) right = second;
    else left = first;
  }
  const returnInstant = new Date((left + right) / 2);
  return { instant: returnInstant, chart: calculateChart(profile, returnInstant) };
}

export function calculateSynastry(first: NatalChart, second: NatalChart) {
  const aspects = calculateAspects(first.planets, second.planets, true);
  const scoreDelta = aspects.reduce((total, aspect) => {
    const closeness = 1 - aspect.orb / (ASPECT_DEFINITIONS.find((item) => item.name === aspect.name)?.orb ?? 1);
    const value = aspect.name === "Trígono" ? 8 : aspect.name === "Sextil" ? 5 : aspect.name === "Conjunción" ? 4 : aspect.name === "Cuadratura" ? -5 : aspect.name === "Oposición" ? -4 : -2;
    return total + value * (0.45 + closeness * 0.55);
  }, 0);
  const score = Math.round(Math.max(18, Math.min(96, 58 + scoreDelta / 3)));
  const harmonious = aspects.filter((aspect) => aspect.tone === "armónico").length;
  const dynamic = aspects.filter((aspect) => aspect.tone === "dinámico").length;
  return { aspects, score, harmonious, dynamic };
}

export function getTransits(natal: NatalChart, now = new Date()) {
  const transitProfile: BirthProfile = {
    date: now.toISOString().slice(0, 10),
    time: now.toISOString().slice(11, 16),
    location: natal.profile.location,
  };
  const current = calculateChart(transitProfile, now);
  return {
    current,
    aspects: calculateAspects(current.planets, natal.planets, true).slice(0, 18),
  };
}

export function formatInstant(instant: Date, timeZone: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone,
  }).format(instant);
}
