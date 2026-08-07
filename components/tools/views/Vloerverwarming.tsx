"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {NumberField, SelectField, SingleCheckbox} from "../ToolFormFields";
import {FieldsetCard, ResultCard, ResultHeadline, TipBlock, ToolCTA} from "../ToolShared";
import {berekenVloerverwarming, formatNL, isRekenFout, vulTemplate} from "../toolsEngine";

export default function Vloerverwarming() {
  const config = DRO_TOOLS_CONFIG.tools.vloerverwarming;
  const [m2, setM2] = useState<number | undefined>(undefined);
  const [isolatieId, setIsolatieId] = useState(config.isolaties[0].id);
  const [vloertypeId, setVloertypeId] = useState(config.vloertypes[0].id);
  const [hoofdverwarming, setHoofdverwarming] = useState(false);

  const resultaat = useMemo(() => berekenVloerverwarming({m2: m2 ?? 0, isolatieId, vloertypeId, hoofdverwarming}), [m2, isolatieId, vloertypeId, hoofdverwarming]);

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <NumberField id="vloerverwarming-m2" label="Oppervlak ruimte (m²)" onChange={setM2} value={m2} />
        <SelectField id="vloerverwarming-isolatie" label="Isolatie woning" onChange={setIsolatieId} options={config.isolaties.map((i) => ({id: i.id, label: i.label}))} value={isolatieId} />
        <SelectField id="vloerverwarming-vloertype" label="Gewenst vloertype" onChange={setVloertypeId} options={config.vloertypes.map((v) => ({id: v.id, label: v.label}))} value={vloertypeId} />
        <SingleCheckbox checked={hoofdverwarming} id="vloerverwarming-hoofd" label="Bedoeld als hoofdverwarming" onChange={setHoofdverwarming} />
      </FieldsetCard>

      {(m2 ?? 0) > 0 && resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>{vulTemplate(config.teksten.resultaat_titel, {watt_per_m2: resultaat.wattPerM2, totaal_watt: formatNL(resultaat.totaalWatt, 0)})}</ResultHeadline>
            <p className="mt-3 text-sm leading-6 text-neutral-700">{resultaat.vloertypeGeschiktheid}</p>
            {resultaat.toonHoofdverwarmingWaarschuwing ? <p className="mt-3 text-sm font-bold text-brand-orange">{config.teksten.hoofdverwarming_waarschuwing}</p> : null}
          </ResultCard>
          <TipBlock>{config.teksten.tip}</TipBlock>
          <ToolCTA toolId="vloerverwarming" />
        </>
      ) : null}

      {(m2 ?? 0) > 0 && resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
