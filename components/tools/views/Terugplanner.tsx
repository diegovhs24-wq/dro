"use client";

import {useMemo, useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {TextField, ToggleField} from "../ToolFormFields";
import {Disclaimer, FieldsetCard, ResultCard, ResultHeadline, ToolCTA} from "../ToolShared";
import {berekenTerugplanner, isRekenFout} from "../toolsEngine";

export default function Terugplanner() {
  const config = DRO_TOOLS_CONFIG.tools.terugplanner;
  const [startdatum, setStartdatum] = useState("");
  const [vergunningNodig, setVergunningNodig] = useState<boolean | null>(null);
  const [maatwerk, setMaatwerk] = useState(false);

  const resultaat = useMemo(() => {
    if (!startdatum || vergunningNodig === null) return null;
    return berekenTerugplanner({startdatum, vergunningNodig, maatwerk});
  }, [startdatum, vergunningNodig, maatwerk]);

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <TextField id="terugplanner-start" label="Gewenste startdatum uitvoering" onChange={setStartdatum} type="date" value={startdatum} />
        <ToggleField
          label="Is er een vergunning nodig? (bij twijfel: ja)"
          onChange={setVergunningNodig}
          value={vergunningNodig ?? false}
        />
        <ToggleField label="Maatwerk of materialen met lange levertijd?" onChange={setMaatwerk} value={maatwerk} />
      </FieldsetCard>

      {resultaat && !isRekenFout(resultaat) ? (
        <>
          <ResultCard>
            <ResultHeadline>Zo plan je terug</ResultHeadline>
            <ul className="mt-4 grid gap-3">
              {resultaat.stappen.map(({stap, datum, verstreken}) => (
                <li className="flex items-start justify-between gap-3 rounded-lg bg-white p-4" key={stap.id}>
                  <div>
                    <p className="font-bold text-brand-ink">{stap.label}</p>
                    <p className="text-sm text-neutral-600">
                      Uiterlijk {datum.toLocaleDateString("nl-NL", {day: "numeric", month: "long", year: "numeric"})}
                    </p>
                    {verstreken ? <p className="mt-1 text-sm font-bold text-red-600">{config.teksten.waarschuwing_verleden}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          </ResultCard>
          <Disclaimer>{config.teksten.disclaimer}</Disclaimer>
          <ToolCTA toolId="terugplanner" />
        </>
      ) : null}

      {resultaat && isRekenFout(resultaat) ? <p className="text-sm font-semibold text-red-600">{resultaat.fout}</p> : null}
    </div>
  );
}
