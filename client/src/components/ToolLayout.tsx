import { Link } from "wouter";
import { ChevronRight, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";

type Props = { eyebrow: string; title: string; intro: string; children: ReactNode };

export function ToolLayout({ eyebrow, title, intro, children }: Props) {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="tool-page container">
        <div className="breadcrumbs"><Link href="/">Inicio</Link><ChevronRight size={14} /><span>{eyebrow}</span></div>
        <section className="tool-heading">
          <span className="eyebrow"><Sparkles size={14} /> {eyebrow}</span>
          <h1>{title}</h1>
          <p>{intro}</p>
        </section>
        {children}
      </main>
    </div>
  );
}
