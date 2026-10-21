"use client";

import {useId, useState} from "react";

import {trackFunnel} from "@/lib/analytics";
import {RENOVATION_PRICE_PER_M2, renovationEstimate} from "@/lib/conversionRoutes";

// Rekenhulp voor een totaalrenovatie: woonoppervlakte erin, bandbreedte eruit,
// plus wat dat betekent voor het betaalschema. Alleen de bevestigde m²-prijs;
// geen kortingen, geen "vanaf"-prijzen.

const VAT = 0.21;
const MIN_M2 = 40;
const MAX_M2 = 300;

function euro(value: number): string {
  return `€ ${(Math.round(value / 500) * 500).toLocaleString("nl-NL")}`;
}

export default function RenovationEstimator({intakeHref = "#intake"}: {intakeHref?: string}) {
  const id = useId();
  const [m2, setM2] = useState(120);
  const [touched, setTouched] = useState(false);
  const {min, max} = renovationEstimate(m2);
  const startMin = min * 0.2;
  const startMax = max * 0.25;

  function onChange(value: number) {
    setM2(value);
    if (!touched) {
      setTouched(true);
      trackFunnel("cta_click", {cta: "estimator_used", route: "grote-renovatie"});
    }
  }

  return (
    <div className="grid overflow-hidden rounded-[10px] border border-lp-line bg-white md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="border-b border-lp-line p-6 md:border-b-0 md:border-r md:p-8">
        <label className="block text-[15px] font-semibold" htmlFor={`${id}-m2`}>
          Woonoppervlakte die gerenoveerd wordt
        </label>
        <p className="mt-1 text-[15px] text-lp-muted">Een schatting is genoeg. Op Funda staat dit als &lsquo;wonen&rsquo;.</p>
        <div className="mt-6 flex items-baseline gap-2">
          <output className="text-[56px] font-bold leading-none tabular-nums tracking-[-0.03em]" htmlFor={`${id}-m2`}>
            {m2}
          </output>
          <span className="text-[20px] font-semibold text-lp-muted">m²</span>
        </div>
        <input
          aria-valuetext={`${m2} vierkante meter`}
          className="route-range mt-5 w-full"
          id={`${id}-m2`}
          max={MAX_M2}
          min={MIN_M2}
          onChange={(e) => onChange(Number(e.target.value))}
          step={5}
          type="range"
          value={m2}
        />
        <div className="mt-1.5 flex justify-between text-[13px] tabular-nums text-lp-muted">
          <span>{MIN_M2} m²</span>
          <span>{MAX_M2} m²</span>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <p className="text-[15px] text-lp-muted">Indicatie totaalrenovatie, exclusief btw</p>
        <p aria-live="polite" className="mt-1 text-[32px] font-bold leading-tight tabular-nums tracking-[-0.02em] sm:text-[38px]">
          {euro(min)} tot {euro(max)}
        </p>
        <p className="mt-1 text-[15px] tabular-nums text-lp-muted">
          {euro(min * (1 + VAT))} tot {euro(max * (1 + VAT))} inclusief 21% btw
        </p>

        <ol className="mt-6 grid gap-0 border-t border-lp-line text-[15px]">
          <li className="flex items-baseline justify-between gap-4 border-b border-lp-line py-3">
            <span>Bij ondertekening</span>
            <span className="font-semibold tabular-nums">€ 0</span>
          </li>
          <li className="flex items-baseline justify-between gap-4 border-b border-lp-line py-3">
            <span>Eerste werkdag (20 tot 25%)</span>
            <span className="text-right font-semibold tabular-nums">
              {euro(startMin)} tot {euro(startMax)}
            </span>
          </li>
          <li className="flex items-baseline justify-between gap-4 border-b border-lp-line py-3">
            <span>Daarna per afgeronde fase</span>
            <span className="text-right text-lp-muted">volgens uw offerte</span>
          </li>
        </ol>

        <p className="mt-4 text-[13px] leading-relaxed text-lp-muted">
          Gerekend met € {RENOVATION_PRICE_PER_M2.min.toLocaleString("nl-NL")} tot € {RENOVATION_PRICE_PER_M2.max.toLocaleString("nl-NL")} per m²
          exclusief btw, afgerond op € 500. Uw offerte volgt na een bezichtiging.
        </p>
        <a className="route-btn mt-6" data-cta="estimator_to_intake" data-track="estimator" href={intakeHref}>
          Start de intake met {m2} m²
        </a>
      </div>
    </div>
  );
}
