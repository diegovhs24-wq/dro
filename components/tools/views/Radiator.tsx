"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {NumberField, SelectField} from "../ToolFormFields";
import {ConversieLaag, ExportDocument, ExportKnop, FieldsetCard, ResultCard, ResultHeadline, TipBlock} from "../ToolShared";
import {berekenRadiator, isRekenFout, vulTemplate} from "../toolsEngine";

export default function Radiator() {
  const config = DRO_TOOLS_CONFIG.tools.radiator;
  const [m2, setM2] = useState<number | undefined>(undefined);
  const [ruimtetypeId, setRuimtetypeId] = useState("");
  const [bouwjaarId, setBouwjaarId] = useState("");

  const resultaat = useMemo(() => berekenRadiator({m2: m2 ?? 0, ruimtetypeId, bouwjaarId}), [m2, ruimtetypeId, bouwjaarId]);
  const geldigResultaat = (m2 ?? 0) > 0 && ruimtetypeId && bouwjaarId && resultaat && !isRekenFout(resultaat) ? resultaat : null;

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <NumberField id="radiator-m2" label="Oppervlak van de ruimte (m²)" onChange={setM2} value={m2} />
        <SelectField id="radiator-ruimtetype" label="Type ruimte" onChange={setRuimtetypeId} options={config.ruimtetypes.map((r) => ({id: r.id, label: r.label}))} placeholder="Kies een ruimtetype" value={ruimtetypeId} />
        <SelectField id="radiator-bouwjaar" label="Bouwjaar categorie" onChange={setBouwjaarId} options={config.bouwjaarfactoren.map((b) => ({id: b.id, label: b.label}))} placeholder="Kies een bouwjaar categorie" value={bouwjaarId} />
      </FieldsetCard>

      {geldigResultaat ? (
        <>
          <ResultCard>
            <ResultHeadline>{vulTemplate(config.teksten.resultaat_titel, {watt: geldigResultaat.watt})}</ResultHeadline>
            <p className="mt-3 text-sm leading-6 text-neutral-600">{config.teksten.verdeling_tekst}</p>
            {geldigResultaat.isBadkamer ? <p className="mt-3 text-sm font-bold text-brand-orange">{config.teksten.badkamer_tekst}</p> : null}
          </ResultCard>
          <TipBlock>{config.teksten.tip}</TipBlock>

          <ExportDocument
            printId="radiator-print"
            tip={config.teksten.tip}
            toolNaam="Radiator vermogen per ruimte"
            uitkomstTitel={vulTemplate(config.teksten.resultaat_titel, {watt: geldigResultaat.watt})}
            waardes={[
              {label: "Oppervlak", waarde: `${m2} m²`},
              {label: "Ruimtetype", waarde: geldigResultaat.ruimtetypeLabel},
              {label: "Bouwjaar categorie", waarde: config.bouwjaarfactoren.find((b) => b.id === bouwjaarId)?.label ?? ""},
            ]}
          />
          <ExportKnop />

          <ConversieLaag samenvatting={{ruimtetype: geldigResultaat.ruimtetypeLabel.toLowerCase(), m2: String(m2), watt: String(geldigResultaat.watt)}} toolId="radiator" />
        </>
      ) : null}

      {(m2 ?? 0) > 0 && ruimtetypeId && bouwjaarId && resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
