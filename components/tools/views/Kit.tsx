"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {CheckboxGroup, SelectField} from "../ToolFormFields";
import {ConversieLaag, ExportDocument, ExportKnop, FieldsetCard, ResultCard, ResultHeadline, TipBlock} from "../ToolShared";
import {berekenKit, isRekenFout, vulTemplate} from "../toolsEngine";

export default function Kit() {
  const config = DRO_TOOLS_CONFIG.tools.kit;
  const [onderdeelIds, setOnderdeelIds] = useState<string[]>([]);
  const [naadbreedteId, setNaadbreedteId] = useState(config.naadbreedtes[0].id);

  const resultaat = useMemo(() => berekenKit({onderdeelIds, naadbreedteId}), [onderdeelIds, naadbreedteId]);

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <CheckboxGroup legend="Welke onderdelen?" onChange={setOnderdeelIds} options={config.onderdelen.map((o) => ({id: o.id, label: o.label}))} selectedIds={onderdeelIds} />
        <SelectField id="kit-naadbreedte" label="Naadbreedte" onChange={setNaadbreedteId} options={config.naadbreedtes.map((n) => ({id: n.id, label: n.label}))} value={naadbreedteId} />
      </FieldsetCard>

      {onderdeelIds.length > 0 && resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>{vulTemplate(config.teksten.resultaat_titel, {kokers: resultaat.kokers})}</ResultHeadline>
          </ResultCard>
          <TipBlock>{config.teksten.tip}</TipBlock>

          <ExportDocument
            printId="kit-print"
            tip={config.teksten.tip}
            toolNaam="Kitwerk calculator"
            uitkomstTitel={vulTemplate(config.teksten.resultaat_titel, {kokers: resultaat.kokers})}
          />
          <ExportKnop />

          <ConversieLaag samenvatting={{kokers: String(resultaat.kokers)}} toolId="kit" />
        </>
      ) : null}

      {onderdeelIds.length > 0 && resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
