"use client";

import Link from "next/link";
import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {SelectField} from "../ToolFormFields";
import {FieldsetCard, ResultCard, ResultHeadline, StuurResultaatKnop} from "../ToolShared";
import {bepaalVoorDroAdvies, isRekenFout} from "../toolsEngine";

export default function VoorDro() {
  const config = DRO_TOOLS_CONFIG.tools["voor-dro"];
  const algemeen = DRO_TOOLS_CONFIG.algemeen;
  const [projectId, setProjectId] = useState("");
  const [regioId, setRegioId] = useState("");
  const [timingId, setTimingId] = useState("");

  const resultaat = useMemo(
    () => (projectId && regioId && timingId ? bepaalVoorDroAdvies({projectId, regioId, timingId}) : null),
    [projectId, regioId, timingId],
  );
  const geldigResultaat = resultaat && !isRekenFout(resultaat) ? resultaat : null;

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <SelectField id="voordro-project" label="Wat wil je laten doen?" onChange={setProjectId} options={config.project_opties} placeholder="Kies een project" value={projectId} />
        <SelectField id="voordro-regio" label="Waar staat de woning?" onChange={setRegioId} options={config.regio_opties} placeholder="Kies een regio" value={regioId} />
        <SelectField id="voordro-timing" label="Wanneer wil je starten?" onChange={setTimingId} options={config.timing_opties} placeholder="Kies een moment" value={timingId} />
      </FieldsetCard>

      {geldigResultaat ? (
        <>
          <ResultCard>
            <ResultHeadline>{geldigResultaat.titel}</ResultHeadline>
            <p className="mt-3 text-sm leading-6 text-neutral-700">{geldigResultaat.tekst}</p>
          </ResultCard>

          <div className="flex flex-col gap-3 sm:flex-row">
            <StuurResultaatKnop
              samenvatting={{projecttype: geldigResultaat.projectLabel.toLowerCase(), regio: geldigResultaat.regioLabel, timing: geldigResultaat.timingLabel.toLowerCase()}}
              toolId="voor-dro"
            />
            <Link className="btn-secondary inline-flex justify-center" href={algemeen.contact_pad}>
              {algemeen.cta_knop_gesprek}
            </Link>
          </div>

          {geldigResultaat.toonToolLinks ? (
            <p className="text-sm font-semibold text-neutral-600">
              Begin bijvoorbeeld met de{" "}
              <a className="text-brand-orange hover:underline" href="#bouwtijd">
                bouwtijd calculator
              </a>{" "}
              of de{" "}
              <a className="text-brand-orange hover:underline" href="#vergunning">
                vergunningcheck
              </a>
              .
            </p>
          ) : null}
        </>
      ) : null}

      {resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
