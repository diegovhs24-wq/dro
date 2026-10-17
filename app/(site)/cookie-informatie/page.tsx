import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";

import CookieSettingsLink from "@/components/analytics/CookieSettingsLink";
import {GOOGLE_ADS_ID} from "@/lib/analytics";
import {buildPageMetadata} from "@/lib/seo/metadata";

const PATHNAME = "/cookie-informatie";
const TITLE = "Cookies en Google Ads | DRO Renovaties";
const DESCRIPTION = "Wat wij met uw toestemming meten met Google Ads, welke gegevens daarbij naar Google gaan en hoe u uw keuze wijzigt.";

export const metadata: Metadata = buildPageMetadata({
  fallbackTitle: TITLE,
  fallbackDescription: DESCRIPTION,
  pathname: PATHNAME,
});

// Beschrijft uitsluitend wat de website feitelijk doet (zie lib/analytics.ts en
// components/analytics/GoogleTag.tsx). Zonder Ads-ID meet de site niets, dus dan
// bestaat deze pagina niet.
export default function CookieInformatiePage() {
  if (!GOOGLE_ADS_ID) notFound();

  return (
    <main className="bg-white">
      <div className="section-shell max-w-3xl py-12 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">Cookies en Google Ads</h1>
        <p className="mt-4 text-base leading-7 text-neutral-700">
          Deze pagina beschrijft wat onze website doet met Google Ads. De{" "}
          <Link className="font-semibold underline underline-offset-2 hover:text-brand-orange" href="/privacypolicy">
            privacyverklaring
          </Link>{" "}
          blijft het uitgangspunt voor de rest van uw gegevens.
        </p>

        <h2 className="mt-10 text-xl font-bold text-brand-ink">Zonder uw toestemming</h2>
        <p className="mt-2 text-base leading-7 text-neutral-700">
          Zolang u niet op &ldquo;Alles accepteren&rdquo; klikt, laden wij geen Google-script en gaat er geen verzoek naar
          Google. Als u &ldquo;Alleen noodzakelijk&rdquo; kiest, werkt de website en het aanvraagformulier gewoon.
        </p>

        <h2 className="mt-10 text-xl font-bold text-brand-ink">Met uw toestemming</h2>
        <p className="mt-2 text-base leading-7 text-neutral-700">
          Na &ldquo;Alles accepteren&rdquo; laden wij de Google Ads-tag van Google. Wij geven Google daarbij toestemming voor
          advertentieopslag, het gebruik van gebruikersgegevens voor advertenties, advertentiepersonalisatie en
          analyseopslag (in de technische instellingen van Google: <code>ad_storage</code>, <code>ad_user_data</code>,{" "}
          <code>ad_personalization</code> en <code>analytics_storage</code>). Wij meten dan drie dingen:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7 text-neutral-700">
          <li>
            Bezoeken aan onze website, zodat Google advertentieresultaten kan meten (de standaardmeting van de tag).
          </li>
          <li>
            Een succesvol verzonden aanvraag. Dan sturen wij een conversiegebeurtenis met een vaste waarde van 1 euro en
            het label van de actie &ldquo;Aanvraag website&rdquo;. Wij sturen hierbij zelf geen naam, e-mailadres,
            telefoonnummer, adres of andere inhoud van het formulier mee.
          </li>
          <li>
            Een klik op een telefoonnummer of op een WhatsApp-knop. Het nummer of de link sturen wij niet mee.
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-bold text-brand-ink">Wat ontvangt Google?</h2>
        <p className="mt-2 text-base leading-7 text-neutral-700">
          Doordat uw browser met Google verbinding maakt, ontvangt Google technische gegevens zoals uw IP-adres,
          browser- en apparaatgegevens en de pagina waarop u zit. Google kan daarbij cookies of vergelijkbare
          identificatiemiddelen plaatsen en lezen. Welke dat zijn en hoe lang Google gegevens bewaart, bepaalt Google; wij
          kunnen daar hier geen afspraken over beloven. Zie hiervoor het{" "}
          <a
            className="font-semibold underline underline-offset-2 hover:text-brand-orange"
            href="https://policies.google.com/privacy"
            rel="noopener noreferrer"
            target="_blank"
          >
            privacybeleid van Google
          </a>
          .
        </p>

        <h2 className="mt-10 text-xl font-bold text-brand-ink">Uw keuze en uw gegevens</h2>
        <p className="mt-2 text-base leading-7 text-neutral-700">
          Uw keuze (&ldquo;granted&rdquo; of &ldquo;denied&rdquo;) slaan wij op in de lokale opslag van uw eigen browser,
          onder de naam <code>dro-cookie-consent</code>. Deze blijft bewaard tot u uw browsergegevens wist of uw keuze
          wijzigt. U kunt uw keuze op elk moment wijzigen via &ldquo;Cookie-instellingen&rdquo; onderaan elke pagina, of
          met de knop hieronder. Kiest u daar &ldquo;Alleen noodzakelijk&rdquo;, dan trekken wij uw toestemming in bij
          Google en proberen wij de Google-cookies van deze website op te ruimen. Een Google-script dat al geladen is,
          blijft actief tot u de pagina opnieuw laadt; daarna wordt het niet meer geladen.
        </p>
        <div className="mt-6">
          <CookieSettingsLink className="min-h-[48px] rounded-md border-2 border-brand-ink bg-white px-5 py-3 text-sm font-bold text-brand-ink transition hover:bg-brand-ink hover:text-white" />
        </div>
      </div>
    </main>
  );
}
