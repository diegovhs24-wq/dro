import {NextResponse} from "next/server";
import {getBlogPosts, getProjects, getServices} from "@/lib/cms";
import {buildMarkdownForPath} from "@/lib/seo/markdown";

const STATIC_PATHS = ["/", "/diensten", "/projecten", "/kennisbank", "/werkwijze", "/over-ons", "/zakelijk", "/contact"];

export async function GET() {
  const [services, projects, posts] = await Promise.all([getServices(), getProjects(), getBlogPosts()]);

  const paths = [
    ...STATIC_PATHS,
    ...services.map((service) => service.href),
    ...projects.map((project) => `/projecten/${project.slug}`),
    ...posts.map((post) => post.href),
  ];

  const pages = await Promise.all(paths.map((path) => buildMarkdownForPath(path)));

  const body = pages.filter((page): page is string => Boolean(page)).join("\n\n---\n\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
