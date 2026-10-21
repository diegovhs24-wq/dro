import type {Metadata} from "next";

import ConversionRoutePage from "@/components/routes/ConversionRoutePage";
import {SPECIALISTISCH as ROUTE} from "@/lib/conversionRoutes";
import {buildPageMetadata} from "@/lib/seo/metadata";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    fallbackTitle: ROUTE.metaTitle,
    fallbackDescription: ROUTE.metaDescription,
    pathname: ROUTE.path,
  });
}

export default function Page() {
  return <ConversionRoutePage route={ROUTE} />;
}
