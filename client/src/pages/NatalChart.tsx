import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { BirthProfileForm } from "@/components/BirthProfileForm";
import { ChartWheel } from "@/components/ChartWheel";
import { ToolLayout } from "@/components/ToolLayout";
import { formatDegree, type NatalChart } from "@/lib/astrology";
import { trpc } from "@/lib/trpc";

export default function NatalChart() {
  const [chart, setChart] = useState<NatalChart | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const aiMutation = trpc.ai.interpretChart.useMutation();

  const resetChart = () => {
    setChart(null);
    setMessages([]);
    aiMutation.reset();
  };

  const sendToGuide = (content: string) => {
    if (!chart || aiMutation.isPending) return;
    const nextMessages: Message[] = [...messages, { role: "user", content }];
    const aiMessages = nextMessages.filter((message): message is Extract<Message, { role: "user" | "assistant" }> => message.role !== "system");
    setMessages(nextMessages);
    aiMutation.mutate({
      chart: {
        ascendant: `${chart.ascendantSign.name} ${formatDegree(chart.ascendant)}`,
        planets: chart.planets.map((planet) => ({
          name: planet.name,
          sign: planet.sign.name,
          degree: formatDegree(planet.degreeInSign),
          house: planet.house,
          retrograde: planet.retrograde,
        })),
        aspects: chart.aspects.slice(0, 18).map((aspect) => ({
          first: aspect.first.name,
          second: aspect.second.name,
          name: aspect.name,
          orb: Number(aspect.orb.toFixed(2)),
        })),
        dominants: chart.dominants.map((planet) => planet.name),
      },
      messages: aiMessages,
    }, {
      onSuccess: (content) => setMessages((current) => [...current, { role: "assistant", content }]),
      onError: (error) => setMessages((current) => [...current, { role: "assistant", content: `No pude completar la lectura en este momento. ${error.message}` }]),
    });
  };

  return <ToolLayout eyebrow="Carta natal" title="Tu cielo de nacimiento" intro="Ingresa tus datos para visualizar las posiciones planetarias, las doce casas iguales, el ascendente y los aspectos principales.">
    {!chart ? <section className="calculator-grid"><div className="calculator-aside"><span className="number-orb">01</span><h2>Comienza por tu origen.</h2><p>La fecha señala el cielo, la hora define el horizonte y el lugar permite ajustar ambos a tus coordenadas.</p><div className="aside-quote"><Sparkles size={15} /> Tus datos no se guardan para calcular la carta.</div></div><BirthProfileForm onGenerated={setChart} /></section> : <section className="chart-results">
      <div className="result-toolbar"><div><span className="eyebrow">Carta de {chart.profile.location.name}</span><h2>{chart.ascendantSign.symbol} Ascendente en {chart.ascendantSign.name}</h2></div><button className="button button--ghost" onClick={resetChart}><RotateCcw size={16} /> Nueva carta</button></div>
      <div className="natal-layout"><ChartWheel chart={chart} /><div className="chart-summary"><div className="summary-head"><span>Posiciones</span><small>Casas iguales</small></div>{chart.planets.map((planet) => <div className="planet-row" key={planet.name}><span className="planet-symbol">{planet.symbol}</span><div><strong>{planet.name} en {planet.sign.name}</strong><span>{formatDegree(planet.degreeInSign)} · Casa {planet.house}{planet.retrograde ? " · R" : ""}</span></div><span className="sign-symbol">{planet.sign.symbol}</span></div>)}</div></div>
      <div className="result-columns"><section className="result-panel"><div className="panel-heading"><span>Aspectos destacados</span><small>{chart.aspects.length} aspectos</small></div>{chart.aspects.slice(0, 8).map((aspect, index) => <div className="aspect-row" key={`${aspect.first.name}-${aspect.second.name}-${index}`}><span className={`tone-dot tone-dot--${aspect.tone}`} /><strong>{aspect.first.symbol} {aspect.symbol} {aspect.second.symbol}</strong><span>{aspect.name} · orbe {aspect.orb.toFixed(1)}°</span></div>)}</section><section className="result-panel dominants-panel"><div className="panel-heading"><span>Planetas dominantes</span><small>Énfasis de la carta</small></div>{chart.dominants.map((planet, index) => <div className="dominant-row" key={planet.name}><span>0{index + 1}</span><i>{planet.symbol}</i><strong>{planet.name}</strong><div><b style={{ width: `${planet.score * 7}%` }} /></div></div>)}<p className="result-disclaimer">Los dominantes se estiman por luminosidad y cercanía al ascendente. Son una orientación interpretativa, no un diagnóstico.</p></section></div>
      <section className="ai-reading-panel" aria-labelledby="ai-reading-title"><div className="ai-reading-copy"><span className="eyebrow"><Sparkles size={14} /> Interpretación personalizada</span><h2 id="ai-reading-title">Conversá con tu carta.</h2><p>La guía de IA conecta tus posiciones, casas y aspectos en una lectura original. Podés pedir una síntesis, profundizar en un planeta o preguntar por un aspecto específico.</p><small>La lectura es simbólica, no determinista, y usa únicamente los datos calculados en esta carta.</small></div><AIChatBox messages={messages} onSendMessage={sendToGuide} isLoading={aiMutation.isPending} height={430} placeholder="Preguntá por tu Sol, tu ascendente o un aspecto…" emptyStateMessage="Tu carta está lista para conversar." suggestedPrompts={["Dame una síntesis de mi carta.", "¿Cómo se combinan mi Sol y mi Ascendente?", "¿Qué puedo observar en mis aspectos destacados?"]} className="ai-chat-shell" /></section>
    </section>}
    <div className="next-tool"><div><span className="eyebrow">Profundiza</span><h3>¿Quieres ver cómo se mueve el cielo hoy?</h3></div><a href="/transitos" className="button button--outline">Explorar tránsitos <ArrowRight size={16} /></a></div>
  </ToolLayout>;
}
