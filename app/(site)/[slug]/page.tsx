import type {Metadata} from "next";
import {notFound, redirect} from "next/navigation";

import DynamicPageShell from "@/components/cms/DynamicPageShell";
import LocationDetailRoute from "@/components/LocationDetailRoute";
import {getLocationSlugs} from "@/lib/cms";
import {pageOrLocationMetadata, resolvePageOrLocation} from "@/lib/cms-page";

type DynamicPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getLocationSlugs();
  return slugs.map((slug) => ({slug}));
}

export async function generateMetadata({params}: DynamicPageProps): Promise<Metadata> {
  const {slug} = await params;

  return pageOrLocationMetadata({
    slug,
    pathname: `/${slug}`,
    fallbackTitle: "DRO Renovaties",
  });
}

export default async function DynamicPage({params}: DynamicPageProps) {
  const {slug} = await params;
  const result = await resolvePageOrLocation(slug);

  if (result.kind === "page") {
    return <DynamicPageShell page={result.page} pathname={`/${slug}`} />;
  }

  if (result.kind === "location") {
    return <LocationDetailRoute slug={slug} />;
  }

  if (result.kind === "redirect_home") {
    redirect("/");
  }

  notFound();
}
