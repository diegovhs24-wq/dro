import JsonLd from "@/components/seo/JsonLd";
import type {BreadcrumbItem, FaqStructuredItem, ServiceStructuredDataInput} from "@/lib/seo/structured-data";
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildJsonLdGraph,
  buildOrganizationGraph,
  buildServiceSchema,
  buildWebPageSchema,
} from "@/lib/seo/structured-data";
import type {OrganizationSeo} from "@/lib/seo/site";
import type {SiteSettings} from "@/lib/types";

type PageStructuredDataProps = {
  siteSettings: SiteSettings;
  organizationSeo?: OrganizationSeo | null;
  pathname: string;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  service?: ServiceStructuredDataInput;
  faqs?: FaqStructuredItem[];
  includeOrganization?: boolean;
};

export default function PageStructuredData({
  siteSettings,
  organizationSeo,
  pathname,
  title,
  description,
  breadcrumbs = [],
  service,
  faqs = [],
  includeOrganization = false,
}: PageStructuredDataProps) {
  const graph = [
    ...(includeOrganization ? buildOrganizationGraph(siteSettings, organizationSeo) : []),
    buildWebPageSchema({title, description, pathname}),
    breadcrumbs.length ? buildBreadcrumbList(breadcrumbs) : null,
    service ? buildServiceSchema(service, siteSettings, organizationSeo) : null,
    buildFaqPageSchema(faqs),
  ];

  return <JsonLd data={buildJsonLdGraph(graph)} />;
}
