import type {Metadata} from "next";

import BlogsIndexShell from "@/components/cms/BlogsIndexShell";
import {getBlogsIndex, metadataFromSeo, type IndexPageDoc} from "@/lib/cms";

const fallbackBlogsIndex: IndexPageDoc = {
  title: "Kennisbank",
  seo: {
    metaTitle: "Kennisbank | DRO Renovaties",
    metaDescription: "Praktische renovatie-inzichten, adviezen en projectkennis van DRO Renovaties.",
  },
  contentBlocks: [],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = (await getBlogsIndex()) || fallbackBlogsIndex;
  return metadataFromSeo(page?.seo || {}, page?.title || "Kennisbank | DRO Renovaties", {
    pathname: "/kennisbank",
  });
}

export default async function KennisbankPage() {
  const page = (await getBlogsIndex()) || fallbackBlogsIndex;
  return <BlogsIndexShell page={page} />;
}
