"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {CheckboxGroup, SelectField} from "../ToolFormFields";
import {Disclaimer, FieldsetCard, ResultCard, ResultHeadline, ToolCTA} from "../ToolShared";
import {berekenGroepenkast, formatNL, isRekenFout, vulTemplate} from "../toolsEngine";

export default function Groepenkast() {
  const config = DRO_TOOLS_CONFIG.tools.groepenkast;
  const [apparaatIds, setApparaatIds] = useState<string[]>([]);
  const [aansluitingId, setAansluitingId] = useState("");

  const resultaat = useMemo(() => berekenGroepenkast({apparaatIds, aansluitingId}), [apparaatIds, aansluitingId]);

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <CheckboxGroup legend="Welke apparaten?" onChange={setApparaatIds} options={config.apparaten.map((a) => ({id: a.id, label: a.label}))} selectedIds={apparaatIds} />
        <SelectField id="groepenkast-aansluiting" label="Huidige aansluiting" onChange={setAansluitingId} options={config.aansluitingen.map((a) => ({id: a.id, label: a.label}))} placeholder="Kies je aansluiting" value={aansluitingId} />
      </FieldsetCard>

      {aansluitingId && resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>{vulTemplate(config.teksten.resultaat_titel, {aantal_groepen: resultaat.aantalGroepen})}</ResultHeadline>
            <ul className="mt-4 grid gap-2 text-sm font-semibold text-neutral-700">
              <li>Totaal indicatief vermogen: {formatNL(resultaat.totaalVermogenKw, 1)} kW</li>
              <li>3 fasen (krachtstroom): {resultaat.driefaseAdvies ? "geadviseerd" : "niet nodig"}</li>
              <li>Netverzwaring bij netbeheerder aanvragen: {resultaat.netverzwaringAdvies ? "waarschijnlijk nodig (houd rekening met wachttijd)" : "waarschijnlijk niet nodig"}</li>
            </ul>
          </ResultCard>
          <Disclaimer>{config.teksten.disclaimer}</Disclaimer>
          <ToolCTA toolId="groepenkast" />
        </>
      ) : null}

      {aansluitingId && resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
