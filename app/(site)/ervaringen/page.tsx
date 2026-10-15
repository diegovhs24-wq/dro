import type {Metadata} from "next";

import CTASection from "@/components/CTASection";
import GoogleReviewCards from "@/components/ervaringen/GoogleReviewCards";
import StatsBand from "@/components/ervaringen/StatsBand";
import TrustStrip from "@/components/ervaringen/TrustStrip";
import VideoTestimonialsSection from "@/components/ervaringen/VideoTestimonialsSection";
import PageHero from "@/components/PageHero";
import PageStructuredData from "@/components/seo/PageStructuredData";
import {getSiteSettings, getVideoTestimonials} from "@/lib/cms";
import {formatRating, getReviewsData} from "@/lib/googleReviews";
import {breadcrumbsForPath} from "@/lib/seo/breadcrumbs";
import {buildPageMetadata} from "@/lib/seo/metadata";

const PATHNAME = "/ervaringen";
const TITLE = "Wat klanten over ons vertellen | DRO Renovaties";
const DESCRIPTION =
  "Echte klanten aan het woord: videoverhalen en reviews over een renovatie met DRO Renovaties in Den Haag en omgeving. Vaste prijs, geen aanbetaling.";

// De pagina zelf ververst snel (nieuwe video's in Sanity zijn zo zichtbaar);
// Google wordt los daarvan hooguit elke 12 uur aangeroepen (zie lib/googleReviews.ts).
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    fallbackTitle: TITLE,
    fallbackDescription: DESCRIPTION,
    pathname: PATHNAME,
  });
}

export default async function ErvaringenPage() {
  const [siteSettings, videos, reviews] = await Promise.all([
    getSiteSettings(),
    getVideoTestimonials(),
    getReviewsData(),
  ]);

  const ratingLabel = `${formatRating(reviews.rating)} uit ${reviews.total} reviews`;
  const hasVideos = videos.length > 0;
  const hasReviews = reviews.reviews.length > 0;

  const secondaryLink = hasVideos
    ? {linkType: "external" as const, externalUrl: "#videos"}
    : hasReviews
      ? {linkType: "external" as const, externalUrl: "#reviews"}
      : undefined;
  const secondaryLabel = hasVideos ? "Bekijk de video's" : hasReviews ? "Lees de reviews" : undefined;

  return (
    <>
      <PageStructuredData
        breadcrumbs={breadcrumbsForPath(PATHNAME, "Ervaringen")}
        description={DESCRIPTION}
        organizationSeo={siteSettings.organizationSeo}
        pathname={PATHNAME}
        siteSettings={siteSettings}
        title={TITLE}
      />
      <main className="min-h-screen bg-white">
        <PageHero
          eyebrow="Ervaringen"
          primaryLabel="Start je aanvraag"
          ratingLabel={ratingLabel}
          ratingScore={reviews.rating}
          secondaryLabel={secondaryLabel}
          secondaryLink={secondaryLink}
          text="Echte klanten, echte verhalen. Hoor van de mensen zelf hoe een renovatie met ons verloopt, van het eerste gesprek tot de oplevering."
          title="Wat klanten over ons vertellen"
        />
        <VideoTestimonialsSection testimonials={videos} />
        <StatsBand rating={reviews.rating} total={reviews.total} />
        <GoogleReviewCards profileUrl={reviews.profileUrl} reviews={reviews.reviews} />
        <TrustStrip />
        <CTASection
          buttons={[
            {
              label: "Start je aanvraag",
              variant: "primary",
              link: {linkType: "internal", internalRef: {_type: "page", slug: "contact"}},
            },
          ]}
          eyebrow="Jouw project"
          ratingLabel={ratingLabel}
          ratingScore={reviews.rating}
          text="Vertel ons wat je van plan bent. Binnen één werkdag hoor je of je project bij ons past."
          title="Wil jij straks ook zo'n verhaal?"
        />
      </main>
    </>
  );
}
