"use client";

import Link from "next/link";
import {useSearchParams} from "next/navigation";

import ProjectTile from "@/components/premium/ProjectTile";
import {PROJECT_CATEGORIES, projectCategory, type ProjectCategoryKey} from "@/lib/projectCategories";
import type {ProjectItem} from "@/lib/types";

type FilterKey = ProjectCategoryKey | "alle";

function isKey(value: string | null): value is ProjectCategoryKey {
  return PROJECT_CATEGORIES.some((c) => c.key === value);
}

// Zonder JavaScript of tijdens het laden staan alle projecten er (goed voor
// zoekmachines); de filter werkt via ?type=, zodat elke selectie deelbaar is.
export function PortfolioGridView({projects, active}: {projects: ProjectItem[]; active: FilterKey}) {
  const counts = Object.fromEntries(PROJECT_CATEGORIES.map((c) => [c.key, projects.filter((p) => projectCategory(p) === c.key).length]));
  const visible = active === "alle" ? projects : projects.filter((p) => projectCategory(p) === active);
  const filters: Array<{key: FilterKey; label: string; count: number}> = [
    {key: "alle", label: "Alle", count: projects.length},
    ...PROJECT_CATEGORIES.filter((c) => counts[c.key] > 0).map((c) => ({key: c.key as FilterKey, label: c.label, count: counts[c.key]})),
  ];

  return (
    <>
      <nav aria-label="Filter op type project" className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            aria-current={f.key === active ? "page" : undefined}
            className={`inline-flex min-h-[44px] items-center gap-2 rounded-[4px] px-4 text-[15px] font-medium transition ${
              f.key === active ? "bg-[var(--pr-ink)] text-white" : "bg-white text-[var(--pr-ink)] shadow-[inset_0_0_0_1px_var(--pr-line)] hover:shadow-[inset_0_0_0_1px_var(--pr-ink)]"
            }`}
            data-cta={`portfolio_filter_${f.key}`}
            href={f.key === "alle" ? "/projecten" : `/projecten?type=${f.key}`}
            key={f.key}
            scroll={false}
          >
            {f.label}
            <span className={`pr-num text-[13px] ${f.key === active ? "text-white/70" : "pr-muted"}`}>{f.count}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <ProjectTile key={p.slug} project={p} width={800} />
        ))}
      </div>
    </>
  );
}

export default function PortfolioGrid({projects}: {projects: ProjectItem[]}) {
  const params = useSearchParams();
  const type = params.get("type");
  return <PortfolioGridView active={isKey(type) ? type : "alle"} projects={projects} />;
}
