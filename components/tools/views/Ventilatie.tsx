"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {NumberField} from "../ToolFormFields";
import {FieldsetCard, ResultCard, ResultHeadline, TipBlock, ToolCTA} from "../ToolShared";
import {berekenVentilatie, formatNL, isRekenFout, vulTemplate} from "../toolsEngine";

export default function Ventilatie() {
  const config = DRO_TOOLS_CONFIG.tools.ventilatie;
  const [m2, setM2] = useState<number | undefined>(undefined);
  const [hoogte, setHoogte] = useState<number | undefined>(undefined);

  const resultaat = useMemo(() => berekenVentilatie({m2: m2 ?? 0, hoogte}), [m2, hoogte]);

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <NumberField id="ventilatie-m2" label="Oppervlak badkamer (m²)" onChange={setM2} value={m2} />
        <NumberField id="ventilatie-hoogte" label={`Hoogte (m, standaard ${formatNL(config.standaard_hoogte, 1)})`} onChange={setHoogte} value={hoogte} />
      </FieldsetCard>

      {(m2 ?? 0) > 0 && resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>{vulTemplate(config.teksten.resultaat_titel, {m3_per_uur: formatNL(resultaat.m3PerUur, 0)})}</ResultHeadline>
            <p className="mt-3 text-sm leading-6 text-neutral-700">{config.teksten.advies_tekst}</p>
          </ResultCard>
          <TipBlock>{config.teksten.tip}</TipBlock>
          <ToolCTA toolId="ventilatie" />
        </>
      ) : null}

      {(m2 ?? 0) > 0 && resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
