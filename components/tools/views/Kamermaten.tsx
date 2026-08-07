"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {NumberField, SelectField} from "../ToolFormFields";
import {FieldsetCard, ResultCard, ResultHeadline, TipBlock, ToolCTA} from "../ToolShared";
import {checkKamermaten, formatNL, isRekenFout} from "../toolsEngine";

const STATUS_LABEL = {
  voldoet_niet: "Voldoet niet aan de minimale maat",
  krap: "Krap, maar het kan",
  comfortabel: "Comfortabel",
};

export default function Kamermaten() {
  const config = DRO_TOOLS_CONFIG.tools.kamermaten;
  const [typeId, setTypeId] = useState("");
  const [lengte, setLengte] = useState<number | undefined>(undefined);
  const [breedte, setBreedte] = useState<number | undefined>(undefined);

  const resultaat = useMemo(() => {
    if (!typeId || !lengte || !breedte) return null;
    return checkKamermaten({typeId, lengte, breedte});
  }, [typeId, lengte, breedte]);

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <SelectField id="kamermaten-type" label="Type ruimte" onChange={setTypeId} options={config.types.map((t) => ({id: t.id, label: t.label}))} placeholder="Kies een type ruimte" value={typeId} />
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField id="kamermaten-lengte" label="Geplande lengte (m)" onChange={setLengte} value={lengte} />
          <NumberField id="kamermaten-breedte" label="Geplande breedte (m)" onChange={setBreedte} value={breedte} />
        </div>
      </FieldsetCard>

      {resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>
              {STATUS_LABEL[resultaat.status]} ({formatNL(resultaat.m2, 1)} m²)
            </ResultHeadline>
            {resultaat.elementen.length ? (
              <ul className="mt-4 grid gap-1.5 text-sm font-semibold text-neutral-700">
                {resultaat.elementen.map((el, index) => (
                  <li key={index}>{el}</li>
                ))}
              </ul>
            ) : null}
          </ResultCard>
          <TipBlock>{config.teksten.tip}</TipBlock>
          <ToolCTA toolId="kamermaten" />
        </>
      ) : null}

      {resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
