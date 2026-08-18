"use client";

import {useEffect, useRef} from "react";

import type {IconTextItem} from "@/lib/types";

type DoorlopendeLijnProps = {
  intro: string;
  steps: IconTextItem[];
};

function faseLabel(title?: string) {
  return (title || "").replace(/^\d+\.\s*/, "");
}

export default function DoorlopendeLijn({intro, steps}: DoorlopendeLijnProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const revealRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const draw = drawRef.current;
    if (!wrap || !draw) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function onScroll() {
      if (!wrap || !draw) return;
      const rect = wrap.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - rect.top) / rect.height));
      draw.style.height = `${progress * 100}%`;
    }

    if (reduceMotion) {
      draw.style.height = "100%";
    } else {
      onScroll();
      window.addEventListener("scroll", onScroll, {passive: true});
      window.addEventListener("resize", onScroll);
    }

    const revealTargets = revealRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
    let observer: IntersectionObserver | null = null;
    if (!reduceMotion && revealTargets.length) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("opacity-100", "translate-y-0");
              entry.target.classList.remove("opacity-0", "translate-y-[18px]");
              observer?.unobserve(entry.target);
            }
          });
        },
        {threshold: 0.12},
      );
      revealTargets.forEach((el) => observer?.observe(el));
    } else {
      revealTargets.forEach((el) => {
        el.classList.add("opacity-100", "translate-y-0");
        el.classList.remove("opacity-0", "translate-y-[18px]");
      });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      observer?.disconnect();
    };
  }, [steps.length]);

  return (
    <section className="py-24 sm:py-28" id="werkwijze">
      <div className="section-shell relative" ref={wrapRef}>
        <div className="pointer-events-none absolute left-8 top-0 h-full w-[1.5px] -translate-x-1/2 sm:left-1/2" aria-hidden="true">
          <div className="absolute inset-0 bg-brand-line" />
          <div className="absolute left-0 top-0 w-full bg-brand-orange transition-[height] duration-150 ease-linear" ref={drawRef} style={{height: 0}} />
        </div>

        <div
          className="relative z-[3] mb-16 max-w-[600px] translate-y-[18px] opacity-0 transition-all duration-700 ease-out sm:mb-20"
          ref={(el) => {
            revealRefs.current[0] = el;
          }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">De Doorlopende Lijn</p>
          <h2 className="mt-4 text-[27px] font-semibold leading-[1.18] tracking-[-0.02em] sm:text-[38px]">
            Verbouwingen gaan mis op de naden. <em className="font-serif font-medium not-italic italic">Dus hebben wij ze weggehaald.</em>
          </h2>
          <p className="mt-4 text-[16.5px] text-brand-stone">{intro}</p>
        </div>

        {steps.map((step, index) => (
          <div
            className={`relative z-[3] grid translate-y-[18px] grid-cols-1 gap-0 py-10 pl-14 opacity-0 transition-all duration-700 ease-out motion-reduce:transition-none sm:grid-cols-2 sm:gap-24 sm:pl-0 ${
              index % 2 === 0 ? "sm:[&>div]:col-start-1 sm:[&>div]:justify-self-end sm:[&>div]:text-right" : "sm:[&>div]:col-start-2"
            }`}
            key={`${step.title}-${index}`}
            ref={(el) => {
              stepRefs.current[index] = el;
              revealRefs.current[index + 1] = el;
            }}
          >
            <div className="max-w-[400px]">
              <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-brand-orange">{faseLabel(step.title)}</p>
              <p className="text-[15px] text-brand-stone">{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
