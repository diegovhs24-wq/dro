import type {Metadata} from "next";
import {notFound} from "next/navigation";

import ProjectsIndexShell from "@/components/cms/ProjectsIndexShell";
import {getProjectsIndex, metadataFromSeo} from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getProjectsIndex();
  return metadataFromSeo(page?.seo || {}, page?.title || "Renovatie projecten | DRO Renovaties", {
    pathname: "/projecten",
  });
}

export default async function ProjectenPage() {
  const page = await getProjectsIndex();
  if (!page) notFound();
  return <ProjectsIndexShell page={page} />;
}
