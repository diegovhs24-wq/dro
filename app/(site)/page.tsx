import type {Metadata} from "next";

import HomePage, {HOME_DESCRIPTION, HOME_TITLE} from "@/components/premium/HomePage";
import {buildPageMetadata} from "@/lib/seo/metadata";

// Homepage in code (fase 2b) in plaats van CMS-blokken: de oude blokken bevatten
// onbevestigde claims (vaste prijs, garantietermijn, 100+ projecten, dekking).
// Projecten, reviews en geverifieerde claims komen nog steeds uit Sanity.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    fallbackTitle: `${HOME_TITLE} | DRO Renovaties`,
    fallbackDescription: HOME_DESCRIPTION,
    pathname: "/",
  });
}

export default function Home() {
  return <HomePage />;
}
