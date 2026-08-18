import type {HomeHeroContent} from "@/lib/types";

type HeroProps = {
  content: HomeHeroContent;
};

const DEFAULT_VIDEO = "/media/hero-totaalrenovatie.mp4";
const DEFAULT_POSTER = "/media/hero-totaalrenovatie.jpg";

export default function Hero({content}: HeroProps) {
  const videoSrc = content.backgroundVideoUrl || DEFAULT_VIDEO;
  const posterSrc = content.backgroundImage || DEFAULT_POSTER;

  return (
    <section className="relative isolate flex min-h-[74vh] items-end overflow-hidden text-white lg:min-h-[88vh]">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <video
          autoPlay
          className="absolute inset-0 h-full w-full object-cover saturate-[0.9] motion-reduce:hidden"
          loop
          muted
          playsInline
          poster={posterSrc}
          preload="metadata"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 hidden bg-cover bg-center motion-reduce:block"
          style={{backgroundImage: `url('${posterSrc}')`}}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,22,19,0.42)_0%,rgba(24,22,19,0.28)_45%,rgba(24,22,19,0.78)_100%)]" />
      </div>

      <div className="section-shell relative z-[2] w-full pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pb-[88px] lg:pt-[140px]">
        <p className="text-sm font-medium text-white/65">{content.coverageText}</p>
        <h1 className="mt-6 max-w-[14em] text-[38px] font-semibold leading-[1.1] tracking-[-0.022em] sm:text-[46px] lg:text-[58px]">
          {content.headlineTop} {content.headlineHighlight} <em className="font-serif not-italic italic font-medium">{content.headlineBottom}</em>
        </h1>
        <p className="mt-6 max-w-[32em] text-[17.5px] leading-7 text-white/82">{content.description}</p>
        <div className="mt-10 flex flex-wrap items-center gap-5">
          <a className="btn rounded border border-brand-soft bg-brand-soft px-7 py-3.5 text-[15px] font-medium text-brand-ink transition hover:bg-transparent hover:text-brand-soft" href="#start">
            Plan een kennismaking
          </a>
          <span className="text-[14.5px] text-white/65">
            of bel <a className="border-b border-white/35 font-medium text-white hover:border-brand-orange" href="tel:+31850871814">085 087 1814</a>
          </span>
        </div>
      </div>

      {content.backgroundVideoCaption ? (
        <p className="absolute bottom-6 right-8 z-[2] hidden text-xs text-white/55 sm:block">{content.backgroundVideoCaption}</p>
      ) : null}
    </section>
  );
}
