import type { LocationChoice } from "./astrology";

const LOCAL_LOCATIONS: LocationChoice[] = [
  { name: "Montevideo", admin1: "Departamento de Montevideo", country: "Uruguay", latitude: -34.9011, longitude: -56.1645, timezone: "America/Montevideo" },
  { name: "Buenos Aires", admin1: "Ciudad Autónoma de Buenos Aires", country: "Argentina", latitude: -34.6037, longitude: -58.3816, timezone: "America/Argentina/Buenos_Aires" },
  { name: "Santiago", admin1: "Región Metropolitana", country: "Chile", latitude: -33.4489, longitude: -70.6693, timezone: "America/Santiago" },
  { name: "Asunción", admin1: "Asunción", country: "Paraguay", latitude: -25.2637, longitude: -57.5759, timezone: "America/Asuncion" },
  { name: "São Paulo", admin1: "São Paulo", country: "Brasil", latitude: -23.5505, longitude: -46.6333, timezone: "America/Sao_Paulo" },
  { name: "Río de Janeiro", admin1: "Río de Janeiro", country: "Brasil", latitude: -22.9068, longitude: -43.1729, timezone: "America/Sao_Paulo" },
  { name: "Madrid", admin1: "Comunidad de Madrid", country: "España", latitude: 40.4168, longitude: -3.7038, timezone: "Europe/Madrid" },
  { name: "Barcelona", admin1: "Cataluña", country: "España", latitude: 41.3874, longitude: 2.1686, timezone: "Europe/Madrid" },
  { name: "Ciudad de México", admin1: "Ciudad de México", country: "México", latitude: 19.4326, longitude: -99.1332, timezone: "America/Mexico_City" },
  { name: "Bogotá", admin1: "Bogotá D.C.", country: "Colombia", latitude: 4.711, longitude: -74.0721, timezone: "America/Bogota" },
  { name: "Lima", admin1: "Lima", country: "Perú", latitude: -12.0464, longitude: -77.0428, timezone: "America/Lima" },
  { name: "Quito", admin1: "Pichincha", country: "Ecuador", latitude: -0.1807, longitude: -78.4678, timezone: "America/Guayaquil" },
];

export function findLocalLocations(query: string): LocationChoice[] {
  const normalized = query.trim().toLocaleLowerCase("es");
  if (!normalized) return [];
  return LOCAL_LOCATIONS.filter((location) =>
    `${location.name} ${location.admin1} ${location.country}`.toLocaleLowerCase("es").includes(normalized),
  ).slice(0, 5);
}
