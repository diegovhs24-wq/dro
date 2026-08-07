"use client";

import {useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {ButtonGroup} from "../ToolFormFields";
import {Disclaimer, FieldsetCard, ResultCard, ResultHeadline, ToolCTA} from "../ToolShared";
import {berekenVerbouwenVerhuizen, isRekenFout} from "../toolsEngine";

export default function VerbouwenVerhuizen() {
  const config = DRO_TOOLS_CONFIG.tools["verbouwen-verhuizen"];
  const [antwoorden, setAntwoorden] = useState<Record<string, string>>({});

  const alleBeantwoord = config.vragen.every((v) => antwoorden[v.id]);
  const resultaat = alleBeantwoord ? berekenVerbouwenVerhuizen(antwoorden) : null;

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        {config.vragen.map((vraag, index) => (
          <div key={vraag.id}>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-400">Vraag {index + 1}</p>
            <h3 className="mt-2 text-lg font-extrabold text-brand-ink">{vraag.vraag}</h3>
            <div className="mt-4">
              <ButtonGroup
                legend={vraag.vraag}
                onChange={(antwoordId) => setAntwoorden((prev) => ({...prev, [vraag.id]: antwoordId}))}
                options={vraag.antwoorden}
                value={antwoorden[vraag.id] || ""}
              />
            </div>
          </div>
        ))}
      </FieldsetCard>

      {resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>{resultaat.uitkomst.titel}</ResultHeadline>
            <p className="mt-3 text-sm leading-6 text-neutral-700">{resultaat.uitkomst.tekst}</p>
            {resultaat.overwegingen.length ? (
              <div className="mt-4">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-orange">Wat meeweegt</p>
                <ul className="mt-2 grid gap-1.5 text-sm font-semibold text-neutral-700">
                  {resultaat.overwegingen.map((tekst, index) => (
                    <li key={index}>{tekst}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </ResultCard>
          <Disclaimer>{config.teksten.disclaimer}</Disclaimer>
          <ToolCTA toolId="verbouwen-verhuizen" />
        </>
      ) : null}
    </div>
  );
}
