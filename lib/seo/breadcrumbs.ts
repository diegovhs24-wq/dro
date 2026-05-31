import type {BreadcrumbItem} from "@/lib/seo/structured-data";

const LABELS: Record<string, string> = {
  "/": "Home",
  "/diensten": "Diensten",
  "/projecten": "Projecten",
  "/over-ons": "Over ons",
  "/werkwijze": "Werkwijze",
  "/zakelijk": "Zakelijk",
  "/contact": "Contact",
};

export function breadcrumbsForPath(pathname: string, currentLabel?: string): BreadcrumbItem[] {
  const normalized = pathname === "" ? "/" : pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (normalized === "/") {
    return [{name: "Home", path: "/"}];
  }

  const segments = normalized.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [{name: "Home", path: "/"}];
  let currentPath = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    const mapped = LABELS[currentPath];
    const name = isLast && currentLabel ? currentLabel : mapped || segment.replace(/-/g, " ");
    items.push({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      path: currentPath,
    });
  });

  return items;
}
