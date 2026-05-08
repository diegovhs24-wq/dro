"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

const projectTypes = [
  "Badkamer renovatie",
  "Totaalrenovatie",
  "Uitbouw / aanbouw",
  "Afbouw nieuwbouw",
  "Vloerverwarming",
  "Warmtepomp",
  "Zonnepanelen",
  "Stuc- en schilderwerk",
  "Onderhoud",
  "Zakelijk project"
];

const budgetOptions = [
  "Nog te bepalen",
  "€ 5.000 - € 15.000",
  "€ 15.000 - € 30.000",
  "€ 30.000 - € 75.000",
  "€ 75.000+",
  "Zakelijk / meerdere units"
];

const faqItems = [
  [
    "Wat gebeurt er na mijn aanvraag?",
    "We bekijken uw aanvraag en nemen binnen 24 uur contact op om de situatie rustig door te nemen."
  ],
  [
    "Krijg ik één aanspreekpunt?",
    "Ja. U heeft één vast aanspreekpunt voor vragen, planning en afstemming."
  ],
  [
    "Kan ik foto's later nog nasturen?",
    "Ja. Tijdens het eerste contact geven wij aan welke foto's of tekeningen handig zijn."
  ],
  [
    "Werken jullie ook zakelijk?",
    "Ja. Wij ondersteunen ook vastgoedpartijen, aannemers en ontwikkelaars met uitvoering en afbouw."
  ]
];

type IntakeWizardProps = {
  compact?: boolean;
  embedded?: boolean;
};

type FormState = {
  clientType: string;
  naam: string;
  email: string;
  telefoon: string;
  straatnaam: string;
  huisnummer: string;
  postcode: string;
  plaats: string;
  projectType: string;
  budget: string;
  startdatum: string;
  omschrijving: string;
};

const initialState: FormState = {
  clientType: "",
  naam: "",
  email: "",
  telefoon: "",
  straatnaam: "",
  huisnummer: "",
  postcode: "",
  plaats: "",
  projectType: "",
  budget: "",
  startdatum: "",
  omschrijving: ""
};

const inputClass =
  "w-full rounded-md border border-black/10 bg-white px-4 py-3 text-sm font-medium text-brand-ink outline-none transition placeholder:text-neutral-400 focus:border-brand-orange focus:ring-4 focus:ring-orange-100";

export default function IntakeWizard({ compact = false, embedded = false }: IntakeWizardProps) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [form, setForm] = useState<FormState>(initialState);

  const steps = useMemo(
    () => [
      {
        title: "Voor wie is deze aanvraag?",
        subtitle: "Zo stemmen we de intake direct goed af.",
        isValid: Boolean(form.clientType),
        content: (
          <div className="grid gap-3 sm:grid-cols-2">
            {["Particulier", "Zakelijk"].map((item) => (
              <button
                className={`rounded-lg border px-4 py-4 text-left text-sm font-semibold transition hover:-translate-y-0.5 ${
                  form.clientType === item
                    ? "border-brand-orange bg-brand-orange text-white shadow-lg shadow-orange-500/20"
                    : "border-black/10 bg-white text-brand-ink hover:border-brand-orange/60"
                }`}
                key={item}
                onClick={() => updateField("clientType", item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        )
      },
      {
        title: "Hoe kunnen we u bereiken?",
        subtitle: "We nemen binnen 24 uur persoonlijk contact op.",
        isValid: Boolean(form.naam && form.email && form.telefoon),
        content: (
          <div className="grid gap-3">
            <input className={inputClass} name="naam" onChange={handleChange} placeholder="Naam *" value={form.naam} />
            <input className={inputClass} name="email" onChange={handleChange} placeholder="E-mail *" type="email" value={form.email} />
            <input className={inputClass} name="telefoon" onChange={handleChange} placeholder="Telefoonnummer *" type="tel" value={form.telefoon} />
          </div>
        )
      },
      {
        title: "Waar bevindt het project zich?",
        subtitle: "Alleen de basislocatie is genoeg voor de eerste beoordeling.",
        isValid: Boolean(form.straatnaam && form.huisnummer && form.postcode && form.plaats),
        content: (
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={inputClass} name="straatnaam" onChange={handleChange} placeholder="Straatnaam *" value={form.straatnaam} />
            <input className={inputClass} name="huisnummer" onChange={handleChange} placeholder="Huisnummer *" value={form.huisnummer} />
            <input className={inputClass} name="postcode" onChange={handleChange} placeholder="Postcode *" value={form.postcode} />
            <input className={inputClass} name="plaats" onChange={handleChange} placeholder="Plaats *" value={form.plaats} />
          </div>
        )
      },
      {
        title: "Wat wilt u laten uitvoeren?",
        subtitle: "Kies de dienst die het beste past. Details bespreken we daarna.",
        isValid: Boolean(form.projectType),
        content: (
          <div className="grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
            {projectTypes.map((item) => (
              <button
                className={`rounded-lg border px-3.5 py-3 text-left text-sm font-semibold transition hover:-translate-y-0.5 ${
                  form.projectType === item
                    ? "border-brand-orange bg-brand-orange text-white shadow-lg shadow-orange-500/20"
                    : "border-black/10 bg-white text-brand-ink hover:border-brand-orange/60"
                }`}
                key={item}
                onClick={() => updateField("projectType", item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        )
      },
      {
        title: "Welke budgetrange past bij uw project?",
        subtitle: "Geen oordeel. Dit helpt alleen om realistisch mee te denken.",
        isValid: Boolean(form.budget),
        content: (
          <div className="grid gap-2 sm:grid-cols-2">
            {budgetOptions.map((item) => (
              <button
                className={`rounded-lg border px-3.5 py-3 text-left text-sm font-semibold transition hover:-translate-y-0.5 ${
                  form.budget === item
                    ? "border-brand-orange bg-brand-orange text-white shadow-lg shadow-orange-500/20"
                    : "border-black/10 bg-white text-brand-ink hover:border-brand-orange/60"
                }`}
                key={item}
                onClick={() => updateField("budget", item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        )
      },
      {
        title: "Wanneer wilt u starten?",
        subtitle: "Een indicatie is voldoende. We stemmen de planning samen af.",
        isValid: Boolean(form.startdatum),
        content: (
          <input className={inputClass} name="startdatum" onChange={handleChange} type="date" value={form.startdatum} />
        )
      },
      {
        title: "Wat moeten we weten?",
        subtitle: "Kort is prima. Wij stellen de rest van de vragen.",
        isValid: true,
        content: (
          <textarea
            className={`${inputClass} min-h-32 resize-none`}
            name="omschrijving"
            onChange={handleChange}
            placeholder="Korte omschrijving van uw project"
            value={form.omschrijving}
          />
        )
      }
    ],
    [form]
  );

  const currentStep = steps[step];
  const progress = Math.round(((step + 1) / steps.length) * 100);

  function updateField(name: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
    setShowError(false);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    updateField(event.target.name as keyof FormState, event.target.value);
  }

  function goNext() {
    if (!currentStep.isValid) {
      setShowError(true);
      return;
    }

    setShowError(false);
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentStep.isValid) {
      setShowError(true);
      return;
    }

    if (step < steps.length - 1) {
      setShowError(false);
      setStep((current) => Math.min(current + 1, steps.length - 1));
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className={embedded ? "" : "rounded-lg border border-black/10 bg-brand-soft p-6 shadow-premium sm:p-8"}>
        <p className="eyebrow">Aanvraag ontvangen</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
          We nemen contact met u op
        </h2>
        <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-neutral-700">
          Bedankt voor uw aanvraag. Wij nemen binnen 24 uur contact met u op.
        </p>
        {!compact ? (
          <div className="mt-7 grid gap-3">
            {faqItems.map(([question, answer]) => (
              <details className="rounded-lg bg-white p-5 shadow-sm" key={question}>
                <summary className="cursor-pointer list-none font-bold text-brand-ink">
                  {question}
                </summary>
                <p className="mt-3 text-sm font-semibold leading-6 text-neutral-600">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <form
      className={embedded ? "" : "rounded-lg border border-black/10 bg-brand-soft p-5 shadow-premium sm:p-7"}
      onSubmit={handleSubmit}
    >
      <div className="mb-5">
        <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">
          <span>Stap {step + 1} van {steps.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/10">
          <div className="h-full rounded-full bg-brand-orange transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div>
        <h3 className={`${compact ? "text-xl" : "text-2xl"} font-bold tracking-tight text-brand-ink`}>
          {currentStep.title}
        </h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-neutral-600">
          {currentStep.subtitle}
        </p>
      </div>

      <div className="mt-5">{currentStep.content}</div>

      {showError ? (
        <p className="mt-4 rounded-md bg-orange-50 px-4 py-3 text-sm font-semibold text-brand-orange">
          Vul deze stap eerst in, dan kunt u door.
        </p>
      ) : null}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          className="rounded-md px-4 py-3 text-sm font-bold text-neutral-500 transition hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30"
          disabled={step === 0}
          onClick={() => setStep((current) => Math.max(current - 1, 0))}
          type="button"
        >
          Terug
        </button>

        {step === steps.length - 1 ? (
          <button className="btn-primary" type="submit">
            Verstuur intake
          </button>
        ) : (
          <button className="btn-primary" onClick={goNext} type="button">
            Volgende stap
          </button>
        )}
      </div>
    </form>
  );
}
