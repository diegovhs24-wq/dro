"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {NumberField, SelectField, SingleCheckbox} from "../ToolFormFields";
import {ConversieLaag, Disclaimer, ExportDocument, ExportKnop, FieldsetCard, ResultCard, ResultHeadline, TipBlock} from "../ToolShared";
import {berekenStucwerk, isRekenFout, vulTemplate} from "../toolsEngine";

export default function Stucwerk() {
  const config = DRO_TOOLS_CONFIG.tools.stucwerk;
  const [vloerM2, setVloerM2] = useState<number | undefined>(undefined);
  const [aantalRuimtes, setAantalRuimtes] = useState<number | undefined>(undefined);
  const [woningtypeId, setWoningtypeId] = useState(config.woningtypes[0].id);
  const [plafondsMeenemen, setPlafondsMeenemen] = useState(true);

  const resultaat = useMemo(
    () => berekenStucwerk({vloerM2: vloerM2 ?? 0, aantalRuimtes: aantalRuimtes ?? 0, woningtypeId, plafondsMeenemen}),
    [vloerM2, aantalRuimtes, woningtypeId, plafondsMeenemen],
  );
  const heeftInvoer = (vloerM2 ?? 0) > 0 && (aantalRuimtes ?? 0) > 0;
  const geldigResultaat = heeftInvoer && resultaat && !isRekenFout(resultaat) ? resultaat : null;

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField id="stucwerk-vloer" label="Vloeroppervlak (m²)" onChange={setVloerM2} value={vloerM2} />
          <NumberField id="stucwerk-ruimtes" label="Aantal ruimtes" onChange={setAantalRuimtes} value={aantalRuimtes} />
        </div>
        <SelectField id="stucwerk-woningtype" label="Woningtype" onChange={setWoningtypeId} options={config.woningtypes.map((w) => ({id: w.id, label: w.label}))} value={woningtypeId} />
        <SingleCheckbox checked={plafondsMeenemen} id="stucwerk-plafonds" label="Plafonds meenemen in de indicatie" onChange={setPlafondsMeenemen} />
      </FieldsetCard>

      {geldigResultaat ? (
        <>
          <ResultCard>
            <ResultHeadline>{vulTemplate(config.teksten.resultaat_titel, {wand_m2: geldigResultaat.wandM2, plafond_m2: geldigResultaat.plafondM2})}</ResultHeadline>
            <p className="mt-3 text-sm font-semibold text-neutral-600">{vulTemplate(config.teksten.werktijd_titel, {dagen_min: geldigResultaat.dagenMin, dagen_max: geldigResultaat.dagenMax})}</p>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{config.teksten.behang_vs_sausklaar_tekst}</p>
          </ResultCard>
          <Disclaimer>{config.teksten.disclaimer}</Disclaimer>
          <TipBlock>{config.teksten.tip}</TipBlock>

          <ExportDocument
            disclaimer={config.teksten.disclaimer}
            printId="stucwerk-print"
            tip={config.teksten.tip}
            toolNaam="Stucwerk m2 indicatie"
            uitkomstRegels={[vulTemplate(config.teksten.werktijd_titel, {dagen_min: geldigResultaat.dagenMin, dagen_max: geldigResultaat.dagenMax})]}
            uitkomstTitel={vulTemplate(config.teksten.resultaat_titel, {wand_m2: geldigResultaat.wandM2, plafond_m2: geldigResultaat.plafondM2})}
            waardes={[
              {label: "Vloeroppervlak", waarde: `${vloerM2} m²`},
              {label: "Aantal ruimtes", waarde: String(aantalRuimtes)},
              {label: "Woningtype", waarde: config.woningtypes.find((w) => w.id === woningtypeId)?.label ?? ""},
            ]}
          />
          <ExportKnop />

          <ConversieLaag samenvatting={{wand_m2: String(geldigResultaat.wandM2), plafond_m2: String(geldigResultaat.plafondM2)}} toolId="stucwerk" />
        </>
      ) : null}

      {heeftInvoer && resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
