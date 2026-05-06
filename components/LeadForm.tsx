"use client";

import { FormEvent, useMemo, useState } from "react";

const projectTypes = [
  "Badkamer renovatie",
  "Totaalrenovatie",
  "Uitbouw / aanbouw",
  "Afbouw nieuwbouw"
];

export default function LeadForm() {
  const [step, setStep] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [timeline, setTimeline] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [contact, setContact] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const canContinue = useMemo(() => {
    if (step === 1) return selectedTypes.length > 0;
    if (step === 2) return address.trim().length > 5;
    if (step === 3) return timeline.trim().length > 0;
    if (step === 4) return files.length >= 2;
    return Boolean(
      contact.name.trim() &&
        contact.phone.trim() &&
        contact.email.includes("@") &&
        contact.message.trim()
    );
  }, [address, timeline, contact, files.length, selectedTypes.length, step]);

  const toggleType = (type: string) => {
    setSelectedTypes((current) =>
      current.includes(type) ? current.filter((item) => item !== type) : [...current, type]
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canContinue) return;
    setSubmitted(true);
  };

  return (
    <section className="bg-white py-24" id="aanvraag">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="eyebrow">Aanvraag</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Ontvang binnen 24 uur eerste duidelijkheid.
          </h2>
          <p className="mt-6 text-lg leading-8 text-neutral-600">
            Deel uw situatie in vijf korte stappen. Hoe concreter de aanvraag, hoe sneller
            onze verbouwconsulent u kan helpen.
          </p>
        </div>

        <form className="rounded-lg border border-black/10 bg-brand-soft p-5 shadow-premium sm:p-8" onSubmit={handleSubmit}>
          <div className="mb-8 flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-brand-orange">Stap {step} van 5</span>
            <div className="h-2 flex-1 rounded-full bg-black/10">
              <div
                className="h-2 rounded-full bg-brand-orange transition-all"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

          {submitted ? (
            <div className="rounded-lg bg-white p-8 text-center">
              <h3 className="text-2xl font-bold">Aanvraag ontvangen.</h3>
              <p className="mt-4 text-neutral-600">
                Uw verbouwconsulent neemt contact op met een eerste inschatting.
              </p>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div>
                  <h3 className="text-2xl font-bold">Wat wilt u verbouwen?</h3>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {projectTypes.map((type) => (
                      <button
                        className={`rounded-md border px-4 py-4 text-left text-sm font-semibold transition ${
                          selectedTypes.includes(type)
                            ? "border-brand-orange bg-white text-brand-orange shadow-sm"
                            : "border-black/10 bg-white text-brand-ink hover:border-brand-orange"
                        }`}
                        key={type}
                        onClick={() => toggleType(type)}
                        type="button"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <label className="text-2xl font-bold" htmlFor="address">
                    Waar is het project?
                  </label>
                  <input
                    className="mt-6 w-full rounded-md border border-black/10 bg-white px-4 py-4 text-base outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-orange-100"
                    id="address"
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Straat, huisnummer, plaats"
                    value={address}
                  />
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="text-2xl font-bold">Wanneer wilt u starten?</h3>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {["Zo snel mogelijk", "Binnen 1-3 maanden", "Ik oriënteer mij"].map((option) => (
                      <button
                        className={`rounded-md border px-4 py-4 text-left text-sm font-semibold transition ${
                          timeline === option
                            ? "border-brand-orange bg-white text-brand-orange shadow-sm"
                            : "border-black/10 bg-white text-brand-ink hover:border-brand-orange"
                        }`}
                        key={option}
                        onClick={() => setTimeline(option)}
                        type="button"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h3 className="text-2xl font-bold">Upload minimaal twee foto's van de huidige situatie</h3>
                  <input
                    accept="image/*"
                    className="mt-6 w-full rounded-md border border-dashed border-black/20 bg-white px-4 py-8 text-sm"
                    multiple
                    onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
                    type="file"
                  />
                  <p className={`mt-4 text-sm font-semibold ${files.length >= 2 ? "text-green-700" : "text-brand-orange"}`}>
                    {files.length >= 2
                      ? `${files.length} foto's toegevoegd`
                      : "Minimaal 2 foto's vereist om verder te gaan."}
                  </p>
                </div>
              )}

              {step === 5 && (
                <div>
                  <h3 className="text-2xl font-bold">Wie mogen wij helpen?</h3>
                  <div className="mt-6 grid gap-4">
                    <input
                      className="rounded-md border border-black/10 bg-white px-4 py-4 outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-orange-100"
                      onChange={(event) => setContact({ ...contact, name: event.target.value })}
                      placeholder="Naam"
                      value={contact.name}
                    />
                    <input
                      className="rounded-md border border-black/10 bg-white px-4 py-4 outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-orange-100"
                      onChange={(event) => setContact({ ...contact, phone: event.target.value })}
                      placeholder="Telefoonnummer"
                      type="tel"
                      value={contact.phone}
                    />
                    <input
                      className="rounded-md border border-black/10 bg-white px-4 py-4 outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-orange-100"
                      onChange={(event) => setContact({ ...contact, email: event.target.value })}
                      placeholder="E-mailadres"
                      type="email"
                      value={contact.email}
                    />
                    <textarea
                      className="min-h-32 rounded-md border border-black/10 bg-white px-4 py-4 outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-orange-100"
                      onChange={(event) => setContact({ ...contact, message: event.target.value })}
                      placeholder="Bericht"
                      value={contact.message}
                    />
                  </div>
                </div>
              )}

              <div className="mt-10 flex flex-col-reverse justify-between gap-3 sm:flex-row">
                <button
                  className="rounded-md px-5 py-3 text-sm font-bold text-neutral-600 transition hover:bg-white"
                  disabled={step === 1}
                  onClick={() => setStep((current) => Math.max(1, current - 1))}
                  type="button"
                >
                  Vorige
                </button>
                {step < 5 ? (
                  <button
                    className="btn-primary disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:shadow-none"
                    disabled={!canContinue}
                    onClick={() => setStep((current) => current + 1)}
                    type="button"
                  >
                    Volgende
                  </button>
                ) : (
                  <button className="btn-primary disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:shadow-none" disabled={!canContinue} type="submit">
                    Verzend naar mijn verbouwconsulent
                  </button>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
