"use client";

import {useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {SelectField} from "../ToolFormFields";
import {ConversieLaag, Disclaimer, ExportDocument, ExportKnop, FieldsetCard, ResultCard, ResultHeadline, TipBlock} from "../ToolShared";
import {haalWerktijden} from "../toolsEngine";

export default function Werktijden() {
  const config = DRO_TOOLS_CONFIG.tools.werktijden;
  const [gemeenteId, setGemeenteId] = useState("");

  const gemeente = gemeenteId ? haalWerktijden(gemeenteId) : null;
  const isAnders = gemeenteId === "anders";

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <SelectField
          id="werktijden-gemeente"
          label="Gemeente"
          onChange={setGemeenteId}
          options={config.gemeenten.map((g) => ({id: g.id, label: g.label}))}
          placeholder="Kies je gemeente"
          value={gemeenteId}
        />
      </FieldsetCard>

      {gemeente ? (
        <>
          <ResultCard>
            <ResultHeadline>Toegestane werktijden{!isAnders ? ` in ${gemeente.label}` : ""}</ResultHeadline>
            {isAnders ? (
              <div className="mt-4 grid gap-2 text-sm font-semibold text-neutral-700">
                <p>Werkdagen: {config.landelijke_vuistregel.werkdagen}</p>
                <p>Zaterdag: {config.landelijke_vuistregel.zaterdag}</p>
                <p>Zondag en feestdagen: {config.landelijke_vuistregel.zondag_feestdag}</p>
                <p className="mt-2 font-bold text-brand-ink">{gemeente.opmerking}</p>
              </div>
            ) : (
              <div className="mt-4 grid gap-2 text-sm font-semibold text-neutral-700">
                <p>Werkdagen: {gemeente.werkdagen}</p>
                <p>Zaterdag: {gemeente.zaterdag}</p>
                <p>Zondag en feestdagen: {gemeente.zondag_feestdag}</p>
              </div>
            )}
            <p className="mt-4 text-sm text-neutral-600">{config.teksten.melding_tekst}</p>
          </ResultCard>
          <TipBlock>{config.teksten.buren_tip}</TipBlock>
          <Disclaimer>
            {config.teksten.disclaimer}{" "}
            <a className="font-bold text-brand-orange hover:text-brand-ink" href={config.gemeente_zoek_url} rel="noopener noreferrer" target="_blank">
              Zoek je gemeente
            </a>
          </Disclaimer>
          <ExportDocument
            disclaimer={config.teksten.disclaimer}
            printId="werktijden-print"
            toolNaam="Bouwgeluid en werktijden check"
            uitkomstRegels={isAnders ? [`Werkdagen: ${config.landelijke_vuistregel.werkdagen}`, `Zaterdag: ${config.landelijke_vuistregel.zaterdag}`] : [`Werkdagen: ${gemeente.werkdagen}`, `Zaterdag: ${gemeente.zaterdag}`, `Zondag en feestdagen: ${gemeente.zondag_feestdag}`]}
            uitkomstTitel={`Toegestane werktijden${!isAnders ? ` in ${gemeente.label}` : ""}`}
          />
          <ExportKnop />

          <ConversieLaag samenvatting={{gemeente: gemeente.label}} toolId="werktijden" />
        </>
      ) : null}
    </div>
  );
}
