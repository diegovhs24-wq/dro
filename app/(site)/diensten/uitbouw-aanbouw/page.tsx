import type {Metadata} from "next";

import ServiceDetailRoute from "@/components/ServiceDetailRoute";
import {getServiceBySlug, metadataFromSeo} from "@/lib/cms";

const slug = "uitbouw-aanbouw";

export async function generateMetadata(): Promise<Metadata> {
  const service = await getServiceBySlug(slug);
  return metadataFromSeo(service?.seo || {}, "Uitbouw laten plaatsen Den Haag | DRO Renovaties", {
    pathname: `/diensten/${slug}`,
    fallbackDescription: service?.intro,
  });
}

export default function ServicePage() {
  return <ServiceDetailRoute slug={slug} />;
}
