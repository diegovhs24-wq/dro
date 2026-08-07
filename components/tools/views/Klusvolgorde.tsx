"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {CheckboxGroup} from "../ToolFormFields";
import {ConversieLaag, ExportDocument, ExportKnop, FieldsetCard, ResultCard, ResultHeadline, TipBlock} from "../ToolShared";
import {berekenKlusvolgorde} from "../toolsEngine";

export default function Klusvolgorde() {
  const config = DRO_TOOLS_CONFIG.tools.klusvolgorde;
  const [geselecteerd, setGeselecteerd] = useState<string[]>([]);

  const stappen = useMemo(() => berekenKlusvolgorde(geselecteerd), [geselecteerd]);

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <CheckboxGroup legend="Welke werkzaamheden ga je doen?" onChange={setGeselecteerd} options={config.stappen.map((s) => ({id: s.id, label: s.label}))} selectedIds={geselecteerd} />
      </FieldsetCard>

      {stappen.length > 0 ? (
        <>
          <ResultCard>
            <ResultHeadline>Jouw klusvolgorde</ResultHeadline>
            <ol className="mt-4 grid gap-3">
              {stappen.map((stap, index) => (
                <li className="rounded-lg bg-white p-4" key={stap.id}>
                  <p className="font-bold text-brand-ink">
                    {index + 1}. {stap.label}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">{stap.uitleg}</p>
                  {stap.waarschuwing ? <p className="mt-2 text-sm font-bold text-brand-orange">{stap.waarschuwing}</p> : null}
                </li>
              ))}
            </ol>
          </ResultCard>
          <TipBlock>{config.teksten.tip}</TipBlock>

          <ExportDocument
            checklistItems={stappen.map((stap) => ({label: stap.label}))}
            printId="klusvolgorde-print"
            tip={config.teksten.tip}
            toolNaam="Klusvolgorde planner"
            uitkomstTitel="Jouw klusvolgorde"
          />
          <ExportKnop />

          <ConversieLaag samenvatting={{}} toolId="klusvolgorde" />
        </>
      ) : null}
    </div>
  );
}
