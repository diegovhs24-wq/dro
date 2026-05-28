import type {Metadata} from "next";

import ServiceDetailRoute from "@/components/ServiceDetailRoute";
import {getServiceBySlug, getServiceSlugs, metadataFromSeo} from "@/lib/cms";

type ServicePageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return slugs.map((slug) => ({slug}));
}

export async function generateMetadata({params}: ServicePageProps): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    return {
      title: "Dienst niet gevonden | DRO Renovaties"
    };
  }

  return metadataFromSeo(service.seo || {}, `${service.title} | DRO Renovaties`, {
    pathname: `/diensten/${params.slug}`,
    fallbackDescription: service.intro,
  });
}

export default function DynamicServicePage({params}: ServicePageProps) {
  return <ServiceDetailRoute slug={params.slug} />;
}
