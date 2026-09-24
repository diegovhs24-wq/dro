import Image from "next/image";

import type {TeamProfilesShowcaseBlock} from "@/lib/cms";

function SectionLabel({
  sectionNumber,
  eyebrow,
}: {
  sectionNumber?: string;
  eyebrow?: string;
}) {
  if (!sectionNumber && !eyebrow) return null;

  return (
    <p className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-brand-ink">
      {sectionNumber ? <span className="text-brand-orange">{sectionNumber}</span> : null}
      {eyebrow ? <span>{eyebrow}</span> : null}
    </p>
  );
}

function ProfileCard({
  image,
  photoCredit,
  name,
  role,
  whatIDo,
  why,
}: NonNullable<TeamProfilesShowcaseBlock["profiles"]>[number]) {
  return (
    <article className="overflow-hidden rounded-[1.15rem] border border-black/10 bg-white shadow-sm">
      <div className="relative min-h-[320px] overflow-hidden bg-[#e7dfcf] sm:min-h-[420px] lg:min-h-[520px]">
        {image ? (
          <Image alt={name || "Teamlid"} className="object-cover object-center" fill sizes="(min-width: 1024px) 33vw, 100vw" src={image} />
        ) : null}
        {photoCredit ? (
          <p className="absolute bottom-4 left-4 text-[12px] font-medium text-[#7d7d7d] sm:bottom-5 sm:left-5">
            {photoCredit}
          </p>
        ) : null}
      </div>

      <div className="px-5 pb-6 pt-5 sm:px-6 sm:pb-7">
        {name ? <h3 className="text-[20px] font-bold leading-none tracking-[-0.04em] text-brand-ink">{name}</h3> : null}
        {role ? <p className="mt-2 text-[14px] font-medium text-brand-orange sm:text-[14px]">{role}</p> : null}

        {whatIDo ? (
          <div className="mt-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-ink">Wat ik doe</p>
            <p className="mt-2 text-[16px] font-normal leading-[1.8] text-deep-slate sm:text-[16px] ">{whatIDo}</p>
          </div>
        ) : null}

        {why ? (
          <div className="mt-3">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-ink">Waarom</p>
            <p className="mt-2 text-[16px] font-normal leading-[1.8] text-deep-slate sm:text-[16px]">{why}</p>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function TeamProfilesShowcaseBlockSection({
  block,
}: {
  block: TeamProfilesShowcaseBlock;
}) {
  const profiles = Array.isArray(block.profiles) ? block.profiles : [];

  if (!block.title || profiles.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f7f3ec]/75 py-16 sm:py-20">
      <div className="section-shell">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="max-w-3xl">
            <SectionLabel sectionNumber={block.sectionNumber} eyebrow={block.eyebrow} />
            <h2 className="mt-5 max-w-xl text-[28px] font-bold leading-[0.96] tracking-[-0.05em] text-brand-ink lg:text-[44px]">
              {block.title}
            </h2>
          </div>

          {block.intro ? (
            <div className="max-w-2xl pt-2 lg:pt-14">
              <p className="text-[16px] font-normal leading-[1.65] text-[#425466] ">
                {block.intro}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {profiles.map((profile, index) => (
            <ProfileCard key={`${profile.name}-${index}`} {...profile} />
          ))}
        </div>

        <div className="relative mt-8 min-h-[280px] overflow-hidden rounded-[1.15rem] border border-black/10 bg-[#e7dfcf] sm:min-h-[420px] lg:min-h-[520px]">
          {block.teamImage ? (
            <Image alt="Het team" className="object-cover object-center" fill sizes="100vw" src={block.teamImage} />
          ) : null}
          {block.teamImageCredit ? (
            <p className="absolute bottom-4 left-4 text-[12px] font-medium text-[#7d7d7d] sm:bottom-5 sm:left-5">
              {block.teamImageCredit}
            </p>
          ) : null}
        </div>

        {block.closingText ? (
          <div className="mt-6 max-w-6xl">
            <p className="text-[16px] font-normal leading-[1.7] text-[rgb(122,124,131)] ">
              {block.closingText}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
