"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {SelectField, SliderField} from "../ToolFormFields";
import {ConversieLaag, ExportDocument, ExportKnop, FieldsetCard, ResultCard, ResultHeadline, TipBlock} from "../ToolShared";
import {bepaalVloerverwarmingSysteem, formatNL, isRekenFout} from "../toolsEngine";

export default function Vloerverwarming() {
  const config = DRO_TOOLS_CONFIG.tools.vloerverwarming;
  const [ondervloerId, setOndervloerId] = useState("");
  const [frezenId, setFrezenId] = useState("");
  const [hoogteId, setHoogteId] = useState("");
  const [m2, setM2] = useState(config.m2_default);

  const resultaat = useMemo(
    () => (ondervloerId && frezenId && hoogteId ? bepaalVloerverwarmingSysteem({ondervloerId, frezenId, hoogteId, m2}) : null),
    [ondervloerId, frezenId, hoogteId, m2],
  );

  const geldigResultaat = resultaat && !isRekenFout(resultaat) ? resultaat : null;

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <SelectField id="vloerverwarming-ondervloer" label="Wat is de huidige ondervloer?" onChange={setOndervloerId} options={config.ondervloer_opties} placeholder="Kies de ondervloer" value={ondervloerId} />
        <SelectField id="vloerverwarming-frezen" label="Is frezen toegestaan en mogelijk?" onChange={setFrezenId} options={config.frezen_opties} placeholder="Kies een antwoord" value={frezenId} />
        <SelectField id="vloerverwarming-hoogte" label="Hoeveel opbouwhoogte is er beschikbaar?" onChange={setHoogteId} options={config.hoogte_opties} placeholder="Kies de beschikbare hoogte" value={hoogteId} />
        <SliderField eenheid=" m²" id="vloerverwarming-m2" label="Oppervlak van de ruimte" max={config.m2_max} min={config.m2_min} onChange={setM2} value={m2} />
      </FieldsetCard>

      {geldigResultaat ? (
        <>
          <ResultCard>
            {geldigResultaat.boodschap ? <p className="mb-4 text-sm font-semibold text-neutral-700">{geldigResultaat.boodschap}</p> : null}
            <div className="grid gap-5">
              {geldigResultaat.systemen.map((systeem) => (
                <div className={geldigResultaat.systemen.length > 1 ? "rounded-lg bg-white p-4" : ""} key={systeem.naam}>
                  <ResultHeadline>{systeem.naam}</ResultHeadline>
                  <ul className="mt-3 grid gap-1.5 text-sm font-semibold text-neutral-700">
                    {systeem.regelsUitleg.map((regel) => (
                      <li key={regel}>{regel}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">{systeem.vloertypeAdvies}</p>
                </div>
              ))}
            </div>
          </ResultCard>

          <p className="text-xs leading-5 text-neutral-500">{config.droogtijd_per_cm_tekst}</p>
          <TipBlock>{config.teksten.tip}</TipBlock>

          <ExportDocument
            printId="vloerverwarming-print"
            tip={config.teksten.tip}
            toolNaam="Vloerverwarming systeemkeuze"
            uitkomstRegels={geldigResultaat.systemen[0]?.regelsUitleg}
            uitkomstTitel={geldigResultaat.systemen[0]?.naam ?? ""}
            waardes={[
              {label: "Ondervloer", waarde: config.ondervloer_opties.find((o) => o.id === ondervloerId)?.label ?? ""},
              {label: "Frezen mogelijk", waarde: config.frezen_opties.find((o) => o.id === frezenId)?.label ?? ""},
              {label: "Opbouwhoogte", waarde: config.hoogte_opties.find((o) => o.id === hoogteId)?.label ?? ""},
              {label: "Oppervlak", waarde: `${formatNL(m2, 0)} m²`},
            ]}
          />
          <ExportKnop />

          <ConversieLaag samenvatting={{systeem: geldigResultaat.systemen[0]?.naam ?? ""}} toolId="vloerverwarming" />
        </>
      ) : null}

      {resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
