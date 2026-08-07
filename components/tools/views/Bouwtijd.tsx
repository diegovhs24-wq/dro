"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {CheckboxGroup, SelectField, SliderField} from "../ToolFormFields";
import {ConversieLaag, Disclaimer, ExportDocument, ExportKnop, FieldsetCard, ResultCard, ResultHeadline} from "../ToolShared";
import {berekenBouwtijd, formatNL, isRekenFout, vulTemplate} from "../toolsEngine";

export default function Bouwtijd() {
  const config = DRO_TOOLS_CONFIG.tools.bouwtijd;
  const [projecttypeId, setProjecttypeId] = useState("");
  const [m2, setM2] = useState<number | undefined>(undefined);
  const [breedte, setBreedte] = useState<number | undefined>(undefined);
  const [verdiepingen, setVerdiepingen] = useState<number | undefined>(undefined);
  const [optieIds, setOptieIds] = useState<string[]>([]);

  const type = config.projecttypes.find((t) => t.id === projecttypeId);
  const huidigeM2 = m2 ?? type?.default_m2 ?? 0;
  const huidigeBreedte = breedte ?? type?.default_breedte ?? 0;
  const huidigeVerdiepingen = verdiepingen ?? type?.default_verdiepingen ?? 1;

  const resultaat = useMemo(() => {
    if (!type) return null;
    return berekenBouwtijd({
      projecttypeId: type.id,
      m2: type.vraag_m2 ? huidigeM2 : undefined,
      breedte: type.vraag_breedte ? huidigeBreedte : undefined,
      verdiepingen: type.vraag_verdiepingen ? huidigeVerdiepingen : undefined,
      optieIds,
    });
  }, [type, huidigeM2, huidigeBreedte, huidigeVerdiepingen, optieIds]);

  const beschikbareOpties = type ? config.extra_opties.filter((optie) => type.opties.includes(optie.id)) : [];

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <SelectField
          id="bouwtijd-projecttype"
          label="Projecttype"
          onChange={(value) => {
            setProjecttypeId(value);
            setM2(undefined);
            setBreedte(undefined);
            setVerdiepingen(undefined);
            setOptieIds([]);
          }}
          options={config.projecttypes.map((t) => ({id: t.id, label: t.label}))}
          placeholder="Kies een projecttype"
          value={projecttypeId}
        />

        {type?.vraag_m2 ? (
          <SliderField
            eenheid=" m²"
            id="bouwtijd-m2"
            label={type.m2_label || "Oppervlak"}
            max={type.max_m2 ?? 100}
            min={type.min_m2 ?? 0}
            onChange={setM2}
            value={huidigeM2}
          />
        ) : null}

        {type?.vraag_breedte ? (
          <SliderField
            eenheid=" m"
            id="bouwtijd-breedte"
            label={type.breedte_label || "Breedte"}
            max={type.max_breedte ?? 10}
            min={type.min_breedte ?? 0}
            onChange={setBreedte}
            step={0.5}
            value={huidigeBreedte}
          />
        ) : null}

        {type?.vraag_verdiepingen ? (
          <SliderField
            id="bouwtijd-verdiepingen"
            label="Aantal verdiepingen"
            max={type.max_verdiepingen ?? 4}
            min={type.min_verdiepingen ?? 1}
            onChange={setVerdiepingen}
            value={huidigeVerdiepingen}
          />
        ) : null}

        {type?.vaste_opmerking ? (
          <p className="rounded-lg bg-brand-soft p-4 text-sm font-semibold text-neutral-700">{type.vaste_opmerking}</p>
        ) : null}

        {beschikbareOpties.length ? (
          <CheckboxGroup legend="Extra opties" onChange={setOptieIds} options={beschikbareOpties} selectedIds={optieIds} />
        ) : null}
      </FieldsetCard>

      {resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>
              {vulTemplate(config.teksten.resultaat_titel, {weken_min: resultaat.wekenMin, weken_max: resultaat.wekenMax})}
            </ResultHeadline>

            <p className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-brand-orange">{config.teksten.opbouw_titel}</p>
            <ul className="mt-3 grid gap-1.5 text-sm font-semibold text-neutral-700">
              <li>
                Basis {resultaat.type.label.toLowerCase()}: {formatNL(resultaat.basisDagen, 1)} werkdagen
              </li>
              {resultaat.gekozenOpties.map((optie) => (
                <li key={optie.id}>
                  {optie.label}: +{formatNL(optie.extra_dagen, 1)} werkdagen
                </li>
              ))}
              <li className="mt-1 font-extrabold text-brand-ink">Totaal: {formatNL(resultaat.totaalDagen, 1)} werkdagen</li>
            </ul>
          </ResultCard>

          <div className="rounded-lg bg-white p-5">
            <p className="text-sm font-bold text-brand-ink">{config.teksten.voorbereiding_titel}</p>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{config.teksten.voorbereiding_tekst}</p>
          </div>

          <Disclaimer>{config.teksten.disclaimer}</Disclaimer>

          <ExportDocument
            disclaimer={config.teksten.disclaimer}
            printId="bouwtijd-print"
            toolNaam="Bouwtijd calculator"
            uitkomstRegels={[
              `Basis ${resultaat.type.label.toLowerCase()}: ${formatNL(resultaat.basisDagen, 1)} werkdagen`,
              ...resultaat.gekozenOpties.map((optie) => `${optie.label}: +${formatNL(optie.extra_dagen, 1)} werkdagen`),
              `Totaal: ${formatNL(resultaat.totaalDagen, 1)} werkdagen`,
            ]}
            uitkomstTitel={vulTemplate(config.teksten.resultaat_titel, {weken_min: resultaat.wekenMin, weken_max: resultaat.wekenMax})}
            waardes={[{label: "Projecttype", waarde: resultaat.type.label}]}
          />
          <ExportKnop />

          <ConversieLaag
            samenvatting={{projecttype: resultaat.type.label.toLowerCase(), weken_min: String(resultaat.wekenMin), weken_max: String(resultaat.wekenMax)}}
            toolId="bouwtijd"
          />
        </>
      ) : null}

      {resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
