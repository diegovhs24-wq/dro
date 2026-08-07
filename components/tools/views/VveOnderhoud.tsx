"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {NumberField, SelectField} from "../ToolFormFields";
import {ConversieLaag, Disclaimer, ExportDocument, ExportKnop, FieldsetCard, ResultCard, ResultHeadline} from "../ToolShared";
import {checkVveOnderhoud, isRekenFout} from "../toolsEngine";

const STATUS_LABEL = {
  op_schema: "Op schema",
  aandacht: "Aandacht nodig",
  achterstallig: "Achterstallig",
};

const STATUS_KLEUR: Record<string, string> = {
  op_schema: "text-emerald-700",
  aandacht: "text-amber-700",
  achterstallig: "text-red-700",
};

export default function VveOnderhoud() {
  const config = DRO_TOOLS_CONFIG.tools["vve-onderhoud"];
  const [bouwjaar, setBouwjaar] = useState<number | undefined>(undefined);
  const [laatsteSchilderwerk, setLaatsteSchilderwerk] = useState<number | undefined>(undefined);
  const [laatsteDakonderhoud, setLaatsteDakonderhoud] = useState<number | undefined>(undefined);
  const [dakType, setDakType] = useState<"plat" | "hellend">("plat");
  const [kozijnen, setKozijnen] = useState<"hout" | "kunststof" | "aluminium">("hout");

  const resultaat = useMemo(() => {
    if (!bouwjaar) return null;
    return checkVveOnderhoud({bouwjaar, laatsteSchilderwerk, laatsteDakonderhoud, dakType, kozijnen});
  }, [bouwjaar, laatsteSchilderwerk, laatsteDakonderhoud, dakType, kozijnen]);

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <NumberField id="vve-bouwjaar" label="Bouwjaar pand" onChange={setBouwjaar} placeholder="bijv. 1975" step={1} value={bouwjaar} />
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField id="vve-schilderwerk" label="Laatste keer geschilderd (jaartal)" onChange={setLaatsteSchilderwerk} step={1} value={laatsteSchilderwerk} />
          <NumberField id="vve-dak" label="Laatste dakonderhoud (jaartal)" onChange={setLaatsteDakonderhoud} step={1} value={laatsteDakonderhoud} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField id="vve-daktype" label="Type dak" onChange={(v) => setDakType(v as "plat" | "hellend")} options={[{id: "plat", label: "Plat dak"}, {id: "hellend", label: "Hellend dak"}]} value={dakType} />
          <SelectField id="vve-kozijnen" label="Kozijnen" onChange={(v) => setKozijnen(v as "hout" | "kunststof" | "aluminium")} options={[{id: "hout", label: "Hout"}, {id: "kunststof", label: "Kunststof"}, {id: "aluminium", label: "Aluminium"}]} value={kozijnen} />
        </div>
      </FieldsetCard>

      {resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>Onderhoudsoverzicht</ResultHeadline>
            <ul className="mt-4 grid gap-2">
              {resultaat.items.map((item) => (
                <li className="rounded-lg bg-white p-3 text-sm" key={item.item}>
                  <p className="font-bold text-brand-ink">
                    {item.item}: <span className={STATUS_KLEUR[item.status]}>{STATUS_LABEL[item.status]}</span>
                  </p>
                  <p className="text-neutral-600">{item.cyclusTekst}</p>
                </li>
              ))}
            </ul>
          </ResultCard>
          <Disclaimer>{config.teksten.mjop_tekst}</Disclaimer>

          <ExportDocument
            disclaimer={config.teksten.mjop_tekst}
            printId="vve-onderhoud-print"
            toolNaam="VvE onderhoudscheck"
            uitkomstRegels={resultaat.items.map((item) => `${item.item}: ${STATUS_LABEL[item.status]} (${item.cyclusTekst})`)}
            uitkomstTitel="Onderhoudsoverzicht"
          />
          <ExportKnop />

          <ConversieLaag samenvatting={{}} toolId="vve-onderhoud" />
        </>
      ) : null}

      {resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
