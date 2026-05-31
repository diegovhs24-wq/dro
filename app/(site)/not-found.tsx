import type {Metadata} from "next";
import SmartButton from "@/components/SmartButton";
import {getSiteSettings} from "@/lib/cms";

export const metadata: Metadata = {
  title: "Pagina niet gevonden | DRO Renovaties",
  description:
    "De pagina die u zoekt bestaat niet meer of is verplaatst. Ga terug naar de homepage of neem contact op.",
  robots: {
    index: false,
    follow: true,
  },
};

const FALLBACK = {
  title: "Pagina niet gevonden",
  text: "De pagina bestaat niet meer, is verplaatst of het adres klopt niet. Ga terug naar de homepage of start direct een intake.",
  buttons: [
    {label: "Naar homepage", link: {linkType: "external" as const, externalUrl: "/"}, variant: "primary" as const},
    {label: "Start intake", link: {linkType: "external" as const, externalUrl: "/contact"}, variant: "outlined" as const},
  ],
};

export default async function NotFound() {
  const siteSettings = await getSiteSettings();
  const content = siteSettings.notFound;

  const title = content?.title || FALLBACK.title;
  const text = content?.text || FALLBACK.text;
  const buttons = content?.buttons?.length ? content.buttons : FALLBACK.buttons;

  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden bg-white py-16 sm:py-20">
      <div className="section-shell">
        <div className="mx-auto max-w-xl text-center">
          <p
            aria-hidden="true"
            className="text-[7.5rem] font-extrabold leading-none tracking-[-0.06em] text-brand-orange sm:text-[10rem]"
          >
            404
          </p>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
            {title}
          </h1>

          <p className="mx-auto mt-4 max-w-md text-base font-semibold leading-7 text-neutral-600">
            {text}
          </p>

          {buttons.length > 0 && (
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <SmartButton buttons={buttons} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
