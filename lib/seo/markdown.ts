import {getPageBySlug, getProjectBySlug, getServiceBySlug, getSiteSettings} from "@/lib/cms";
import {absoluteUrl, getSiteUrl} from "@/lib/seo/site";
import type {CmsDynamicPageBlock} from "@/lib/cms";

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
    case "textBlock":
      return [heading(2, block.title || ""), paragraph(block.text)].join("");
    case "servicesListingBlock":
      return heading(2, block.title || "Diensten");
    case "projectsListingBlock":
      return heading(2, block.title || "Projecten");
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
    case "googleReviewsBlock":
      return heading(2, "Google reviews");
    case "ctaBannerBlock":
      return [
        heading(2, block.cta?.title || "Contact"),
        paragraph(block.cta?.text),
        block.cta?.primaryHref
          ? `- ${link(block.cta.primaryLabel || "Neem contact op", block.cta.primaryHref)}\n\n`
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
    case "processHeaderBlock":
      return [
        heading(1, `${block.titlePrefix || ""} ${block.titleHighlight || ""}`.trim()),
        paragraph(block.intro),
        ...(block.steps || []).map(
          (step, index) => `${index + 1}. **${step.title}** — ${step.text || ""}\n`
        ),
        "\n",
      ].join("");
    case "processBenefitsBlock":
      return [
        heading(2, "Voordelen"),
        ...(block.benefits || []).map((item) => `- **${item.title}**: ${item.text || ""}\n`),
        "\n",
      ].join("");
    case "processTrustBlock":
      return [
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
    const page = await getPageBySlug("diensten");
    page?.contentBlocks?.forEach((block) => lines.push(blockToMarkdown(block)));
    return lines.join("\n");
  }

  if (normalized === "/projecten") {
    const page = await getPageBySlug("projecten");
    page?.contentBlocks?.forEach((block) => lines.push(blockToMarkdown(block)));
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

  const cmsSlug = normalized.replace(/^\//, "");
  const page = await getPageBySlug(cmsSlug);
  if (page?.contentBlocks?.length) {
    lines.push(heading(1, page.title || cmsSlug));
    page.contentBlocks.forEach((block) => lines.push(blockToMarkdown(block)));
    return lines.join("\n");
  }

  return null;
}
