"use client";

import {useEffect, useMemo, useState} from "react";
import {Bricolage_Grotesque, Hanken_Grotesk} from "next/font/google";
import {lookupPdokAddress, normalizeDutchPostcode, type PdokAddress} from "@/lib/pdok";
import {
  COMMON,
  QUESTIONS,
  SERVICES,
  SERVICE_ICON,
  findServiceForQuestionId,
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
function optionBack(o: QuestionOption): boolean {
  return typeof o === "object" && Boolean(o.back);
}

function formatBudget(value: number): string {
  if (value >= 150000) return "€150k+";
  if (value <= 0) return "€0";
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

export default function SmartIntakeWizard() {
  const [services, setServices] = useState<string[]>([]);
  const [flow, setFlow] = useState<QuestionDef[]>([SERVICES_STEP, ...COMMON]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [company, setCompany] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const [budgetMin, setBudgetMin] = useState(15000);
  const [budgetMax, setBudgetMax] = useState(45000);
  const [budgetLabel, setBudgetLabel] = useState("€15k – €45k");

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
    setFlow([SERVICES_STEP, ...questions, ...COMMON]);
    go(1);
  }

  function toggleService(service: string) {
    setServices((prev) => (prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]));
  }

  function selectSingle(def: QuestionDef, option: QuestionOption) {
    if (def.t === "confirm" && optionBack(option)) {
      go(0);
      return;
    }
    updateAnswer(def.id, optionLabel(option));
    window.setTimeout(next, 300);
  }

  function toggleMulti(def: QuestionDef, option: string) {
    const current = (answers[def.id] as string[] | undefined) || [];
    const nextValue = current.includes(option) ? current.filter((v) => v !== option) : [...current, option];
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
          hoeGevonden: answers.found,
          message: answers.more,
          serviceAnswers,
        }),
      });

      if (!res.ok) throw new Error("Submit failed");
      setSubmitting(false);
      next();
    } catch {
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
        <h1 className="intake-h1">Waar kunnen we u mee helpen?</h1>
        <p className="intake-sub">Kies één of meer diensten. We stellen daarna alleen de vragen die voor u van toepassing zijn.</p>
        <div className="intake-sp">
          <span className="intake-stars">
            <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
          </span>
          <span>
            <b>4.8</b> uit 273 reviews, huiseigenaren in de regio gingen u voor
          </span>
        </div>
        <div className="intake-grid">
          {SERVICES.map((service) => {
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
    function handleRange(which: "min" | "max", value: number) {
      let mn = which === "min" ? value : budgetMin;
      let mx = which === "max" ? value : budgetMax;
      if (mn > mx) {
        if (which === "min") mn = mx;
        else mx = mn;
      }
      setBudgetMin(mn);
      setBudgetMax(mx);
      setBudgetLabel(`${formatBudget(mn)} – ${formatBudget(mx)}`);
    }

    const fillLeft = (budgetMin / 150000) * 100;
    const fillWidth = ((budgetMax - budgetMin) / 150000) * 100;

    return (
      <>
        {renderHeader(def, "Budget")}
        <div className="intake-rvals">
          <div>
            <div className="intake-rvals-l">Minimum</div>
            <div className="intake-rvals-b">{formatBudget(budgetMin)}</div>
          </div>
          <div style={{textAlign: "right"}}>
            <div className="intake-rvals-l">Maximum</div>
            <div className="intake-rvals-b">{formatBudget(budgetMax)}</div>
          </div>
        </div>
        <div className="intake-slider">
          <div className="intake-slider-base" />
          <div className="intake-slider-fill" style={{left: `${fillLeft}%`, width: `${fillWidth}%`}} />
          <input max={150000} min={0} onChange={(e) => handleRange("min", Number(e.target.value))} step={5000} type="range" value={budgetMin} />
          <input max={150000} min={0} onChange={(e) => handleRange("max", Number(e.target.value))} step={5000} type="range" value={budgetMax} />
        </div>
        <div className="intake-rscale">
          <span>€0</span>
          <span>€150k+</span>
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
    const rows: Row[] = [{label: "Wat we voor u doen", val: services.map(serviceLabel).join(", "), to: 0}];

    for (let i = 1; i < idx; i++) {
      const d = flow[i];
      if (d.t === "confirm" || d.t === "services") continue;
      let val = "";
      if (d.id === "loc") val = (answers.address as string) || `${answers.pc || ""} ${answers.hn || ""}`.trim();
      else if (d.id === "budget") val = budgetLabel;
      else if (d.t === "multi") val = ((answers[d.id] as string[]) || []).join(", ");
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
          {rows.map((r) => (
            <button className="intake-sum-row" key={r.label} onClick={() => go(r.to)} type="button">
              <span className="intake-sr-l">{r.label}</span>
              <span className="intake-sr-v">{r.val}</span>
              <span className="intake-sr-e">wijzig</span>
            </button>
          ))}
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
          U bent klaar. Uw aanvraag komt direct bij Therab en het team terecht, wij nemen binnen één werkdag persoonlijk contact met u op.
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
          <ShieldCheckIcon />U zit nergens aan vast. Geen aanbetaling, volledig vrijblijvend, en uw gegevens blijven vertrouwelijk.
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
          We hebben uw aanvraag voor {primaryLabel()} ontvangen. Wij nemen binnen één werkdag persoonlijk contact met u op.
        </p>
        <div className="intake-ns">
          <div className="intake-ns-h">Wat er nu gebeurt</div>
          <div className="intake-ns-r">
            <span className="intake-ns-n">1</span>
            <span className="intake-ns-tx">
              <b>Therab of een collega neemt binnen één werkdag contact op</b>, per telefoon, e-mail of WhatsApp.
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
              <b>Een heldere, vaste prijsopgave.</b> Geen verrassingen, geen aanbetaling.
            </span>
          </div>
        </div>
        <div className="intake-sel-note">
          We nemen bewust een beperkt aantal projecten tegelijk aan, zodat elk project de aandacht en het vakmanschap krijgt dat het verdient.
        </div>
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
    if (current.t === "address") return {label: "Verder", onClick: confirmAddress, disabled: !(postcodeInput.trim() && houseNumberInput.trim())};
    if (current.t === "budget") return {label: "Verder", onClick: next, disabled: false};
    if (current.t === "summary") return {label: "Alles klopt, verder", onClick: next, disabled: false};
    return null;
  }

  const footerButton = showsFooterButton();
  const showSkip = current?.t === "text" && current.optional;
  const percent = total > 0 ? Math.round((Math.min(idx + 1, total) / total) * 100) : 0;

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
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--intake-ink-3);
          margin-bottom: 8px;
        }
        .intake-prog-meta b {
          color: var(--intake-ink);
        }
        .intake-track {
          height: 4px;
          border-radius: 99px;
          background: #eaeaea;
          overflow: hidden;
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
                Stap <b>{Math.min(idx + 1, total)}</b> van {total}
              </span>
              <span>{percent}%</span>
            </div>
            <div className="intake-track">
              <div className="intake-bar" style={{width: `${percent}%`}} />
            </div>
          </div>
        ) : null}

        <div className="intake-screen intake-screen-enter" key={idx}>
          {renderScreen()}
        </div>

        {footerButton || showSkip ? (
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
          </div>
        ) : null}
      </div>
    </div>
  );
}
