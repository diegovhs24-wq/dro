"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {NumberField, SelectField} from "../ToolFormFields";
import {Disclaimer, FieldsetCard, ResultCard, ResultHeadline, ToolCTA} from "../ToolShared";
import {berekenVerwarming, formatNL, isRekenFout, vulTemplate} from "../toolsEngine";

export default function Verwarming() {
  const config = DRO_TOOLS_CONFIG.tools.verwarming;
  const [m2, setM2] = useState<number | undefined>(undefined);
  const [bouwjaarId, setBouwjaarId] = useState("");
  const [hoogte, setHoogte] = useState<number | undefined>(undefined);

  const resultaat = useMemo(() => berekenVerwarming({m2: m2 ?? 0, bouwjaarId, hoogte}), [m2, bouwjaarId, hoogte]);

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <NumberField id="verwarming-m2" label="Woonoppervlak (m²)" onChange={setM2} value={m2} />
        <SelectField id="verwarming-bouwjaar" label="Bouwjaar categorie" onChange={setBouwjaarId} options={config.bouwjaren.map((b) => ({id: b.id, label: b.label}))} placeholder="Kies een bouwjaar" value={bouwjaarId} />
        <NumberField id="verwarming-hoogte" label={`Plafondhoogte (m, standaard ${formatNL(config.standaard_hoogte, 1)})`} onChange={setHoogte} value={hoogte} />
      </FieldsetCard>

      {(m2 ?? 0) > 0 && bouwjaarId && resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>{vulTemplate(config.teksten.resultaat_titel, {kw: formatNL(resultaat.kw, 1)})}</ResultHeadline>
            <p className="mt-3 text-sm font-bold text-brand-ink">{resultaat.advies}</p>
          </ResultCard>
          <Disclaimer>{config.teksten.disclaimer}</Disclaimer>
          <ToolCTA toolId="verwarming" />
        </>
      ) : null}

      {(m2 ?? 0) > 0 && bouwjaarId && resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
