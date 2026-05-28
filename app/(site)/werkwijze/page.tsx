import type {Metadata} from "next";

import DynamicPageShell from "@/components/cms/DynamicPageShell";
import {cmsPageMetadata, requireCmsPage} from "@/lib/cms-page";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata({
    slug: "werkwijze",
    pathname: "/werkwijze",
    fallbackTitle: "Werkwijze | DRO Renovaties",
  });
}

export default async function WerkwijzePage() {
  const page = await requireCmsPage("werkwijze");
  return <DynamicPageShell page={page} pathname="/werkwijze" showFloatingActions={false} />;
}
