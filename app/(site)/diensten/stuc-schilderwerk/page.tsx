import type {Metadata} from "next";

import ServiceDetailRoute from "@/components/ServiceDetailRoute";
import {getServiceBySlug, metadataFromSeo} from "@/lib/cms";

const slug = "stuc-schilderwerk";

export async function generateMetadata(): Promise<Metadata> {
  const service = await getServiceBySlug(slug);
  return metadataFromSeo(service?.seo || {}, "Stuc- en schilderwerk | DRO Renovaties", {
    pathname: `/diensten/${slug}`,
    fallbackDescription: service?.intro,
  });
}

export default function ServicePage() {
  return <ServiceDetailRoute slug={slug} />;
}
