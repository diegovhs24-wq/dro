import type {Metadata} from "next";

import DynamicPageShell from "@/components/cms/DynamicPageShell";
import {cmsPageMetadata, requireCmsPage} from "@/lib/cms-page";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata({
    slug: "over-ons",
    pathname: "/over-ons",
    fallbackTitle: "Over DRO Renovaties | Team en werkwijze",
  });
}

export default async function OverOnsPage() {
  const page = await requireCmsPage("over-ons");
  return <DynamicPageShell page={page} pathname="/over-ons" />;
}
