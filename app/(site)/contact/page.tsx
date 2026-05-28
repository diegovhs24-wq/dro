import type {Metadata} from "next";

import DynamicPageShell from "@/components/cms/DynamicPageShell";
import {cmsPageMetadata, requireCmsPage} from "@/lib/cms-page";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata({
    slug: "contact",
    pathname: "/contact",
    fallbackTitle: "Contact renovatiebedrijf Den Haag | DRO Renovaties",
  });
}

export default async function ContactPage() {
  const page = await requireCmsPage("contact");
  return <DynamicPageShell page={page} pathname="/contact" showFloatingActions={false} />;
}
