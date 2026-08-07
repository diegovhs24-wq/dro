"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {SelectField, SingleCheckbox} from "../ToolFormFields";
import {ConversieLaag, ExportDocument, ExportKnop, FieldsetCard, ResultCard, ResultHeadline, TipBlock} from "../ToolShared";
import {berekenIsolatie, formatNL, isRekenFout} from "../toolsEngine";

type GecheckDeel = {bouwdeelLabel: string; huidigeWaarde: number; eisTekst: string};

export default function Isolatie() {
  const config = DRO_TOOLS_CONFIG.tools.isolatie;
  const [bouwdeelId, setBouwdeelId] = useState("");
  const [bouwjaarId, setBouwjaarId] = useState("");
  const [naGeisoleerd, setNaGeisoleerd] = useState(false);
  const [gecheckt, setGecheckt] = useState<GecheckDeel[]>([]);

  const resultaat = useMemo(() => {
    if (!bouwdeelId || !bouwjaarId) return null;
    return berekenIsolatie({bouwdeelId, bouwjaarId, naGeisoleerd});
  }, [bouwdeelId, bouwjaarId, naGeisoleerd]);

  function voegToe() {
    if (!resultaat || isRekenFout(resultaat)) return;
    setGecheckt((prev) => [...prev.filter((d) => d.bouwdeelLabel !== resultaat.bouwdeelLabel), resultaat]);
  }

  const zwaksteDeel = gecheckt.length
    ? [...gecheckt].sort((a, b) => a.huidigeWaarde - b.huidigeWaarde)[0]
    : null;

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <SelectField id="isolatie-bouwdeel" label="Bouwdeel" onChange={setBouwdeelId} options={config.bouwdelen.map((b) => ({id: b.id, label: b.label}))} placeholder="Kies een bouwdeel" value={bouwdeelId} />
        <SelectField id="isolatie-bouwjaar" label="Bouwjaar categorie" onChange={setBouwjaarId} options={config.bouwjaren.map((b) => ({id: b.id, label: b.label}))} placeholder="Kies een bouwjaar" value={bouwjaarId} />
        <SingleCheckbox checked={naGeisoleerd} id="isolatie-nageisoleerd" label="Dit bouwdeel is al eens nageisoleerd" onChange={setNaGeisoleerd} />
      </FieldsetCard>

      {resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>
              {resultaat.bouwdeelLabel}: Rc {formatNL(resultaat.huidigeWaarde, 1)} (norm: {resultaat.eisTekst})
            </ResultHeadline>
            <button className="btn-primary mt-4" onClick={voegToe} type="button">
              Voeg toe aan overzicht
            </button>
          </ResultCard>
        </>
      ) : null}

      {gecheckt.length > 0 ? (
        <ResultCard>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-orange">Overzicht gecontroleerde bouwdelen</p>
          <ul className="mt-3 grid gap-1.5 text-sm font-semibold text-neutral-700">
            {gecheckt.map((deel) => (
              <li key={deel.bouwdeelLabel}>
                {deel.bouwdeelLabel}: Rc {formatNL(deel.huidigeWaarde, 1)} (norm {deel.eisTekst})
              </li>
            ))}
          </ul>
          {zwaksteDeel ? (
            <p className="mt-3 text-sm font-bold text-brand-ink">Grootste verbeterpunt: {zwaksteDeel.bouwdeelLabel}.</p>
          ) : null}
          <TipBlock>{config.teksten.tip}</TipBlock>
          <div className="mt-5 grid gap-5">
            <ExportDocument
              printId="isolatie-print"
              tip={config.teksten.tip}
              toolNaam="Isolatie Rc check"
              uitkomstRegels={gecheckt.map((deel) => `${deel.bouwdeelLabel}: Rc ${formatNL(deel.huidigeWaarde, 1)} (norm ${deel.eisTekst})`)}
              uitkomstTitel="Overzicht gecontroleerde bouwdelen"
            />
            <ExportKnop />

            <ConversieLaag samenvatting={{huidige_waarde: zwaksteDeel ? formatNL(zwaksteDeel.huidigeWaarde, 1) : ""}} toolId="isolatie" />
          </div>
        </ResultCard>
      ) : null}
    </div>
  );
}
