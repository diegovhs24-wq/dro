"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {NumberField, SelectField} from "../ToolFormFields";
import {FieldsetCard, ResultCard, ResultHeadline, TipBlock, ToolCTA} from "../ToolShared";
import {berekenContainer, formatNL, isRekenFout, vulTemplate} from "../toolsEngine";

export default function Container() {
  const config = DRO_TOOLS_CONFIG.tools.container;
  const [klusTypeId, setKlusTypeId] = useState("");
  const [m2, setM2] = useState<number | undefined>(undefined);

  const resultaat = useMemo(() => berekenContainer({klusTypeId, m2: m2 ?? 0}), [klusTypeId, m2]);

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <SelectField id="container-klustype" label="Type klus" onChange={setKlusTypeId} options={config.klustypes.map((k) => ({id: k.id, label: k.label}))} placeholder="Kies een type klus" value={klusTypeId} />
        <NumberField id="container-m2" label="M² van de ruimte of woning" onChange={setM2} value={m2} />
      </FieldsetCard>

      {klusTypeId && (m2 ?? 0) > 0 && resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>{vulTemplate(config.teksten.resultaat_titel, {volume: formatNL(resultaat.volume, 1)})}</ResultHeadline>
            <p className="mt-3 text-lg font-bold text-brand-ink">Advies: {resultaat.advies}</p>
          </ResultCard>
          <TipBlock>{config.teksten.tip}</TipBlock>
          <ToolCTA toolId="container" />
        </>
      ) : null}

      {klusTypeId && (m2 ?? 0) > 0 && resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
