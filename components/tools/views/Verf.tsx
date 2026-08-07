"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {NumberField, SelectField, SingleCheckbox} from "../ToolFormFields";
import {ConversieLaag, Disclaimer, ExportDocument, ExportKnop, FieldsetCard, ResultCard, ResultHeadline, TipBlock} from "../ToolShared";
import {berekenVerf, formatNL, isRekenFout, vulTemplate} from "../toolsEngine";

export default function Verf() {
  const config = DRO_TOOLS_CONFIG.tools.verf;
  const [verfsoortId, setVerfsoortId] = useState(config.muurverf_verfsoort_id);
  const [modus, setModus] = useState<"direct" | "help">("help");
  const [m2Direct, setM2Direct] = useState<number | undefined>(undefined);
  const [lengte, setLengte] = useState<number | undefined>(undefined);
  const [breedte, setBreedte] = useState<number | undefined>(undefined);
  const [hoogte, setHoogte] = useState<number | undefined>(undefined);
  const [aftrekM2, setAftrekM2] = useState<number | undefined>(undefined);
  const [plafondMeeschilderen, setPlafondMeeschilderen] = useState(false);
  const [ondergrondId, setOndergrondId] = useState(config.ondergronden[0].id);
  const [lagenHandmatig, setLagenHandmatig] = useState<number | undefined>(undefined);

  const verfsoort = config.verfsoorten.find((v) => v.id === verfsoortId);
  const isMuurverf = verfsoortId === config.muurverf_verfsoort_id;
  const ondergrond = config.ondergronden.find((o) => o.id === ondergrondId);
  const heeftInvoer = modus === "direct" ? (m2Direct ?? 0) > 0 : (lengte ?? 0) > 0 && (breedte ?? 0) > 0 && (hoogte ?? 0) > 0;

  const resultaat = useMemo(
    () =>
      berekenVerf({
        verfsoortId,
        modus,
        m2Direct,
        lengte,
        breedte,
        hoogte,
        aftrekM2,
        plafondMeeschilderen: isMuurverf ? plafondMeeschilderen : false,
        ondergrondId: isMuurverf ? ondergrondId : undefined,
        lagen: lagenHandmatig,
      }),
    [verfsoortId, modus, m2Direct, lengte, breedte, hoogte, aftrekM2, plafondMeeschilderen, ondergrondId, lagenHandmatig, isMuurverf],
  );

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <SelectField
          id="verf-soort"
          label="Wat ga je verven of behandelen?"
          onChange={(value) => {
            setVerfsoortId(value);
            setLagenHandmatig(undefined);
          }}
          options={config.verfsoorten.map((v) => ({id: v.id, label: v.label}))}
          value={verfsoortId}
        />

        <div className="flex flex-wrap gap-3">
          <button className={`min-h-12 rounded-lg border px-5 text-sm font-bold transition ${modus === "help" ? "border-brand-orange bg-brand-orange text-white" : "border-black/15 bg-white text-brand-ink"}`} onClick={() => setModus("help")} type="button">
            Help me rekenen
          </button>
          <button className={`min-h-12 rounded-lg border px-5 text-sm font-bold transition ${modus === "direct" ? "border-brand-orange bg-brand-orange text-white" : "border-black/15 bg-white text-brand-ink"}`} onClick={() => setModus("direct")} type="button">
            Ik weet mijn m² al
          </button>
        </div>

        {modus === "direct" ? (
          <NumberField id="verf-m2-direct" label="Te schilderen of behandelen oppervlak (m²)" onChange={setM2Direct} value={m2Direct} />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField id="verf-lengte" label="Lengte (m)" onChange={setLengte} value={lengte} />
              <NumberField id="verf-breedte" label="Breedte (m)" onChange={setBreedte} value={breedte} />
              <NumberField id="verf-hoogte" label="Hoogte (m)" onChange={setHoogte} value={hoogte} />
            </div>
            <NumberField id="verf-aftrek" label="Aftrek voor deuren en ramen (m²)" onChange={setAftrekM2} value={aftrekM2 ?? config.standaard_aftrek_m2} />
            {isMuurverf ? <SingleCheckbox checked={plafondMeeschilderen} id="verf-plafond" label="Plafond meeschilderen" onChange={setPlafondMeeschilderen} /> : null}
          </>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {isMuurverf ? (
            <SelectField
              id="verf-ondergrond"
              label="Ondergrond"
              onChange={(value) => {
                setOndergrondId(value);
                setLagenHandmatig(undefined);
              }}
              options={config.ondergronden.map((o) => ({id: o.id, label: o.label}))}
              value={ondergrondId}
            />
          ) : null}
          <SelectField
            id="verf-lagen"
            label="Aantal lagen"
            onChange={(value) => setLagenHandmatig(Number(value))}
            options={Array.from({length: config.max_lagen - config.min_lagen + 1}, (_, i) => config.min_lagen + i).map((n) => ({id: String(n), label: `${n} laag/lagen`}))}
            value={String(lagenHandmatig ?? (isMuurverf ? ondergrond?.default_lagen : verfsoort?.default_lagen) ?? config.min_lagen)}
          />
        </div>
      </FieldsetCard>

      {heeftInvoer && resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>
              {vulTemplate(config.teksten.resultaat_titel, {liters: formatNL(resultaat.liters, 1), verfsoort: resultaat.verfsoort.label.toLowerCase(), blikken_advies: resultaat.blikkenAdvies || `${formatNL(resultaat.liters, 1)} liter`})}
            </ResultHeadline>
            <p className="mt-2 text-sm text-neutral-600">
              {vulTemplate(config.teksten.range_tekst, {min: formatNL(resultaat.verfsoort.m2_per_liter_min, 0), max: formatNL(resultaat.verfsoort.m2_per_liter_max, 0)})}
            </p>
            {typeof resultaat.litersVoorstrijk === "number" ? (
              <p className="mt-3 text-lg font-bold text-brand-ink">{vulTemplate(config.teksten.voorstrijk_titel, {liters_voorstrijk: formatNL(resultaat.litersVoorstrijk, 1)})}</p>
            ) : null}
            <p className="mt-3 text-sm font-semibold text-neutral-600">
              Op basis van {formatNL(resultaat.totaalM2, 1)} m² en {resultaat.lagen} laag/lagen.
            </p>
          </ResultCard>
          <TipBlock>{config.teksten.tip}</TipBlock>
          <Disclaimer>{config.teksten.disclaimer}</Disclaimer>

          <ExportDocument
            disclaimer={config.teksten.disclaimer}
            printId="verf-print"
            tip={config.teksten.tip}
            toolNaam="Verf calculator"
            uitkomstTitel={vulTemplate(config.teksten.resultaat_titel, {liters: formatNL(resultaat.liters, 1), verfsoort: resultaat.verfsoort.label.toLowerCase(), blikken_advies: resultaat.blikkenAdvies || `${formatNL(resultaat.liters, 1)} liter`})}
            waardes={[
              {label: "Verfsoort", waarde: resultaat.verfsoort.label},
              {label: "Oppervlak", waarde: `${formatNL(resultaat.totaalM2, 1)} m²`},
              {label: "Ondergrond", waarde: ondergrond?.label ?? "-"},
            ]}
          />
          <ExportKnop />

          <ConversieLaag samenvatting={{m2: formatNL(resultaat.totaalM2, 1), liters: formatNL(resultaat.liters, 1)}} toolId="verf" />
        </>
      ) : null}

      {heeftInvoer && resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
