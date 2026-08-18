import Link from "next/link";
import type {PtBlock} from "@/lib/types";
import {resolveSmartLink} from "@/lib/smartLink";
import CTASection from "@/components/CTASection";
import Hero from "@/components/Hero";
import HomeFeitenBalk from "@/components/HomeFeitenBalk";
import DoorlopendeLijn from "@/components/DoorlopendeLijn";
import HomeSlotSection from "@/components/HomeSlotSection";
import LeadForm from "@/components/LeadForm";
import PageHero from "@/components/PageHero";
import MetricsBandBlockSection from "@/components/cms/blocks/MetricsBandBlockSection";
import EditorialPrinciplesBlockSection from "@/components/cms/blocks/EditorialPrinciplesBlockSection";
import SplitIntroBlockSection from "@/components/cms/blocks/SplitIntroBlockSection";
import SketchIcon, { type SketchIconName } from "@/components/SketchIcon";
import {
  AboutIntroBlockSection,
  AboutTeamBlockSection,
  AboutTeamImageBlockSection
} from "@/components/cms/blocks/AboutBlockSections";
import BusinessContentBlockSection from "@/components/cms/blocks/BusinessContentBlockSection";
import VideoChecklistBlockSection from "@/components/cms/blocks/VideoChecklistBlockSection";
import GoogleReviewsBlockSection from "@/components/cms/blocks/GoogleReviewsBlockSection";
import ReviewShowcaseBlockSection from "@/components/cms/blocks/ReviewShowcaseBlockSection";
import TeamProfilesShowcaseBlockSection from "@/components/cms/blocks/TeamProfilesShowcaseBlockSection";
import VisitInvitationBlockSection from "@/components/cms/blocks/VisitInvitationBlockSection";
import SplitTimelineBlockSection from "@/components/cms/blocks/SplitTimelineBlockSection";
import FaqAnswersGridBlockSection from "@/components/cms/blocks/FaqAnswersGridBlockSection";
import ProjectsShowcaseGridBlockSection from "@/components/cms/blocks/ProjectsShowcaseGridBlockSection";
import StackedStepsListBlockSection from "@/components/cms/blocks/StackedStepsListBlockSection";
import SplitFeatureListBlockSection from "@/components/cms/blocks/SplitFeatureListBlockSection";
import DarkAssuranceGridBlockSection from "@/components/cms/blocks/DarkAssuranceGridBlockSection";
import CenteredActionBannerBlockSection from "@/components/cms/blocks/CenteredActionBannerBlockSection";
import PartnersBlockSection from "@/components/cms/blocks/PartnersBlockSection";
import LogoCardGridBlockSectionView from "@/components/cms/blocks/LogoCardGridBlockSectionView";
import ProblemSolutionBlockSection from "@/components/cms/blocks/ProblemSolutionBlockSection";
import {
  ProcessBlockSection,
  ProcessFaqBlockSection,
  ProcessIntakeBannerBlockSection,
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

function renderSpan(span: NonNullable<PtBlock['children']>[number], markDefs: NonNullable<PtBlock['markDefs']>, si: number): React.ReactNode {
  const marks = span.marks || [];
  let node: React.ReactNode = span.text;

  // Apply decorators (innermost first so nesting is correct)
  if (marks.includes('underline')) node = <u>{node}</u>;
  if (marks.includes('em')) node = <em>{node}</em>;
  if (marks.includes('strong')) node = <strong>{node}</strong>;

  // Apply annotation marks (links etc.)
  for (const markKey of marks) {
    const def = markDefs.find((d) => d._key === markKey);
    if (def?._type === 'link' && def.href) {
      const isExternal = def.href.startsWith('http');
      node = (
        <a
          href={def.href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="font-semibold text-brand-orange underline underline-offset-2 hover:text-brand-ink"
        >
          {node}
        </a>
      );
    }
  }

  return <span key={si}>{node}</span>;
}

function RichDescription({blocks}: {blocks: PtBlock[]}) {
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    const markDefs = block.markDefs ?? [];

    // Collect consecutive list items of the same type
    if (block.listItem === 'bullet' || block.listItem === 'number') {
      const listType = block.listItem;
      const listItems: React.ReactNode[] = [];

      while (i < blocks.length && blocks[i].listItem === listType) {
        const b = blocks[i];
        const children = (b.children || []).map((span, si) => renderSpan(span, b.markDefs ?? [], si));
        listItems.push(<li key={b._key}>{children}</li>);
        i++;
      }

      const Tag = listType === 'number' ? 'ol' : 'ul';
      const listClass =
        listType === 'number'
          ? 'list-decimal pl-5 space-y-1'
          : 'list-disc pl-5 space-y-1';
      nodes.push(<Tag key={`list-${i}`} className={listClass}>{listItems}</Tag>);
      continue;
    }

    // Regular block
    const children = (block.children || []).map((span, si) => renderSpan(span, markDefs, si));
    const style = block.style;

    if (style === 'h3') {
      nodes.push(<h3 key={block._key} className="text-xl font-bold text-brand-ink">{children}</h3>);
    } else if (style === 'h4') {
      nodes.push(<h4 key={block._key} className="text-lg font-bold text-brand-ink">{children}</h4>);
    } else {
      nodes.push(<p key={block._key}>{children}</p>);
    }

    i++;
  }

  return (
    <div className="mt-5 max-w-3xl space-y-4 text-base font-semibold leading-7 text-neutral-600">
      {nodes}
    </div>
  );
}

function TextBlockSection({ block }: { block: Extract<CmsDynamicPageBlock, {_type: "textBlock"}> }) {
  const hasDescription = Array.isArray(block.description) && block.description.length > 0;
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="section-shell max-w-3xl">
        {block.eyebrow ? <p className="eyebrow">{block.eyebrow}</p> : null}
        {block.title ? (
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">{block.title}</h2>
        ) : null}
        {hasDescription ? <RichDescription blocks={block.description!} /> : null}
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
      return block.hero ? (
        <>
          <Hero content={block.hero} />
          <HomeFeitenBalk />
          {block.hero.processSteps?.length ? (
            <DoorlopendeLijn intro={block.hero.processIntro || ""} steps={block.hero.processSteps} />
          ) : null}
        </>
      ) : null;
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
    case "splitIntroBlock":
      return <SplitIntroBlockSection content={block} />;
    case "editorialPrinciplesBlock":
      return <EditorialPrinciplesBlockSection content={block} />;
    case "metricsBandBlock":
      return <MetricsBandBlockSection content={block} />;
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
    case "logoCardGridBlock":
      return <LogoCardGridBlockSectionView block={block} />;
    case "googleReviewsBlock":
      return <GoogleReviewsBlockSection limit={block.limit} compact={block.compact} />;
    case "reviewShowcaseBlock":
      return <ReviewShowcaseBlockSection block={block} />;
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
    case "teamProfilesShowcaseBlock":
      return <TeamProfilesShowcaseBlockSection block={block} />;
    case "visitInvitationBlock":
      return <VisitInvitationBlockSection block={block} />;
    case "splitTimelineBlock":
      return <SplitTimelineBlockSection block={block} />;
    case "faqAnswersGridBlock":
      return <FaqAnswersGridBlockSection block={block} />;
    case "projectsShowcaseGridBlock":
      return <ProjectsShowcaseGridBlockSection block={block} />;
    case "stackedStepsListBlock":
      return <StackedStepsListBlockSection block={block} />;
    case "splitFeatureListBlock":
      return <SplitFeatureListBlockSection block={block} />;
    case "darkAssuranceGridBlock":
      return <DarkAssuranceGridBlockSection block={block} />;
    case "centeredActionBannerBlock":
      return <CenteredActionBannerBlockSection block={block} />;
    case "processBlock":
      return <ProcessBlockSection content={block} />;
    case "processFaqBlock":
      return <ProcessFaqBlockSection content={block} />;
    case "processIntakeBannerBlock":
      return <ProcessIntakeBannerBlockSection content={block} />;
    case "businessContentBlock":
      return <BusinessContentBlockSection content={block} />;
    case "videoChecklistBlock":
      return <VideoChecklistBlockSection content={block} />;
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

  const heroBlock = blocks.find((block) => block._type === "homeHeroBlock");

  return (
    <>
      {await Promise.all(
        blocks.map(async (block, index) => (
          <div key={block._key || `${block._type}-${index}`}>{await RenderBlock({ block })}</div>
        ))
      )}
      {heroBlock?.hero ? <HomeSlotSection intakeForm={heroBlock.hero.intakeForm} /> : null}
    </>
  );
}
