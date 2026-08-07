"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {ButtonGroup, NumberField} from "../ToolFormFields";
import {ConversieLaag, ExportDocument, ExportKnop, FieldsetCard, ResultCard, ResultHeadline, TipBlock} from "../ToolShared";
import {berekenAfschot, formatNL, isRekenFout, vulTemplate} from "../toolsEngine";

export default function Afschot() {
  const config = DRO_TOOLS_CONFIG.tools.afschot;
  const [lengteCm, setLengteCm] = useState<number | undefined>(undefined);
  const [type, setType] = useState<"goot" | "putje_midden">("goot");

  const resultaat = useMemo(() => berekenAfschot({lengteCm: lengteCm ?? 0, type}), [lengteCm, type]);

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <NumberField id="afschot-lengte" label="Lengte doucheveloer richting afvoer (cm)" onChange={setLengteCm} step={1} value={lengteCm} />
        <ButtonGroup
          legend="Type afvoer"
          onChange={(value) => setType(value as "goot" | "putje_midden")}
          options={[
            {id: "goot", label: "Draingoot aan de rand"},
            {id: "putje_midden", label: "Putje in het midden"},
          ]}
          value={type}
        />
      </FieldsetCard>

      {(lengteCm ?? 0) > 0 && resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>{vulTemplate(config.teksten.resultaat_titel, {hoogteverschil: formatNL(resultaat.hoogteverschilMm, 0)})}</ResultHeadline>
          </ResultCard>
          <TipBlock>{config.teksten.tip}</TipBlock>

          <ExportDocument
            printId="afschot-print"
            tip={config.teksten.tip}
            toolNaam="Afschot douche calculator"
            uitkomstTitel={vulTemplate(config.teksten.resultaat_titel, {hoogteverschil: formatNL(resultaat.hoogteverschilMm, 0)})}
            waardes={[{label: "Lengte", waarde: `${lengteCm} cm`}]}
          />
          <ExportKnop />

          <ConversieLaag samenvatting={{hoogteverschil: formatNL(resultaat.hoogteverschilMm, 0)}} toolId="afschot" />
        </>
      ) : null}

      {(lengteCm ?? 0) > 0 && resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
