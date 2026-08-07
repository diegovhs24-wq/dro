"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {NumberField, SelectField, SingleCheckbox} from "../ToolFormFields";
import {FieldsetCard, ResultCard, ResultHeadline, TipBlock, ToolCTA} from "../ToolShared";
import {berekenVloer, formatNL, isRekenFout, vulTemplate} from "../toolsEngine";

export default function Vloer() {
  const config = DRO_TOOLS_CONFIG.tools.vloer;
  const [m2, setM2] = useState<number | undefined>(undefined);
  const [typeId, setTypeId] = useState(config.types[0].id);
  const [ondervloerNodig, setOndervloerNodig] = useState(false);

  const resultaat = useMemo(() => berekenVloer({m2: m2 ?? 0, typeId, ondervloerNodig}), [m2, typeId, ondervloerNodig]);
  const type = config.types.find((t) => t.id === typeId);

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <NumberField id="vloer-m2" label="Vloeroppervlak (m²)" onChange={setM2} value={m2} />
        <SelectField id="vloer-type" label="Type" onChange={setTypeId} options={config.types.map((t) => ({id: t.id, label: t.label}))} value={typeId} />
        <SingleCheckbox checked={ondervloerNodig} id="vloer-ondervloer" label="Ondervloer nodig" onChange={setOndervloerNodig} />
      </FieldsetCard>

      {(m2 ?? 0) > 0 && resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>{vulTemplate(config.teksten.resultaat_titel, {pakken: resultaat.pakken, type_label: type?.label || "", totaal_m2: formatNL(resultaat.totaalM2, 1)})}</ResultHeadline>
            {resultaat.rollenOndervloer ? <p className="mt-3 text-lg font-bold text-brand-ink">{vulTemplate(config.teksten.ondervloer_titel, {rollen: resultaat.rollenOndervloer})}</p> : null}
          </ResultCard>
          <TipBlock>{config.teksten.tip}</TipBlock>
          <ToolCTA toolId="vloer" />
        </>
      ) : null}

      {(m2 ?? 0) > 0 && resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
