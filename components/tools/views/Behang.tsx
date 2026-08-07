"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {NumberField} from "../ToolFormFields";
import {FieldsetCard, ResultCard, ResultHeadline, TipBlock, ToolCTA} from "../ToolShared";
import {berekenBehang, isRekenFout, vulTemplate} from "../toolsEngine";

export default function Behang() {
  const config = DRO_TOOLS_CONFIG.tools.behang;
  const [modus, setModus] = useState<"afmeting" | "m2">("afmeting");
  const [omtrek, setOmtrek] = useState<number | undefined>(undefined);
  const [muurhoogte, setMuurhoogte] = useState<number | undefined>(undefined);
  const [m2, setM2] = useState<number | undefined>(undefined);
  const [patroonherhalingCm, setPatroonherhalingCm] = useState<number | undefined>(undefined);

  const heeftInvoer = modus === "afmeting" ? (omtrek ?? 0) > 0 && (muurhoogte ?? 0) > 0 : (m2 ?? 0) > 0;

  const resultaat = useMemo(
    () => berekenBehang({modus, omtrek, muurhoogte, m2, patroonherhalingCm}),
    [modus, omtrek, muurhoogte, m2, patroonherhalingCm]
  );

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <div className="flex flex-wrap gap-3">
          <button className={`min-h-12 rounded-lg border px-5 text-sm font-bold transition ${modus === "afmeting" ? "border-brand-orange bg-brand-orange text-white" : "border-black/15 bg-white text-brand-ink"}`} onClick={() => setModus("afmeting")} type="button">
            Op basis van afmetingen
          </button>
          <button className={`min-h-12 rounded-lg border px-5 text-sm font-bold transition ${modus === "m2" ? "border-brand-orange bg-brand-orange text-white" : "border-black/15 bg-white text-brand-ink"}`} onClick={() => setModus("m2")} type="button">
            Ik weet mijn m² al
          </button>
        </div>

        {modus === "afmeting" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField id="behang-omtrek" label="Omtrek muren (m)" onChange={setOmtrek} value={omtrek} />
            <NumberField id="behang-hoogte" label="Muurhoogte (m)" onChange={setMuurhoogte} value={muurhoogte} />
          </div>
        ) : (
          <NumberField id="behang-m2" label="Muuroppervlak (m²)" onChange={setM2} value={m2} />
        )}
        <NumberField id="behang-patroon" label="Patroonherhaling (cm, 0 = geen patroon)" onChange={setPatroonherhalingCm} step={1} value={patroonherhalingCm} />
      </FieldsetCard>

      {heeftInvoer && resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>{vulTemplate(config.teksten.resultaat_titel, {rollen: resultaat.rollen})}</ResultHeadline>
            <p className="mt-3 text-sm text-neutral-600">{vulTemplate(config.teksten.aanname_tekst, {rolbreedte: resultaat.rolbreedte, rollengte: resultaat.rollengte})}</p>
          </ResultCard>
          <TipBlock>{config.teksten.tip}</TipBlock>
          <ToolCTA toolId="behang" />
        </>
      ) : null}

      {heeftInvoer && resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
