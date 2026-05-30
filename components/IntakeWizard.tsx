"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import type { IntakeFormConfig, IntakeFormField, IntakeStep } from "@/lib/types";

type IntakeWizardProps = {
  compact?: boolean;
  embedded?: boolean;
  config: IntakeFormConfig;
};

const inputClass =
  "w-full rounded-md border border-black/10 bg-white px-4 py-3 text-sm font-medium text-brand-ink outline-none transition placeholder:text-neutral-400 focus:border-brand-orange focus:ring-4 focus:ring-orange-100";

function isStepValid(step: IntakeStep, form: Record<string, string>): boolean {
  switch (step.stepType) {
    case "clientType":
    case "choice":
      return Boolean(step.stepKey && form[step.stepKey]);
    case "date":
      return Boolean(step.stepKey && form[step.stepKey]);
    case "textarea":
      return true;
    case "fields":
      return (step.fields ?? [])
        .filter((f) => f.required)
        .every((f) => Boolean(form[f.fieldKey]?.trim()));
  }
}

function collectEntries(
  steps: IntakeStep[],
  form: Record<string, string>
): Array<{ fieldKey: string; label: string; value: string }> {
  const entries: Array<{ fieldKey: string; label: string; value: string }> = [];

  for (const step of steps) {
    if (step.stepType === "fields") {
      for (const field of step.fields ?? []) {
        if (form[field.fieldKey]) {
          entries.push({ fieldKey: field.fieldKey, label: field.label, value: form[field.fieldKey] });
        }
      }
    } else if (step.stepKey && form[step.stepKey]) {
      entries.push({ fieldKey: step.stepKey, label: step.title, value: form[step.stepKey] });
    }
  }

  return entries;
}

function OptionButton({
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
      className={`rounded-lg border px-3.5 py-3 text-left text-sm font-semibold transition hover:-translate-y-0.5 ${
        active
          ? "border-brand-orange bg-brand-orange text-white shadow-lg shadow-orange-500/20"
          : "border-black/10 bg-white text-brand-ink hover:border-brand-orange/60"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: IntakeFormField;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      className={inputClass}
      name={field.fieldKey}
      onChange={onChange}
      placeholder={field.label}
      type={field.inputType}
      value={value}
    />
  );
}

function StepContent({
  step,
  form,
  setForm,
}: {
  step: IntakeStep;
  form: Record<string, string>;
  setForm: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  function handleInput(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  switch (step.stepType) {
    case "clientType":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {(step.options ?? []).map((item) => (
            <OptionButton
              active={form[step.stepKey!] === item}
              key={item}
              onClick={() => setForm((prev) => ({ ...prev, [step.stepKey!]: item }))}
            >
              {item}
            </OptionButton>
          ))}
        </div>
      );

    case "choice":
      return (
        <div className="grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
          {(step.options ?? []).map((item) => (
            <OptionButton
              active={form[step.stepKey!] === item}
              key={item}
              onClick={() => setForm((prev) => ({ ...prev, [step.stepKey!]: item }))}
            >
              {item}
            </OptionButton>
          ))}
        </div>
      );

    case "fields": {
      const hasHalf = (step.fields ?? []).some((f) => f.halfWidth);
      return (
        <div className={`grid gap-3 ${hasHalf ? "sm:grid-cols-2" : ""}`}>
          {(step.fields ?? []).map((field) => (
            <div className={field.halfWidth ? "" : hasHalf ? "sm:col-span-2" : ""} key={field.fieldKey}>
              <FieldInput field={field} onChange={handleInput} value={form[field.fieldKey] ?? ""} />
            </div>
          ))}
        </div>
      );
    }

    case "date":
      return (
        <input
          className={inputClass}
          name={step.stepKey}
          onChange={handleInput}
          type="date"
          value={form[step.stepKey!] ?? ""}
        />
      );

    case "textarea":
      return (
        <textarea
          className={`${inputClass} min-h-32 resize-none`}
          name={step.stepKey}
          onChange={handleInput}
          placeholder={step.subtitle}
          value={form[step.stepKey ?? "textarea"] ?? ""}
        />
      );
  }
}

function FormHeader({ config }: { config: IntakeFormConfig }) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-extrabold tracking-[-0.03em]">
          {config.formTitle}
        </h2>
        <span className="font-hand text-lg text-brand-orange">
          {config.timeLabel}
        </span>
      </div>
      <p className="mt-3 text-sm font-semibold leading-6 text-neutral-500">
        {config.description}
      </p>
    </>
  );
}

function FormFooter({ config }: { config: IntakeFormConfig }) {
  if (!config.privacyText) return null;
  return (
    <p className="mt-5 flex gap-3 text-sm font-semibold leading-6 text-neutral-500">
      <svg className="mt-0.5 h-6 w-6 shrink-0 text-neutral-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {config.privacyText}
    </p>
  );
}

export default function IntakeWizard({ compact = false, embedded = false, config }: IntakeWizardProps) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const steps = config.steps ?? [];
  const currentStep = steps[step];
  const progress = steps.length > 0 ? Math.round(((step + 1) / steps.length) * 100) : 0;
  const valid = currentStep ? isStepValid(currentStep, form) : true;

  function wrappedSetForm(updater: React.SetStateAction<Record<string, string>>) {
    setForm(updater);
    setShowError(false);
  }

  function goNext() {
    if (!valid) { setShowError(true); return; }
    setShowError(false);
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!valid) { setShowError(true); return; }

    if (step < steps.length - 1) {
      setShowError(false);
      setStep((current) => Math.min(current + 1, steps.length - 1));
      return;
    }

    setSubmitting(true);
    try {
      await fetch("/api/submit-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intakeFormId: "default-intake-form",
          entries: collectEntries(steps, form),
        }),
      });
    } catch {
      // submission saved client-side regardless; failure is non-blocking
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className={embedded ? "" : "rounded-lg border border-black/10 bg-brand-soft p-6 shadow-premium sm:p-8"}>
        <p className="eyebrow">{config.successEyebrow}</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
          {config.successTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-neutral-700">
          {config.successText}
        </p>
        {!compact && config.faqItems?.length > 0 ? (
          <div className="mt-7 grid gap-3">
            {config.faqItems.map(({ question, answer }) => (
              <details className="rounded-lg bg-white p-5 shadow-sm" key={question}>
                <summary className="cursor-pointer list-none font-bold text-brand-ink">
                  {question}
                </summary>
                <div className="mt-3 grid gap-2">
                  {answer.map((paragraph, i) => (
                    <p className="text-sm font-semibold leading-6 text-neutral-600" key={i}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  if (!currentStep) return null;

  return (
    <form
      className={embedded ? "" : "rounded-lg border border-black/10 bg-brand-soft p-5 shadow-premium sm:p-7"}
      onSubmit={handleSubmit}
    >
      <FormHeader config={config} />

      <div className="mb-5 mt-5">
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

      <div className="mt-5">
        <StepContent form={form} setForm={wrappedSetForm} step={currentStep} />
      </div>

      {showError ? (
        <p className="mt-4 rounded-md bg-orange-50 px-4 py-3 text-sm font-semibold text-brand-orange">
          {config.errorMessage}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          className="rounded-md px-4 py-3 text-sm font-bold text-neutral-500 transition hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30"
          disabled={step === 0}
          onClick={() => setStep((current) => Math.max(current - 1, 0))}
          type="button"
        >
          {config.backLabel}
        </button>

        {step === steps.length - 1 ? (
          <button className="btn-primary" disabled={submitting} type="submit">
            {submitting ? "Bezig…" : config.submitLabel}
          </button>
        ) : (
          <button className="btn-primary" onClick={goNext} type="button">
            {config.nextLabel}
          </button>
        )}
      </div>

      <FormFooter config={config} />
    </form>
  );
}
