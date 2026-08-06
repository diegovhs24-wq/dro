import {
  getBlogPostBySlug,
  getBlogPosts,
  getBlogsIndex,
  getLocationBySlug,
  getPageBySlug,
  getProjectBySlug,
  getProjectsIndex,
  getServiceBySlug,
  getServicesIndex,
  getSiteSettings,
} from "@/lib/cms";
import {absoluteUrl, getSiteUrl} from "@/lib/seo/site";
import type {CmsDynamicPageBlock} from "@/lib/cms";
import type {PtBlock, RichTextContent} from "@/lib/types";

function heading(level: number, text: string) {
  return `${"#".repeat(level)} ${text}\n\n`;
}

function paragraph(text?: string) {
  return text ? `${text.trim()}\n\n` : "";
}

function list(items?: string[]) {
  if (!items?.length) return "";
  return `${items.map((item) => `- ${item}`).join("\n")}\n\n`;
}

function link(label: string, href: string) {
  const url = href.startsWith("http") ? href : absoluteUrl(href);
  return `[${label}](${url})`;
}

function richTextSpanText(span: NonNullable<PtBlock["children"]>[number]) {
  return span.text || "";
}

function richTextToMarkdown(blocks: RichTextContent = []): string {
  return blocks
    .map((block) => {
      if (typeof block === "string") {
        return `![](${block})\n\n`;
      }

      if (block._type === "cmsImage") {
        const image = block as {url?: string; alt?: string};
        return image.url ? `![${image.alt || ""}](${image.url})\n\n` : "";
      }

      const ptBlock = block as PtBlock;
      const text = (ptBlock.children || []).map(richTextSpanText).join("");

      if (ptBlock.listItem) {
        return `${ptBlock.listItem === "number" ? "1." : "-"} ${text}\n`;
      }

      switch (ptBlock.style) {
        case "h2":
          return heading(2, text);
        case "h3":
          return heading(3, text);
        case "h4":
          return heading(4, text);
        case "blockquote":
          return `> ${text}\n\n`;
        default:
          return paragraph(text);
      }
    })
    .join("");
}

function blockToMarkdown(block: CmsDynamicPageBlock): string {
  switch (block._type) {
    case "homeHeroBlock":
      return [
        heading(1, `${block.hero?.headlineTop || ""} ${block.hero?.headlineHighlight || ""}`.trim()),
        paragraph(block.hero?.description),
        paragraph(block.hero?.note),
      ].join("");
    case "pageHeroBlock":
      return [heading(1, block.hero?.title || ""), paragraph(block.hero?.text)].join("");
    case "problemSolutionBlock":
      return [
        heading(2, block.problemTitle || "Probleem"),
        list(block.problems),
        heading(2, block.solutionTitle || "Oplossing"),
        list(block.solutions),
        paragraph(block.solutionNote),
      ].join("");
    case "textBlock": {
      const descText = Array.isArray(block.description)
        ? block.description.flatMap((b) => (b.children || []).map((s) => s.text)).join(" ")
        : "";
      return [heading(2, block.title || ""), paragraph(descText)].join("");
    }
    case "servicesListingBlock":
      return heading(2, "Diensten");
    case "projectsListingBlock":
      return heading(2, "Projecten");
    case "iconCardsBlock":
      return [
        heading(2, block.title || ""),
        ...(block.items || []).map((item) => `- **${item.title}**: ${item.text || ""}\n`),
        "\n",
      ].join("");
    case "partnersBlock":
      return [
        heading(2, block.title || "Partners"),
        paragraph(block.text),
      ].join("");
    case "logoCardGridBlock":
      return [
        heading(2, block.title || "Partners"),
        paragraph(block.text),
        ...(block.partners || []).map(
          (partner) => `- **${partner.name}**${partner.category ? ` - ${partner.category}` : ""}\n`
        ),
        "\n",
      ].join("");
    case "googleReviewsBlock":
      return heading(2, "Google reviews");
    case "reviewShowcaseBlock":
      return [
        heading(2, block.title || "Reviews"),
        paragraph(block.reviewsSummary),
        ...(block.selectedReviews || []).map(
          (review) => `- **${review.name}**${review.location ? ` (${review.location})` : ""}: ${review.quote}\n`
        ),
        "\n",
      ].join("");
    case "ctaBannerBlock":
      return [
        heading(2, block.cta?.title || "Contact"),
        paragraph(block.cta?.text),
        block.cta?.buttons?.[0]
          ? `- ${link(block.cta.buttons[0].label || "Neem contact op", block.cta.buttons[0].link.linkType === "external" ? block.cta.buttons[0].link.externalUrl : "#")}\n\n`
          : "",
      ].join("");
    case "contactFormBlock":
      return [
        heading(1, block.title || "Contact"),
        paragraph(block.text),
        paragraph(block.note),
      ].join("");
    case "aboutIntroBlock":
      return [
        heading(1, block.title || "Over ons"),
        paragraph(block.intro),
        ...(block.introItems || []).map((item) => `- **${item.title}**: ${item.text || ""}\n`),
        "\n",
      ].join("");
    case "aboutTeamBlock":
      return [
        heading(2, block.teamTitle || "Team"),
        ...(block.coreTeam || []).map(
          (member) => `- **${member.name}** (${member.role}): ${member.text || ""}\n`
        ),
        "\n",
      ].join("");
    case "teamProfilesShowcaseBlock":
      return [
        heading(2, block.title || "Team"),
        paragraph(block.intro),
        ...(block.profiles || []).map(
          (profile) =>
            `- **${profile.name || ""}**${profile.role ? ` (${profile.role})` : ""}: ${profile.whatIDo || ""} ${profile.why || ""}\n`
        ),
        paragraph(block.closingText),
        "\n",
      ].join("");
    case "visitInvitationBlock":
      return [
        heading(2, block.title || "Bezoek"),
        paragraph(block.description),
        block.primaryButtonLabel
          ? `- ${block.primaryButtonLabel}${block.secondaryNote ? `: ${block.secondaryNote}` : ""}\n\n`
          : "",
      ].join("");
    case "splitTimelineBlock":
      return [
        heading(2, block.title || "Tijdlijn"),
        paragraph(block.description),
        block.highlightLabel ? `- ${block.highlightLabel}\n\n` : "",
        ...(block.milestones || []).map(
          (milestone) =>
            `- **${milestone.eyebrow || ""}**${milestone.title ? `: ${milestone.title}` : ""}${milestone.text ? ` - ${milestone.text}` : ""}\n`
        ),
        "\n",
        ...(block.assurancePoints || []).map(
          (item) => `- **${item.title || ""}**${item.text ? `: ${item.text}` : ""}\n`
        ),
        "\n",
      ].join("");
    case "faqAnswersGridBlock":
      return [
        heading(2, block.title || "Vragen en antwoorden"),
        paragraph(block.intro),
        ...(block.faqs || []).map(
          (faq, index) => `### ${(index + 1).toString().padStart(2, "0")} ${faq.question}\n\n${faq.answer}\n\n`
        ),
      ].join("");
    case "projectsShowcaseGridBlock":
      return [
        heading(2, block.title || "Projecten"),
        paragraph(block.intro),
        ...(block.projects || []).map(
          (project) =>
            `- **${project.title || ""}**${project.duration ? ` (${project.duration})` : ""}${project.type ? ` - ${project.type}` : ""}${project.location ? ` - ${project.location}` : ""}\n`
        ),
        "\n",
      ].join("");
    case "darkAssuranceGridBlock":
      return [
        heading(2, block.title || "Zekerheden"),
        ...(block.items || []).map(
          (item) => `- **${item.title || ""}**${item.text ? `: ${item.text}` : ""}\n`
        ),
        "\n",
      ].join("");
    case "centeredActionBannerBlock":
      return [
        heading(2, block.title || "Contact"),
        block.primaryButtonLabel ? `- ${block.primaryButtonLabel}\n` : "",
        block.secondaryButtonLabel ? `- ${block.secondaryButtonLabel}\n` : "",
        "\n",
      ].join("");
    case "processBlock":
      return [
        heading(1, `${block.titlePrefix || ""} ${block.titleHighlight || ""}`.trim()),
        paragraph(block.intro),
        ...(block.steps || []).map(
          (step, index) => `${index + 1}. **${step.title}** — ${step.text || ""}\n`
        ),
        "\n",
        heading(2, "Voordelen"),
        ...(block.benefits || []).map((item) => `- **${item.title}**: ${item.text || ""}\n`),
        "\n",
        heading(2, "Vertrouwen"),
        ...(block.trustPoints || []).map((item) => `- **${item.title}**: ${item.text || ""}\n`),
        "\n",
      ].join("");
    case "processFaqBlock":
      return [
        heading(2, block.faqTitle || "Veelgestelde vragen"),
        paragraph(block.faqIntro),
        ...(block.faqs || []).map(
          (faq) => `### ${faq.question}\n\n${faq.answer}\n\n`
        ),
      ].join("");
    case "businessContentBlock":
      return [
        heading(2, block.positionTitle || "Zakelijk"),
        paragraph(block.positionText),
        ...(block.cards || []).map(
          (card) => [heading(3, card.title || ""), list(card.items)].join("")
        ),
      ].join("");
    default:
      return "";
  }
}

export async function buildMarkdownForPath(pathname: string) {
  const normalized = pathname === "" ? "/" : pathname.startsWith("/") ? pathname : `/${pathname}`;
  const siteSettings = await getSiteSettings();
  const siteUrl = getSiteUrl();
  const lines: string[] = [
    "---",
    `title: DRO Renovaties`,
    `source: ${absoluteUrl(normalized)}`,
    `format: text/markdown`,
    `language: nl`,
    "---",
    "",
    `# DRO Renovaties`,
    "",
    `> ${siteSettings.description || siteSettings.footer.description}`,
    "",
    `Canonical URL: ${absoluteUrl(normalized)}`,
    "",
  ];

  if (normalized === "/") {
    const page = await getPageBySlug("home");
    page?.contentBlocks?.forEach((block) => lines.push(blockToMarkdown(block)));
    lines.push(`## Navigatie\n\n`);
    siteSettings.headerMenu.forEach((item) => {
      if (item.type === "link" && item.link?.linkType === "external" && item.link.externalUrl) {
        lines.push(`- ${link(item.label, item.link.externalUrl)}`);
      }
    });
    lines.push("\n");
    return lines.join("\n");
  }

  if (normalized === "/diensten") {
    const page = await getServicesIndex();
    page?.contentBlocks?.forEach((block) => lines.push(blockToMarkdown(block)));
    return lines.join("\n");
  }

  if (normalized === "/projecten") {
    const page = await getProjectsIndex();
    page?.contentBlocks?.forEach((block) => lines.push(blockToMarkdown(block)));
    return lines.join("\n");
  }

  if (normalized === "/kennisbank") {
    const page = await getBlogsIndex();
    page?.contentBlocks?.forEach((block) => lines.push(blockToMarkdown(block)));
    lines.push(heading(2, "Artikelen"));
    const posts = await getBlogPosts();
    posts.forEach((post) => {
      lines.push(`- ${link(post.title, post.href)}${post.excerpt ? ` — ${post.excerpt}` : ""}\n`);
    });
    return lines.join("\n");
  }

  if (normalized.startsWith("/kennisbank/")) {
    const slug = normalized.replace("/kennisbank/", "");
    const post = await getBlogPostBySlug(slug);
    if (!post) return null;
    lines.push(heading(1, post.title));
    if (post.author?.name || post.publishedAt) {
      lines.push(
        `${post.author?.name ? `Door ${post.author.name}` : ""}${
          post.author?.name && post.publishedAt ? " — " : ""
        }${post.publishedAt ? post.publishedAt : ""}\n\n`
      );
    }
    lines.push(paragraph(post.excerpt));
    lines.push(richTextToMarkdown(post.body));
    if (post.relatedServices?.length) {
      lines.push(heading(2, "Gerelateerde diensten"));
      post.relatedServices.forEach((service) => {
        lines.push(`- ${link(service.title, service.href)}\n`);
      });
      lines.push("\n");
    }
    if (post.relatedProjects?.length) {
      lines.push(heading(2, "Gerelateerde projecten"));
      post.relatedProjects.forEach((project) => {
        lines.push(`- ${link(project.title, `/projecten/${project.slug}`)}\n`);
      });
      lines.push("\n");
    }
    lines.push(`Terug naar ${link("de kennisbank", "/kennisbank")}.\n`);
    return lines.join("\n");
  }

  if (normalized === "/werkwijze") {
    const page = await getPageBySlug("werkwijze");
    page?.contentBlocks?.forEach((block) => lines.push(blockToMarkdown(block)));
    return lines.join("\n");
  }

  if (normalized.startsWith("/diensten/")) {
    const slug = normalized.replace("/diensten/", "");
    const service = await getServiceBySlug(slug);
    if (!service) return null;
    lines.push(heading(1, service.title));
    lines.push(paragraph(service.intro));
    service.sections.forEach((section) => {
      lines.push(heading(2, section.title));
      lines.push(list(section.items));
    });
    lines.push(heading(2, service.processTitle));
    lines.push(paragraph(service.processText));
    service.faqs?.forEach((faq) => {
      lines.push(`### ${faq.question}\n\n${faq.answer}\n\n`);
    });
    lines.push(`Terug naar ${link("alle diensten", "/diensten")}.\n`);
    return lines.join("\n");
  }

  if (normalized.startsWith("/projecten/")) {
    const slug = normalized.replace("/projecten/", "");
    const project = await getProjectBySlug(slug);
    if (!project) return null;
    lines.push(heading(1, `${project.type} in ${project.location}`));
    lines.push(paragraph(project.description));
    lines.push(heading(2, "Uitgevoerd werk"));
    lines.push(list(project.work_items));
    lines.push(heading(2, "Projectverhaal"));
    lines.push(paragraph(project.story));
    lines.push(`Terug naar ${link("alle projecten", "/projecten")}.\n`);
    return lines.join("\n");
  }

  const segments = normalized.split("/").filter(Boolean);

  if (segments.length === 2) {
    const [citySlug, serviceSlug] = segments;
    const [location, service] = await Promise.all([
      getLocationBySlug(citySlug),
      getServiceBySlug(serviceSlug),
    ]);

    if (location && service) {
      // service.title is the SEO-styled page H1 (already includes a city + brand suffix);
      // eyebrow holds the clean short service name for composing "{name} in {city}" copy.
      const serviceName = service.eyebrow || service.title;
      lines.push(heading(1, `${serviceName} in ${location.name}`));
      lines.push(paragraph(service.intro));
      lines.push(paragraph(`Actief in ${location.name} en omgeving. Vaste prijs, geen aanbetaling, 4,8 uit 273 reviews.`));
      if (location.localContext) {
        lines.push(heading(2, "Lokale situatie"));
        lines.push(paragraph(location.localContext));
      }
      service.sections.forEach((section) => {
        lines.push(heading(2, section.title));
        lines.push(list(section.items));
      });
      service.faqs?.forEach((faq) => {
        lines.push(`### ${faq.question}\n\n${faq.answer}\n\n`);
      });
      lines.push(`Terug naar ${link(location.name, `/${citySlug}`)} of ${link(`alle ${serviceName.toLowerCase()}`, `/diensten/${serviceSlug}`)}.\n`);
      return lines.join("\n");
    }
  }

  const cmsSlug = normalized.replace(/^\//, "");
  const page = await getPageBySlug(cmsSlug);
  if (page?.contentBlocks?.length) {
    lines.push(heading(1, page.title || cmsSlug));
    page.contentBlocks.forEach((block) => lines.push(blockToMarkdown(block)));
    return lines.join("\n");
  }

  const location = await getLocationBySlug(cmsSlug);
  if (location) {
    lines.push(heading(1, `Renovatie in ${location.name}`));
    lines.push(paragraph(location.intro));
    if (location.localContext) {
      lines.push(heading(2, "Lokale situatie"));
      lines.push(paragraph(location.localContext));
    }
    if (location.whyDro) {
      lines.push(heading(2, "Waarom DRO"));
      lines.push(paragraph(location.whyDro));
    }
    if (location.popularServices.length) {
      lines.push(heading(2, "Populaire diensten"));
      location.popularServices.forEach((service) => {
        lines.push(`- ${link(service.title, `/${location.slug}/${service.slug}`)}\n`);
      });
      lines.push("\n");
    }
    if (location.nearbyCities.length) {
      lines.push(heading(2, "Ook actief in de omgeving"));
      lines.push(list(location.nearbyCities.map((city) => city.name)));
    }
    return lines.join("\n");
  }

  return null;
}
