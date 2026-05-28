import type {Metadata} from "next";

import DynamicPageShell from "@/components/cms/DynamicPageShell";
import {cmsPageMetadata, requireCmsPage} from "@/lib/cms-page";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata({
    slug: "home",
    pathname: "/",
    fallbackTitle: "Renovatiebedrijf | DRO Renovaties",
  });
}

export default async function Home() {
  const page = await requireCmsPage("home");
  return <DynamicPageShell page={page} pathname="/" />;
}
