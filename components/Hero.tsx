import GoogleRatingBadge from "@/components/GoogleRatingBadge";
import IntakeWizard from "@/components/IntakeWizard";
import SketchIcon, { type SketchIconName } from "@/components/SketchIcon";
import type {HomeHeroContent} from "@/lib/types";

type HeroProps = {
  content: HomeHeroContent;
};

function MultilineText({
  text,
  breakClassName = ""
}: {
  text: string;
  breakClassName?: string;
}) {
  return (
    <>
      {text.split("\n").map((line, index) => (
        <span key={`${line}-${index}`}>
          {index > 0 ? <br className={breakClassName} /> : null}
          {line}
        </span>
      ))}
    </>
  );
}

export default function Hero({content}: HeroProps) {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-neutral-950 text-white">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-70"
          style={{
            backgroundImage: `url('${content.backgroundImage}')`
          }}
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_38%,rgba(255,255,255,0.10),transparent_24%),linear-gradient(90deg,rgba(0,0,0,0.92),rgba(0,0,0,0.72)_46%,rgba(0,0,0,0.55))]" />

        <div className="section-shell grid min-h-[680px] gap-10 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="animate-float-in">
            <p className="font-hand max-w-2xl text-base leading-7 text-brand-orange sm:text-lg">
              {content.coverageText}
            </p>
            <div className="mt-2 h-1 w-56 rounded-full bg-brand-orange" />

            <h1 className="mt-7 max-w-4xl text-[2.75rem] font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-[3.55rem] lg:text-[4.45rem]">
              {content.headlineTop}
              <span className="block text-brand-orange">{content.headlineHighlight}</span>
              <span className="relative inline-block">
                {content.headlineBottom}
                <span className="absolute -bottom-2 left-[52%] h-1.5 w-28 -translate-x-1/2 rotate-[-3deg] rounded-full bg-white" />
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-white/80 sm:text-[17px]">
              <MultilineText text={content.description} breakClassName="hidden sm:block" />
            </p>

            <div className="mt-7 grid max-w-2xl gap-5 sm:grid-cols-3">
              {content.trustItems.map((item) => (
                <div className="flex items-center gap-3" key={item.title}>
                  <SketchIcon
                    name={item.icon as SketchIconName}
                    className="h-8 w-8 shrink-0 text-brand-orange"
                  />
                  <span className="text-sm font-medium leading-5 text-white/80">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>

            <p className="font-hand mt-7 max-w-2xl text-[17px] leading-8 text-white/80">
              <MultilineText text={content.note} />
            </p>
          </div>

          {content.intakeForm ? (
            <div className="rounded-2xl bg-[#fbf8f2] p-5 text-brand-ink shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-6 lg:max-w-[500px] lg:justify-self-end">
              <IntakeWizard compact embedded config={content.intakeForm} />
            </div>
          ) : null}
        </div>

        <div className="border-t border-white/10 bg-black/35 backdrop-blur-md">
          <div className="section-shell grid gap-5 py-5 text-sm sm:grid-cols-3">
            {content.stats.map((stat, index) => (
              <div
                className={`flex items-center gap-4 border-white/10 ${index > 0 ? "sm:border-l sm:pl-9" : ""}`}
                key={`${stat.value}-${stat.label}`}
              >
                {stat.rating ? (
                  <GoogleRatingBadge compact variant="dark" />
                ) : (
                  <SketchIcon
                    name={(stat.icon || "team") as SketchIconName}
                    className="h-10 w-10 shrink-0 text-brand-orange"
                  />
                )}
                <div>
                  <p className="font-black text-white">{stat.value}</p>
                  <p className="text-white/60">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f2ea] py-7">
        <div className="section-shell grid gap-5 lg:grid-cols-[1.1fr_repeat(5,1fr)] lg:items-center">
          <div>
            <p className="font-hand text-xl leading-7 text-brand-ink">
              <MultilineText text={content.processIntro} />
            </p>
            <div className="mt-2 h-1 w-44 rounded-full bg-brand-orange" />
          </div>
          {content.processSteps.map((step, index) => (
            <div className="relative" key={step.title}>
              {index > 0 ? (
                <span className="font-hand absolute -left-6 top-8 hidden text-3xl text-brand-orange lg:block">
                  →
                </span>
              ) : null}
              <SketchIcon
                name={step.icon as SketchIconName}
                className="h-12 w-12 text-brand-ink"
              />
              <h3 className="font-hand mt-2 text-lg font-normal text-brand-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-xs font-semibold leading-5 text-neutral-600">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
