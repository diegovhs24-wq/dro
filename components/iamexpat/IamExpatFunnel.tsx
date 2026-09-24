"use client";

import {useState} from "react";
import TrustBadges from "@/components/iamexpat/TrustBadges";
import {lookupPdokAddress, normalizeDutchPostcode, type PdokAddress} from "@/components/iamexpat/pdok";

const WHATSAPP_NUMBER = "31850871814";

// Reserve this spot for a real, English-language review from an
// international client once one is available (e.g. from Google Reviews).
// Never invent a quote. To add one, fill in the object below with the
// exact wording and the reviewer's name, e.g.:
// const FEATURED_REVIEW: {quote: string; name: string} | null = {
//   quote: "As an American who'd just moved here, I was nervous about hiring a contractor. DRO made it easy.",
//   name: "Alex, relocated from the US",
// };
const FEATURED_REVIEW: {quote: string; name: string} | null = null;

const SERVICE_OPTIONS = [
  "Bathroom renovation",
  "Kitchen",
  "Extension or dormer",
  "Total renovation",
  "Painting and plastering",
  "Something else",
];

const PROPERTY_TYPES = ["Apartment", "House", "Newly bought home", "Rental or investment property", "Other"];

const TIMELINES = ["As soon as possible", "Within 3 months", "In 3 to 6 months", "Just exploring for now"];

const BUDGETS = ["Under EUR 15,000", "EUR 15,000 to 30,000", "EUR 30,000 to 75,000", "EUR 75,000+", "Not sure yet"];

const QUESTION_STEPS = ["services", "propertyType", "location", "timeline", "budget", "message", "details"] as const;

type FunnelState = {
  services: string[];
  propertyType: string;
  postcode: string;
  houseNumber: string;
  address: string;
  location: string;
  timeline: string;
  budget: string;
  message: string;
  name: string;
  email: string;
  phone: string;
};

const initialState: FunnelState = {
  services: [],
  propertyType: "",
  postcode: "",
  houseNumber: "",
  address: "",
  location: "",
  timeline: "",
  budget: "",
  message: "",
  name: "",
  email: "",
  phone: "",
};

function whatsappHref(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function ProgressBar({step}: {step: number}) {
  const total = QUESTION_STEPS.length;
  const current = Math.min(step, total);
  const percent = Math.round((current / total) * 100);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-brand-ink/60">
        <span>
          Step {current} of {total}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-black/10">
        <div className="h-full rounded-full bg-brand-orange transition-all duration-500" style={{width: `${percent}%`}} />
      </div>
    </div>
  );
}

function BackButton({onClick}: {onClick: () => void}) {
  return (
    <button
      className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink/60 transition hover:text-brand-ink"
      onClick={onClick}
      type="button"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back
    </button>
  );
}

function OptionCard({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`flex min-h-[64px] w-full items-center justify-between gap-3 rounded-xl border-2 px-5 py-4 text-left text-base font-semibold transition-all duration-200 ${
        active
          ? "border-brand-orange bg-brand-orange/5 text-brand-ink shadow-lg shadow-orange-500/10"
          : "border-black/10 bg-white text-brand-ink hover:border-brand-orange/50 hover:-translate-y-0.5"
      }`}
      onClick={onClick}
      type="button"
    >
      <span>{children}</span>
      <span
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${
          active ? "border-brand-orange bg-brand-orange" : "border-black/15"
        }`}
      >
        {active ? (
          <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </span>
    </button>
  );
}

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-base font-medium text-brand-ink outline-none transition placeholder:text-neutral-400 focus:border-brand-orange focus:ring-4 focus:ring-orange-100";

function ReassuranceLine({icon, children}: {icon: React.ReactNode; children: React.ReactNode}) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg bg-brand-ink/[0.03] px-4 py-3 text-sm font-medium leading-5 text-brand-ink/80">
      <span className="mt-0.5 shrink-0 text-brand-orange">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path
        d="M12 3l7 3v5c0 4.5-2.9 8.4-7 10-4.1-1.6-7-5.5-7-10V6l7-3z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function IamExpatFunnel() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<FunnelState>(initialState);
  const [company, setCompany] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  // Location step's own working state, separate from the committed form
  // fields so a visitor can search, reconsider and switch to manual entry
  // without losing what they already typed.
  const [postcodeInput, setPostcodeInput] = useState("");
  const [houseNumberInput, setHouseNumberInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [pdokResults, setPdokResults] = useState<PdokAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<PdokAddress | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualStreet, setManualStreet] = useState("");
  const [manualCity, setManualCity] = useState("");

  function update<K extends keyof FunnelState>(key: K, value: FunnelState[K]) {
    setState((prev) => ({...prev, [key]: value}));
  }

  function goNext() {
    setStep((current) => Math.min(current + 1, QUESTION_STEPS.length + 1));
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0));
  }

  function autoAdvance() {
    window.setTimeout(goNext, 380);
  }

  function toggleService(option: string) {
    setState((prev) => ({
      ...prev,
      services: prev.services.includes(option)
        ? prev.services.filter((item) => item !== option)
        : [...prev.services, option],
    }));
  }

  async function handleAddressSearch() {
    setSearching(true);
    setSearched(false);
    setSelectedAddress(null);
    setManualMode(false);

    const results = await lookupPdokAddress(postcodeInput, houseNumberInput);

    setPdokResults(results);
    setSearching(false);
    setSearched(true);

    if (results.length === 0) {
      setManualMode(true);
    } else if (results.length === 1) {
      setSelectedAddress(results[0]);
    }
  }

  function confirmAddress() {
    if (selectedAddress) {
      update("postcode", selectedAddress.postcode);
      update("houseNumber", selectedAddress.houseNumber);
      update("address", selectedAddress.displayName);
      update("location", selectedAddress.city);
    } else if (manualMode) {
      update("postcode", postcodeInput.trim());
      update("houseNumber", houseNumberInput.trim());
      update("address", `${manualStreet.trim()}, ${manualCity.trim()}`);
      update("location", manualCity.trim());
    }
    goNext();
  }

  const locationReady = Boolean(selectedAddress) || (manualMode && manualStreet.trim() && manualCity.trim());

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(false);

    try {
      const res = await fetch("/api/submit-iamexpat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({...state, company}),
      });

      if (!res.ok) throw new Error("Submit failed");

      setSubmitting(false);
      goNext();
    } catch {
      setSubmitting(false);
      setSubmitError(true);
    }
  }

  // ── Step 0: welcome ──────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="animate-fade-in">
        <div className="mb-6 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-premium">
          {/*
            Photo of Therab and Jarek, the two faces of DRO Renovaties.
            Add the file at public/iamexpat/team.jpg (landscape, roughly
            4:3 or 16:10, at least 1200px wide) and swap this placeholder
            block for:
            <Image alt="Therab and Jarek from DRO Renovaties" className="h-full w-full object-cover" height={750} priority src="/iamexpat/team.jpg" width={1200} />
          */}
          <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-soft-deep to-brand-line text-center">
            <svg className="h-10 w-10 text-brand-ink/30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path
                d="M3 16.5l5-5 3.5 3.5L17 9l4 4M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="px-6 text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink/40">
              Photo of Therab and Jarek
            </p>
          </div>
        </div>

        <p className="eyebrow">IamExpat</p>
        <h1 className="mt-3 text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-brand-ink sm:text-[34px]">
          Thanks for visiting us at IamExpat.
        </h1>
        <p className="mt-4 text-[15.5px] leading-7 text-neutral-700">
          We&apos;re Therab and Jarek, the team behind DRO Renovaties, a family-run renovation company based in The
          Hague. It was great to meet you. Whether you&apos;ve just bought a home or you&apos;re planning a
          renovation, we&apos;re happy to think along with you, in plain English, from first idea to finished
          result. Tell us a bit about your plans and we&apos;ll get back to you within one working day.
        </p>

        {FEATURED_REVIEW ? (
          <div className="mt-6 rounded-xl border border-brand-orange/20 bg-brand-orange/5 p-5">
            <div className="flex gap-1 text-brand-orange" aria-hidden="true">
              {Array.from({length: 5}).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <p className="mt-2 text-[15px] font-medium italic leading-6 text-brand-ink">
              &ldquo;{FEATURED_REVIEW.quote}&rdquo;
            </p>
            <p className="mt-2 text-sm font-semibold text-brand-ink/70">{FEATURED_REVIEW.name}</p>
          </div>
        ) : null}

        <div className="mt-6 grid gap-2 text-sm font-semibold text-brand-ink/80">
          {[
            "Family business, based in The Hague",
            "English-speaking, from first call to final invoice",
            "Fixed price, no upfront payment",
            "We handle all the Dutch permits and paperwork",
            "Rated 4.8 out of 5 from 273 reviews",
          ].map((line) => (
            <div className="flex items-center gap-2.5" key={line}>
              <svg className="h-4 w-4 shrink-0 text-brand-orange" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {line}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <TrustBadges compact />
        </div>

        <button className="btn-primary mt-7 w-full text-base" onClick={goNext} type="button">
          Start my request
        </button>
        <p className="mt-3 text-center text-xs font-semibold text-brand-ink/50">
          Takes less than 60 seconds. No obligation, no upfront payment.
        </p>
      </div>
    );
  }

  // ── Step 1: services ─────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="animate-float-in" key="step-1">
        <BackButton onClick={goBack} />
        <ProgressBar step={1} />
        <h2 className="text-2xl font-bold tracking-tight text-brand-ink">What can we help you with?</h2>
        <p className="mt-2 text-sm font-medium text-neutral-600">Choose everything that applies.</p>

        <div className="mt-6 grid gap-3">
          {SERVICE_OPTIONS.map((option) => (
            <OptionCard active={state.services.includes(option)} key={option} onClick={() => toggleService(option)}>
              {option}
            </OptionCard>
          ))}
        </div>

        <div className="mt-6">
          <ReassuranceLine icon={<ShieldIcon />}>
            Whatever your project needs, we cover it in-house or through our trusted network of bathroom and
            sanitary suppliers, structural engineers and architects.
          </ReassuranceLine>
        </div>

        <button
          className="btn-primary mt-6 w-full text-base disabled:pointer-events-none disabled:opacity-40"
          disabled={state.services.length === 0}
          onClick={goNext}
          type="button"
        >
          Continue
        </button>
      </div>
    );
  }

  // ── Step 2: property type ────────────────────────────────────────
  if (step === 2) {
    return (
      <div className="animate-float-in" key="step-2">
        <BackButton onClick={goBack} />
        <ProgressBar step={2} />
        <h2 className="text-2xl font-bold tracking-tight text-brand-ink">What type of property is it?</h2>
        <p className="mt-2 text-sm font-medium text-neutral-600">Tap the one that fits best.</p>

        <div className="mt-6 grid gap-3">
          {PROPERTY_TYPES.map((option) => (
            <OptionCard
              active={state.propertyType === option}
              key={option}
              onClick={() => {
                update("propertyType", option);
                autoAdvance();
              }}
            >
              {option}
            </OptionCard>
          ))}
        </div>

        <div className="mt-6">
          <ReassuranceLine icon={<ShieldIcon />}>
            Apartment with a VvE, a listed building, or new construction: we handle permits, VvE approval and all
            the Dutch paperwork for you.
          </ReassuranceLine>
        </div>
      </div>
    );
  }

  // ── Step 3: location ─────────────────────────────────────────────
  if (step === 3) {
    return (
      <div className="animate-float-in" key="step-3">
        <BackButton onClick={goBack} />
        <ProgressBar step={3} />
        <h2 className="text-2xl font-bold tracking-tight text-brand-ink">Where is the property located?</h2>
        <p className="mt-2 text-sm font-medium text-neutral-600">
          Enter your postcode and house number and we&apos;ll find the address for you.
        </p>

        {!manualMode ? (
          <>
            <div className="mt-6 grid grid-cols-[1.4fr_1fr] gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-brand-ink/60">
                  Postcode
                </label>
                <input
                  className={inputClass}
                  onChange={(e) => setPostcodeInput(e.target.value)}
                  placeholder="1234 AB"
                  value={postcodeInput}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-brand-ink/60">
                  House number
                </label>
                <input
                  className={inputClass}
                  onChange={(e) => setHouseNumberInput(e.target.value)}
                  placeholder="12"
                  value={houseNumberInput}
                />
              </div>
            </div>

            <button
              className="btn-primary mt-4 w-full text-base disabled:pointer-events-none disabled:opacity-40"
              disabled={!normalizeDutchPostcode(postcodeInput) || !houseNumberInput.trim() || searching}
              onClick={handleAddressSearch}
              type="button"
            >
              {searching ? "Searching…" : "Find my address"}
            </button>

            <button
              className="mt-3 w-full text-center text-sm font-semibold text-brand-ink/50 transition hover:text-brand-ink"
              onClick={() => setManualMode(true)}
              type="button"
            >
              I&apos;ll enter my address manually
            </button>

            {searched && !searching && pdokResults.length === 0 ? (
              <p className="mt-4 text-sm font-medium text-brand-ink/60">
                We couldn&apos;t find that automatically. No problem, just enter your address below.
              </p>
            ) : null}

            {pdokResults.length === 1 && selectedAddress ? (
              <div className="mt-5 rounded-xl border-2 border-brand-orange/30 bg-brand-orange/5 p-5">
                <p className="text-sm font-semibold text-brand-ink">
                  We found: {selectedAddress.street} {selectedAddress.houseNumber}, {selectedAddress.city}. Is that
                  right?
                </p>
                <div className="mt-4 flex gap-3">
                  <button className="btn-primary flex-1 text-sm" onClick={confirmAddress} type="button">
                    Yes, that&apos;s right
                  </button>
                  <button
                    className="flex-1 rounded-md border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-brand-ink transition hover:bg-black/5"
                    onClick={() => {
                      setSelectedAddress(null);
                      setManualMode(true);
                    }}
                    type="button"
                  >
                    Not quite
                  </button>
                </div>
              </div>
            ) : null}

            {pdokResults.length > 1 ? (
              <div className="mt-5">
                <p className="mb-3 text-sm font-semibold text-brand-ink">We found a few matches. Which one is yours?</p>
                <div className="grid gap-2.5">
                  {pdokResults.map((result) => (
                    <OptionCard active={selectedAddress?.id === result.id} key={result.id} onClick={() => setSelectedAddress(result)}>
                      {result.displayName}
                    </OptionCard>
                  ))}
                </div>
                {selectedAddress ? (
                  <button className="btn-primary mt-4 w-full text-base" onClick={confirmAddress} type="button">
                    Continue
                  </button>
                ) : null}
              </div>
            ) : null}
          </>
        ) : (
          <div className="mt-6">
            <div className="grid gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-brand-ink/60">
                  Street address
                </label>
                <input
                  className={inputClass}
                  onChange={(e) => setManualStreet(e.target.value)}
                  placeholder="e.g. Orionstraat 235"
                  value={manualStreet}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-brand-ink/60">
                  City
                </label>
                <input
                  className={inputClass}
                  onChange={(e) => setManualCity(e.target.value)}
                  placeholder="e.g. The Hague"
                  value={manualCity}
                />
              </div>
            </div>

            <button
              className="btn-primary mt-4 w-full text-base disabled:pointer-events-none disabled:opacity-40"
              disabled={!locationReady}
              onClick={confirmAddress}
              type="button"
            >
              Continue
            </button>

            <button
              className="mt-3 w-full text-center text-sm font-semibold text-brand-ink/50 transition hover:text-brand-ink"
              onClick={() => {
                setManualMode(false);
                setSearched(false);
                setPdokResults([]);
              }}
              type="button"
            >
              Try postcode lookup instead
            </button>
          </div>
        )}

        <div className="mt-6">
          <ReassuranceLine icon={<ShieldIcon />}>
            You&apos;re always welcome to visit us at our office in The Hague (Orionstraat 235) to talk through your
            plans over coffee.
          </ReassuranceLine>
        </div>
      </div>
    );
  }

  // ── Step 4: timeline ─────────────────────────────────────────────
  if (step === 4) {
    return (
      <div className="animate-float-in" key="step-4">
        <BackButton onClick={goBack} />
        <ProgressBar step={4} />
        <h2 className="text-2xl font-bold tracking-tight text-brand-ink">What&apos;s your timeline?</h2>
        <p className="mt-2 text-sm font-medium text-neutral-600">Tap the one that fits best.</p>

        <div className="mt-6 grid gap-3">
          {TIMELINES.map((option) => (
            <OptionCard
              active={state.timeline === option}
              key={option}
              onClick={() => {
                update("timeline", option);
                autoAdvance();
              }}
            >
              {option}
            </OptionCard>
          ))}
        </div>

        <div className="mt-6">
          <ReassuranceLine icon={<ShieldIcon />}>
            Not in the Netherlands yet, or traveling often? You can manage your renovation remotely, with regular
            photo updates.
          </ReassuranceLine>
        </div>
      </div>
    );
  }

  // ── Step 5: budget ────────────────────────────────────────────────
  if (step === 5) {
    return (
      <div className="animate-float-in" key="step-5">
        <BackButton onClick={goBack} />
        <ProgressBar step={5} />
        <h2 className="text-2xl font-bold tracking-tight text-brand-ink">Budget indication</h2>
        <p className="mt-2 text-sm font-medium text-neutral-600">A rough range is enough, nothing is fixed yet.</p>

        <div className="mt-6 grid gap-3">
          {BUDGETS.map((option) => (
            <OptionCard
              active={state.budget === option}
              key={option}
              onClick={() => {
                update("budget", option);
                autoAdvance();
              }}
            >
              {option}
            </OptionCard>
          ))}
        </div>

        <div className="mt-6 grid gap-2.5">
          <ReassuranceLine icon={<ShieldIcon />}>
            We work with a fixed price, agreed upfront. No surprises, no down payment.
          </ReassuranceLine>
          <ReassuranceLine icon={<ShieldIcon />}>
            Just bought your home? We work with your mortgage bouwdepot and invoice in a way your bank accepts.
          </ReassuranceLine>
        </div>
      </div>
    );
  }

  // ── Step 6: tell us more ─────────────────────────────────────────
  if (step === 6) {
    return (
      <div className="animate-float-in" key="step-6">
        <BackButton onClick={goBack} />
        <ProgressBar step={6} />
        <h2 className="text-2xl font-bold tracking-tight text-brand-ink">Tell us more about your renovation</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          This is the fun part. Tell us what we don&apos;t know yet: your ideas, your must-haves, that one wall
          you&apos;d love to knock down. The more you share, the better we can think along.
        </p>

        <textarea
          className={`${inputClass} mt-6 min-h-[180px] resize-none`}
          onChange={(e) => update("message", e.target.value)}
          placeholder="For example: we just bought a 1930s home and want to open up the kitchen..."
          value={state.message}
        />

        <button className="btn-primary mt-6 w-full text-base" onClick={goNext} type="button">
          Continue
        </button>
      </div>
    );
  }

  // ── Step 7: details ───────────────────────────────────────────────
  if (step === 7) {
    const canSubmit = state.name.trim() && state.email.trim() && state.phone.trim() && !submitting;

    return (
      <div className="animate-float-in" key="step-7">
        <BackButton onClick={goBack} />
        <ProgressBar step={7} />
        <h2 className="text-2xl font-bold tracking-tight text-brand-ink">Your details</h2>
        <p className="mt-2 text-sm font-medium text-neutral-600">
          Almost done. We&apos;ll use this to get back to you within one working day.
        </p>

        <div className="mt-6 grid gap-3">
          <input
            autoComplete="name"
            className={inputClass}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Full name"
            type="text"
            value={state.name}
          />
          <input
            autoComplete="email"
            className={inputClass}
            onChange={(e) => update("email", e.target.value)}
            placeholder="Email address"
            type="email"
            value={state.email}
          />
          <input
            autoComplete="tel"
            className={inputClass}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="Phone number"
            type="tel"
            value={state.phone}
          />

          {/* Honeypot: hidden from real visitors, bots tend to fill every field. */}
          <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
            <label htmlFor="company">Company</label>
            <input
              autoComplete="off"
              id="company"
              name="company"
              onChange={(e) => setCompany(e.target.value)}
              tabIndex={-1}
              type="text"
              value={company}
            />
          </div>
        </div>

        <div className="mt-5">
          <ReassuranceLine icon={<ShieldIcon />}>
            No upfront payment. No obligation. We reply within one working day, in English.
          </ReassuranceLine>
        </div>

        <div className="mt-4">
          <TrustBadges compact />
        </div>

        {submitError ? (
          <p className="mt-4 rounded-md bg-orange-50 px-4 py-3 text-sm font-semibold text-brand-orange">
            Something went wrong sending your request. Please try again, or message us on WhatsApp below.
          </p>
        ) : null}

        <button
          className="btn-primary mt-6 w-full text-base disabled:pointer-events-none disabled:opacity-40"
          disabled={!canSubmit}
          onClick={handleSubmit}
          type="button"
        >
          {submitting ? "Sending…" : "Send my request"}
        </button>

        <a
          className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-brand-ink/60 transition hover:text-brand-ink"
          href={whatsappHref("Hi DRO! I'm visiting your stand at IamExpat and I'd like to talk about a renovation.")}
          rel="noopener noreferrer"
          target="_blank"
        >
          Prefer to chat? Message us on WhatsApp.
        </a>
      </div>
    );
  }

  // ── Step 8: thank you ─────────────────────────────────────────────
  return (
    <div className="animate-fade-in text-center" key="step-8">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-orange/10">
        <svg className="h-8 w-8 text-brand-orange" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="mt-5 text-2xl font-bold tracking-tight text-brand-ink">
        Thanks{state.name ? `, ${state.name.split(" ")[0]}` : ""}.
      </h2>
      <p className="mt-3 text-[15px] leading-7 text-neutral-700">
        We&apos;ve received your request and we&apos;ll contact you within one working day, in English.
      </p>

      <a
        className="btn-primary mt-7 inline-flex w-full text-base"
        href={whatsappHref(
          `Hi DRO! I'm ${state.name || "an IamExpat visitor"}, I just submitted a renovation request via your IamExpat page.`
        )}
        rel="noopener noreferrer"
        target="_blank"
      >
        Prefer to chat now? Message us on WhatsApp
      </a>

      <p className="mt-6 text-xs font-semibold text-brand-ink/50">
        DRO Renovaties · Orionstraat 235, The Hague · KvK 94825653
      </p>
    </div>
  );
}
