"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {Bricolage_Grotesque, Hanken_Grotesk} from "next/font/google";
import {trackLead} from "@/lib/analytics";
import {captureAttribution, getAttribution} from "@/lib/attribution";
import {lookupPdokAddress, normalizeDutchPostcode, type PdokAddress} from "@/lib/pdok";
import {
  DRAAGMUUR_DEFAULTS,
  draagmuurBreakdown,
  formatEuro,
  type DraagmuurFloor,
  type DraagmuurInput,
  type DraagmuurKind,
} from "@/lib/draagmuurPrice";
import {
  COMMON,
  DIMS_UNKNOWN,
  QUESTIONS,
  SERVICES,
  SERVICE_ICON,
  findServiceForQuestionId,
  formatDims,
  parseDim,
  serviceLabel,
  type QuestionDef,
  type QuestionOption,
} from "@/lib/serviceIntakeConfig";

const bricolage = Bricolage_Grotesque({subsets: ["latin"], weight: ["600", "700", "800"], variable: "--intake-font-display", display: "swap"});
const hanken = Hanken_Grotesk({subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--intake-font-body", display: "swap"});

const SERVICES_STEP: QuestionDef = {id: "services", t: "services", q: ""};

type Answers = Record<string, string | string[] | undefined>;

function optionLabel(o: QuestionOption): string {
  return typeof o === "string" ? o : o.l;
}
function optionDesc(o: QuestionOption): string | undefined {
  return typeof o === "string" ? undefined : o.d;
}
function optionStop(o: QuestionOption): string | undefined {
  return typeof o === "object" ? o.stop : undefined;
}
function optionBack(o: QuestionOption): boolean {
  return typeof o === "object" && Boolean(o.back);
}

// Foto's verkleinen in de browser (max 1600 px, JPEG), zodat zes foto's samen
// ruim onder de uploadlimiet blijven en ook op 4G snel verstuurd zijn.
const MAX_PHOTOS = 6;
async function compressPhoto(file: File): Promise<string | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return canvas.toDataURL("image/jpeg", 0.72);
  } catch {
    return null;
  }
}

// Lampje bij een tip (bijvoorbeeld korting bij meer werkzaamheden).
function LampIcon() {
  return (
    <svg aria-hidden="true" className="intake-lamp" fill="none" height="22" viewBox="0 0 24 24" width="22">
      <path className="intake-lamp-glass" d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V17h5.2v-1.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" />
      <path d="M9.6 19.5h4.8M10.4 21.5h3.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path className="intake-lamp-rays" d="M12 0.6v1.2M4.2 3.6l.9.9M19.8 3.6l-.9.9M1.2 10h1.2M21.6 10h1.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

// Bouwvakker op de voortgangsbalk: helm in de huisstijlkleur, hamer slaat kort
// bij elke nieuwe stap.
function WorkerIcon() {
  return (
    <svg fill="none" height="26" viewBox="0 0 26 26" width="26">
      <path d="M6.5 9.2a4.5 4.5 0 0 1 9 0v.6h-9z" fill="var(--intake-accent)" />
      <rect fill="var(--intake-accent-deep)" height="1.4" rx=".7" width="11" x="5.5" y="9.4" />
      <circle cx="11" cy="13.2" fill="#E9C9A8" r="2.6" />
      <path d="M6.8 25v-5.2a4.2 4.2 0 0 1 8.4 0V25" fill="currentColor" />
      <g className="intake-hammer">
        <path d="M14.6 18.2l4.6-4.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        <rect fill="#8a8a8a" height="3" rx=".6" transform="rotate(-46 20.6 11.6)" width="5.4" x="17.9" y="10.1" />
      </g>
    </svg>
  );
}

function HouseGoalIcon({done}: {done: boolean}) {
  return (
    <svg className={done ? "intake-house-done" : undefined} fill="none" height="24" viewBox="0 0 24 24" width="24">
      <path d="M3.5 11.2L12 4l8.5 7.2V20a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z" fill="currentColor" />
      <path d="M9.5 21v-5.5h5V21" fill="#fff" />
    </svg>
  );
}

// Budgetschuif: tot 150k per 5k. Met een hoger plafond (budgetCap) worden de
// stappen daarboven groter, zodat het gebied rond 50k tot 150k fijn blijft.
function budgetSteps(cap: number): number[] {
  const steps: number[] = [];
  for (let v = 0; v <= Math.min(cap, 150000); v += 5000) steps.push(v);
  for (let v = 175000; v <= Math.min(cap, 500000); v += 25000) steps.push(v);
  for (let v = 550000; v <= Math.min(cap, 1000000); v += 50000) steps.push(v);
  for (let v = 1100000; v <= cap; v += 100000) steps.push(v);
  return steps;
}

function nearestStep(steps: number[], value: number): number {
  let best = 0;
  steps.forEach((v, i) => {
    if (Math.abs(v - value) < Math.abs(steps[best] - value)) best = i;
  });
  return best;
}

function formatBudget(value: number, cap = 150000): string {
  if (value >= cap) return cap >= 1000000 ? `€${String(cap / 1000000).replace(".", ",")} mln+` : `€${cap / 1000}k+`;
  if (value <= 0) return "€0";
  if (value >= 1000000) return `€${String(value / 1000000).replace(".", ",")} mln`;
  return `€${value / 1000}k`;
}

function coachMessage(flow: QuestionDef[], idx: number): string {
  const def = flow[idx];
  if (!def || ["services", "thanks", "contact", "confirm"].includes(def.t)) return "";
  const total = flow.filter((f) => f.t !== "thanks").length;
  const n = idx + 1;
  const left = total - n;
  if (n === 2) return "We stellen alleen vragen die op u van toepassing zijn";
  if (left === 1) return "Nog één vraag en u bent klaar";
  if (left <= 3) return "Bijna klaar, nog een paar korte vragen";
  return "";
}

function CheckIcon({className}: {className?: string}) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BackIcon() {
  return (
    <svg fill="none" height="18" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width="18">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg fill="none" height="18" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width="18">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg fill="currentColor" height="13" viewBox="0 0 24 24" width="13">
      <path d="M12 2l3 6.9 7.5.6-5.7 5 1.7 7.4L12 18l-6.5 3.9 1.7-7.4-5.7-5 7.5-.6z" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg fill="none" height="17" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width="17">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
    </svg>
  );
}
function ShieldCheckIcon() {
  return (
    <svg fill="none" height="17" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width="17">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg fill="none" height="16" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect height="10" rx="2" width="16" x="4" y="10" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
function SealIcon() {
  return (
    <svg fill="none" height="32" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" width="32">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ServiceIcon({service}: {service: string}) {
  return (
    <svg fill="none" height="20" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" width="20" dangerouslySetInnerHTML={{__html: SERVICE_ICON[service] || ""}} />
  );
}

const inputClass = "intake-inp";

// Op een advertentiepagina staat de dienst al vast: dan slaan we de dienstkeuze
// over en laten we vragen weg die daar niets toevoegen (presetServices, skipIds).
export type SmartIntakeProps = {
  presetServices?: string[];
  skipIds?: string[];
  source?: "smart-intake" | "lp-totaalrenovatie" | "lp-draagmuur";
  variant?: string;
  responsePromise?: string;
  initialBudget?: [number, number];
  thanksLinks?: Array<{href: string; label: string}>;
  // Eerste stap aanpassen zonder de dienst vast te zetten: volgorde van de
  // diensten (de rest volgt in de standaardvolgorde), eigen kop en uitleg.
  serviceOrder?: string[];
  servicesTitle?: string;
  servicesSub?: string;
  // Startwaarde van de budgetschuif als er een groot project is gekozen.
  largeBudget?: [number, number];
  // Hoogste waarde op de budgetschuif (standaard 150.000).
  budgetCap?: number;
  largeServices?: string[];
};

function buildPresetFlow(presetServices: string[], skipIds: string[]): QuestionDef[] {
  const skip = new Set(skipIds);
  const questions = presetServices.flatMap((s) => QUESTIONS[s] || []);
  return [...questions, ...COMMON].filter((q) => !skip.has(q.id));
}

export default function SmartIntakeWizard({
  presetServices,
  skipIds = [],
  source = "smart-intake",
  variant,
  responsePromise = "binnen één werkdag",
  initialBudget,
  thanksLinks,
  serviceOrder,
  servicesTitle = "Waar kunnen we u mee helpen?",
  servicesSub = "Kies één of meer diensten. We stellen daarna alleen de vragen die voor u van toepassing zijn.",
  largeBudget,
  budgetCap = 150000,
  largeServices = ["Totaalrenovatie", "Aanbouw of opbouw"],
}: SmartIntakeProps = {}) {
  const skipSet = useMemo(() => new Set(skipIds), [skipIds]);
  const orderedServices = useMemo(
    () => (serviceOrder ? [...serviceOrder.filter((s) => SERVICES.includes(s)), ...SERVICES.filter((s) => !serviceOrder.includes(s))] : SERVICES),
    [serviceOrder],
  );
  const hasPreset = Boolean(presetServices && presetServices.length);
  const [services, setServices] = useState<string[]>(hasPreset ? (presetServices as string[]) : []);
  const [flow, setFlow] = useState<QuestionDef[]>(() =>
    hasPreset ? buildPresetFlow(presetServices as string[], skipIds) : [SERVICES_STEP, ...COMMON].filter((q) => !skipIds.includes(q.id)),
  );
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [dimInputs, setDimInputs] = useState<Record<string, Record<string, string>>>({});
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoBusy, setPhotoBusy] = useState(false);
  // Rekenmodule draagmuur (vraagtype "calc") en stopmelding bij "fit".
  const [calc, setCalc] = useState<DraagmuurInput>({
    kind: "volledig",
    width: DRAAGMUUR_DEFAULTS.volledig.width,
    thickness: 22,
    height: DRAAGMUUR_DEFAULTS.volledig.height,
    floor: "begane grond",
    finished: true,
    fireWrap: true,
  });
  const [stopMessage, setStopMessage] = useState<string | null>(null);
  const [company, setCompany] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const leadTrackedRef = useRef(false);
  const submitInFlightRef = useRef(false);

  const [budgetMin, setBudgetMin] = useState(initialBudget ? initialBudget[0] : 15000);
  const [budgetMax, setBudgetMax] = useState(initialBudget ? initialBudget[1] : 45000);
  const [budgetLabel, setBudgetLabel] = useState(
    initialBudget ? `${formatBudget(initialBudget[0])} – ${formatBudget(initialBudget[1])}` : "€15k – €45k",
  );

  // Herkomst vastleggen (campagne, zoekwoord). Op de landingspagina met variant.
  useEffect(() => {
    captureAttribution(variant);
  }, [variant]);

  const [postcodeInput, setPostcodeInput] = useState("");
  const [houseNumberInput, setHouseNumberInput] = useState("");
  const [addressStatus, setAddressStatus] = useState<"idle" | "searching" | "found" | "notfound">("idle");
  const [foundAddress, setFoundAddress] = useState<PdokAddress | null>(null);

  useEffect(() => {
    const normalizedPostcode = normalizeDutchPostcode(postcodeInput);
    if (!normalizedPostcode || !houseNumberInput.trim()) {
      setAddressStatus("idle");
      setFoundAddress(null);
      return;
    }

    setAddressStatus("searching");
    const timeout = setTimeout(async () => {
      const results = await lookupPdokAddress(postcodeInput, houseNumberInput);
      if (results.length > 0) {
        setFoundAddress(results[0]);
        setAddressStatus("found");
      } else {
        setFoundAddress(null);
        setAddressStatus("notfound");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [postcodeInput, houseNumberInput]);

  const total = useMemo(() => flow.filter((f) => f.t !== "thanks").length, [flow]);
  const current = flow[idx];
  const isThanks = current?.t === "thanks";

  function updateAnswer(id: string, value: string | string[]) {
    setAnswers((prev) => ({...prev, [id]: value}));
  }

  function go(n: number) {
    setIdx(Math.max(0, Math.min(flow.length - 1, n)));
  }
  function next() {
    go(idx + 1);
  }
  function goBack() {
    if (idx > 0) go(idx - 1);
  }

  function buildFlowAndStart() {
    const questions = services.flatMap((s) => QUESTIONS[s] || []);
    setFlow([SERVICES_STEP, ...questions, ...COMMON].filter((q) => !skipSet.has(q.id)));
    if (largeBudget) {
      const [min, max] = services.some((s) => largeServices.includes(s)) ? largeBudget : initialBudget || [15000, 45000];
      setBudgetMin(min);
      setBudgetMax(max);
      setBudgetLabel(`${formatBudget(min, budgetCap)} – ${formatBudget(max, budgetCap)}`);
    }
    go(1);
  }

  function toggleService(service: string) {
    setServices((prev) => (prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]));
  }

  function selectSingle(def: QuestionDef, option: QuestionOption) {
    if (def.t === "confirm" && optionBack(option)) {
      if (!hasPreset) go(0);
      return;
    }
    if (def.id === "dm1") {
      const label = optionLabel(option);
      const kind: DraagmuurKind = /deuropening/i.test(label) ? "deur" : /deels/i.test(label) ? "deels" : "volledig";
      setCalc((prev) => ({...prev, kind, ...DRAAGMUUR_DEFAULTS[kind]}));
    }
    if (def.t === "fit") {
      const price = draagmuurBreakdown(calc).totalIncl;
      const label = optionLabel(option);
      const stop = optionStop(option);
      updateAnswer(def.id, label);
      setBudgetMin(price);
      setBudgetMax(price);
      setBudgetLabel(`${stop ? "Lager dan" : label.startsWith("Mijn budget is hoger") ? "Hoger dan" : "Past bij"} indicatie ${formatEuro(price)} incl. btw`);
      if (stop) {
        setStopMessage(stop);
        return;
      }
      setStopMessage(null);
      window.setTimeout(next, 300);
      return;
    }
    updateAnswer(def.id, optionLabel(option));
    window.setTimeout(next, 300);
  }

  function calcSummary(): string {
    const b = draagmuurBreakdown(calc);
    const kindLabel = calc.kind === "deur" ? "Deuropening" : calc.kind === "deels" ? "Draagmuur deels weg" : "Draagmuur helemaal weg";
    const fmt = (n: number) => n.toLocaleString("nl-NL", {maximumFractionDigits: 2});
    return [
      kindLabel,
      `opening ${fmt(calc.width)} m`,
      `muur ${calc.thickness} cm`,
      `hoogte ${fmt(calc.height)} m`,
      calc.floor,
      calc.finished ? "afgewerkt" : "casco",
      `ligger brandwerend bekleden: ${calc.fireWrap ? "door DRO" : "doet klant of eigen aannemer (klant gewaarschuwd)"}`,
      `complexiteit ${String(b.factor).replace(".", ",")}${b.reasons.length ? ` (${b.reasons.join(", ")})` : ""}`,
      `indicatie ${formatEuro(b.totalEx)} excl. / ${formatEuro(b.totalIncl)} incl. btw${b.wide ? " (breed: staal apart calculeren)" : ""}`,
    ].join(" · ");
  }

  function confirmCalc(def: QuestionDef) {
    updateAnswer(def.id, calcSummary());
    next();
  }

  function toggleMulti(def: QuestionDef, option: string) {
    const current = (answers[def.id] as string[] | undefined) || [];
    let nextValue = current.includes(option) ? current.filter((v) => v !== option) : [...current, option];
    // "Nee, alleen ..." sluit de andere keuzes uit, en andersom.
    if (def.none && !current.includes(option)) {
      nextValue = option === def.none ? [option] : nextValue.filter((v) => v !== def.none);
    }
    updateAnswer(def.id, nextValue);
  }

  function confirmAddress() {
    updateAnswer("pc", postcodeInput.trim());
    updateAnswer("hn", houseNumberInput.trim());
    if (foundAddress) {
      updateAnswer("address", `${foundAddress.street} ${foundAddress.houseNumber}, ${foundAddress.city}`);
      updateAnswer("city", foundAddress.city);
    }
    next();
  }

  function primaryLabel(): string {
    if (!services.length) return "uw project";
    const s = services[0];
    if (s === "Iets anders") return "uw project";
    return serviceLabel(s).toLowerCase();
  }

  async function handleSubmit() {
    // Snel dubbelklikken mag nooit twee aanvragen versturen: state is te traag.
    if (submitInFlightRef.current) return;
    submitInFlightRef.current = true;
    setSubmitting(true);
    setSubmitError(false);

    const serviceAnswers = services.map((service) => {
      const questions = QUESTIONS[service] || [];
      const qa = questions
        .filter((q) => q.t !== "confirm" && answers[q.id])
        .map((q) => ({
          question: q.q,
          answer: Array.isArray(answers[q.id]) ? (answers[q.id] as string[]).join(", ") : (answers[q.id] as string),
        }));
      return {service: serviceLabel(service), answers: qa};
    });

    const attribution = getAttribution();

    try {
      const res = await fetch("/api/submit-request", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          company,
          name: answers.nm,
          email: answers.em,
          phone: answers.ph,
          services: services.map(serviceLabel),
          postcode: answers.pc,
          houseNumber: answers.hn,
          address: answers.address,
          location: answers.city,
          fundaUrl: answers.funda,
          timeline: answers.plan,
          budgetMin: budgetLabel === "Weet ik nog niet" ? undefined : budgetMin,
          budgetMax: budgetLabel === "Weet ik nog niet" ? undefined : budgetMax,
          budgetLabel,
          hoeGevonden: answers.found || (source.startsWith("lp-") ? "Advertentie (landingspagina)" : undefined),
          message: answers.more,
          serviceAnswers,
          photos: photos.map((p) => p.replace(/^data:image\/jpeg;base64,/, "")),
          source,
          attribution,
        }),
      });

      if (!res.ok) throw new Error("Submit failed");
      if (!leadTrackedRef.current) {
        leadTrackedRef.current = true;
        trackLead();
      }
      setSubmitting(false);
      next();
    } catch {
      submitInFlightRef.current = false;
      setSubmitting(false);
      setSubmitError(true);
    }
  }

  function renderHeader(def: QuestionDef, eyebrow: string) {
    const coach = coachMessage(flow, idx);
    return (
      <>
        {coach ? (
          <div className="intake-coach">
            <span className="intake-coach-dot" />
            {coach}
          </div>
        ) : null}
        {eyebrow ? <div className="intake-eyebrow">{eyebrow}</div> : null}
        <h1 className="intake-h1">{def.q}</h1>
        {def.s ? <p className="intake-sub">{def.s}</p> : null}
      </>
    );
  }

  function renderOptions(def: QuestionDef) {
    return (
      <div className="intake-opts">
        {(def.o || []).map((o) => {
          const label = optionLabel(o);
          const desc = optionDesc(o);
          const selected = answers[def.id] === label;
          return (
            <button className={`intake-opt${selected ? " intake-sel" : ""}`} key={label} onClick={() => selectSingle(def, o)} type="button">
              <span className="intake-opt-lab">
                <span className="intake-opt-t">{label}</span>
                {desc ? <span className="intake-opt-d">{desc}</span> : null}
              </span>
              <span className="intake-opt-rc">
                <CheckIcon className={selected ? "intake-check-on" : "intake-check-off"} />
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  function renderMultiOptions(def: QuestionDef) {
    const selectedValues = (answers[def.id] as string[] | undefined) || [];
    return (
      <div className="intake-opts">
        {def.hint ? (
          <div aria-live="polite" className={`intake-hint${selectedValues.some((v) => v !== def.none) ? " intake-hint-on" : ""}`}>
            <LampIcon />
            <span>{def.hint}</span>
          </div>
        ) : null}
        {(def.o || []).map((o) => {
          const label = optionLabel(o);
          const selected = selectedValues.includes(label);
          return (
            <button className={`intake-opt${selected ? " intake-sel" : ""}`} key={label} onClick={() => toggleMulti(def, label)} type="button">
              <span className="intake-opt-lab">
                <span className="intake-opt-t">{label}</span>
              </span>
              <span className="intake-opt-rc">
                <CheckIcon className={selected ? "intake-check-on" : "intake-check-off"} />
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  function renderServicesScreen() {
    return (
      <>
        <div className="intake-eyebrow">Uw project</div>
        <h1 className="intake-h1">{servicesTitle}</h1>
        <p className="intake-sub">{servicesSub}</p>
        <div className="intake-sp">
          <span className="intake-stars">
            <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
          </span>
          <span>
            <b>4.8</b> uit 273 reviews, huiseigenaren in de regio gingen u voor
          </span>
        </div>
        <div className="intake-grid">
          {orderedServices.map((service) => {
            const selected = services.includes(service);
            const wide = service === "Iets anders";
            return (
              <button
                className={`intake-tile${wide ? " intake-tile-wide" : ""}${selected ? " intake-sel" : ""}`}
                key={service}
                onClick={() => toggleService(service)}
                type="button"
              >
                <span className="intake-tile-ic">
                  <ServiceIcon service={service} />
                </span>
                <span className="intake-tile-t">{serviceLabel(service)}</span>
                <span className="intake-tile-chk">
                  <CheckIcon className={selected ? "intake-check-on" : "intake-check-off"} />
                </span>
              </button>
            );
          })}
        </div>
      </>
    );
  }

  function renderSeg<T extends string | boolean>(label: string, value: T, options: Array<{v: T; l: string}>, onPick: (v: T) => void) {
    return (
      <div className="intake-field">
        <label>{label}</label>
        <div className="intake-seg" role="group">
          {options.map((o) => (
            <button aria-pressed={value === o.v} className={value === o.v ? "intake-seg-on" : undefined} key={String(o.v)} onClick={() => onPick(o.v)} type="button">
              {o.l}
            </button>
          ))}
        </div>
      </div>
    );
  }

  function renderSlider(label: string, value: number, min: number, max: number, step: number, unit: string, onChange: (v: number) => void) {
    const shown = value.toLocaleString("nl-NL", {maximumFractionDigits: 2});
    return (
      <div className="intake-field">
        <label className="intake-range-l">
          <span>{label}</span>
          <b>
            {shown} {unit}
          </b>
        </label>
        <input
          aria-label={label}
          className="intake-range"
          max={max}
          min={min}
          onChange={(e) => onChange(Number(e.target.value))}
          step={step}
          style={{"--intake-fill": `${((value - min) / (max - min)) * 100}%`} as React.CSSProperties}
          type="range"
          value={value}
        />
      </div>
    );
  }

  function renderCalcScreen(def: QuestionDef) {
    const b = draagmuurBreakdown(calc);
    const set = (patch: Partial<DraagmuurInput>) => setCalc((prev) => ({...prev, ...patch}));
    return (
      <>
        {renderHeader(def, "Prijsindicatie")}
        <p className="intake-pricechip" aria-hidden="true">
          Indicatie nu: <b>{formatEuro(b.totalIncl)}</b> incl. btw
        </p>
        {renderSeg<DraagmuurKind>("Wat gaat eruit?", calc.kind, [
          {v: "deur", l: "Deuropening"},
          {v: "deels", l: "Deels"},
          {v: "volledig", l: "Hele muur"},
        ], (kind) => set({kind, ...DRAAGMUUR_DEFAULTS[kind]}))}
        {renderSlider("Hoe breed wordt de doorbraak?", calc.width, 0.6, 8, 0.1, "m", (width) => set({width}))}
        {renderSlider("Hoe hoog wordt de doorbraak?", calc.height, 1.8, 3.6, 0.05, "m", (height) => set({height}))}
        {renderSlider("Hoe dik is de muur?", calc.thickness, 10, 40, 1, "cm", (thickness) => set({thickness}))}
        {renderSeg<DraagmuurFloor>("Waar zit de muur?", calc.floor, [
          {v: "begane grond", l: "Begane grond"},
          {v: "verdieping", l: "Verdieping"},
          {v: "appartement", l: "Appartement"},
        ], (floor) => set({floor}))}
        {renderSeg<boolean>("Hoe wilt u het opgeleverd?", calc.finished, [
          {v: true, l: "Afgewerkt"},
          {v: false, l: "Casco"},
        ], (finished) => set({finished}))}
        <p className="intake-dimprev" style={{marginTop: -8, marginBottom: 14}}>
          {calc.finished ? "Afgewerkt: inclusief basisafwerking van de opening." : "Casco: alleen de constructieve doorbraak, u of een ander werkt af."}
        </p>
        {renderSeg<boolean>("Wie bekleedt de stalen ligger brandwerend?", calc.fireWrap, [
          {v: true, l: "DRO"},
          {v: false, l: "Wij of onze aannemer"},
        ], (fireWrap) => set({fireWrap}))}
        {!calc.fireWrap ? (
          <div className="intake-warn" role="note">
            <b>Let op.</b> Een stalen ligger moet na het plaatsen brandwerend worden bekleed, bijvoorbeeld met Promatect-platen. Zorg dat
            u of uw aannemer dit goed laat uitvoeren, ook voor de vergunning, uw garantie en uw verzekering. Brengt DRO de bekleding niet
            aan, dan is DRO niet verantwoordelijk voor de brandwerendheid van de ligger.
          </div>
        ) : (
          <p className="intake-dimprev" style={{marginTop: -8, marginBottom: 14}}>
            Wij bekleden de ligger na plaatsing brandwerend, bijvoorbeeld met Promatect-platen. Dit staat als losse post in uw indicatie.
          </p>
        )}
        <div className="intake-price" aria-live="polite">
          <span className="intake-price-l">Uw indicatie, inclusief btw</span>
          <span className="intake-price-v">{formatEuro(b.totalIncl)}</span>
          <span className="intake-price-s" style={{marginTop: 6}}>Opbouw, excl. btw</span>
          <dl className="intake-price-rows">
            <dt>Slopen en afvoeren</dt>
            <dd>{formatEuro(b.demolition)}</dd>
            <dt>Stempelen</dt>
            <dd>{formatEuro(b.shoring)}</dd>
            <dt>Stalen ligger</dt>
            <dd>{formatEuro(b.steel)}</dd>
            <dt>Constructieberekening</dt>
            <dd>{formatEuro(b.engineering)}</dd>
            {b.finishing ? (
              <>
                <dt>Basisafwerking</dt>
                <dd>{formatEuro(b.finishing)}</dd>
              </>
            ) : null}
            {b.fireCladding ? (
              <>
                <dt>Brandwerende bekleding ligger</dt>
                <dd>{formatEuro(b.fireCladding)}</dd>
              </>
            ) : null}
            {b.factor > 1 ? (
              <>
                <dt>Complexiteit ({b.reasons.join(", ")})</dt>
                <dd>x {String(b.factor).replace(".", ",")}</dd>
              </>
            ) : null}
            <dt>Totaal excl. btw</dt>
            <dd>{formatEuro(b.totalEx)}</dd>
          </dl>
          <span className="intake-price-s">
            Inclusief constructieberekening, vergunningsaanvraag, stempelen, stalen ligger, sloop, container en afvoer. Leges van de
            gemeente apart. Na de opname krijgt u een vaste prijs.
          </span>
          {b.wide ? (
            <span className="intake-price-s" style={{color: "#ffd6b8"}}>
              Bij een doorbraak van deze breedte rekent de constructeur de staalconstructie apart door. De prijs kan dan hoger uitvallen.
            </span>
          ) : null}
        </div>
      </>
    );
  }

  function renderFitScreen(def: QuestionDef) {
    const price = draagmuurBreakdown(calc).totalIncl;
    return (
      <>
        {renderHeader(def, "Budget")}
        <p className="intake-dimprev" style={{marginTop: -4, marginBottom: 12}}>
          Uw indicatie: <b>{formatEuro(price)}</b> inclusief btw.
        </p>
        {renderOptions(def)}
        {stopMessage ? (
          <div className="intake-stop" role="alert">
            <p>{stopMessage}</p>
            <button
              className="intake-btn"
              onClick={() => {
                updateAnswer(def.id, "Budget lager dan indicatie, kan mogelijk omhoog");
                setStopMessage(null);
                next();
              }}
              type="button"
            >
              Mijn budget kan omhoog, verder <ArrowIcon />
            </button>
          </div>
        ) : null}
      </>
    );
  }

  function dimsComplete(def: QuestionDef): boolean {
    const values = dimInputs[def.id] || {};
    return (def.f || []).every((field) => field.opt || parseDim(values[field.k] || "") !== null) &&
      (def.f || []).some((field) => parseDim(values[field.k] || "") !== null);
  }

  function confirmDims(def: QuestionDef) {
    updateAnswer(def.id, formatDims(def, dimInputs[def.id] || {}));
    next();
  }

  function skipDims(def: QuestionDef) {
    updateAnswer(def.id, DIMS_UNKNOWN);
    next();
  }

  function renderDimsScreen(def: QuestionDef) {
    const values = dimInputs[def.id] || {};
    const fields = def.f || [];
    const preview = formatDims(def, values);
    return (
      <>
        {renderHeader(def, serviceLabel(findServiceForQuestionId(def.id) || "") || "Maten")}
        <div className={fields.length > 1 ? "intake-dims" : undefined}>
          {fields.map((field) => (
            <div className="intake-field" key={field.k}>
              <label>
                {field.l} {field.opt ? <span className="intake-optnl">(optioneel)</span> : null}
              </label>
              <div className="intake-unitwrap">
                <input
                  className={inputClass}
                  inputMode="decimal"
                  onChange={(e) =>
                    setDimInputs((prev) => ({...prev, [def.id]: {...(prev[def.id] || {}), [field.k]: e.target.value.replace(/[^\d.,]/g, "")}}))
                  }
                  placeholder={field.ph}
                  value={values[field.k] || ""}
                />
                <span className="intake-unit">{field.unit}</span>
              </div>
            </div>
          ))}
        </div>
        {preview ? <p className="intake-dimprev">{preview}</p> : null}
      </>
    );
  }

  async function addPhotos(files: FileList | null) {
    if (!files || !files.length) return;
    setPhotoBusy(true);
    const room = MAX_PHOTOS - photos.length;
    const picked = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, Math.max(0, room));
    const compressed = (await Promise.all(picked.map(compressPhoto))).filter((x): x is string => Boolean(x));
    setPhotos((prev) => [...prev, ...compressed].slice(0, MAX_PHOTOS));
    setPhotoBusy(false);
  }

  function renderPhotosScreen(def: QuestionDef) {
    return (
      <>
        {renderHeader(def, "Foto's")}
        <div className="intake-photos">
          {photos.map((src, i) => (
            <div className="intake-photo" key={src.slice(-24) + i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={`Foto ${i + 1}`} src={src} />
              <button aria-label={`Foto ${i + 1} verwijderen`} onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))} type="button">
                &times;
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS ? (
            <label className="intake-photo-add">
              <input accept="image/*" multiple onChange={(e) => { void addPhotos(e.target.files); e.target.value = ""; }} type="file" />
              <span>{photoBusy ? "Bezig..." : "+ Foto toevoegen"}</span>
            </label>
          ) : null}
        </div>
        <p className="intake-dimprev">Bijvoorbeeld de ruimte vanuit twee hoeken, de meterkast of de plek van de uitbouw.</p>
      </>
    );
  }

  function renderAddressScreen(def: QuestionDef) {
    return (
      <>
        {renderHeader(def, "Locatie")}
        <div className="intake-row2">
          <div className="intake-field">
            <label>Postcode</label>
            <input className={inputClass} onChange={(e) => setPostcodeInput(e.target.value)} placeholder="2516 AH" value={postcodeInput} />
          </div>
          <div className="intake-field">
            <label>Huisnr.</label>
            <input className={inputClass} onChange={(e) => setHouseNumberInput(e.target.value)} placeholder="235" value={houseNumberInput} />
          </div>
        </div>

        {addressStatus === "found" && foundAddress ? (
          <div className="intake-found">
            <CheckIcon className="intake-found-check" />
            <div>
              <div style={{fontWeight: 600}}>
                {foundAddress.street} {foundAddress.houseNumber}, {foundAddress.city}
              </div>
              <div style={{fontSize: "12.5px", opacity: 0.8}}>Klopt dat?</div>
            </div>
          </div>
        ) : null}
        {addressStatus === "notfound" ? (
          <p className="intake-sub" style={{marginTop: 10, marginBottom: 0}}>
            We konden dit adres niet automatisch vinden. Geen probleem, u kunt gewoon doorgaan.
          </p>
        ) : null}

        <div className="intake-field" style={{marginTop: 14}}>
          <label>
            Funda-link <span className="intake-optnl">(optioneel)</span>
          </label>
          <input
            className={inputClass}
            onChange={(e) => updateAnswer("funda", e.target.value)}
            placeholder="Plak de Funda-link als u die heeft"
            value={(answers.funda as string) || ""}
          />
        </div>
        <div className="intake-note">
          <InfoIcon />
          Een Funda-link geeft ons in één klik de plattegronden en maten, zo denken we sneller mee.
        </div>
      </>
    );
  }

  function renderBudgetScreen(def: QuestionDef) {
    const steps = budgetSteps(budgetCap);
    const top = steps.length - 1;
    const minIdx = nearestStep(steps, budgetMin);
    const maxIdx = nearestStep(steps, budgetMax);
    function handleRange(which: "min" | "max", idx: number) {
      const value = steps[idx];
      let mn = which === "min" ? value : budgetMin;
      let mx = which === "max" ? value : budgetMax;
      if (mn > mx) {
        if (which === "min") mn = mx;
        else mx = mn;
      }
      setBudgetMin(mn);
      setBudgetMax(mx);
      setBudgetLabel(`${formatBudget(mn, budgetCap)} – ${formatBudget(mx, budgetCap)}`);
    }

    const fillLeft = (minIdx / top) * 100;
    const fillWidth = ((maxIdx - minIdx) / top) * 100;

    return (
      <>
        {renderHeader(def, "Budget")}
        <div className="intake-rvals">
          <div>
            <div className="intake-rvals-l">Minimum</div>
            <div className="intake-rvals-b">{formatBudget(budgetMin, budgetCap)}</div>
          </div>
          <div style={{textAlign: "right"}}>
            <div className="intake-rvals-l">Maximum</div>
            <div className="intake-rvals-b">{formatBudget(budgetMax, budgetCap)}</div>
          </div>
        </div>
        <div className="intake-slider">
          <div className="intake-slider-base" />
          <div className="intake-slider-fill" style={{left: `${fillLeft}%`, width: `${fillWidth}%`}} />
          <input max={top} min={0} onChange={(e) => handleRange("min", Number(e.target.value))} step={1} type="range" value={minIdx} />
          <input max={top} min={0} onChange={(e) => handleRange("max", Number(e.target.value))} step={1} type="range" value={maxIdx} />
        </div>
        <div className="intake-rscale">
          <span>€0</span>
          <span>{formatBudget(budgetCap, budgetCap)}</span>
        </div>
        <button
          className="intake-unsure"
          onClick={() => {
            setBudgetLabel("Weet ik nog niet");
            next();
          }}
          type="button"
        >
          Weet ik nog niet
        </button>
      </>
    );
  }

  function renderSummaryScreen() {
    type Row = {label: string; val: string; to: number};
    const rows: Row[] = [{label: "Wat we voor u doen", val: services.map(serviceLabel).join(", "), to: hasPreset ? -1 : 0}];

    for (let i = hasPreset ? 0 : 1; i < idx; i++) {
      const d = flow[i];
      if (d.t === "confirm" || d.t === "services") continue;
      let val = "";
      if (d.id === "loc") val = (answers.address as string) || `${answers.pc || ""} ${answers.hn || ""}`.trim();
      else if (d.id === "budget") val = budgetLabel;
      else if (d.t === "multi") val = ((answers[d.id] as string[]) || []).join(", ");
      else if (d.t === "photos") val = photos.length ? `${photos.length} foto${photos.length === 1 ? "" : "'s"}` : "";
      else val = (answers[d.id] as string) || "";
      if (!val) continue;
      if (val.length > 60) val = `${val.slice(0, 60)}...`;
      rows.push({label: d.q, val, to: i});
    }

    return (
      <>
        <div className="intake-eyebrow">Overzicht</div>
        <h1 className="intake-h1">Klopt dit zo?</h1>
        <p className="intake-sub">Dit is uw aanvraag in het kort. Tik op een regel om iets aan te passen.</p>
        <div className="intake-sum">
          {rows.map((r) =>
            r.to < 0 ? (
              <div className="intake-sum-row" key={r.label} style={{cursor: "default"}}>
                <span className="intake-sr-l">{r.label}</span>
                <span className="intake-sr-v">{r.val}</span>
              </div>
            ) : (
              <button className="intake-sum-row" key={r.label} onClick={() => go(r.to)} type="button">
                <span className="intake-sr-l">{r.label}</span>
                <span className="intake-sr-v">{r.val}</span>
                <span className="intake-sr-e">wijzig</span>
              </button>
            ),
          )}
        </div>
        <div className="intake-assure">
          <LockIcon />
          Uw gegevens en plannen behandelen we vertrouwelijk. We delen ze met niemand.
        </div>
      </>
    );
  }

  function renderTrustStrip() {
    return (
      <div className="intake-tstrip">
        <span className="intake-tstrip-c">VLOK-erkend</span>
        <span className="intake-tstrip-c">VCA</span>
        <span className="intake-tstrip-c">Verzekerd</span>
        <span className="intake-tstrip-rate">
          <span className="intake-stars">
            <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
          </span>
          <b>4.8</b> uit 273 reviews
        </span>
      </div>
    );
  }

  function renderContactScreen() {
    const canSubmit = Boolean((answers.nm as string)?.trim() && (answers.em as string)?.trim() && (answers.ph as string)?.trim()) && !submitting;
    return (
      <>
        <div className="intake-eyebrow">Voor {primaryLabel()}</div>
        <h1 className="intake-h1">Waar mogen we uw plan naartoe sturen?</h1>
        <p className="intake-sub">
          U bent klaar. Uw aanvraag komt direct bij Therab en het team terecht, wij nemen {responsePromise} persoonlijk contact met u op.
        </p>
        <div className="intake-field">
          <label>Naam</label>
          <input autoComplete="name" className={inputClass} onChange={(e) => updateAnswer("nm", e.target.value)} placeholder="Uw naam" value={(answers.nm as string) || ""} />
        </div>
        <div className="intake-field">
          <label>E-mail</label>
          <input autoComplete="email" className={inputClass} onChange={(e) => updateAnswer("em", e.target.value)} placeholder="u@email.nl" type="email" value={(answers.em as string) || ""} />
        </div>
        <div className="intake-field">
          <label>Telefoon</label>
          <input autoComplete="tel" className={inputClass} onChange={(e) => updateAnswer("ph", e.target.value)} placeholder="06 ..." type="tel" value={(answers.ph as string) || ""} />
        </div>

        {/* Honeypot: onzichtbaar voor bezoekers, bots vullen doorgaans elk veld. */}
        <div aria-hidden="true" style={{position: "absolute", left: -9999, top: 0, height: 0, width: 0, overflow: "hidden"}}>
          <label htmlFor="company">Bedrijf</label>
          <input autoComplete="off" id="company" name="company" onChange={(e) => setCompany(e.target.value)} tabIndex={-1} type="text" value={company} />
        </div>

        <div className="intake-note">
          <ShieldCheckIcon />U zit nergens aan vast. Volledig vrijblijvend, en uw gegevens blijven vertrouwelijk.
        </div>
        {submitError ? (
          <p className="intake-sub" style={{color: "var(--intake-accent-deep)", marginTop: 10}}>
            Er ging iets mis bij het versturen. Probeer het nog eens, of bel of WhatsApp ons op 085 087 1814.
          </p>
        ) : null}
        {renderTrustStrip()}
        <div className="intake-foot-inline">
          <button className="intake-btn" disabled={!canSubmit} onClick={handleSubmit} type="button">
            {submitting ? "Bezig…" : "Mijn aanvraag versturen"} <ArrowIcon />
          </button>
        </div>
      </>
    );
  }

  function renderThanksScreen() {
    const firstName = ((answers.nm as string) || "").split(" ")[0];
    return (
      <div className="intake-ty">
        <div className="intake-seal">
          <SealIcon />
        </div>
        <h1 className="intake-h1">Bedankt{firstName ? `, ${firstName}` : ""}!</h1>
        <p>
          We hebben uw aanvraag voor {primaryLabel()} ontvangen. Wij nemen {responsePromise} persoonlijk contact met u op.
        </p>
        <div className="intake-ns">
          <div className="intake-ns-h">Wat er nu gebeurt</div>
          <div className="intake-ns-r">
            <span className="intake-ns-n">1</span>
            <span className="intake-ns-tx">
              <b>Therab of een collega neemt {responsePromise} contact op</b>, per telefoon, e-mail of WhatsApp.
            </span>
          </div>
          <div className="intake-ns-r">
            <span className="intake-ns-n">2</span>
            <span className="intake-ns-tx">
              <b>Een persoonlijk adviesgesprek</b>, online of bij ons op kantoor in Den Haag, om uw plannen door te nemen.
            </span>
          </div>
          <div className="intake-ns-r">
            <span className="intake-ns-n">3</span>
            <span className="intake-ns-tx">
              <b>Een heldere, vaste prijsopgave.</b> Geen verrassingen, en u betaalt per afgeronde fase.
            </span>
          </div>
        </div>
        <div className="intake-sel-note">
          We nemen bewust een beperkt aantal projecten tegelijk aan, zodat elk project de aandacht en het vakmanschap krijgt dat het verdient.
        </div>
        {thanksLinks && thanksLinks.length ? (
          <div className="intake-more">
            <div className="intake-ns-h">Leer ons alvast beter kennen</div>
            <p className="intake-more-tx">Terwijl u op ons belletje wacht: bekijk wie we zijn, wat we gebouwd hebben en hoe we werken.</p>
            <div className="intake-more-links">
              {thanksLinks.map((link, i) => (
                <a className={`intake-more-a${i === 0 ? " intake-more-a1" : ""}`} href={link.href} key={link.href}>
                  {link.label} <ArrowIcon />
                </a>
              ))}
            </div>
          </div>
        ) : null}
        <p style={{marginTop: 18, fontSize: "13.5px", color: "var(--intake-ink-3)"}}>Tot snel, Therab en het team van DRO.</p>
      </div>
    );
  }

  function renderScreen() {
    if (!current) return null;
    if (current.t === "services") return renderServicesScreen();
    if (current.t === "single" || current.t === "confirm") return <>{renderHeader(current, current.t === "confirm" ? "Even bevestigen" : serviceLabel(findServiceForQuestionId(current.id) || "") || "Uw aanvraag")}{renderOptions(current)}</>;
    if (current.t === "multi") return <>{renderHeader(current, serviceLabel(findServiceForQuestionId(current.id) || "") || "Uw aanvraag")}{renderMultiOptions(current)}</>;
    if (current.t === "text") {
      return (
        <>
          {renderHeader(current, serviceLabel(findServiceForQuestionId(current.id) || "") || "Uw aanvraag")}
          <div className="intake-field">
            <textarea
              className="intake-ta"
              onChange={(e) => updateAnswer(current.id, e.target.value)}
              placeholder={current.ph}
              value={(answers[current.id] as string) || ""}
            />
          </div>
        </>
      );
    }
    if (current.t === "calc") return renderCalcScreen(current);
    if (current.t === "fit") return renderFitScreen(current);
    if (current.t === "dims") return renderDimsScreen(current);
    if (current.t === "photos") return renderPhotosScreen(current);
    if (current.t === "address") return renderAddressScreen(current);
    if (current.t === "budget") return renderBudgetScreen(current);
    if (current.t === "summary") return renderSummaryScreen();
    if (current.t === "contact") return renderContactScreen();
    if (current.t === "thanks") return renderThanksScreen();
    return null;
  }

  function showsFooterButton(): {label: string; onClick: () => void; disabled: boolean} | null {
    if (!current) return null;
    if (current.t === "services") return {label: "Verder", onClick: buildFlowAndStart, disabled: services.length === 0};
    if (current.t === "multi") return {label: "Verder", onClick: next, disabled: !((answers[current.id] as string[] | undefined)?.length)};
    if (current.t === "text") return {label: "Verder", onClick: next, disabled: false};
    if (current.t === "dims") {
      const def = current;
      return {label: "Verder", onClick: () => confirmDims(def), disabled: !dimsComplete(def)};
    }
    if (current.t === "photos") return {label: photos.length ? "Verder" : "Verder zonder foto's", onClick: next, disabled: photoBusy};
    if (current.t === "calc") {
      const def = current;
      return {label: "Verder", onClick: () => confirmCalc(def), disabled: false};
    }
    if (current.t === "address") return {label: "Verder", onClick: confirmAddress, disabled: !(postcodeInput.trim() && houseNumberInput.trim())};
    if (current.t === "budget") return {label: "Verder", onClick: next, disabled: false};
    if (current.t === "summary") return {label: "Alles klopt, verder", onClick: next, disabled: false};
    return null;
  }

  const footerButton = showsFooterButton();
  const showSkip = current?.t === "text" && current.optional;
  // Voortgang zonder stapnummers: een bouwfase en een schatting van de tijd die
  // nog rest. Op de eerste stap ligt het aantal vragen nog niet vast, dus daar
  // een vaste startwaarde (anders springt de balk terug na de dienstkeuze).
  const percent = current?.t === "services" ? 6 : total > 0 ? Math.max(8, Math.round((Math.min(idx + 1, total) / total) * 100)) : 0;
  const stepsLeft = Math.max(0, total - (idx + 1));
  const phase =
    percent < 25 ? "Fundering" : percent < 50 ? "Ruwbouw" : percent < 75 ? "Afbouw" : stepsLeft > 1 ? "Bijna opgeleverd" : "Laatste stap";
  const timeLeft =
    current?.t === "services"
      ? "duurt ongeveer 2 minuten"
      : stepsLeft * 7 >= 90
        ? "nog ongeveer 2 minuten"
        : stepsLeft * 7 >= 40
          ? "nog ongeveer 1 minuut"
          : stepsLeft > 0
            ? "nog even"
            : "dan is het klaar";

  return (
    <div className={`intake-widget ${bricolage.variable} ${hanken.variable}`}>
      <style jsx global>{`
        .intake-widget {
          --intake-bg: #ffffff;
          --intake-ink: #111111;
          --intake-ink-2: #454545;
          --intake-ink-3: #6e6e6e;
          --intake-line: #e7e7e7;
          --intake-line-2: #dbdbdb;
          --intake-sand: #f4f3f1;
          --intake-accent: #e85a26;
          --intake-accent-deep: #c6471a;
          --intake-accent-tint: #fceee6;
          --intake-good: #2e7d50;
          --intake-fd: var(--intake-font-display), system-ui, sans-serif;
          --intake-fb: var(--intake-font-body), system-ui, -apple-system, sans-serif;
          font-family: var(--intake-fb);
          color: var(--intake-ink);
        }
        .intake-card {
          width: 100%;
          max-width: 460px;
          margin: 0 auto;
          background: var(--intake-bg);
          border-radius: 26px;
          overflow: hidden;
          border: 1px solid #e4e2de;
          box-shadow: 0 2px 6px rgba(17, 17, 17, 0.05), 0 24px 60px rgba(17, 17, 17, 0.13);
          display: flex;
          flex-direction: column;
          height: 660px;
          max-height: 85vh;
        }
        .intake-top {
          padding: 18px 22px 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--intake-bg);
        }
        .intake-brand {
          font-family: var(--intake-fd);
          font-weight: 700;
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--intake-ink);
        }
        .intake-brand-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--intake-accent);
          box-shadow: 0 0 0 4px var(--intake-accent-tint);
        }
        .intake-back {
          margin-left: auto;
          appearance: none;
          border: 1px solid var(--intake-line-2);
          background: var(--intake-bg);
          width: 38px;
          height: 38px;
          border-radius: 11px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--intake-ink-2);
        }
        .intake-back:hover {
          background: var(--intake-sand);
        }
        .intake-prog {
          padding: 0 22px 14px;
          background: var(--intake-bg);
        }
        .intake-prog-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12.5px;
          font-weight: 500;
          color: var(--intake-ink-3);
          margin-bottom: 6px;
        }
        .intake-prog-meta b {
          color: var(--intake-ink);
          font-weight: 700;
        }
        .intake-build {
          position: relative;
          padding: 22px 30px 0 0;
        }
        .intake-track {
          height: 6px;
          border-radius: 99px;
          background: repeating-linear-gradient(90deg, #ececec 0 10px, #e2e2e2 10px 12px);
          overflow: hidden;
        }
        .intake-worker {
          position: absolute;
          bottom: 2px;
          width: 26px;
          height: 26px;
          margin-left: -16px;
          transition: left 0.45s cubic-bezier(0.4, 0, 0.1, 1);
          color: var(--intake-ink);
        }
        .intake-worker svg {
          display: block;
        }
        .intake-worker .intake-hammer {
          transform-origin: 15px 13px;
          animation: intakeHammer 0.5s ease-in-out 3;
        }
        .intake-worker {
          animation: intakeHop 0.5s ease-out 1;
        }
        @keyframes intakeHammer {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-38deg);
          }
        }
        @keyframes intakeHop {
          0% {
            transform: translateY(0);
          }
          35% {
            transform: translateY(-4px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .intake-house {
          position: absolute;
          right: 0;
          bottom: -3px;
          width: 24px;
          height: 24px;
          color: #c9c9c9;
        }
        .intake-house-done {
          color: var(--intake-accent);
        }
        @media (prefers-reduced-motion: reduce) {
          .intake-worker,
          .intake-worker .intake-hammer {
            animation: none;
          }
          .intake-worker,
          .intake-bar {
            transition: none;
          }
        }
        .intake-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--intake-accent), #f0793f);
          border-radius: 99px;
          transition: width 0.45s cubic-bezier(0.4, 0, 0.1, 1);
        }
        .intake-screen {
          flex: 1 1 auto;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: 6px 22px 26px;
          background: var(--intake-bg);
        }
        .intake-screen-enter {
          animation: intakeIn 0.4s cubic-bezier(0.22, 0.61, 0.36, 1) both;
        }
        @keyframes intakeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .intake-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--intake-accent);
          margin: 8px 0 10px;
        }
        .intake-h1 {
          font-family: var(--intake-fd);
          font-weight: 700;
          font-size: 26px;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0 0 8px;
          color: var(--intake-ink);
        }
        .intake-sub {
          color: var(--intake-ink-3);
          font-size: 14.5px;
          line-height: 1.45;
          margin: 0 0 20px;
        }
        .intake-coach {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--intake-ink-2);
          background: var(--intake-sand);
          border-radius: 99px;
          padding: 6px 13px;
          margin: 6px 0 14px;
        }
        .intake-coach-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--intake-accent);
        }
        .intake-sp {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          color: var(--intake-ink-3);
          margin: -8px 0 18px;
        }
        .intake-stars {
          color: var(--intake-accent);
          display: flex;
          gap: 1px;
        }
        .intake-sp b {
          color: var(--intake-ink-2);
          font-weight: 700;
        }
        .intake-opts {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .intake-opt {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          text-align: left;
          cursor: pointer;
          background: var(--intake-bg);
          border: 1.5px solid var(--intake-line);
          border-radius: 14px;
          padding: 16px 16px;
          color: var(--intake-ink);
          transition: border-color 0.15s ease, background 0.15s ease, transform 0.12s ease, box-shadow 0.15s ease;
        }
        .intake-opt:hover {
          border-color: var(--intake-line-2);
          transform: translateY(-1px);
          box-shadow: 0 5px 16px rgba(17, 17, 17, 0.06);
        }
        .intake-opt-lab {
          flex: 1 1 auto;
        }
        .intake-opt-t {
          font-weight: 600;
          font-size: 15.5px;
          letter-spacing: -0.005em;
        }
        .intake-opt-d {
          display: block;
          font-size: 12.5px;
          color: var(--intake-ink-3);
          margin-top: 2px;
        }
        .intake-opt-rc {
          flex: 0 0 auto;
          width: 23px;
          height: 23px;
          border-radius: 50%;
          border: 1.5px solid var(--intake-line-2);
          background: var(--intake-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.15s ease;
        }
        .intake-check-off,
        .intake-check-on {
          width: 13px;
          height: 13px;
          transition: 0.15s ease;
        }
        .intake-check-off {
          opacity: 0;
          transform: scale(0.5);
        }
        .intake-check-on {
          opacity: 1;
          transform: scale(1);
          color: #fff;
        }
        .intake-opt.intake-sel {
          border-color: var(--intake-accent);
          background: var(--intake-accent-tint);
        }
        .intake-opt.intake-sel .intake-opt-rc {
          border-color: var(--intake-accent);
          background: var(--intake-accent);
        }
        .intake-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .intake-tile {
          position: relative;
          text-align: left;
          cursor: pointer;
          background: var(--intake-bg);
          border: 1.5px solid var(--intake-line);
          border-radius: 15px;
          padding: 15px 14px 14px;
          min-height: 104px;
          display: flex;
          flex-direction: column;
          gap: 11px;
          color: var(--intake-ink);
          transition: border-color 0.15s ease, background 0.15s ease, transform 0.12s ease, box-shadow 0.15s ease;
        }
        .intake-tile:hover {
          border-color: var(--intake-line-2);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(17, 17, 17, 0.07);
        }
        .intake-tile-ic {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: var(--intake-sand);
          color: var(--intake-ink-2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.15s ease;
        }
        .intake-tile-t {
          font-weight: 600;
          font-size: 14.5px;
          line-height: 1.2;
        }
        .intake-tile-chk {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1.5px solid var(--intake-line-2);
          background: var(--intake-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.15s ease;
        }
        .intake-tile.intake-sel {
          border-color: var(--intake-accent);
          background: var(--intake-accent-tint);
        }
        .intake-tile.intake-sel .intake-tile-ic {
          background: var(--intake-accent);
          color: #fff;
        }
        .intake-tile.intake-sel .intake-tile-chk {
          border-color: var(--intake-accent);
          background: var(--intake-accent);
        }
        .intake-tile-wide {
          grid-column: 1 / -1;
          flex-direction: row;
          align-items: center;
          min-height: 0;
          padding: 14px;
        }
        .intake-field {
          margin-bottom: 15px;
        }
        .intake-field label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--intake-ink-2);
          margin: 0 0 7px;
        }
        .intake-optnl {
          color: var(--intake-ink-3);
          font-weight: 500;
        }
        .intake-inp,
        .intake-ta {
          width: 100%;
          font-family: var(--intake-fb);
          font-size: 16px;
          color: var(--intake-ink);
          background: var(--intake-bg);
          border: 1.5px solid var(--intake-line);
          border-radius: 12px;
          padding: 14px 15px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .intake-inp::placeholder,
        .intake-ta::placeholder {
          color: #a9a9a9;
        }
        .intake-inp:focus,
        .intake-ta:focus {
          outline: none;
          border-color: var(--intake-accent);
          box-shadow: 0 0 0 3px var(--intake-accent-tint);
        }
        .intake-ta {
          min-height: 150px;
          resize: vertical;
          line-height: 1.55;
        }
        .intake-seg {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .intake-seg button {
          flex: 1 1 0;
          min-width: 0;
          min-height: 44px;
          padding: 8px 10px;
          border: 1.5px solid var(--intake-line);
          border-radius: 12px;
          background: var(--intake-bg);
          font-family: var(--intake-fb);
          font-size: 14px;
          font-weight: 600;
          color: var(--intake-ink-2);
          cursor: pointer;
        }
        .intake-seg button.intake-seg-on {
          border-color: var(--intake-accent);
          background: var(--intake-accent-tint);
          color: var(--intake-ink);
        }
        .intake-range-l {
          display: flex !important;
          justify-content: space-between;
          align-items: baseline;
        }
        .intake-range-l b {
          font-size: 15px;
          color: var(--intake-ink);
          font-variant-numeric: tabular-nums;
        }
        .intake-range {
          width: 100%;
          height: 28px;
          appearance: none;
          -webkit-appearance: none;
          background: transparent;
          cursor: pointer;
        }
        .intake-range::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 99px;
          background: linear-gradient(90deg, var(--intake-accent) var(--intake-fill), #e6e6e6 var(--intake-fill));
        }
        .intake-range::-moz-range-track {
          height: 6px;
          border-radius: 99px;
          background: linear-gradient(90deg, var(--intake-accent) var(--intake-fill), #e6e6e6 var(--intake-fill));
        }
        .intake-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 26px;
          height: 26px;
          margin-top: -10px;
          border-radius: 999px;
          background: #fff;
          border: 2px solid var(--intake-accent);
          box-shadow: 0 2px 6px rgba(17, 17, 17, 0.18);
        }
        .intake-range::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: #fff;
          border: 2px solid var(--intake-accent);
        }
        .intake-range:focus-visible {
          outline: 2px solid var(--intake-accent);
          outline-offset: 4px;
        }
        .intake-hint {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          margin-bottom: 4px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px dashed var(--intake-line-2);
          font-size: 13.5px;
          line-height: 1.5;
          color: var(--intake-ink-3);
          transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
        }
        .intake-lamp {
          flex: none;
          color: #9a9a9a;
          transition: color 0.3s ease;
        }
        .intake-lamp-glass {
          fill: #ececec;
          stroke: #9a9a9a;
          stroke-width: 1.6;
          transition: fill 0.3s ease, stroke 0.3s ease, filter 0.3s ease;
        }
        .intake-lamp-rays {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .intake-hint-on {
          border-style: solid;
          border-color: #f3c58f;
          background: #fff7e8;
          color: #5f430f;
        }
        .intake-hint-on .intake-lamp {
          color: #e8a317;
        }
        .intake-hint-on .intake-lamp-glass {
          fill: #ffd25c;
          stroke: #e8a317;
          filter: drop-shadow(0 0 6px rgba(255, 196, 64, 0.85));
        }
        .intake-hint-on .intake-lamp-rays {
          opacity: 1;
          animation: intakeGlow 1.6s ease-in-out 2;
        }
        @keyframes intakeGlow {
          50% {
            opacity: 0.35;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .intake-hint-on .intake-lamp-rays {
            animation: none;
          }
        }
        .intake-pricechip {
          position: sticky;
          top: -6px;
          z-index: 2;
          margin: -4px 0 14px;
          padding: 9px 12px;
          border-radius: 10px;
          background: var(--intake-accent-tint);
          font-size: 13.5px;
          color: var(--intake-ink-2);
        }
        .intake-pricechip b {
          color: var(--intake-ink);
          font-variant-numeric: tabular-nums;
        }
        .intake-warn {
          margin: -4px 0 14px;
          padding: 12px 14px;
          border-radius: 12px;
          background: #fff4e5;
          border: 1px solid #f3d3a5;
          font-size: 13.5px;
          line-height: 1.5;
          color: #6b4a12;
        }
        .intake-price {
          display: grid;
          gap: 4px;
          margin-top: 4px;
          padding: 16px;
          border-radius: 14px;
          background: #1f2830;
          color: #fff;
        }
        .intake-price-l {
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.7);
        }
        .intake-price-v {
          font-family: var(--intake-fd);
          font-size: 26px;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
        }
        .intake-price-v span {
          font-size: 15px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          padding: 0 4px;
        }
        .intake-price-rows {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 3px 12px;
          margin: 2px 0 6px;
          padding: 8px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.14);
          border-bottom: 1px solid rgba(255, 255, 255, 0.14);
          font-size: 13px;
          color: rgba(255, 255, 255, 0.82);
        }
        .intake-price-rows dd {
          margin: 0;
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
        .intake-price-s {
          font-size: 12.5px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.78);
        }
        .intake-stop {
          margin-top: 12px;
          padding: 14px;
          border-radius: 12px;
          background: var(--intake-sand);
          border: 1px solid var(--intake-line-2);
          font-size: 14px;
          line-height: 1.55;
          color: var(--intake-ink-2);
        }
        .intake-stop p {
          margin: 0 0 12px;
        }
        .intake-dims {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 11px;
        }
        .intake-unitwrap {
          position: relative;
        }
        .intake-unitwrap .intake-inp {
          padding-right: 52px;
        }
        .intake-unit {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          color: var(--intake-ink-3);
          pointer-events: none;
        }
        .intake-dimprev {
          margin: 2px 0 0;
          font-size: 13px;
          color: var(--intake-ink-3);
        }
        .intake-photos {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .intake-photo {
          position: relative;
          aspect-ratio: 1;
          border-radius: 10px;
          overflow: hidden;
          background: var(--intake-sand);
        }
        .intake-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .intake-photo button {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 26px;
          height: 26px;
          border-radius: 999px;
          border: none;
          background: rgba(17, 17, 17, 0.7);
          color: #fff;
          font-size: 16px;
          line-height: 1;
          cursor: pointer;
        }
        .intake-photo-add {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          border: 1.5px dashed var(--intake-line-2);
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: var(--intake-ink-2);
          cursor: pointer;
          padding: 6px;
        }
        .intake-photo-add:hover {
          border-color: var(--intake-accent);
          color: var(--intake-accent);
        }
        .intake-photo-add input {
          display: none;
        }
        .intake-row2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 11px;
        }
        .intake-found {
          display: flex;
          gap: 11px;
          align-items: center;
          margin-top: 6px;
          padding: 13px 15px;
          border-radius: 12px;
          background: #f1f7f3;
          border: 1px solid #d5e7dc;
          color: #1f5238;
          font-size: 14px;
        }
        .intake-found-check {
          flex: 0 0 auto;
          width: 19px;
          height: 19px;
          color: var(--intake-good);
        }
        .intake-note {
          display: flex;
          gap: 11px;
          align-items: flex-start;
          margin-top: 18px;
          padding: 14px 15px;
          border-radius: 13px;
          background: var(--intake-sand);
          color: var(--intake-ink-2);
          font-size: 13px;
          line-height: 1.5;
        }
        .intake-note svg {
          flex: 0 0 auto;
          color: var(--intake-accent);
          margin-top: 1px;
        }
        .intake-rvals {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin: 8px 0 20px;
        }
        .intake-rvals-l {
          font-size: 10.5px;
          color: var(--intake-ink-3);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 600;
          margin-bottom: 5px;
        }
        .intake-rvals-b {
          font-family: var(--intake-fd);
          font-weight: 700;
          font-size: 26px;
          letter-spacing: -0.01em;
          color: var(--intake-ink);
          font-variant-numeric: tabular-nums;
        }
        .intake-slider {
          position: relative;
          height: 40px;
        }
        .intake-slider-base {
          position: absolute;
          top: 50%;
          left: 2px;
          right: 2px;
          height: 5px;
          transform: translateY(-50%);
          background: #e6e6e6;
          border-radius: 99px;
        }
        .intake-slider-fill {
          position: absolute;
          top: 50%;
          height: 5px;
          transform: translateY(-50%);
          background: var(--intake-accent);
          border-radius: 99px;
        }
        .intake-slider input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 40px;
          margin: 0;
          background: none;
          pointer-events: none;
          -webkit-appearance: none;
          appearance: none;
        }
        .intake-slider input:focus {
          outline: none;
        }
        .intake-slider input::-webkit-slider-runnable-track {
          height: 40px;
          background: transparent;
        }
        .intake-slider input::-moz-range-track {
          height: 40px;
          background: transparent;
        }
        .intake-slider input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          pointer-events: auto;
          margin-top: 7px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #fff;
          border: 2.5px solid var(--intake-accent);
          box-shadow: 0 2px 8px rgba(17, 17, 17, 0.2);
          cursor: grab;
        }
        .intake-slider input::-moz-range-thumb {
          pointer-events: auto;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #fff;
          border: 2.5px solid var(--intake-accent);
          box-shadow: 0 2px 8px rgba(17, 17, 17, 0.2);
          cursor: grab;
        }
        .intake-rscale {
          display: flex;
          justify-content: space-between;
          font-size: 11.5px;
          color: var(--intake-ink-3);
          margin-top: 11px;
          font-weight: 500;
        }
        .intake-unsure {
          display: block;
          margin: 20px auto 0;
          background: none;
          border: none;
          color: var(--intake-ink-3);
          font-size: 13px;
          font-family: var(--intake-fb);
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .intake-unsure:hover {
          color: var(--intake-ink);
        }
        .intake-foot {
          padding: 12px 22px calc(16px + env(safe-area-inset-bottom, 0px));
          background: linear-gradient(to top, var(--intake-bg) 66%, rgba(255, 255, 255, 0));
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .intake-foot-inline {
          margin-top: 22px;
        }
        .intake-btn {
          width: 100%;
          appearance: none;
          border: none;
          cursor: pointer;
          font-family: var(--intake-fb);
          font-weight: 600;
          font-size: 16px;
          border-radius: 13px;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          background: var(--intake-accent);
          color: #fff;
          box-shadow: 0 6px 16px rgba(232, 90, 38, 0.28);
          transition: 0.15s ease;
        }
        .intake-btn:hover {
          background: var(--intake-accent-deep);
          transform: translateY(-1px);
        }
        .intake-btn[disabled] {
          background: #e6e4e0;
          color: #a7a29a;
          box-shadow: none;
          cursor: not-allowed;
          transform: none;
        }
        .intake-skip {
          text-align: center;
          font-size: 13px;
          color: var(--intake-ink-3);
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          font-family: var(--intake-fb);
        }
        .intake-skip:hover {
          color: var(--intake-ink);
        }
        .intake-tstrip {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 14px;
          align-items: center;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--intake-line);
        }
        .intake-tstrip-c {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--intake-ink-3);
        }
        .intake-tstrip-rate {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          color: var(--intake-ink-2);
          margin-left: auto;
        }
        .intake-tstrip-rate b {
          color: var(--intake-ink);
        }
        .intake-sum {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .intake-sum-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 3px 12px;
          align-items: center;
          text-align: left;
          width: 100%;
          cursor: pointer;
          background: var(--intake-bg);
          border: 1.5px solid var(--intake-line);
          border-radius: 13px;
          padding: 13px 15px;
          transition: 0.15s ease;
        }
        .intake-sum-row:hover {
          border-color: var(--intake-line-2);
          background: var(--intake-sand);
        }
        .intake-sr-l {
          grid-column: 1;
          grid-row: 1;
          font-size: 11.5px;
          color: var(--intake-ink-3);
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .intake-sr-v {
          grid-column: 1;
          grid-row: 2;
          font-size: 14.5px;
          font-weight: 600;
          color: var(--intake-ink);
          line-height: 1.3;
        }
        .intake-sr-e {
          grid-column: 2;
          grid-row: 1 / span 2;
          font-size: 12px;
          color: var(--intake-accent);
          font-weight: 600;
          align-self: center;
        }
        .intake-assure {
          display: flex;
          gap: 11px;
          align-items: flex-start;
          margin-top: 16px;
          font-size: 12.5px;
          color: var(--intake-ink-3);
          line-height: 1.5;
        }
        .intake-assure svg {
          flex: 0 0 auto;
          color: var(--intake-ink-3);
          margin-top: 1px;
        }
        .intake-ty {
          text-align: center;
          padding-top: 36px;
        }
        .intake-seal {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          margin: 0 auto 22px;
          background: var(--intake-accent-tint);
          color: var(--intake-accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .intake-ty h1 {
          font-size: 27px;
          margin-bottom: 10px;
        }
        .intake-ty p {
          color: var(--intake-ink-3);
          font-size: 15px;
          line-height: 1.55;
          margin: 0 auto 24px;
          max-width: 32ch;
        }
        .intake-ns {
          text-align: left;
          background: var(--intake-sand);
          border-radius: 16px;
          padding: 18px;
        }
        .intake-ns-h {
          font-family: var(--intake-fd);
          font-weight: 700;
          font-size: 15px;
          margin-bottom: 14px;
        }
        .intake-ns-r {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .intake-ns-r:last-child {
          margin-bottom: 0;
        }
        .intake-ns-n {
          flex: 0 0 auto;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          background: var(--intake-accent);
          color: #fff;
          font-weight: 700;
          font-size: 12px;
          font-family: var(--intake-fd);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .intake-ns-tx {
          font-size: 13.5px;
          color: var(--intake-ink-2);
          line-height: 1.45;
          padding-top: 2px;
        }
        .intake-ns-tx b {
          color: var(--intake-ink);
        }
        .intake-more {
          margin-top: 16px;
          text-align: left;
          border: 1.5px solid var(--intake-line);
          border-radius: 16px;
          padding: 18px;
        }
        .intake-more-tx {
          font-size: 13.5px !important;
          color: var(--intake-ink-2) !important;
          margin: -6px 0 14px !important;
          max-width: none !important;
        }
        .intake-more-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .intake-more-a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1.5px solid var(--intake-line);
          font-weight: 600;
          font-size: 14.5px;
          color: var(--intake-ink);
          text-decoration: none;
        }
        .intake-more-a:hover {
          border-color: var(--intake-accent);
          color: var(--intake-accent-deep);
        }
        .intake-more-a1 {
          background: var(--intake-accent);
          border-color: var(--intake-accent);
          color: #fff;
        }
        .intake-more-a1:hover {
          background: var(--intake-accent-deep);
          color: #fff;
        }
        .intake-sel-note {
          margin-top: 18px;
          padding: 15px 16px;
          border-radius: 13px;
          background: var(--intake-sand);
          font-size: 13px;
          color: var(--intake-ink-2);
          line-height: 1.5;
        }
        @media (prefers-reduced-motion: reduce) {
          .intake-widget * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="intake-card">
        <div className="intake-top">
          <span className="intake-brand">
            <span className="intake-brand-dot" />
            DRO Renovaties
          </span>
          {idx > 0 && !isThanks ? (
            <button aria-label="Terug" className="intake-back" onClick={goBack} type="button">
              <BackIcon />
            </button>
          ) : null}
        </div>

        {!isThanks ? (
          <div className="intake-prog">
            <div className="intake-prog-meta">
              <span>
                <b>{phase}</b> &middot; {timeLeft}
              </span>
            </div>
            <div aria-label={`Voortgang: ${phase}, ${timeLeft}`} aria-valuemax={100} aria-valuemin={0} aria-valuenow={percent} className="intake-build" role="progressbar">
              <div className="intake-track">
                <div className="intake-bar" style={{width: `${percent}%`}} />
              </div>
              <span aria-hidden="true" className="intake-worker" key={idx} style={{left: `calc((100% - 30px) * ${percent / 100})`}}>
                <WorkerIcon />
              </span>
              <span aria-hidden="true" className="intake-house">
                <HouseGoalIcon done={percent >= 100} />
              </span>
            </div>
          </div>
        ) : null}

        <div className="intake-screen intake-screen-enter" key={idx}>
          {renderScreen()}
        </div>

        {footerButton || showSkip || current?.t === "dims" ? (
          <div className="intake-foot">
            {footerButton ? (
              <button className="intake-btn" disabled={footerButton.disabled} onClick={footerButton.onClick} type="button">
                {footerButton.label} <ArrowIcon />
              </button>
            ) : null}
            {showSkip ? (
              <button className="intake-skip" onClick={next} type="button">
                Sla deze vraag over
              </button>
            ) : null}
            {current?.t === "dims" ? (
              <button className="intake-skip" onClick={() => skipDims(current)} type="button">
                Ik weet de maten nog niet
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
