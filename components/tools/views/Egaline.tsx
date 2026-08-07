"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {NumberField, SliderField} from "../ToolFormFields";
import {FieldsetCard, ResultCard, ResultHeadline, TipBlock, ToolCTA} from "../ToolShared";
import {berekenEgaline, isRekenFout, vulTemplate} from "../toolsEngine";

export default function Egaline() {
  const config = DRO_TOOLS_CONFIG.tools.egaline;
  const [m2, setM2] = useState<number | undefined>(undefined);
  const [mm, setMm] = useState(config.default_mm);

  const resultaat = useMemo(() => berekenEgaline({m2: m2 ?? 0, mm}), [m2, mm]);

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <NumberField id="egaline-m2" label="Vloeroppervlak (m²)" onChange={setM2} value={m2} />
        <SliderField eenheid=" mm" id="egaline-mm" label="Gemiddelde laagdikte" max={config.max_mm} min={config.min_mm} onChange={setMm} value={mm} />
      </FieldsetCard>

      {(m2 ?? 0) > 0 && resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>{vulTemplate(config.teksten.resultaat_titel, {zakken: resultaat.zakken})}</ResultHeadline>
          </ResultCard>
          <TipBlock>{config.teksten.tip}</TipBlock>
          <ToolCTA toolId="egaline" />
        </>
      ) : null}

      {(m2 ?? 0) > 0 && resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
