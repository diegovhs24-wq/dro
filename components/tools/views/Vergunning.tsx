"use client";

import {useState} from "react";

import {DRO_TOOLS_CONFIG} from "../toolsConfig";
import {ButtonGroup} from "../ToolFormFields";
import {ConversieLaag, Disclaimer, ExportDocument, ExportKnop, FieldsetCard, ResultCard, ResultHeadline, StoplichtBadge, TussentijdseCta} from "../ToolShared";
import {bepaalVergunningUitkomst, isVveVanToepassing, volgendeVergunningVraag} from "../toolsEngine";

export default function Vergunning() {
  const config = DRO_TOOLS_CONFIG.tools.vergunning;
  const [antwoorden, setAntwoorden] = useState<Record<string, string>>({});
  const [geschiedenis, setGeschiedenis] = useState<string[]>([]);

  const huidigeVraag = volgendeVergunningVraag(antwoorden);

  function beantwoord(vraagId: string, antwoordId: string) {
    setAntwoorden((prev) => ({...prev, [vraagId]: antwoordId}));
    setGeschiedenis((prev) => [...prev, vraagId]);
  }

  function terug() {
    setGeschiedenis((prev) => {
      const laatste = prev[prev.length - 1];
      if (!laatste) return prev;
      setAntwoorden((huidige) => {
        const kopie = {...huidige};
        delete kopie[laatste];
        return kopie;
      });
      return prev.slice(0, -1);
    });
  }

  function opnieuw() {
    setAntwoorden({});
    setGeschiedenis([]);
  }

  const uitkomst = !huidigeVraag ? bepaalVergunningUitkomst(antwoorden) : null;
  const vveVanToepassing = !huidigeVraag ? isVveVanToepassing(antwoorden) : false;

  return (
    <div className="grid gap-6">
      <FieldsetCard>
        <div className="flex items-center justify-between">
          <div aria-hidden="true" className="flex gap-1.5">
            {geschiedenis.map((id) => (
              <span className="h-1.5 w-6 rounded-full bg-brand-orange" key={id} />
            ))}
            {huidigeVraag ? <span className="h-1.5 w-6 rounded-full bg-black/10" /> : null}
          </div>
          {geschiedenis.length > 0 ? (
            <button className="text-sm font-bold text-brand-orange hover:text-brand-ink" onClick={terug} type="button">
              &larr; Terug
            </button>
          ) : null}
        </div>

        {huidigeVraag && geschiedenis.length >= 2 ? <TussentijdseCta /> : null}

        {huidigeVraag ? (
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-400">Vraag {geschiedenis.length + 1}</p>
            <h3 className="mt-2 text-xl font-extrabold text-brand-ink">{huidigeVraag.vraag}</h3>
            <div className="mt-5">
              <ButtonGroup
                legend={huidigeVraag.vraag}
                onChange={(antwoordId) => beantwoord(huidigeVraag.id, antwoordId)}
                options={huidigeVraag.antwoorden}
                value={antwoorden[huidigeVraag.id] || ""}
              />
            </div>
          </div>
        ) : (
          <button className="text-sm font-bold text-brand-orange hover:text-brand-ink" onClick={opnieuw} type="button">
            Opnieuw beginnen
          </button>
        )}
      </FieldsetCard>

      {uitkomst ? (
        <>
          <ResultCard>
            <StoplichtBadge kleur={uitkomst.kleur} />
            <ResultHeadline>
              <span className="mt-3 block">{uitkomst.titel}</span>
            </ResultHeadline>
            <p className="mt-3 text-sm leading-6 text-neutral-700">{uitkomst.tekst}</p>
            <p className="mt-4 text-sm font-bold text-brand-ink">{uitkomst.doorlooptijd}</p>
            {vveVanToepassing ? (
              <div className="mt-5 rounded-lg border border-brand-orange/30 bg-white p-4 text-sm font-semibold leading-6 text-neutral-700">
                {config.vve_extra_tekst}
              </div>
            ) : null}
          </ResultCard>

          <Disclaimer>
            {config.disclaimer}{" "}
            <a className="font-bold text-brand-orange hover:text-brand-ink" href={config.omgevingsloket_url} rel="noopener noreferrer" target="_blank">
              omgevingswet.overheid.nl
            </a>
          </Disclaimer>

          <ExportDocument
            disclaimer={config.disclaimer}
            printId="vergunning-print"
            toolNaam="Vergunningcheck"
            uitkomstRegels={[uitkomst.doorlooptijd]}
            uitkomstTitel={uitkomst.titel}
            waardes={[{label: "Werkzaamheden", waarde: config.vragen[0].antwoorden.find((a) => a.id === antwoorden[config.vragen[0].id])?.label ?? ""}]}
          />
          <ExportKnop />

          <ConversieLaag
            samenvatting={{
              uitkomst_titel: uitkomst.titel,
              projecttype:
                config.vragen[0].antwoorden.find((a) => a.id === antwoorden[config.vragen[0].id])?.label.toLowerCase() || "project",
            }}
            toolId="vergunning"
          />
        </>
      ) : null}
    </div>
  );
}
