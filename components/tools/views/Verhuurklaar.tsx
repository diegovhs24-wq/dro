"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {CheckboxGroup} from "../ToolFormFields";
import {Disclaimer, FieldsetCard, ResultCard, ResultHeadline, ToolCTA} from "../ToolShared";
import {checkVerhuurKlaar} from "../toolsEngine";

const STATUS_LABEL = {
  klaar: "Verhuurklaar",
  bijna: "Bijna verhuurklaar",
  niet_klaar: "Nog niet verhuurklaar",
};

export default function Verhuurklaar() {
  const config = DRO_TOOLS_CONFIG.tools.verhuurklaar;
  const [aangevinkt, setAangevinkt] = useState<string[]>([]);

  const resultaat = useMemo(() => checkVerhuurKlaar(aangevinkt), [aangevinkt]);

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <CheckboxGroup legend="Wat is al op orde?" onChange={setAangevinkt} options={config.items.map((i) => ({id: i.id, label: i.label}))} selectedIds={aangevinkt} />
      </FieldsetCard>

      {aangevinkt.length > 0 ? (
        <>
          <ResultCard>
            <ResultHeadline>{STATUS_LABEL[resultaat.status]}</ResultHeadline>
            {resultaat.ontbrekend.length ? (
              <div className="mt-4">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-orange">Nog te doen</p>
                <ul className="mt-2 grid gap-2 text-sm font-semibold text-neutral-700">
                  {resultaat.ontbrekend.map((item) => (
                    <li key={item.label}>
                      {item.verplicht ? <span className="mr-2 font-bold text-red-600">Verplicht</span> : <span className="mr-2 text-neutral-400">Aanbevolen</span>}
                      {item.label}
                      <span className="block text-xs font-normal text-neutral-500">{item.uitleg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-3 text-sm text-neutral-600">Alle punten zijn op orde.</p>
            )}
          </ResultCard>
          <Disclaimer>{config.teksten.disclaimer}</Disclaimer>
          <ToolCTA toolId="verhuurklaar" />
        </>
      ) : null}
    </div>
  );
}
