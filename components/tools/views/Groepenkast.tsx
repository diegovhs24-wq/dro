"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {CheckboxGroup, SelectField, SliderField} from "../ToolFormFields";
import {ConversieLaag, Disclaimer, ExportDocument, ExportKnop, FieldsetCard, ResultCard, ResultHeadline} from "../ToolShared";
import {berekenGroepenkast, formatNL, isRekenFout, vulTemplate} from "../toolsEngine";

export default function Groepenkast() {
  const config = DRO_TOOLS_CONFIG.tools.groepenkast;
  const [etages, setEtages] = useState(1);
  const [apparaatIds, setApparaatIds] = useState<string[]>([]);
  const [aansluitingId, setAansluitingId] = useState("");

  const resultaat = useMemo(() => berekenGroepenkast({etages, apparaatIds, aansluitingId}), [etages, apparaatIds, aansluitingId]);
  const geldigResultaat = aansluitingId && resultaat && !isRekenFout(resultaat) ? resultaat : null;

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <SliderField id="groepenkast-etages" label="Aantal etages" max={4} min={1} onChange={setEtages} value={etages} />
        <CheckboxGroup legend="Welke apparaten?" onChange={setApparaatIds} options={config.apparaten.map((a) => ({id: a.id, label: a.label}))} selectedIds={apparaatIds} />
        <SelectField id="groepenkast-aansluiting" label="Huidige aansluiting" onChange={setAansluitingId} options={config.aansluitingen.map((a) => ({id: a.id, label: a.label}))} placeholder="Kies je aansluiting" value={aansluitingId} />
      </FieldsetCard>

      {geldigResultaat ? (
        <>
          <ResultCard>
            <ResultHeadline>{vulTemplate(config.teksten.resultaat_titel, {totaal_groepen: geldigResultaat.totaalGroepen})}</ResultHeadline>
            <ul className="mt-4 grid gap-2 text-sm font-semibold text-neutral-700">
              <li>
                Verlichting: {geldigResultaat.groepenVerlichting} groep(en), wandcontactdozen: {geldigResultaat.groepenWcd} groep(en)
              </li>
              <li>Apparaten met eigen groep: {geldigResultaat.groepenApparaten} groep(en)</li>
              <li>Reserve: {geldigResultaat.reserveGroepen} groep</li>
              <li>Totaal indicatief vermogen apparaten: {formatNL(geldigResultaat.totaalVermogenKw, 1)} kW</li>
              <li>3 fasen (krachtstroom): {geldigResultaat.driefaseAdvies ? "geadviseerd" : "niet nodig"}</li>
            </ul>
            {geldigResultaat.netverzwaringAdvies ? <p className="mt-4 text-sm font-bold text-brand-orange">{config.teksten.netverzwaring_tekst}</p> : null}
            <p className="mt-4 text-xs leading-5 text-neutral-500">{config.teksten.aardleklabel_tekst}</p>
          </ResultCard>
          <Disclaimer>{config.teksten.disclaimer}</Disclaimer>

          <ExportDocument
            disclaimer={config.teksten.disclaimer}
            printId="groepenkast-print"
            toolNaam="Groepenkast calculator"
            uitkomstRegels={[
              `Verlichting: ${geldigResultaat.groepenVerlichting} groep(en)`,
              `Wandcontactdozen: ${geldigResultaat.groepenWcd} groep(en)`,
              `Apparaten met eigen groep: ${geldigResultaat.groepenApparaten} groep(en)`,
              `Reserve: ${geldigResultaat.reserveGroepen} groep`,
              `3 fasen: ${geldigResultaat.driefaseAdvies ? "geadviseerd" : "niet nodig"}`,
            ]}
            uitkomstTitel={vulTemplate(config.teksten.resultaat_titel, {totaal_groepen: geldigResultaat.totaalGroepen})}
            waardes={[
              {label: "Aantal etages", waarde: String(etages)},
              {label: "Huidige aansluiting", waarde: config.aansluitingen.find((a) => a.id === aansluitingId)?.label ?? ""},
            ]}
          />
          <ExportKnop />

          <ConversieLaag samenvatting={{totaal_groepen: String(geldigResultaat.totaalGroepen)}} toolId="groepenkast" />
        </>
      ) : null}

      {aansluitingId && resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
