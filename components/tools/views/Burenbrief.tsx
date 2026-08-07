"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {ButtonGroup, SelectField, TextField} from "../ToolFormFields";
import {ConversieLaag, Disclaimer, FieldsetCard, PrintableBlock, ResultCard, TipBlock} from "../ToolShared";
import {genereerBurenbrief, isRekenFout} from "../toolsEngine";

export default function Burenbrief() {
  const config = DRO_TOOLS_CONFIG.tools.burenbrief;
  const [naam, setNaam] = useState("");
  const [adres, setAdres] = useState("");
  const [projectTypeId, setProjectTypeId] = useState("");
  const [startdatum, setStartdatum] = useState("");
  const [einddatum, setEinddatum] = useState("");
  const [luidruchtigePeriode, setLuidruchtigePeriode] = useState("");
  const [contact, setContact] = useState("");
  const [variantId, setVariantId] = useState(config.varianten[0].id);
  const [gekopieerd, setGekopieerd] = useState(false);

  const resultaat = useMemo(() => {
    if (!naam || !adres || !projectTypeId || !startdatum) return null;
    return genereerBurenbrief({naam, adres, projectTypeId, startdatum, einddatum, luidruchtigePeriode, contact, variantId});
  }, [naam, adres, projectTypeId, startdatum, einddatum, luidruchtigePeriode, contact, variantId]);

  async function kopieer(tekst: string) {
    try {
      await navigator.clipboard.writeText(tekst);
      setGekopieerd(true);
      setTimeout(() => setGekopieerd(false), 2000);
    } catch {
      setGekopieerd(false);
    }
  }

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <ButtonGroup legend="Toon" onChange={setVariantId} options={config.varianten} value={variantId} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField id="burenbrief-naam" label="Jouw naam" onChange={setNaam} value={naam} />
          <TextField id="burenbrief-adres" label="Adres van de verbouwing" onChange={setAdres} value={adres} />
        </div>
        <SelectField id="burenbrief-type" label="Type werkzaamheden" onChange={setProjectTypeId} options={config.projecttypes} placeholder="Kies een type" value={projectTypeId} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField id="burenbrief-start" label="Startdatum" onChange={setStartdatum} type="date" value={startdatum} />
          <TextField id="burenbrief-eind" label="Verwachte einddatum" onChange={setEinddatum} type="date" value={einddatum} />
        </div>
        <TextField id="burenbrief-periode" label="Luidruchtigste periode" onChange={setLuidruchtigePeriode} placeholder="bijv. de eerste twee weken" value={luidruchtigePeriode} />
        <TextField id="burenbrief-contact" label="Contactgegevens (optioneel)" onChange={setContact} placeholder="telefoonnummer" value={contact} />
      </FieldsetCard>

      {resultaat && !isRekenFout(resultaat) ? (
        <>
          <PrintableBlock printId="burenbrief-print">
            <ResultCard>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-neutral-800">{resultaat.tekst}</pre>
              <p className="mt-6 text-xs text-neutral-400 print:mt-10">{config.teksten.afzenderregel}</p>
              <div className="mt-5 flex flex-wrap gap-3 print:hidden">
                <button className="btn-primary" onClick={() => kopieer(resultaat.tekst)} type="button">
                  {gekopieerd ? "Gekopieerd" : config.teksten.kopieer_knop}
                </button>
                <button className="rounded-md border border-black/15 px-6 py-3 text-sm font-medium text-brand-ink" onClick={() => window.print()} type="button">
                  {config.teksten.print_knop}
                </button>
              </div>
            </ResultCard>
          </PrintableBlock>

          <TipBlock>{config.teksten.tip}</TipBlock>
          <Disclaimer>{config.teksten.privacy_tekst}</Disclaimer>

          <ConversieLaag samenvatting={{projecttype: config.projecttypes.find((p) => p.id === projectTypeId)?.label?.toLowerCase() ?? ""}} toolId="burenbrief" />
        </>
      ) : null}

      {resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
