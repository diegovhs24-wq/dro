"use client";

import {useId, useState} from "react";

import {trackFunnel} from "@/lib/analytics";
import {ESTIMATOR_M2, RENOVATION_PRICE_PER_M2, renovationBand} from "@/lib/conversionRoutes";

// Rekenhulp totaalrenovatie, bewust terughoudend:
// - alleen de bevestigde € 1.000 tot € 1.250 per m² excl. btw, getoond inclusief
//   btw (consumentenprijzen zijn volgens de algemene voorwaarden incl. btw);
// - afgerond op € 5.000 (ondergrens omlaag, bovengrens omhoog), zie renovationBand;
// - de factoren die de echte prijs bepalen staan ernaast, zonder verzonnen percentages;
// - het betaalschema in percentages, niet in bedragen;
// - nergens "offerte": die volgt pas na een bezichtiging.

const MIN_M2 = ESTIMATOR_M2.min;
const MAX_M2 = ESTIMATOR_M2.max;

export const PRICE_FACTORS = [
  {up: true, text: "Staat van de woning: verouderde leidingen, houtrot of scheefstand"},
  {up: true, text: "Installaties: nieuwe meterkast, elektra, ventilatie of verwarming"},
  {up: true, text: "Constructieve wijzigingen, zoals een draagmuur eruit"},
  {up: true, text: "Aantal badkamers en toiletten, en het niveau van de keuken"},
  {up: true, text: "Afwerkingsniveau van vloeren, wanden en details"},
  {up: false, text: "Delen die al recent zijn vernieuwd en kunnen blijven"},
] as const;

function euro(value: number): string {
  return `€ ${value.toLocaleString("nl-NL")}`;
}

export default function RenovationEstimator({intakeHref = "#intake", route = "grote-renovatie"}: {intakeHref?: string; route?: string}) {
  const id = useId();
  const [m2, setM2] = useState<number>(ESTIMATOR_M2.initial);
  const [touched, setTouched] = useState(false);
  const band = renovationBand(m2);

  function onChange(value: number) {
    setM2(value);
    if (!touched) {
      setTouched(true);
      trackFunnel("cta_click", {cta: "estimator_used", route});
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
      <div className="rounded-card border border-[var(--pr-line)] bg-white">
        <div className="p-6 md:p-8">
          <label className="block text-[16px] font-semibold" htmlFor={`${id}-m2`}>
            Woonoppervlakte die u wilt laten renoveren
          </label>
          <p className="mt-1 text-[15px] pr-muted">Een schatting is genoeg. Op Funda staat dit als &lsquo;wonen&rsquo;.</p>
          <div className="mt-6 flex items-baseline gap-2">
            <output className="pr-num text-[56px] font-bold leading-none tracking-[-0.03em]" htmlFor={`${id}-m2`}>
              {m2}
            </output>
            <span className="text-[20px] font-semibold pr-muted">m²</span>
          </div>
          <input
            aria-valuetext={`${m2} vierkante meter`}
            className="pr-range mt-5"
            id={`${id}-m2`}
            max={MAX_M2}
            min={MIN_M2}
            onChange={(e) => onChange(Number(e.target.value))}
            step={ESTIMATOR_M2.step}
            type="range"
            value={m2}
          />
          <div className="mt-1 flex justify-between text-[13px] pr-num pr-muted">
            <span>{MIN_M2} m²</span>
            <span>{MAX_M2} m²</span>
          </div>
        </div>

        <div className="border-t border-[var(--pr-line)] p-6 md:p-8">
          <p className="pr-measure">indicatieve bandbreedte, inclusief 21% btw</p>
          <p aria-live="polite" className="mt-4 pr-num text-[30px] font-bold leading-tight tracking-[-0.02em] sm:text-[38px]">
            <span className="whitespace-nowrap">{euro(band.incl.min)}</span> tot <span className="whitespace-nowrap">{euro(band.incl.max)}</span>
          </p>
          <p className="mt-1 text-[15px] pr-num pr-muted">
            Exclusief btw: {euro(band.excl.min)} tot {euro(band.excl.max)}
          </p>
          <p className="mt-5 rounded-card bg-[var(--pr-kalk)] px-4 py-3 text-[15px] leading-[1.55]">
            <strong className="font-semibold">Dit is een indicatie, geen offerte.</strong> Gerekend met € {RENOVATION_PRICE_PER_M2.min.toLocaleString("nl-NL")} tot €{" "}
            {RENOVATION_PRICE_PER_M2.max.toLocaleString("nl-NL")} per m² exclusief btw, afgerond op € 5.000. Of tegels, sanitair en keuken in de prijs zitten, staat in uw offerte: volgens de algemene voorwaarden kiest en levert u die zelf, tenzij we afspreken dat wij ze leveren. Uw prijs volgt pas na een bezichtiging.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a className="pr-btn" data-cta="estimator_to_intake" data-track="estimator" href={intakeHref}>
              Bespreek uw woning
            </a>
            <span className="text-[15px] pr-muted">Betaling: per fase, volgens het schema dat vooraf in uw offerte staat.</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="pr-h3">Wat uw prijs hoger of lager maakt</h3>
        <ul className="mt-4 border-b border-[var(--pr-line)]">
          {PRICE_FACTORS.map((factor) => (
            <li className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2 border-t border-[var(--pr-line)] py-3 text-[16px] leading-[1.5]" key={factor.text}>
              <span aria-hidden="true" className={`pr-num font-semibold ${factor.up ? "text-[var(--pr-signal-dark)]" : "text-[#3d6b4f]"}`}>
                {factor.up ? "↑" : "↓"}
              </span>
              <span>
                <span className="sr-only">{factor.up ? "Maakt duurder: " : "Maakt voordeliger: "}</span>
                {factor.text}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[15px] pr-muted">
          Een uitbouw of dakopbouw zit niet in deze rekenhulp: fundering en constructie verschillen per woning, dus die prijzen we na een opname.
        </p>
      </div>
    </div>
  );
}
