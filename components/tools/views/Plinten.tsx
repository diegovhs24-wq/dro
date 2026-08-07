"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {NumberField} from "../ToolFormFields";
import {FieldsetCard, ResultCard, ResultHeadline, TipBlock, ToolCTA} from "../ToolShared";
import {berekenPlinten, formatNL, isRekenFout, vulTemplate} from "../toolsEngine";

export default function Plinten() {
  const config = DRO_TOOLS_CONFIG.tools.plinten;
  const [omtrekM, setOmtrekM] = useState<number | undefined>(undefined);
  const [deuren, setDeuren] = useState<number | undefined>(undefined);

  const resultaat = useMemo(() => berekenPlinten({omtrekM: omtrekM ?? 0, deuren: deuren ?? 0}), [omtrekM, deuren]);

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <NumberField id="plinten-omtrek" label="Omtrek ruimte(s) (m)" onChange={setOmtrekM} value={omtrekM} />
        <NumberField id="plinten-deuren" label="Aantal deuren" onChange={setDeuren} step={1} value={deuren} />
      </FieldsetCard>

      {(omtrekM ?? 0) > 0 && resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>{vulTemplate(config.teksten.resultaat_titel, {meters: formatNL(resultaat.meters, 1), stuks: resultaat.stuks, lengte: formatNL(config.lengte_per_plint_default, 1)})}</ResultHeadline>
          </ResultCard>
          <TipBlock>{config.teksten.tip}</TipBlock>
          <ToolCTA toolId="plinten" />
        </>
      ) : null}

      {(omtrekM ?? 0) > 0 && resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
