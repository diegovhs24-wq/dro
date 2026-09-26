"use client";

import {useMemo, useState} from "react";
import {lookupPdokAddress, normalizeDutchPostcode, type PdokAddress} from "@/lib/pdok";
import {
  BUDGET_OPTIONS,
  SERVICES,
  TIMELINE_OPTIONS,
  getServiceConfig,
  type Answers,
  type QuestionBlock,
  type QuestionField,
  type ServiceConfig,
} from "@/lib/serviceIntakeConfig";

type UniversalState = {
  postcode: string;
  houseNumber: string;
  address: string;
  location: string;
  fundaLink: string;
  priorities: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  phone: string;
};

const initialUniversal: UniversalState = {
  postcode: "",
  houseNumber: "",
  address: "",
  location: "",
  fundaLink: "",
  priorities: "",
  budget: "",
  timeline: "",
  name: "",
  email: "",
  phone: "",
};

type StepDescriptor =
  | {kind: "confirmation"; service: ServiceConfig}
  | {kind: "block"; service: ServiceConfig; block: QuestionBlock; blockIndex: number}
  | {kind: "location"}
  | {kind: "funda"}
  | {kind: "priorities"}
  | {kind: "budget"}
  | {kind: "timeline"}
  | {kind: "contact"};

function visibleFields(block: QuestionBlock, answers: Answers): QuestionField[] {
  return block.fields.filter((field) => !field.showIf || field.showIf(answers));
}

function computeSteps(
  selectedServices: string[],
  answersByService: Record<string, Answers>,
  confirmations: Record<string, "yes" | "no">
): StepDescriptor[] {
  const steps: StepDescriptor[] = [];

  for (const key of selectedServices) {
    const service = getServiceConfig(key);
    if (!service) continue;

    if (service.confirmation) {
      steps.push({kind: "confirmation", service});
      if (confirmations[key] !== "yes") continue;
    }

    const answers = answersByService[key] || {};
    service.blocks.forEach((block, blockIndex) => {
      if (visibleFields(block, answers).length > 0) {
        steps.push({kind: "block", service, block, blockIndex});
      }
    });
  }

  steps.push({kind: "location"}, {kind: "funda"}, {kind: "priorities"}, {kind: "budget"}, {kind: "timeline"}, {kind: "contact"});
  return steps;
}

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-base font-medium text-brand-ink outline-none transition placeholder:text-neutral-400 focus:border-brand-orange focus:ring-4 focus:ring-orange-100";

function OptionCard({active, onClick, children}: {active: boolean; onClick: () => void; children: React.ReactNode}) {
  return (
    <button
      className={`flex min-h-[58px] w-full items-center justify-between gap-3 rounded-xl border-2 px-5 py-3.5 text-left text-base font-semibold transition-all duration-200 ${
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

function ProgressBar({current, total}: {current: number; total: number}) {
  const percent = total > 0 ? Math.round((Math.min(current, total) / total) * 100) : 0;
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">
        <span>Stap {Math.min(current, total)} van {total}</span>
        <span>{percent}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10">
        <div className="h-full rounded-full bg-brand-orange transition-all duration-500" style={{width: `${percent}%`}} />
      </div>
    </div>
  );
}

function BackButton({onClick}: {onClick: () => void}) {
  return (
    <button
      className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink/60 transition hover:text-brand-ink"
      onClick={onClick}
      type="button"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Terug
    </button>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: QuestionField;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
}) {
  if (field.type === "choice" || field.type === "yesno") {
    return (
      <div className="grid gap-2.5">
        {(field.options ?? []).map((option) => (
          <OptionCard active={value === option} key={option} onClick={() => onChange(option)}>
            {option}
          </OptionCard>
        ))}
      </div>
    );
  }

  if (field.type === "multiChoice") {
    const selected = Array.isArray(value) ? value : [];
    return (
      <div className="grid gap-2.5">
        {(field.options ?? []).map((option) => (
          <OptionCard
            active={selected.includes(option)}
            key={option}
            onClick={() =>
              onChange(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option])
            }
          >
            {option}
          </OptionCard>
        ))}
      </div>
    );
  }

  if (field.type === "number") {
    return (
      <div className="relative">
        <input
          className={inputClass}
          inputMode="decimal"
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? "0"}
          type="text"
          value={typeof value === "string" ? value : ""}
        />
        {field.unit ? (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-400">
            {field.unit}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <input
      className={inputClass}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      type="text"
      value={typeof value === "string" ? value : ""}
    />
  );
}

function BlockStep({
  service,
  block,
  answers,
  onChange,
  onNext,
  onBack,
  current,
  total,
}: {
  service: ServiceConfig;
  block: QuestionBlock;
  answers: Answers;
  onChange: (fieldKey: string, value: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
  current: number;
  total: number;
}) {
  const fields = visibleFields(block, answers);
  const singleAutoAdvance = fields.length === 1 && (fields[0].type === "choice" || fields[0].type === "yesno");

  return (
    <div className="animate-float-in">
      <BackButton onClick={onBack} />
      <ProgressBar current={current} total={total} />
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-orange">{service.label}</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-ink">{block.title}</h2>
      {block.subtitle ? <p className="mt-2 text-sm font-medium text-neutral-600">{block.subtitle}</p> : null}

      <div className="mt-6 grid gap-6">
        {fields.map((field) => {
          const note = field.note?.(answers);
          return (
            <div key={field.key}>
              <label className="mb-2 block text-[15px] font-bold leading-6 text-brand-ink">{field.label}</label>
              {field.helpText ? <p className="mb-2.5 text-sm leading-5 text-neutral-500">{field.helpText}</p> : null}
              <FieldRenderer
                field={field}
                onChange={(value) => {
                  onChange(field.key, value);
                  if (singleAutoAdvance) window.setTimeout(onNext, 380);
                }}
                value={answers[field.key]}
              />
              {note ? (
                <p className="mt-2.5 rounded-lg bg-brand-orange/5 px-3.5 py-2.5 text-sm leading-5 text-brand-ink/80">{note}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      {!singleAutoAdvance ? (
        <button className="btn-primary mt-7 w-full text-base" onClick={onNext} type="button">
          Volgende
        </button>
      ) : null}
    </div>
  );
}

export default function SmartIntakeWizard({embedded = false}: {embedded?: boolean}) {
  const shellClass = embedded ? "" : "rounded-lg border border-black/10 bg-brand-soft p-5 shadow-premium sm:p-7";
  const [phase, setPhase] = useState<"services" | "flow" | "done">("services");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [flowIndex, setFlowIndex] = useState(0);
  const [answersByService, setAnswersByService] = useState<Record<string, Answers>>({});
  const [confirmations, setConfirmations] = useState<Record<string, "yes" | "no">>({});
  const [universal, setUniversal] = useState<UniversalState>(initialUniversal);
  const [company, setCompany] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  // Location step's own working state.
  const [postcodeInput, setPostcodeInput] = useState("");
  const [houseNumberInput, setHouseNumberInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [pdokResults, setPdokResults] = useState<PdokAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<PdokAddress | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualStreet, setManualStreet] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [locationSkipped, setLocationSkipped] = useState(false);

  const steps = useMemo(
    () => computeSteps(selectedServices, answersByService, confirmations),
    [selectedServices, answersByService, confirmations]
  );

  function updateAnswer(serviceKey: string, fieldKey: string, value: string | string[]) {
    setAnswersByService((prev) => ({
      ...prev,
      [serviceKey]: {...(prev[serviceKey] || {}), [fieldKey]: value},
    }));
  }

  function toggleService(key: string) {
    setSelectedServices((prev) => {
      if (key === "totaalrenovatie") {
        return prev.includes("totaalrenovatie") ? [] : ["totaalrenovatie"];
      }
      const withoutTotaal = prev.filter((item) => item !== "totaalrenovatie");
      return withoutTotaal.includes(key) ? withoutTotaal.filter((item) => item !== key) : [...withoutTotaal, key];
    });
  }

  function startFlow() {
    setFlowIndex(0);
    setPhase("flow");
  }

  function goNext() {
    setFlowIndex((current) => Math.min(current + 1, steps.length));
  }

  function goBack() {
    if (flowIndex === 0) {
      setPhase("services");
      return;
    }
    setFlowIndex((current) => Math.max(current - 1, 0));
  }

  function declineTotaalrenovatie() {
    setConfirmations((prev) => ({...prev, totaalrenovatie: "no"}));
    setSelectedServices([]);
    setAnswersByService({});
    setPhase("services");
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

    if (results.length === 0) setManualMode(true);
    else if (results.length === 1) setSelectedAddress(results[0]);
  }

  function confirmAddress() {
    if (selectedAddress) {
      setUniversal((prev) => ({
        ...prev,
        postcode: selectedAddress.postcode,
        houseNumber: selectedAddress.houseNumber,
        address: selectedAddress.displayName,
        location: selectedAddress.city,
      }));
    } else if (manualMode) {
      setUniversal((prev) => ({
        ...prev,
        postcode: postcodeInput.trim(),
        houseNumber: houseNumberInput.trim(),
        address: `${manualStreet.trim()}, ${manualCity.trim()}`,
        location: manualCity.trim(),
      }));
    }
    goNext();
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(false);

    const serviceAnswers = selectedServices.map((key) => {
      const service = getServiceConfig(key);
      const answers = answersByService[key] || {};
      const qa = Object.entries(answers)
        .filter(([, value]) => (Array.isArray(value) ? value.length > 0 : Boolean(value)))
        .map(([fieldKey, value]) => {
          const field = service?.blocks.flatMap((b) => b.fields).find((f) => f.key === fieldKey);
          return {
            question: field?.label || fieldKey,
            answer: Array.isArray(value) ? value.join(", ") : value,
          };
        });
      return {service: service?.label || key, answers: qa};
    });

    try {
      const res = await fetch("/api/submit-request", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          ...universal,
          services: selectedServices.map((key) => getServiceConfig(key)?.label || key),
          serviceAnswers,
          company,
        }),
      });

      if (!res.ok) throw new Error("Submit failed");
      setSubmitting(false);
      setPhase("done");
    } catch {
      setSubmitting(false);
      setSubmitError(true);
    }
  }

  // ── Phase: kies diensten ─────────────────────────────────────────
  if (phase === "services") {
    return (
      <div className={shellClass}>
        <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-brand-ink">Waar kunnen we u mee helpen?</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-brand-ink">
          Kies één of meer diensten. We stellen daarna alleen de vragen die voor u van toepassing zijn.
        </p>

        <div className="mt-6 grid gap-2.5">
          {SERVICES.map((service) => (
            <OptionCard active={selectedServices.includes(service.key)} key={service.key} onClick={() => toggleService(service.key)}>
              {service.label}
            </OptionCard>
          ))}
        </div>

        <button
          className="btn-primary mt-6 w-full text-base disabled:pointer-events-none disabled:opacity-40"
          disabled={selectedServices.length === 0}
          onClick={startFlow}
          type="button"
        >
          Volgende
        </button>
      </div>
    );
  }

  // ── Phase: klaar ──────────────────────────────────────────────────
  if (phase === "done") {
    return (
      <div className={shellClass}>
        <p className="eyebrow">Aanvraag ontvangen</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
          Bedankt{universal.name ? `, ${universal.name.split(" ")[0]}` : ""}.
        </h2>
        <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-neutral-700">
          We hebben uw aanvraag ontvangen en nemen binnen één werkdag contact met u op.
        </p>
      </div>
    );
  }

  // ── Phase: flow ───────────────────────────────────────────────────
  const step = steps[flowIndex];
  const total = steps.length;
  const current = flowIndex + 1;

  if (!step) return null;

  if (step.kind === "confirmation") {
    const {service} = step;
    if (!service.confirmation) return null;
    return (
      <div className={`animate-float-in ${shellClass}`}>
        <BackButton onClick={goBack} />
        <h2 className="text-2xl font-bold tracking-tight text-brand-ink">{service.confirmation.title}</h2>
        <p className="mt-3 text-[15px] leading-7 text-neutral-700">{service.confirmation.body}</p>
        <div className="mt-6 grid gap-3">
          <button
            className="btn-primary text-base"
            onClick={() => {
              setConfirmations((prev) => ({...prev, [service.key]: "yes"}));
              goNext();
            }}
            type="button"
          >
            {service.confirmation.confirmLabel}
          </button>
          <button
            className="rounded-md border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-brand-ink transition hover:bg-black/5"
            onClick={declineTotaalrenovatie}
            type="button"
          >
            {service.confirmation.declineLabel}
          </button>
        </div>
      </div>
    );
  }

  if (step.kind === "block") {
    return (
      <div className={shellClass}>
        <BlockStep
          answers={answersByService[step.service.key] || {}}
          block={step.block}
          current={current}
          onBack={goBack}
          onChange={(fieldKey, value) => updateAnswer(step.service.key, fieldKey, value)}
          onNext={goNext}
          service={step.service}
          total={total}
        />
      </div>
    );
  }

  if (step.kind === "location") {
    const locationReady = Boolean(selectedAddress) || (manualMode && manualStreet.trim() && manualCity.trim());
    return (
      <div className={`animate-float-in ${shellClass}`}>
        <BackButton onClick={goBack} />
        <ProgressBar current={current} total={total} />
        <h2 className="text-2xl font-bold tracking-tight text-brand-ink">Waar staat de woning?</h2>
        <p className="mt-2 text-sm font-medium text-neutral-600">
          Vul uw postcode en huisnummer in, dan vullen we straat en plaats automatisch aan.
        </p>

        {!manualMode ? (
          <>
            <div className="mt-6 grid grid-cols-[1.4fr_1fr] gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-brand-ink/60">Postcode</label>
                <input className={inputClass} onChange={(e) => setPostcodeInput(e.target.value)} placeholder="1234 AB" value={postcodeInput} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-brand-ink/60">Huisnummer</label>
                <input className={inputClass} onChange={(e) => setHouseNumberInput(e.target.value)} placeholder="12" value={houseNumberInput} />
              </div>
            </div>

            <button
              className="btn-primary mt-4 w-full text-base disabled:pointer-events-none disabled:opacity-40"
              disabled={!normalizeDutchPostcode(postcodeInput) || !houseNumberInput.trim() || searching}
              onClick={handleAddressSearch}
              type="button"
            >
              {searching ? "Zoeken…" : "Vind mijn adres"}
            </button>

            <button
              className="mt-3 w-full text-center text-sm font-semibold text-brand-ink/50 transition hover:text-brand-ink"
              onClick={() => setManualMode(true)}
              type="button"
            >
              Ik vul mijn adres liever handmatig in
            </button>

            {searched && !searching && pdokResults.length === 0 ? (
              <p className="mt-4 text-sm font-medium text-brand-ink/60">
                We konden dit niet automatisch vinden. Geen probleem, vul uw adres hieronder in.
              </p>
            ) : null}

            {pdokResults.length === 1 && selectedAddress ? (
              <div className="mt-5 rounded-xl border-2 border-brand-orange/30 bg-brand-orange/5 p-5">
                <p className="text-sm font-semibold text-brand-ink">
                  We vonden: {selectedAddress.street} {selectedAddress.houseNumber}, {selectedAddress.city}. Klopt dat?
                </p>
                <div className="mt-4 flex gap-3">
                  <button className="btn-primary flex-1 text-sm" onClick={confirmAddress} type="button">
                    Ja, dat klopt
                  </button>
                  <button
                    className="flex-1 rounded-md border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-brand-ink transition hover:bg-black/5"
                    onClick={() => {
                      setSelectedAddress(null);
                      setManualMode(true);
                    }}
                    type="button"
                  >
                    Niet helemaal
                  </button>
                </div>
              </div>
            ) : null}

            {pdokResults.length > 1 ? (
              <div className="mt-5">
                <p className="mb-3 text-sm font-semibold text-brand-ink">We vonden een paar mogelijke adressen. Welke is de juiste?</p>
                <div className="grid gap-2.5">
                  {pdokResults.map((result) => (
                    <OptionCard active={selectedAddress?.id === result.id} key={result.id} onClick={() => setSelectedAddress(result)}>
                      {result.displayName}
                    </OptionCard>
                  ))}
                </div>
                {selectedAddress ? (
                  <button className="btn-primary mt-4 w-full text-base" onClick={confirmAddress} type="button">
                    Volgende
                  </button>
                ) : null}
              </div>
            ) : null}
          </>
        ) : (
          <div className="mt-6">
            <div className="grid gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-brand-ink/60">Straat en huisnummer</label>
                <input className={inputClass} onChange={(e) => setManualStreet(e.target.value)} placeholder="Bijvoorbeeld Orionstraat 235" value={manualStreet} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-brand-ink/60">Plaats</label>
                <input className={inputClass} onChange={(e) => setManualCity(e.target.value)} placeholder="Bijvoorbeeld Den Haag" value={manualCity} />
              </div>
            </div>

            <button
              className="btn-primary mt-4 w-full text-base disabled:pointer-events-none disabled:opacity-40"
              disabled={!locationReady}
              onClick={confirmAddress}
              type="button"
            >
              Volgende
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
              Toch via postcode zoeken
            </button>
          </div>
        )}

        {!locationSkipped ? (
          <button
            className="mt-5 w-full text-center text-sm font-semibold text-brand-ink/40 transition hover:text-brand-ink/70"
            onClick={() => {
              setLocationSkipped(true);
              goNext();
            }}
            type="button"
          >
            Deze stap overslaan
          </button>
        ) : null}
      </div>
    );
  }

  if (step.kind === "funda") {
    return (
      <div className={`animate-float-in ${shellClass}`}>
        <BackButton onClick={goBack} />
        <ProgressBar current={current} total={total} />
        <h2 className="text-2xl font-bold tracking-tight text-brand-ink">Staat de woning (nog) op Funda?</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          Optioneel: plak hier de link. Zo hebben we in één klik de plattegronden, oppervlaktes, het bouwjaar en foto&apos;s
          bij de hand, en kunnen we een snellere en preciezere inschatting maken.
        </p>
        <input
          className={`${inputClass} mt-5`}
          onChange={(e) => setUniversal((prev) => ({...prev, fundaLink: e.target.value}))}
          placeholder="https://www.funda.nl/koop/..."
          type="url"
          value={universal.fundaLink}
        />
        <button className="btn-primary mt-6 w-full text-base" onClick={goNext} type="button">
          Volgende
        </button>
      </div>
    );
  }

  if (step.kind === "priorities") {
    return (
      <div className={`animate-float-in ${shellClass}`}>
        <BackButton onClick={goBack} />
        <ProgressBar current={current} total={total} />
        <h2 className="text-2xl font-bold tracking-tight text-brand-ink">Wat vindt u het belangrijkst aan dit project?</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          Vertel gerust vrijuit. Denk aan stijl, kwaliteit, snelheid, budget, specifieke wensen, of iets waar wij rekening
          mee moeten houden.
        </p>
        <textarea
          className={`${inputClass} mt-5 min-h-[160px] resize-none`}
          onChange={(e) => setUniversal((prev) => ({...prev, priorities: e.target.value}))}
          placeholder="Bijvoorbeeld: wij hechten vooral aan een strakke afwerking en een realistische planning, budget is voor ons net zo belangrijk als snelheid..."
          value={universal.priorities}
        />
        <button className="btn-primary mt-6 w-full text-base" onClick={goNext} type="button">
          Volgende
        </button>
      </div>
    );
  }

  if (step.kind === "budget") {
    return (
      <div className={`animate-float-in ${shellClass}`}>
        <BackButton onClick={goBack} />
        <ProgressBar current={current} total={total} />
        <h2 className="text-2xl font-bold tracking-tight text-brand-ink">Wat is uw budgetindicatie?</h2>
        <p className="mt-2 text-sm font-medium text-neutral-600">Een globale inschatting is genoeg, er ligt nog niets vast.</p>
        <div className="mt-6 grid gap-2.5">
          {BUDGET_OPTIONS.map((option) => (
            <OptionCard
              active={universal.budget === option}
              key={option}
              onClick={() => {
                setUniversal((prev) => ({...prev, budget: option}));
                window.setTimeout(goNext, 380);
              }}
            >
              {option}
            </OptionCard>
          ))}
        </div>
      </div>
    );
  }

  if (step.kind === "timeline") {
    return (
      <div className={`animate-float-in ${shellClass}`}>
        <BackButton onClick={goBack} />
        <ProgressBar current={current} total={total} />
        <h2 className="text-2xl font-bold tracking-tight text-brand-ink">Wat is uw planning?</h2>
        <div className="mt-6 grid gap-2.5">
          {TIMELINE_OPTIONS.map((option) => (
            <OptionCard
              active={universal.timeline === option}
              key={option}
              onClick={() => {
                setUniversal((prev) => ({...prev, timeline: option}));
                window.setTimeout(goNext, 380);
              }}
            >
              {option}
            </OptionCard>
          ))}
        </div>
      </div>
    );
  }

  // step.kind === "contact"
  const canSubmit = universal.name.trim() && universal.email.trim() && universal.phone.trim() && !submitting;

  return (
    <div className={`animate-float-in ${shellClass}`}>
      <BackButton onClick={goBack} />
      <ProgressBar current={current} total={total} />
      <h2 className="text-2xl font-bold tracking-tight text-brand-ink">Uw gegevens</h2>
      <p className="mt-2 text-sm font-medium text-neutral-600">
        Bijna klaar. Hiermee kunnen we binnen één werkdag contact met u opnemen.
      </p>

      <div className="mt-6 grid gap-3">
        <input
          autoComplete="name"
          className={inputClass}
          onChange={(e) => setUniversal((prev) => ({...prev, name: e.target.value}))}
          placeholder="Naam"
          type="text"
          value={universal.name}
        />
        <input
          autoComplete="email"
          className={inputClass}
          onChange={(e) => setUniversal((prev) => ({...prev, email: e.target.value}))}
          placeholder="E-mailadres"
          type="email"
          value={universal.email}
        />
        <input
          autoComplete="tel"
          className={inputClass}
          onChange={(e) => setUniversal((prev) => ({...prev, phone: e.target.value}))}
          placeholder="Telefoonnummer"
          type="tel"
          value={universal.phone}
        />

        {/* Honeypot: onzichtbaar voor bezoekers, bots vullen doorgaans elk veld. */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
          <label htmlFor="company">Bedrijf</label>
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

      {submitError ? (
        <p className="mt-4 rounded-md bg-orange-50 px-4 py-3 text-sm font-semibold text-brand-orange">
          Er ging iets mis bij het versturen. Probeer het nog eens, of bel of WhatsApp ons op 085 087 1814.
        </p>
      ) : null}

      <button
        className="btn-primary mt-6 w-full text-base disabled:pointer-events-none disabled:opacity-40"
        disabled={!canSubmit}
        onClick={handleSubmit}
        type="button"
      >
        {submitting ? "Versturen…" : "Aanvraag versturen"}
      </button>
    </div>
  );
}
