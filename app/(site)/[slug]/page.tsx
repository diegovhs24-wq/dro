import type {Metadata} from "next";

import DynamicPageShell from "@/components/cms/DynamicPageShell";
import {cmsPageMetadata, requireCmsPage} from "@/lib/cms-page";

type DynamicPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({params}: DynamicPageProps): Promise<Metadata> {
  const {slug} = await params;

  return cmsPageMetadata({
    slug,
    pathname: `/${slug}`,
    fallbackTitle: "DRO Renovaties",
  });
}

export default async function DynamicPage({params}: DynamicPageProps) {
  const {slug} = await params;
  const page = await requireCmsPage(slug);

  return <DynamicPageShell page={page} pathname={`/${slug}`} />;
}
