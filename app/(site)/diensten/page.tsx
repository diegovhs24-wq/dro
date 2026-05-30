import type {Metadata} from "next";
import {notFound} from "next/navigation";

import ServicesIndexShell from "@/components/cms/ServicesIndexShell";
import {getServicesIndex, metadataFromSeo} from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getServicesIndex();
  return metadataFromSeo(page?.seo || {}, page?.title || "Renovatiediensten | DRO Renovaties", {
    pathname: "/diensten",
  });
}

export default async function DienstenPage() {
  const page = await getServicesIndex();
  if (!page) notFound();
  return <ServicesIndexShell page={page} />;
}
