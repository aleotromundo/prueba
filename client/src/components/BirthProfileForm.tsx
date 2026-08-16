import { type FormEvent, useState } from "react";
import { CalendarDays, Check, Loader2, MapPin, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { calculateChart, type BirthProfile, type LocationChoice, type NatalChart } from "@/lib/astrology";

type Props = {
  onGenerated: (chart: NatalChart) => void;
  label?: string;
  compact?: boolean;
};

export function BirthProfileForm({ onGenerated, label = "Generar carta", compact = false }: Props) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [matches, setMatches] = useState<LocationChoice[]>([]);
  const [location, setLocation] = useState<LocationChoice | null>(null);
  const [formError, setFormError] = useState("");
  const [calculating, setCalculating] = useState(false);
  const search = trpc.geocode.search.useMutation();

  const findPlace = async () => {
    setFormError("");
    if (place.trim().length < 3) {
      setFormError("Escribe una ciudad o localidad de al menos tres caracteres.");
      return;
    }
    try {
      const results = await search.mutateAsync({ query: place });
      setMatches(results);
      if (results.length === 0) setFormError("No encontramos esa localidad. Prueba con ciudad y país.");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "No fue posible buscar la localidad.");
    }
  };

  const chooseLocation = (choice: LocationChoice) => {
    setLocation(choice);
    setPlace(`${choice.name}${choice.country ? `, ${choice.country}` : ""}`);
    setMatches([]);
    setFormError("");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!date || !time || !location) {
      setFormError("Completa fecha, hora y selecciona una localidad de la búsqueda.");
      return;
    }
    setCalculating(true);
    setFormError("");
    try {
      const profile: BirthProfile = { date, time, location };
      const chart = calculateChart(profile);
      await new Promise<void>((resolve) => window.setTimeout(resolve, 180));
      onGenerated(chart);
    } catch {
      setFormError("No fue posible calcular la carta con esos datos. Revisa fecha, hora y localidad.");
    } finally {
      setCalculating(false);
    }
  };

  return (
    <form className={`birth-form ${compact ? "birth-form--compact" : ""}`} onSubmit={submit}>
      <div className="form-intro">
        <span className="eyebrow"><CalendarDays size={14} /> Datos de nacimiento</span>
        <p>Usamos tu ubicación para ajustar el huso horario y calcular el ascendente.</p>
      </div>
      <label className="field">
        <span>Fecha</span>
        <input value={date} onChange={(event) => setDate(event.target.value)} type="date" max={new Date().toISOString().slice(0, 10)} required />
      </label>
      <label className="field">
        <span>Hora local</span>
        <input value={time} onChange={(event) => setTime(event.target.value)} type="time" required />
      </label>
      <div className="field field--place">
        <span>Lugar de nacimiento</span>
        <div className="place-search">
          <MapPin size={17} />
          <input value={place} onChange={(event) => { setPlace(event.target.value); setLocation(null); }} placeholder="Ej.: Montevideo, Uruguay" autoComplete="off" />
          <button type="button" onClick={findPlace} aria-label="Buscar localidad" disabled={search.isPending}>
            {search.isPending ? <Loader2 size={17} className="spin" /> : <Search size={17} />}
          </button>
        </div>
        {matches.length > 0 && (
          <div className="location-results" role="listbox" aria-label="Resultados de localidad">
            {matches.map((match) => (
              <button type="button" key={`${match.latitude}-${match.longitude}`} onClick={() => chooseLocation(match)}>
                <MapPin size={15} />
                <span><strong>{match.name}</strong>{match.admin1 ? `, ${match.admin1}` : ""}, {match.country}</span>
                <small>{match.timezone}</small>
              </button>
            ))}
          </div>
        )}
        {location && <span className="field-confirm"><Check size={14} /> {location.timezone}</span>}
      </div>
      {formError && <p className="form-error" role="alert">{formError}</p>}
      <button className="button button--primary button--wide" type="submit" disabled={calculating}>{calculating ? <><Loader2 size={16} className="spin" /> Calculando el cielo…</> : label}</button>
      <p className="form-note">Los cálculos se realizan en tu dispositivo. La astrología se presenta como una herramienta simbólica de reflexión.</p>
    </form>
  );
}
