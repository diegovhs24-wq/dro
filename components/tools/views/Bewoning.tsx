"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {CheckboxGroup, ToggleField} from "../ToolFormFields";
import {ConversieLaag, Disclaimer, ExportDocument, ExportKnop, FieldsetCard, ResultCard, ResultHeadline} from "../ToolShared";
import {berekenBewoning, isRekenFout} from "../toolsEngine";

export default function Bewoning() {
  const config = DRO_TOOLS_CONFIG.tools.bewoning;
  const [ruimteIds, setRuimteIds] = useState<string[]>([]);
  const [tweedeToilet, setTweedeToilet] = useState(true);
  const [thuiswerkers, setThuiswerkers] = useState(false);
  const [kinderen, setKinderen] = useState(false);

  const resultaat = useMemo(() => {
    if (!ruimteIds.length) return null;
    return berekenBewoning({ruimteIds, tweedeToilet, thuiswerkers, kinderen});
  }, [ruimteIds, tweedeToilet, thuiswerkers, kinderen]);

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <CheckboxGroup
          legend="Welke ruimtes worden aangepakt?"
          onChange={setRuimteIds}
          options={config.ruimtes.map((r) => ({id: r.id, label: r.label}))}
          selectedIds={ruimteIds}
        />
        <ToggleField label="Is er een tweede toilet of douchemogelijkheid?" onChange={setTweedeToilet} value={tweedeToilet} />
        <ToggleField label="Werk je thuis?" onChange={setThuiswerkers} value={thuiswerkers} />
        <ToggleField label="Kinderen onder de 6 jaar in huis?" onChange={setKinderen} value={kinderen} />
      </FieldsetCard>

      {resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>{resultaat.titel}</ResultHeadline>
            <p className="mt-3 text-sm leading-6 text-neutral-700">{resultaat.tekst}</p>
            {resultaat.adviezen.length ? (
              <ul className="mt-4 grid gap-2 text-sm font-semibold text-neutral-700">
                {resultaat.adviezen.map((advies, index) => (
                  <li className="flex gap-2" key={index}>
                    <span className="text-brand-orange">✔</span>
                    {advies}
                  </li>
                ))}
              </ul>
            ) : null}
          </ResultCard>
          <Disclaimer>Stof is het grootste onderschatte punt, laat de aannemer stofschotten plaatsen.</Disclaimer>

          <ExportDocument printId="bewoning-print" toolNaam="Verbouwen tijdens bewoning check" uitkomstRegels={resultaat.adviezen} uitkomstTitel={resultaat.titel} />
          <ExportKnop />

          <ConversieLaag samenvatting={{titel: resultaat.titel}} toolId="bewoning" />
        </>
      ) : null}

      {resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
