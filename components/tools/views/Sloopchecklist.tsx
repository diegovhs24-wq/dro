"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {NumberField, SelectField, SingleCheckbox} from "../ToolFormFields";
import {ConversieLaag, ExportDocument, ExportKnop, FieldsetCard, ResultCard, ResultHeadline, TussentijdseCta} from "../ToolShared";
import {genereerSloopChecklist, isRekenFout} from "../toolsEngine";

export default function Sloopchecklist() {
  const config = DRO_TOOLS_CONFIG.tools.sloopchecklist;
  const [projectTypeId, setProjectTypeId] = useState("");
  const [bouwjaar, setBouwjaar] = useState<number | undefined>(undefined);
  const [vve, setVve] = useState(false);
  const [bewoning, setBewoning] = useState(false);
  const [afgevinkt, setAfgevinkt] = useState<string[]>([]);

  const resultaat = useMemo(() => {
    if (!projectTypeId || !bouwjaar) return null;
    return genereerSloopChecklist({projectTypeId, bouwjaar, vve, bewoning});
  }, [projectTypeId, bouwjaar, vve, bewoning]);

  function toggle(id: string) {
    setAfgevinkt((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <SelectField id="sloop-type" label="Type project" onChange={setProjectTypeId} options={config.projecttypes} placeholder="Kies een type project" value={projectTypeId} />
        <NumberField id="sloop-bouwjaar" label="Bouwjaar woning" onChange={setBouwjaar} placeholder="bijv. 1985" step={1} value={bouwjaar} />
        <SingleCheckbox checked={vve} id="sloop-vve" label="Woning is onderdeel van een VvE" onChange={setVve} />
        <SingleCheckbox checked={bewoning} id="sloop-bewoning" label="Er wordt in de woning gebleven tijdens de sloop" onChange={setBewoning} />
      </FieldsetCard>

      {resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>Jouw sloopchecklist</ResultHeadline>

            {resultaat.asbestVanToepassing ? (
              <div className="mt-4 rounded-lg border-2 border-red-500 bg-red-50 p-4">
                <p className="text-sm font-bold uppercase tracking-[0.1em] text-red-700">{config.teksten.asbest_titel}</p>
                <p className="mt-2 text-sm leading-6 text-red-700">{config.teksten.asbest_tekst}</p>
              </div>
            ) : null}

            <ul className="mt-4 grid gap-2">
              {resultaat.items
                .filter((item) => item.id !== "asbest")
                .map((item) => (
                  <li key={item.id}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-white p-3 text-sm font-semibold text-neutral-700">
                      <input checked={afgevinkt.includes(item.id)} className="mt-0.5 h-5 w-5 shrink-0 accent-brand-orange" onChange={() => toggle(item.id)} type="checkbox" />
                      {item.tekst}
                    </label>
                  </li>
                ))}
            </ul>
          </ResultCard>

          <TussentijdseCta />

          <ExportDocument
            checklistItems={resultaat.items.filter((item) => item.id !== "asbest").map((item) => ({label: item.tekst, checked: afgevinkt.includes(item.id)}))}
            disclaimer={resultaat.asbestVanToepassing ? `${config.teksten.asbest_titel}: ${config.teksten.asbest_tekst}` : undefined}
            printId="sloopchecklist-print"
            toolNaam="Sloopchecklist generator"
            uitkomstTitel="Jouw sloopchecklist"
            waardes={[
              {label: "Type project", waarde: config.projecttypes.find((p) => p.id === projectTypeId)?.label ?? ""},
              {label: "Bouwjaar", waarde: String(bouwjaar ?? "")},
            ]}
          />
          <ExportKnop label={config.teksten.print_knop_label} />

          <ConversieLaag samenvatting={{projecttype: config.projecttypes.find((p) => p.id === projectTypeId)?.label ?? ""}} toolId="sloopchecklist" />
        </>
      ) : null}

      {resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
