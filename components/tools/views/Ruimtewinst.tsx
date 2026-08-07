"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {NumberField, SelectField} from "../ToolFormFields";
import {Disclaimer, FieldsetCard, ResultCard, ResultHeadline, ToolCTA} from "../ToolShared";
import {berekenRuimtewinst, formatNL, isRekenFout} from "../toolsEngine";

export default function Ruimtewinst() {
  const config = DRO_TOOLS_CONFIG.tools.ruimtewinst;
  const [typeId, setTypeId] = useState("");
  const [breedte, setBreedte] = useState<number | undefined>(undefined);
  const [diepte, setDiepte] = useState<number | undefined>(undefined);
  const [m2, setM2] = useState<number | undefined>(undefined);
  const [zolderM2, setZolderM2] = useState<number | undefined>(undefined);

  const resultaat = useMemo(() => {
    if (!typeId) return null;
    return berekenRuimtewinst({typeId, breedte, diepte, m2, zolderM2});
  }, [typeId, breedte, diepte, m2, zolderM2]);

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <SelectField id="ruimtewinst-type" label="Type" onChange={setTypeId} options={config.types.map((t) => ({id: t.id, label: t.label}))} placeholder="Kies een type" value={typeId} />

        {typeId === "uitbouw" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField id="ruimtewinst-breedte" label="Breedte (m)" onChange={setBreedte} value={breedte} />
            <NumberField id="ruimtewinst-diepte" label="Diepte (m)" onChange={setDiepte} value={diepte} />
          </div>
        ) : null}

        {typeId === "dakopbouw" ? <NumberField id="ruimtewinst-m2" label="M² dakvlak" onChange={setM2} value={m2} /> : null}

        {typeId === "dakkapel" ? <NumberField id="ruimtewinst-breedte-dakkapel" label="Breedte dakkapel (m)" onChange={setBreedte} value={breedte} /> : null}

        {typeId === "zolder" ? <NumberField id="ruimtewinst-zolder" label="Huidig zolderoppervlak (m²)" onChange={setZolderM2} value={zolderM2} /> : null}
      </FieldsetCard>

      {resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>
              Circa {formatNL(resultaat.m2, 1)} m² ({formatNL(resultaat.m3, 1)} m³) extra ruimte
            </ResultHeadline>
            <p className="mt-3 text-sm font-semibold text-neutral-700">Mogelijk geschikt voor: {resultaat.nieuweRuimteSuggestie}</p>
            <p className="mt-3 text-sm font-bold text-brand-ink">
              Indicatief waarde-effect: {formatNL(resultaat.waardeMinPct, 0)}% tot {formatNL(resultaat.waardeMaxPct, 0)}%
            </p>
          </ResultCard>
          <Disclaimer>{config.teksten.waarde_disclaimer}</Disclaimer>
          <ToolCTA toolId="ruimtewinst" />
        </>
      ) : null}

      {resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
