"use client";

import Link from "next/link";
import {useEffect, useRef, useState} from "react";

import {trackLead} from "@/lib/analytics";
import {captureAttribution, getAttribution, isPaidSearch} from "@/lib/attribution";
import {lookupPdokAddress, normalizeDutchPostcode, type PdokAddress} from "@/lib/pdok";

// Aanvraagformulier voor de landingspagina totaalrenovatie. Vijf korte stappen:
// eerst de makkelijke vragen, contactgegevens als laatste. Verstuurt naar
// /api/submit-request met bron "lp-totaalrenovatie" en de advertentieherkomst.

type Option = {label: string; value: string};
type BudgetOption = Option & {min?: number; max?: number};

const HOUSE_TYPES: Option[] = [
  {label: "Rijwoning", value: "Rijwoning"},
  {label: "Hoekwoning of twee-onder-een-kap", value: "Hoekwoning / 2-onder-1-kap"},
  {label: "Vrijstaande woning", value: "Vrijstaand"},
  {label: "Appartement", value: "Appartement"},
  {label: "Herenhuis, boven- of benedenwoning", value: "Herenhuis / boven- of benedenwoning"},
];

const SITUATIONS: Option[] = [
  {label: "Net gekocht of binnenkort de sleutel", value: "Net gekocht"},
  {label: "Ik woon er al en ben eigenaar", value: "Eigenaar-bewoner"},
  {label: "Ik ben nog op zoek naar een woning", value: "Nog op zoek"},
  {label: "Anders (bijvoorbeeld verhuur of belegging)", value: "Anders"},
];

const BUDGETS: BudgetOption[] = [
  {label: "Tot € 50.000", value: "tot-50k", max: 50000},
  {label: "€ 50.000 tot € 100.000", value: "50-100k", min: 50000, max: 100000},
  {label: "€ 100.000 tot € 150.000", value: "100-150k", min: 100000, max: 150000},
  {label: "Meer dan € 150.000", value: "150k-plus", min: 150000},
  {label: "Weet ik nog niet", value: "onbekend"},
];

const TIMELINES: Option[] = [
  {label: "Zo snel mogelijk", value: "Zo snel mogelijk"},
  {label: "Binnen 3 maanden", value: "Binnen 3 maanden"},
  {label: "Over 3 tot 6 maanden", value: "Over 3 tot 6 maanden"},
  {label: "Later of nog oriënterend", value: "Later / oriënterend"},
];

const TOTAL_STEPS = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const choiceClass =
  "flex min-h-[52px] w-full items-center justify-between rounded-md border border-lp-line bg-white px-4 py-3 text-left text-[15px] font-medium text-lp-ink transition-colors hover:border-lp-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-orange";
const choiceActive = "border-lp-ink bg-lp-plaster ring-1 ring-lp-ink";
const inputClass =
  "mt-1 block min-h-[48px] w-full rounded-md border border-lp-line bg-white px-3 py-2 text-[16px] text-lp-ink focus:border-lp-ink focus:outline-none focus:ring-2 focus:ring-lp-orange";
const primaryButton =
  "inline-flex min-h-[52px] w-full items-center justify-center rounded-md bg-lp-orange px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-lp-orange-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-lp-ink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
const backButton = "min-h-[44px] px-2 text-sm font-medium text-lp-muted underline underline-offset-2 hover:text-lp-ink";

type Props = {variant: string; phoneHref: string; phoneLabel: string};

export default function LandingForm({variant, phoneHref, phoneLabel}: Props) {
  const [step, setStep] = useState(1);
  const [houseType, setHouseType] = useState("");
  const [situation, setSituation] = useState("");
  const [postcode, setPostcode] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [address, setAddress] = useState<PdokAddress | null>(null);
  const [city, setCity] = useState("");
  const [lookupState, setLookupState] = useState<"idle" | "loading" | "found" | "notfound">("idle");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const sentRef = useRef(false);
  const formTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    captureAttribution(variant);
  }, [variant]);

  // Adres opzoeken zodra postcode en huisnummer geldig zijn.
  useEffect(() => {
    const normalized = normalizeDutchPostcode(postcode);
    if (!normalized || !/\d/.test(houseNumber)) {
      setAddress(null);
      setLookupState("idle");
      return;
    }
    let cancelled = false;
    setLookupState("loading");
    const timer = setTimeout(async () => {
      const results = await lookupPdokAddress(normalized, houseNumber);
      if (cancelled) return;
      if (results.length) {
        setAddress(results[0]);
        setCity(results[0].city);
        setLookupState("found");
      } else {
        setAddress(null);
        setLookupState("notfound");
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [postcode, houseNumber]);

  function go(next: number) {
    setErrors({});
    setStep(next);
    formTopRef.current?.scrollIntoView({behavior: "smooth", block: "nearest"});
  }

  function validateAddress(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!normalizeDutchPostcode(postcode)) nextErrors.postcode = "Vul een geldige postcode in, bijvoorbeeld 2511 AB.";
    if (!/\d/.test(houseNumber)) nextErrors.houseNumber = "Vul uw huisnummer in.";
    if (lookupState === "notfound" && !city.trim()) nextErrors.city = "Vul de plaats in.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateContact(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = "Vul uw naam in.";
    if (phone.replace(/\D/g, "").length < 9) nextErrors.phone = "Vul een geldig telefoonnummer in.";
    if (!EMAIL_RE.test(email.trim())) nextErrors.email = "Vul een geldig e-mailadres in.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submit() {
    if (status === "sending" || sentRef.current) return;
    if (!validateContact()) return;

    setStatus("sending");
    const budgetOption = BUDGETS.find((option) => option.value === budget);
    const attribution = getAttribution();

    try {
      const response = await fetch("/api/submit-request", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          company,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          services: ["Totaalrenovatie"],
          postcode: normalizeDutchPostcode(postcode) || postcode.trim(),
          houseNumber: houseNumber.trim(),
          address: address?.displayName || "",
          location: address?.city || city.trim(),
          timeline,
          ...(budgetOption?.min !== undefined ? {budgetMin: budgetOption.min} : {}),
          ...(budgetOption?.max !== undefined ? {budgetMax: budgetOption.max} : {}),
          budgetLabel: budgetOption ? `${budgetOption.label} (incl. btw)` : "",
          hoeGevonden: isPaidSearch(attribution) ? "Google Ads" : "Landingspagina",
          message: message.trim(),
          serviceAnswers: [
            {
              service: "Totaalrenovatie",
              answers: [
                {question: "Type woning", answer: houseType},
                {question: "Situatie", answer: situation},
              ],
            },
          ],
          source: "lp-totaalrenovatie",
          attribution,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      if (!sentRef.current) {
        sentRef.current = true;
        trackLead();
      }
      setStatus("done");
      formTopRef.current?.scrollIntoView({behavior: "smooth", block: "nearest"});
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    const firstName = name.trim().split(" ")[0];
    return (
      <div className="rounded-lg bg-white p-6 shadow-[0_24px_60px_rgba(16,22,28,0.28)] sm:p-7" ref={formTopRef}>
        <p className="text-[22px] font-bold [font-stretch:110%] leading-tight">Bedankt{firstName ? `, ${firstName}` : ""}. Uw aanvraag is binnen.</p>
        <p className="mt-3 text-[15px] leading-6 text-lp-muted">
          Scott Huisman neemt contact met u op om uw plannen te bespreken en een bezichtiging in te plannen. Liever zelf
          bellen? Dat kan op{" "}
          <a className="font-semibold text-lp-ink underline underline-offset-2" href={phoneHref}>
            {phoneLabel}
          </a>
          .
        </p>
        <p className="mt-3 text-sm leading-6 text-lp-muted">
          Tip: heeft u een plattegrond, Funda-link of foto&apos;s van de woning? Houd ze bij de hand voor het gesprek.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-5 shadow-[0_24px_60px_rgba(16,22,28,0.28)] sm:p-7" ref={formTopRef}>
      <div className="flex items-center justify-between text-xs font-medium text-lp-muted">
        <span>
          Stap {step} van {TOTAL_STEPS}
        </span>
        <span>Vrijblijvend, ongeveer 1 minuut</span>
      </div>
      <div aria-hidden="true" className="mt-2 h-1.5 w-full rounded-full bg-lp-plaster">
        <div className="h-1.5 rounded-full bg-lp-orange transition-all" style={{width: `${(step / TOTAL_STEPS) * 100}%`}} />
      </div>

      {/* Honeypot: onzichtbaar voor bezoekers. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label>
          Bedrijf
          <input autoComplete="off" onChange={(e) => setCompany(e.target.value)} tabIndex={-1} type="text" value={company} />
        </label>
      </div>

      {step === 1 && (
        <fieldset className="mt-5">
          <legend className="text-[19px] font-bold [font-stretch:108%] leading-tight">Om wat voor woning gaat het?</legend>
          <div className="mt-3 grid gap-2">
            {HOUSE_TYPES.map((option) => (
              <button
                className={`${choiceClass} ${houseType === option.value ? choiceActive : ""}`}
                key={option.value}
                onClick={() => {
                  setHouseType(option.value);
                  go(2);
                }}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="mt-5">
          <legend className="text-[19px] font-bold [font-stretch:108%] leading-tight">Wat is uw situatie?</legend>
          <div className="mt-3 grid gap-2">
            {SITUATIONS.map((option) => (
              <button
                className={`${choiceClass} ${situation === option.value ? choiceActive : ""}`}
                key={option.value}
                onClick={() => {
                  setSituation(option.value);
                  go(3);
                }}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
          <button className={`${backButton} mt-3`} onClick={() => go(1)} type="button">
            Terug
          </button>
        </fieldset>
      )}

      {step === 3 && (
        <div className="mt-5">
          <p className="text-[19px] font-bold [font-stretch:108%] leading-tight">Waar staat de woning?</p>
          <p className="mt-1 text-sm text-lp-muted">
            {situation === "Nog op zoek" ? "Nog geen woning? Vul uw huidige adres of de gewenste buurt in." : "Zo weten we of de woning in ons werkgebied ligt."}
          </p>
          <div className="mt-3 grid grid-cols-[1.4fr_1fr] gap-3">
            <label className="text-[13px] font-medium">
              Postcode
              <input
                autoComplete="postal-code"
                className={inputClass}
                inputMode="text"
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="2511 AB"
                value={postcode}
              />
              {errors.postcode && <span className="mt-1 block text-xs text-red-700">{errors.postcode}</span>}
            </label>
            <label className="text-[13px] font-medium">
              Huisnummer
              <input
                className={inputClass}
                inputMode="numeric"
                onChange={(e) => setHouseNumber(e.target.value)}
                placeholder="12"
                value={houseNumber}
              />
              {errors.houseNumber && <span className="mt-1 block text-xs text-red-700">{errors.houseNumber}</span>}
            </label>
          </div>
          <p aria-live="polite" className="mt-2 min-h-[20px] text-sm text-lp-muted">
            {lookupState === "loading" && "Adres opzoeken..."}
            {lookupState === "found" && address && `${address.street} ${address.houseNumber}, ${address.city}`}
          </p>
          {lookupState === "notfound" && (
            <label className="mt-1 block text-[13px] font-medium">
              Plaats
              <input autoComplete="address-level2" className={inputClass} onChange={(e) => setCity(e.target.value)} value={city} />
              {errors.city && <span className="mt-1 block text-xs text-red-700">{errors.city}</span>}
            </label>
          )}
          <button className={`${primaryButton} mt-4`} onClick={() => validateAddress() && go(4)} type="button">
            Volgende
          </button>
          <button className={`${backButton} mt-2`} onClick={() => go(2)} type="button">
            Terug
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="mt-5">
          <fieldset>
            <legend className="text-[19px] font-bold [font-stretch:108%] leading-tight">Welk budget heeft u ongeveer in gedachten?</legend>
            <p className="mt-1 text-sm text-lp-muted">Inclusief btw. Een grove inschatting is genoeg.</p>
            <div className="mt-3 grid gap-2">
              {BUDGETS.map((option) => (
                <button
                  aria-pressed={budget === option.value}
                  className={`${choiceClass} ${budget === option.value ? choiceActive : ""}`}
                  key={option.value}
                  onClick={() => setBudget(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="mt-5">
            <legend className="text-[19px] font-bold [font-stretch:108%] leading-tight">Wanneer wilt u starten?</legend>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {TIMELINES.map((option) => (
                <button
                  aria-pressed={timeline === option.value}
                  className={`${choiceClass} justify-center text-center text-sm ${timeline === option.value ? choiceActive : ""}`}
                  key={option.value}
                  onClick={() => setTimeline(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
          {errors.step4 && <p className="mt-2 text-xs text-red-700">{errors.step4}</p>}
          <button
            className={`${primaryButton} mt-4`}
            onClick={() => {
              if (!budget || !timeline) {
                setErrors({step4: "Kies een budget en een startmoment."});
                return;
              }
              go(5);
            }}
            type="button"
          >
            Volgende
          </button>
          <button className={`${backButton} mt-2`} onClick={() => go(3)} type="button">
            Terug
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="mt-5">
          <p className="text-[19px] font-bold [font-stretch:108%] leading-tight">Waar kunnen we u bereiken?</p>
          <div className="mt-3 grid gap-3">
            <label className="text-[13px] font-medium">
              Naam
              <input autoComplete="name" className={inputClass} onChange={(e) => setName(e.target.value)} value={name} />
              {errors.name && <span className="mt-1 block text-xs text-red-700">{errors.name}</span>}
            </label>
            <label className="text-[13px] font-medium">
              Telefoonnummer
              <input
                autoComplete="tel"
                className={inputClass}
                inputMode="tel"
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                value={phone}
              />
              <span className="mt-1 block text-xs font-normal text-lp-muted">
                Alleen om uw aanvraag te bespreken en een bezichtiging te plannen.
              </span>
              {errors.phone && <span className="mt-1 block text-xs text-red-700">{errors.phone}</span>}
            </label>
            <label className="text-[13px] font-medium">
              E-mailadres
              <input
                autoComplete="email"
                className={inputClass}
                inputMode="email"
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                value={email}
              />
              {errors.email && <span className="mt-1 block text-xs text-red-700">{errors.email}</span>}
            </label>
            <label className="text-[13px] font-medium">
              Iets wat we moeten weten? <span className="font-normal text-lp-muted">(optioneel)</span>
              <textarea className={`${inputClass} min-h-[88px]`} onChange={(e) => setMessage(e.target.value)} rows={3} value={message} />
            </label>
          </div>
          {status === "error" && (
            <p className="mt-3 text-sm text-red-700">
              Versturen lukte niet. Probeer het nog eens of bel ons op{" "}
              <a className="font-semibold underline" href={phoneHref}>
                {phoneLabel}
              </a>
              .
            </p>
          )}
          <button className={`${primaryButton} mt-4`} disabled={status === "sending"} onClick={submit} type="button">
            {status === "sending" ? "Bezig met versturen..." : "Vraag vrijblijvend een bezichtiging aan"}
          </button>
          <p className="mt-3 text-xs leading-5 text-lp-muted">
            Wij gebruiken uw gegevens alleen voor deze aanvraag. Lees onze{" "}
            <Link className="underline underline-offset-2" href="/privacypolicy">
              privacyverklaring
            </Link>
            .
          </p>
          <button className={`${backButton} mt-1`} onClick={() => go(4)} type="button">
            Terug
          </button>
        </div>
      )}
    </div>
  );
}
