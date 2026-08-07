"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {NumberField, SelectField} from "../ToolFormFields";
import {ConversieLaag, ExportDocument, ExportKnop, FieldsetCard, ResultCard, ResultHeadline} from "../ToolShared";
import {berekenTransformatie, formatNL, isRekenFout} from "../toolsEngine";

export default function Transformatie() {
  const config = DRO_TOOLS_CONFIG.tools.transformatie;
  const [huidigGebruik, setHuidigGebruik] = useState("kantoor");
  const [m2Bvo, setM2Bvo] = useState<number | undefined>(undefined);
  const [aantalWoningen, setAantalWoningen] = useState<number | undefined>(undefined);
  const [monument, setMonument] = useState("nee");

  const resultaat = useMemo(() => {
    if (!m2Bvo || !aantalWoningen) return null;
    return berekenTransformatie({m2Bvo, aantalWoningen});
  }, [m2Bvo, aantalWoningen]);

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <SelectField
          id="transformatie-gebruik"
          label="Huidig gebruik"
          onChange={setHuidigGebruik}
          options={[{id: "kantoor", label: "Kantoor"}, {id: "winkel", label: "Winkel"}, {id: "bedrijfsruimte", label: "Bedrijfsruimte"}, {id: "anders", label: "Anders"}]}
          value={huidigGebruik}
        />
        <NumberField id="transformatie-bvo" label="M² BVO" onChange={setM2Bvo} value={m2Bvo} />
        <NumberField id="transformatie-woningen" label="Aantal beoogde woningen" onChange={setAantalWoningen} step={1} value={aantalWoningen} />
        <SelectField id="transformatie-monument" label="Monument of beschermd gezicht" onChange={setMonument} options={[{id: "nee", label: "Nee"}, {id: "ja", label: "Ja"}, {id: "weet_niet", label: "Weet ik niet"}]} value={monument} />
      </FieldsetCard>

      {resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>Gemiddelde woninggrootte: circa {formatNL(resultaat.gemiddeldeWoninggrootte, 0)} m²</ResultHeadline>
            {resultaat.onderMinimum ? (
              <p className="mt-3 text-sm font-bold text-red-600">
                Let op, dit ligt onder de gangbare minimale woninggrootte van {config.min_woninggrootte_m2} m² die veel gemeenten hanteren.
              </p>
            ) : null}
            {monument !== "nee" ? (
              <p className="mt-3 text-sm font-semibold text-neutral-700">
                Bij een monument of beschermd gezicht komt er extra onderzoek en advies bij, met een langere doorlooptijd.
              </p>
            ) : null}
            <div className="mt-5">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-orange">Stappen die vrijwel altijd nodig zijn</p>
              <ul className="mt-3 grid gap-1.5 text-sm font-semibold text-neutral-700">
                {config.stappen.map((stap) => (
                  <li className="flex gap-2" key={stap.id}>
                    <span className="text-brand-orange">✔</span>
                    {stap.tekst}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-4 text-sm font-bold text-brand-ink">{config.doorlooptijd_tekst}</p>
          </ResultCard>
          <ExportDocument
            printId="transformatie-print"
            toolNaam="Transformatie quickscan"
            uitkomstRegels={config.stappen.map((s) => s.tekst)}
            uitkomstTitel={`Gemiddelde woninggrootte: circa ${formatNL(resultaat.gemiddeldeWoninggrootte, 0)} m²`}
            waardes={[
              {label: "Huidig gebruik", waarde: huidigGebruik},
              {label: "M² BVO", waarde: `${m2Bvo} m²`},
              {label: "Aantal beoogde woningen", waarde: String(aantalWoningen)},
            ]}
          />
          <ExportKnop />

          <ConversieLaag samenvatting={{m2: String(m2Bvo), woningen: String(aantalWoningen)}} toolId="transformatie" />
        </>
      ) : null}

      {resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
