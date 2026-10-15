"use client";

import {useState} from "react";

import type {VideoTestimonial} from "@/lib/cms";

// De video zelf wordt pas geladen na een klik: tot dan staat er alleen de
// (lichte) poster. Video's zijn zwaar, en zo blijft de pagina snel.
export default function VideoTestimonialPlayer({
  testimonial,
  featured = false,
}: {
  testimonial: VideoTestimonial;
  featured?: boolean;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-lg bg-brand-ink shadow-premium">
        {playing ? (
          <video
            autoPlay
            className="h-full w-full bg-black object-contain"
            controls
            playsInline
            poster={testimonial.posterUrl}
            preload="auto"
            src={testimonial.videoUrl}
          />
        ) : (
          <button
            aria-label={`Speel de video van ${testimonial.clientName} af`}
            className="group absolute inset-0 block h-full w-full"
            onClick={() => setPlaying(true)}
            type="button"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              height={720}
              loading="lazy"
              src={testimonial.posterUrl}
              width={1280}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            <span
              className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand-orange text-white shadow-lg shadow-black/25 transition duration-300 group-hover:scale-110 ${
                featured ? "h-20 w-20 sm:h-24 sm:w-24" : "h-14 w-14 sm:h-16 sm:w-16"
              }`}
            >
              <svg className={featured ? "ml-1 h-8 w-8 sm:h-10 sm:w-10" : "ml-0.5 h-6 w-6"} fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <figcaption className={featured ? "mt-5" : "mt-3"}>
        <p className={`font-bold text-brand-ink ${featured ? "text-xl" : "text-base"}`}>{testimonial.clientName}</p>
        {testimonial.caption ? <p className="mt-0.5 text-sm font-semibold text-neutral-500">{testimonial.caption}</p> : null}
        {testimonial.quote ? (
          <blockquote className={`mt-3 text-neutral-700 ${featured ? "max-w-3xl text-lg leading-8" : "text-sm leading-6"}`}>
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
        ) : null}
      </figcaption>
    </figure>
  );
}
