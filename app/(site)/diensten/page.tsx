import type {Metadata} from "next";

import DynamicPageShell from "@/components/cms/DynamicPageShell";
import {cmsPageMetadata, requireCmsPage} from "@/lib/cms-page";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata({
    slug: "diensten",
    pathname: "/diensten",
    fallbackTitle: "Renovatiediensten | DRO Renovaties",
  });
}

export default async function DienstenPage() {
  const page = await requireCmsPage("diensten");
  return <DynamicPageShell page={page} pathname="/diensten" />;
}
