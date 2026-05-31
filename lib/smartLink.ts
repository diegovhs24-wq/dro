import type {SmartLink} from "@/lib/types";

export function resolveSmartLink(link: SmartLink | null | undefined): {href: string; openInNewTab: boolean} {
  if (!link) return {href: "#", openInNewTab: false};
  if (link.linkType === "internal") {
    const ref = link.internalRef;
    if (!ref?.slug) return {href: "#", openInNewTab: false};
    if (ref._type === "service") return {href: `/diensten/${ref.slug}`, openInNewTab: false};
    if (ref._type === "project") return {href: `/projecten/${ref.slug}`, openInNewTab: false};
    return {href: ref.slug === "home" ? "/" : `/${ref.slug}`, openInNewTab: false};
  }
  return {href: link.externalUrl || "#", openInNewTab: link.openInNewTab ?? false};
}
