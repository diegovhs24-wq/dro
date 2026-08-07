"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {NumberField, SelectField, SingleCheckbox} from "../ToolFormFields";
import {FieldsetCard, ResultCard, ResultHeadline, TipBlock, ToolCTA} from "../ToolShared";
import {berekenStucwerk, isRekenFout, vulTemplate} from "../toolsEngine";

export default function Stucwerk() {
  const config = DRO_TOOLS_CONFIG.tools.stucwerk;
  const [wandenM2, setWandenM2] = useState<number | undefined>(undefined);
  const [plafondsM2, setPlafondsM2] = useState<number | undefined>(undefined);
  const [afwerkingId, setAfwerkingId] = useState(config.afwerkingen[0].id);
  const [slechteStaat, setSlechteStaat] = useState(false);

  const resultaat = useMemo(
    () => berekenStucwerk({wandenM2: wandenM2 ?? 0, plafondsM2: plafondsM2 ?? 0, afwerkingId, slechteStaat}),
    [wandenM2, plafondsM2, afwerkingId, slechteStaat]
  );
  const heeftInvoer = (wandenM2 ?? 0) > 0 || (plafondsM2 ?? 0) > 0;

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField id="stucwerk-wanden" label="Wanden (m²)" onChange={setWandenM2} value={wandenM2} />
          <NumberField id="stucwerk-plafonds" label="Plafonds (m²)" onChange={setPlafondsM2} value={plafondsM2} />
        </div>
        <SelectField id="stucwerk-afwerking" label="Afwerking" onChange={setAfwerkingId} options={config.afwerkingen.map((a) => ({id: a.id, label: a.label}))} value={afwerkingId} />
        <SingleCheckbox checked={slechteStaat} id="stucwerk-staat" label="Slechte staat (veel uitvlakwerk nodig)" onChange={setSlechteStaat} />
      </FieldsetCard>

      {heeftInvoer && resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>{vulTemplate(config.teksten.resultaat_titel, {zakken: resultaat.zakken, totaal_m2: resultaat.totaalM2})}</ResultHeadline>
            <p className="mt-3 text-sm font-semibold text-neutral-600">{vulTemplate(config.teksten.werktijd_titel, {dagen_min: resultaat.dagenMin, dagen_max: resultaat.dagenMax})}</p>
          </ResultCard>
          <TipBlock>{config.teksten.tip}</TipBlock>
          <ToolCTA toolId="stucwerk" />
        </>
      ) : null}

      {heeftInvoer && resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
