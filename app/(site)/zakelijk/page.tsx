import type {Metadata} from "next";

import DynamicPageShell from "@/components/cms/DynamicPageShell";
import {cmsPageMetadata, requireCmsPage} from "@/lib/cms-page";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata({
    slug: "zakelijk",
    pathname: "/zakelijk",
    fallbackTitle: "Zakelijke renovatie | DRO Renovaties",
  });
}

export default async function ZakelijkPage() {
  const page = await requireCmsPage("zakelijk");
  return <DynamicPageShell page={page} pathname="/zakelijk" />;
}
