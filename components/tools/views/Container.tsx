"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {NumberField, SelectField} from "../ToolFormFields";
import {ConversieLaag, ExportDocument, ExportKnop, FieldsetCard, ResultCard, ResultHeadline, TipBlock} from "../ToolShared";
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
            <ul className="mt-3 grid gap-1 text-sm font-semibold text-neutral-700">
              <li>{vulTemplate(config.teksten.opbouw_sloop_tekst, {sloop_volume: formatNL(resultaat.sloopVolume, 1)})}</li>
              <li>{vulTemplate(config.teksten.opbouw_werkafval_tekst, {werkafval_volume: formatNL(resultaat.werkafvalVolume, 1)})}</li>
            </ul>
            <p className="mt-3 text-lg font-bold text-brand-ink">Advies: {resultaat.advies}</p>
            <p className="mt-3 text-sm leading-6 text-neutral-600">{config.teksten.werkafval_uitleg}</p>
          </ResultCard>
          <TipBlock>{config.teksten.tip}</TipBlock>

          <ExportDocument
            printId="container-print"
            tip={config.teksten.tip}
            toolNaam="Containercalculator"
            uitkomstRegels={[
              vulTemplate(config.teksten.opbouw_sloop_tekst, {sloop_volume: formatNL(resultaat.sloopVolume, 1)}),
              vulTemplate(config.teksten.opbouw_werkafval_tekst, {werkafval_volume: formatNL(resultaat.werkafvalVolume, 1)}),
              `Advies: ${resultaat.advies}`,
            ]}
            uitkomstTitel={vulTemplate(config.teksten.resultaat_titel, {volume: formatNL(resultaat.volume, 1)})}
            waardes={[
              {label: "Type klus", waarde: config.klustypes.find((k) => k.id === klusTypeId)?.label ?? ""},
              {label: "M²", waarde: `${m2} m²`},
            ]}
          />
          <ExportKnop />

          <ConversieLaag samenvatting={{advies: resultaat.advies}} toolId="container" />
        </>
      ) : null}

      {klusTypeId && (m2 ?? 0) > 0 && resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
