"use client";

import {useState} from "react";

// Klantvideo's: alleen een stilstaand beeld tot de bezoeker op afspelen drukt.
// Pas dan wordt het videobestand geladen, zodat de pagina snel blijft.

export type VideoTestimonial = {
  name: string;
  place?: string;
  project: string;
  duration: string;
  quote: string;
  poster: string;
  src: string;
  captions?: string;
};

function Play() {
  return (
    <span
      aria-hidden="true"
      className="flex h-14 w-14 items-center justify-center rounded-full bg-lp-orange pl-1 text-xl text-white shadow-[0_6px_16px_rgba(217,91,22,0.35)]"
    >
      ▶
    </span>
  );
}

function VideoCard({item}: {item: VideoTestimonial}) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="m-0">
      <div className="relative aspect-[9/16] overflow-hidden rounded-lg bg-lp-slate">
        {playing ? (
          <video autoPlay className="h-full w-full object-cover" controls playsInline poster={item.poster} preload="metadata" src={item.src}>
            {item.captions ? <track default kind="captions" label="Nederlands" src={item.captions} srcLang="nl" /> : null}
          </video>
        ) : (
          <button
            aria-label={`Speel video van ${item.name} af`}
            className="group absolute inset-0 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lp-orange"
            onClick={() => setPlaying(true)}
            type="button"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="absolute inset-0 h-full w-full object-cover" decoding="async" loading="lazy" src={item.poster} />
            <span className="relative">
              <Play />
            </span>
            <span className="absolute bottom-3 left-3 rounded bg-black/45 px-1.5 py-0.5 text-[13px] font-semibold text-white">{item.duration}</span>
          </button>
        )}
      </div>
      <figcaption className="mt-3">
        <span className="block font-semibold">
          {item.place ? `${item.name}, ${item.place}` : item.name}
        </span>
        <span className="block text-sm text-lp-muted">
          {item.project}
        </span>
        <span className="mt-1.5 block text-[15px]">{item.quote}</span>
      </figcaption>
    </figure>
  );
}

export default function VideoTestimonials({items}: {items: VideoTestimonial[]}) {
  return (
    <div className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:gap-6">
      {items.map((item) => (
        <VideoCard item={item} key={item.src} />
      ))}
    </div>
  );
}
