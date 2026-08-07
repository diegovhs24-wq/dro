"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {NumberField, SelectField} from "../ToolFormFields";
import {ConversieLaag, Disclaimer, ExportDocument, ExportKnop, FieldsetCard, ResultCard, ResultHeadline, TipBlock} from "../ToolShared";
import {berekenTegels, berekenWandHulptool, formatNL, isRekenFout, vulTemplate} from "../toolsEngine";
import type {TegelWand} from "../toolsEngine";

const LEGE_WAND: TegelWand = {lengte: 0, hoogte: 0, deuren: 0, raamM2: 0};

export default function Tegels() {
  const config = DRO_TOOLS_CONFIG.tools.tegels;
  const [vloerM2, setVloerM2] = useState<number | undefined>(undefined);
  const [wandM2, setWandM2] = useState<number | undefined>(undefined);
  const [formaatId, setFormaatId] = useState(config.formaten[0].id);
  const [legpatroonId, setLegpatroonId] = useState(config.legpatronen[0].id);
  const [m2PerDoosHandmatig, setM2PerDoosHandmatig] = useState<number | undefined>(undefined);
  const [hulptoolOpen, setHulptoolOpen] = useState(false);
  const [wanden, setWanden] = useState<TegelWand[]>([{...LEGE_WAND}]);

  const hulptoolTotaal = useMemo(() => berekenWandHulptool(wanden), [wanden]);

  const resultaat = useMemo(
    () => berekenTegels({vloerM2: vloerM2 ?? 0, wandM2: wandM2 ?? 0, formaatId, legpatroonId, m2PerDoosHandmatig}),
    [vloerM2, wandM2, formaatId, legpatroonId, m2PerDoosHandmatig]
  );

  const formaat = config.formaten.find((f) => f.id === formaatId);
  const heeftInvoer = (vloerM2 ?? 0) > 0 || (wandM2 ?? 0) > 0;

  function updateWand(index: number, veld: keyof TegelWand, waarde: number) {
    setWanden((prev) => prev.map((wand, i) => (i === index ? {...wand, [veld]: waarde} : wand)));
  }

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <div className="grid gap-6 sm:grid-cols-2">
          <NumberField id="tegels-vloer" label="Vloeroppervlak (m²)" onChange={setVloerM2} value={vloerM2} />
          <NumberField id="tegels-wand" label="Wandoppervlak (m²)" onChange={setWandM2} value={wandM2} />
        </div>

        <div>
          <button className="text-sm font-bold text-brand-orange hover:text-brand-ink" onClick={() => setHulptoolOpen((open) => !open)} type="button">
            {hulptoolOpen ? "Verberg" : "Help me het wandoppervlak berekenen"}
          </button>

          {hulptoolOpen ? (
            <div className="mt-4 grid gap-4 rounded-lg bg-brand-soft p-4">
              {wanden.map((wand, index) => (
                <div className="grid gap-3 sm:grid-cols-4" key={index}>
                  <NumberField id={`wand-${index}-lengte`} label="Lengte (m)" onChange={(v) => updateWand(index, "lengte", v ?? 0)} value={wand.lengte || undefined} />
                  <NumberField id={`wand-${index}-hoogte`} label="Hoogte (m)" onChange={(v) => updateWand(index, "hoogte", v ?? 0)} value={wand.hoogte || undefined} />
                  <NumberField id={`wand-${index}-deuren`} label="Aantal deuren" onChange={(v) => updateWand(index, "deuren", v ?? 0)} step={1} value={wand.deuren || undefined} />
                  <NumberField id={`wand-${index}-raam`} label="Ramen (m²)" onChange={(v) => updateWand(index, "raamM2", v ?? 0)} value={wand.raamM2 || undefined} />
                </div>
              ))}
              <div className="flex flex-wrap items-center justify-between gap-3">
                {wanden.length < config.max_wanden_hulptool ? (
                  <button className="text-sm font-bold text-brand-orange hover:text-brand-ink" onClick={() => setWanden((prev) => [...prev, {...LEGE_WAND}])} type="button">
                    + Wand toevoegen
                  </button>
                ) : (
                  <span />
                )}
                <button className="btn-primary" onClick={() => setWandM2(Math.round(hulptoolTotaal * 100) / 100)} type="button">
                  Neem {formatNL(hulptoolTotaal, 2)} m² over
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <SelectField id="tegels-formaat" label="Tegelformaat" onChange={setFormaatId} options={config.formaten.map((f) => ({id: f.id, label: f.label}))} value={formaatId} />
          <SelectField id="tegels-legpatroon" label="Legpatroon" onChange={setLegpatroonId} options={config.legpatronen.map((p) => ({id: p.id, label: p.label}))} value={legpatroonId} />
        </div>

        {formaat?.m2_per_doos === null ? (
          <NumberField id="tegels-m2-per-doos" label="M² per doos van dit tegelformaat" onChange={setM2PerDoosHandmatig} value={m2PerDoosHandmatig} />
        ) : null}
      </FieldsetCard>

      {heeftInvoer && resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>
              {vulTemplate(config.teksten.resultaat_titel, {dozen: resultaat.dozen, totaal_m2: formatNL(resultaat.totaalM2, 1), snijverlies_pct: formatNL(resultaat.snijverlies * 100, 0)})}
            </ResultHeadline>
            <ul className="mt-4 grid gap-1.5 text-sm font-semibold text-neutral-700">
              <li>{vulTemplate(config.teksten.lijm_tekst, {zakken_lijm: resultaat.zakkenLijm})}</li>
              <li>{vulTemplate(config.teksten.voeg_tekst, {zakken_voeg: resultaat.zakkenVoeg})}</li>
            </ul>
          </ResultCard>
          {resultaat.formaat.ondervloer_waarschuwing ? (
            <div className="rounded-lg bg-brand-soft p-4 text-sm font-semibold leading-6 text-neutral-700">{config.teksten.ondervloer_tekst}</div>
          ) : null}
          <p className="text-sm leading-6 text-neutral-600">{config.teksten.aanbeveling_tekst}</p>
          <TipBlock>{config.teksten.tip}</TipBlock>
          <Disclaimer>{config.teksten.disclaimer}</Disclaimer>

          <ExportDocument
            disclaimer={config.teksten.disclaimer}
            printId="tegels-print"
            tip={config.teksten.tip}
            toolNaam="Tegel calculator"
            uitkomstRegels={[vulTemplate(config.teksten.lijm_tekst, {zakken_lijm: resultaat.zakkenLijm}), vulTemplate(config.teksten.voeg_tekst, {zakken_voeg: resultaat.zakkenVoeg})]}
            uitkomstTitel={vulTemplate(config.teksten.resultaat_titel, {dozen: resultaat.dozen, totaal_m2: formatNL(resultaat.totaalM2, 1), snijverlies_pct: formatNL(resultaat.snijverlies * 100, 0)})}
            waardes={[
              {label: "Vloeroppervlak", waarde: `${vloerM2 ?? 0} m²`},
              {label: "Wandoppervlak", waarde: `${wandM2 ?? 0} m²`},
              {label: "Tegelformaat", waarde: formaat?.label ?? ""},
              {label: "Legpatroon", waarde: config.legpatronen.find((p) => p.id === legpatroonId)?.label ?? ""},
            ]}
          />
          <ExportKnop />

          <ConversieLaag samenvatting={{totaal_m2: formatNL(resultaat.totaalM2, 1), dozen: String(resultaat.dozen)}} toolId="tegels" />
        </>
      ) : null}

      {heeftInvoer && resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
