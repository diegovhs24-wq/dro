import type {Metadata} from "next";

import DynamicPageShell from "@/components/cms/DynamicPageShell";
import {cmsPageMetadata, requireCmsPage} from "@/lib/cms-page";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata({
    slug: "projecten",
    pathname: "/projecten",
    fallbackTitle: "Renovatie projecten | DRO Renovaties",
  });
}

export default async function ProjectenPage() {
  const page = await requireCmsPage("projecten");
  return <DynamicPageShell page={page} pathname="/projecten" />;
}
