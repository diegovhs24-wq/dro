"use client";

import Link from "next/link";

import SketchIcon, {type SketchIconName} from "@/components/SketchIcon";
import {DRO_TOOLS_CONFIG} from "./toolsConfig";
import type {StoplichtKleur, ToolId} from "./toolsTypes";

export function ResultCard({children}: {children: React.ReactNode}) {
  return (
    <div
      aria-live="polite"
      className="rounded-lg border-2 border-brand-orange bg-brand-soft p-6 shadow-sm sm:p-8"
      role="status"
    >
      {children}
    </div>
  );
}

export function ResultHeadline({children}: {children: React.ReactNode}) {
  return <p className="text-2xl font-extrabold leading-tight text-brand-ink sm:text-3xl">{children}</p>;
}

export function TipBlock({children}: {children: React.ReactNode}) {
  return (
    <div className="rounded-lg border border-brand-orange/30 bg-white p-4 text-sm font-semibold leading-6 text-neutral-700">
      <span className="mr-2 text-brand-orange">Tip.</span>
      {children}
    </div>
  );
}

export function Disclaimer({children}: {children: React.ReactNode}) {
  return <p className="text-xs leading-5 text-neutral-500">{children}</p>;
}

export function FieldsetCard({children}: {children: React.ReactNode}) {
  return <div className="grid gap-6 rounded-lg border border-black/10 bg-white p-6 sm:p-8">{children}</div>;
}

const KLEUR_STIJLEN: Record<StoplichtKleur, string> = {
  groen: "border-emerald-500 bg-emerald-50 text-emerald-700",
  oranje: "border-amber-500 bg-amber-50 text-amber-700",
  rood: "border-red-500 bg-red-50 text-red-700",
};

const KLEUR_LABEL: Record<StoplichtKleur, string> = {
  groen: "Waarschijnlijk vergunningvrij",
  oranje: "Hangt af van de details",
  rood: "Vergunning nodig",
};

export function StoplichtBadge({kleur, label}: {kleur: StoplichtKleur; label?: string}) {
  return (
    <div className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.1em] ${KLEUR_STIJLEN[kleur]}`}>
      {label || KLEUR_LABEL[kleur]}
    </div>
  );
}

function buildWhatsAppHref(tekstTemplate: string, vars: Record<string, string>) {
  const tekst = tekstTemplate.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match);
  return `https://wa.me/${DRO_TOOLS_CONFIG.algemeen.whatsapp_nummer}?text=${encodeURIComponent(tekst)}`;
}

type ToolCTAProps = {
  toolId: ToolId;
  whatsappVars?: Record<string, string>;
};

/** CTA-blok onder elke tool: link naar contact en een vooringevulde WhatsApp-link uit de meta van de tool. */
export function ToolCTA({toolId, whatsappVars = {}}: ToolCTAProps) {
  const algemeen = DRO_TOOLS_CONFIG.algemeen;
  const meta = DRO_TOOLS_CONFIG.tools[toolId].meta;
  const whatsappHref = buildWhatsAppHref(meta.whatsapp_tekst, whatsappVars);

  return (
    <div className="rounded-lg bg-brand-ink p-6 text-white sm:p-8">
      <p className="text-lg font-bold sm:text-xl">{algemeen.cta_titel}</p>
      <p className="mt-2 text-sm text-white/70">{algemeen.cta_tekst}</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link className="btn-primary" href={algemeen.contact_pad}>
          {algemeen.cta_knop_gesprek}
        </Link>
        <a className="btn-secondary" href={whatsappHref} rel="noopener noreferrer" target="_blank">
          {algemeen.cta_knop_whatsapp}
        </a>
      </div>
    </div>
  );
}

const CATEGORIE_ICONEN: Record<string, SketchIconName> = {
  tijd: "calendar",
  materialen: "tiles",
  techniek: "electric",
  woning: "location",
  zakelijk: "document",
};

export function categorieIcoon(categorieId: string): SketchIconName {
  return CATEGORIE_ICONEN[categorieId] || "checklist";
}

type BreadcrumbProps = {
  toolId: ToolId;
  onNavigateHome: () => void;
};

export function ToolBreadcrumb({toolId, onNavigateHome}: BreadcrumbProps) {
  const tool = DRO_TOOLS_CONFIG.tools[toolId];
  const categorie = DRO_TOOLS_CONFIG.categorieen.find((c) => c.id === tool.meta.categorie);

  return (
    <nav aria-label="Broodkruimel" className="flex flex-wrap items-center gap-2 text-sm font-semibold text-neutral-500">
      <button className="hover:text-brand-orange" onClick={onNavigateHome} type="button">
        Alle tools
      </button>
      <span aria-hidden="true">/</span>
      <span>{categorie?.naam}</span>
      <span aria-hidden="true">/</span>
      <span className="text-brand-ink">{tool.meta.naam}</span>
    </nav>
  );
}

export function TerugKnop({onClick}: {onClick: () => void}) {
  return (
    <button className="text-sm font-bold text-brand-orange hover:text-brand-ink" onClick={onClick} type="button">
      &larr; Alle tools
    </button>
  );
}

type RelatedToolsProps = {
  toolIds: string[];
  onSelect: (toolId: ToolId) => void;
};

export function RelatedTools({toolIds, onSelect}: RelatedToolsProps) {
  const tools = toolIds
    .filter((id): id is ToolId => id in DRO_TOOLS_CONFIG.tools)
    .map((id) => ({id, ...DRO_TOOLS_CONFIG.tools[id].meta}))
    .filter((tool) => tool.actief);

  if (!tools.length) return null;

  return (
    <section>
      <p className="eyebrow">Gerelateerde tools</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-brand-ink">Kan je dit ook van pas komen?</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {tools.map((tool) => (
          <button
            className="card flex flex-col gap-2 p-5 text-left"
            key={tool.id}
            onClick={() => onSelect(tool.id)}
            type="button"
          >
            <SketchIcon className="h-8 w-8 text-brand-orange" name={categorieIcoon(tool.categorie)} />
            <p className="font-bold text-brand-ink">{tool.naam}</p>
            <p className="text-sm leading-6 text-neutral-600">{tool.omschrijving_kort}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

/** Print-vriendelijk vlak, gebruikt door de burenbrief en de sloopchecklist. */
export function PrintableBlock({children, printId}: {children: React.ReactNode; printId: string}) {
  return (
    <div id={printId}>
      {children}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #${printId}, #${printId} * { visibility: visible; }
          #${printId} { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}
