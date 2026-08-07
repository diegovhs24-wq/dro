"use client";

import Link from "next/link";
import {useEffect, useMemo, useState} from "react";

import SketchIcon from "@/components/SketchIcon";
import {DRO_TOOLS_CONFIG} from "./toolsConfig";
import {TOOL_REGISTRY} from "./toolRegistry";
import {categorieIcoon, RelatedTools, TerugKnop, ToolBreadcrumb, TrustRegel} from "./ToolShared";
import type {ToolId} from "./toolsTypes";

// "voor-dro" is de conversietool, geen rekentool: die krijgt een eigen prominente card en telt niet mee in het aanbod.
const VOOR_DRO_ID: ToolId = "voor-dro";
const ALLE_TOOLS = (Object.entries(DRO_TOOLS_CONFIG.tools) as Array<[ToolId, (typeof DRO_TOOLS_CONFIG.tools)[ToolId]]>).filter(
  ([id]) => id !== VOOR_DRO_ID,
);

function isGeldigeToolId(id: string): id is ToolId {
  return id in DRO_TOOLS_CONFIG.tools && DRO_TOOLS_CONFIG.tools[id as ToolId].meta.actief;
}

function leesHash(): ToolId | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace("#", "");
  return isGeldigeToolId(hash) ? hash : null;
}

export default function ToolsLibrary() {
  const [actieveTool, setActieveTool] = useState<ToolId | null>(null);
  const [zoekterm, setZoekterm] = useState("");
  const [categorie, setCategorie] = useState("alles");

  useEffect(() => {
    setActieveTool(leesHash());
    function onHashChange() {
      setActieveTool(leesHash());
    }
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onHashChange);
    };
  }, []);

  function openTool(id: ToolId) {
    window.location.hash = id;
    setActieveTool(id);
    window.scrollTo({top: 0, behavior: "smooth"});
  }

  function terugNaarHub() {
    history.pushState("", document.title, window.location.pathname + window.location.search);
    setActieveTool(null);
    window.scrollTo({top: 0, behavior: "smooth"});
  }

  const gefilterdeTools = useMemo(() => {
    const term = zoekterm.trim().toLowerCase();
    return ALLE_TOOLS.filter(([, tool]) => tool.meta.actief)
      .filter(([, tool]) => categorie === "alles" || tool.meta.categorie === categorie)
      .filter(([, tool]) => {
        if (!term) return true;
        if (tool.meta.naam.toLowerCase().includes(term)) return true;
        return tool.meta.trefwoorden.some((woord) => woord.toLowerCase().includes(term));
      })
      .sort((a, b) => a[1].meta.volgorde - b[1].meta.volgorde);
  }, [zoekterm, categorie]);

  if (actieveTool) {
    const tool = DRO_TOOLS_CONFIG.tools[actieveTool];
    const ToolView = TOOL_REGISTRY[actieveTool];

    return (
      <main>
        <section className="bg-brand-soft py-8">
          <div className="section-shell">
            <ToolBreadcrumb onNavigateHome={terugNaarHub} toolId={actieveTool} />
          </div>
        </section>

        <section className="bg-white py-12 sm:py-16">
          <div className="section-shell max-w-3xl">
            <TerugKnop onClick={terugNaarHub} />
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">{tool.meta.naam}</h2>
            <p className="mt-4 text-base leading-7 text-neutral-600">{tool.meta.uitleg}</p>
          </div>
          <div className="section-shell mt-8 max-w-3xl">
            <ToolView />
          </div>
        </section>

        <section className="bg-brand-soft py-14 sm:py-16">
          <div className="section-shell">
            <RelatedTools onSelect={openTool} toolIds={tool.meta.gerelateerd} />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-brand-ink py-16 text-white sm:py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/20 via-black/50 to-black/70" />
        <div className="section-shell">
          <div className="max-w-3xl animate-float-in">
            <p className="eyebrow">Gratis rekentools en checks</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">Handige tools voor je verbouwing</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              Van bouwtijd en vergunningen tot materialen en techniek: {ALLE_TOOLS.filter(([, t]) => t.meta.actief).length}{" "}
              gratis tools om je renovatie voor te bereiden. Direct een uitkomst, geen e-mailadres nodig.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-12">
        <div className="section-shell">
          <button
            className="card flex w-full flex-col gap-3 border-2 border-brand-orange bg-brand-soft p-6 text-left sm:flex-row sm:items-center sm:justify-between sm:p-8"
            onClick={() => openTool(VOOR_DRO_ID)}
            type="button"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-orange">{DRO_TOOLS_CONFIG.tools[VOOR_DRO_ID].meta.omschrijving_kort}</p>
              <p className="mt-2 text-2xl font-extrabold text-brand-ink">{DRO_TOOLS_CONFIG.tools[VOOR_DRO_ID].meta.naam}</p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600">{DRO_TOOLS_CONFIG.tools[VOOR_DRO_ID].meta.uitleg}</p>
            </div>
            <span className="btn-primary shrink-0 text-center">Doe de check</span>
          </button>
        </div>
      </section>

      <section className="bg-white pb-10 sm:pb-12">
        <div className="section-shell">
          <label className="sr-only" htmlFor="tools-zoeken">
            Zoek een tool
          </label>
          <input
            className="h-14 w-full rounded-lg border border-black/15 bg-white px-5 text-base text-brand-ink focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
            id="tools-zoeken"
            onChange={(event) => setZoekterm(event.target.value)}
            placeholder="Zoek op toolnaam of trefwoord, bijvoorbeeld 'tegels' of 'vergunning'"
            type="search"
            value={zoekterm}
          />

          <div className="mt-5 flex flex-wrap gap-2" role="tablist">
            <button
              className={`rounded-full border px-4 py-2 text-sm font-bold transition ${categorie === "alles" ? "border-brand-orange bg-brand-orange text-white" : "border-black/15 bg-white text-brand-ink"}`}
              onClick={() => setCategorie("alles")}
              type="button"
            >
              Alles
            </button>
            {DRO_TOOLS_CONFIG.categorieen.map((cat) => (
              <button
                className={`rounded-full border px-4 py-2 text-sm font-bold transition ${categorie === cat.id ? "border-brand-orange bg-brand-orange text-white" : "border-black/15 bg-white text-brand-ink"}`}
                key={cat.id}
                onClick={() => setCategorie(cat.id)}
                type="button"
              >
                {cat.naam}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-6">
        <div className="section-shell">
          <TrustRegel />
        </div>
      </section>

      <section className="bg-brand-soft py-10 sm:py-14">
        <div className="section-shell">
          {gefilterdeTools.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gefilterdeTools.map(([id, tool]) => (
                <button className="card flex flex-col gap-3 p-6 text-left" key={id} onClick={() => openTool(id)} type="button">
                  <div className="grid h-14 w-14 place-items-center rounded-lg bg-brand-soft text-brand-ink">
                    <SketchIcon className="h-9 w-9 text-brand-orange" name={categorieIcoon(tool.meta.categorie)} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-orange">
                    {DRO_TOOLS_CONFIG.categorieen.find((c) => c.id === tool.meta.categorie)?.naam}
                  </p>
                  <p className="text-lg font-bold text-brand-ink">{tool.meta.naam}</p>
                  <p className="text-sm leading-6 text-neutral-600">{tool.meta.omschrijving_kort}</p>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm font-semibold text-neutral-600">Geen tools gevonden voor deze zoekterm.</p>
          )}
        </div>
      </section>

      <section className="bg-brand-ink py-14 text-white sm:py-16">
        <div className="section-shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow">Over DRO Renovaties</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Familiebedrijf uit Den Haag, met eigen vaste teams.</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80">
              DRO Renovaties is een familiebedrijf uit Den Haag. We werken met eigen vaste vakteams, een eigen opslag en
              prefabricage, zodat planning en materiaal altijd op elkaar zijn afgestemd. Deze rekentools geven een
              eerste indicatie, voor een compleet beeld van jouw project denken we graag vrijblijvend mee.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link className="btn-primary" href="/contact">
              Plan een gesprek
            </Link>
            <Link className="btn-secondary" href="/over-ons">
              Meer over DRO
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
