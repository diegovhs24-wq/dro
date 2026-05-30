import Link from "next/link";
import {resolveSmartLink} from "@/lib/smartLink";
import CTASection from "@/components/CTASection";
import Hero from "@/components/Hero";
import LeadForm from "@/components/LeadForm";
import PageHero from "@/components/PageHero";
import SketchIcon, { type SketchIconName } from "@/components/SketchIcon";
import {
  AboutIntroBlockSection,
  AboutTeamBlockSection,
  AboutTeamImageBlockSection
} from "@/components/cms/blocks/AboutBlockSections";
import BusinessContentBlockSection from "@/components/cms/blocks/BusinessContentBlockSection";
import GoogleReviewsBlockSection from "@/components/cms/blocks/GoogleReviewsBlockSection";
import PartnersBlockSection from "@/components/cms/blocks/PartnersBlockSection";
import ProblemSolutionBlockSection from "@/components/cms/blocks/ProblemSolutionBlockSection";
import {
  ProcessBenefitsBlockSection,
  ProcessFaqBlockSection,
  ProcessHeaderBlockSection,
  ProcessIntakeBannerBlockSection,
  ProcessTrustBlockSection
} from "@/components/cms/blocks/ProcessBlockSections";
import FeaturedProjectsBlockSection from "@/components/cms/blocks/FeaturedProjectsBlockSection";
import FeaturedServicesBlockSection from "@/components/cms/blocks/FeaturedServicesBlockSection";
import type {
  CmsDynamicPage,
  CmsDynamicPageBlock,
  ContactFormBlock,
  FeaturedProjectsBlock,
  FeaturedServicesBlock,
  IconCardsBlock,
} from "@/lib/cms";

function TextBlockSection({ block }: { block: Extract<CmsDynamicPageBlock, {_type: "textBlock"}> }) {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="section-shell max-w-3xl">
        {block.eyebrow ? <p className="eyebrow">{block.eyebrow}</p> : null}
        {block.title ? (
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">{block.title}</h2>
        ) : null}
        {block.text ? <p className="mt-5 text-base font-semibold leading-7 text-neutral-600">{block.text}</p> : null}
      </div>
    </section>
  );
}


function IconCardsSection({ block }: { block: IconCardsBlock }) {
  const items = Array.isArray(block.items) ? block.items : [];
  const btnLink = resolveSmartLink(block.buttonLink);

  return (
    <section className="bg-brand-soft py-14 sm:py-16">
      <div className="section-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          {block.eyebrow ? <p className="eyebrow">{block.eyebrow}</p> : null}
          {block.title ? (
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{block.title}</h2>
          ) : null}
          {block.buttonLink && block.buttonLabel ? (
            <Link
              className="btn-primary mt-7"
              href={btnLink.href}
              target={btnLink.openInNewTab ? "_blank" : undefined}
              rel={btnLink.openInNewTab ? "noopener noreferrer" : undefined}
            >
              {block.buttonLabel}
            </Link>
          ) : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div
              className="rounded-lg bg-white p-6 transition hover:-translate-y-1 hover:shadow-premium"
              key={`${item.title}-${item.icon}`}
            >
              <SketchIcon name={(item.icon || "tools") as SketchIconName} className="h-11 w-11 text-brand-ink" />
              {item.title ? <h3 className="mt-4 text-xl font-bold">{item.title}</h3> : null}
              {item.text ? <p className="mt-3 text-sm font-semibold leading-6 text-neutral-600">{item.text}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactFormSection({ block }: { block: ContactFormBlock }) {
  return (
    <LeadForm
      content={{
        seo: {},
        eyebrow: block.eyebrow || "",
        title: block.title || "",
        text: block.text || "",
        note: block.note || "",
        intakeForm: block.intakeForm!
      }}
    />
  );
}

async function RenderBlock({ block }: { block: CmsDynamicPageBlock }) {
  switch (block._type) {
    case "homeHeroBlock":
      return block.hero ? <Hero content={block.hero} /> : null;
    case "pageHeroBlock":
      return block.hero ? (
        <PageHero
          eyebrow={block.hero.eyebrow || ""}
          title={block.hero.title || ""}
          text={block.hero.text || ""}
          backgroundImage={block.hero.backgroundImage}
          primaryLabel={block.hero.primaryLabel}
          primaryLink={block.hero.primaryLink}
          secondaryLabel={block.hero.secondaryLabel}
          secondaryLink={block.hero.secondaryLink}
        />
      ) : null;
    case "problemSolutionBlock":
      return <ProblemSolutionBlockSection content={block} />;
    case "textBlock":
      return <TextBlockSection block={block} />;
    case "iconCardsBlock":
      return <IconCardsSection block={block} />;
    case "partnersBlock":
      return (
        <PartnersBlockSection
          eyebrow={block.eyebrow}
          title={block.title}
          text={block.text}
        />
      );
    case "googleReviewsBlock":
      return <GoogleReviewsBlockSection limit={block.limit} compact={block.compact} />;
    case "ctaBannerBlock":
      return block.cta ? <CTASection {...block.cta} /> : null;
    case "contactFormBlock":
      return <ContactFormSection block={block} />;
    case "aboutIntroBlock":
      return <AboutIntroBlockSection content={block} />;
    case "aboutTeamBlock":
      return <AboutTeamBlockSection content={block} />;
    case "aboutTeamImageBlock":
      return <AboutTeamImageBlockSection content={block} />;
    case "processHeaderBlock":
      return <ProcessHeaderBlockSection content={block} />;
    case "processBenefitsBlock":
      return <ProcessBenefitsBlockSection benefits={block.benefits || []} />;
    case "processTrustBlock":
      return <ProcessTrustBlockSection trustPoints={block.trustPoints || []} />;
    case "processFaqBlock":
      return <ProcessFaqBlockSection content={block} />;
    case "processIntakeBannerBlock":
      return <ProcessIntakeBannerBlockSection content={block} />;
    case "businessContentBlock":
      return <BusinessContentBlockSection content={block} />;
    case "featuredServicesBlock":
      return <FeaturedServicesBlockSection block={block as FeaturedServicesBlock} />;
    case "featuredProjectsBlock":
      return <FeaturedProjectsBlockSection block={block as FeaturedProjectsBlock} />;
    default:
      return null;
  }
}




export async function CmsPageView({ page }: { page: CmsDynamicPage }) {
  const blocks = page.contentBlocks || [];

  if (blocks.length === 0) {
    return (
      <section className="bg-white py-14 sm:py-16">
        <div className="section-shell">
          <h1 className="text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
            {page.title || "Untitled page"}
          </h1>
          <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-neutral-600">
            No content blocks have been added to this page yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {await Promise.all(
        blocks.map(async (block, index) => (
          <div key={block._key || `${block._type}-${index}`}>{await RenderBlock({ block })}</div>
        ))
      )}
    </>
  );
}
