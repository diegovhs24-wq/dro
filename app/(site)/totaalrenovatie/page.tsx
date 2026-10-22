import type {Metadata} from "next";

import ConversionRoutePage from "@/components/routes/ConversionRoutePage";
import {TOTAALRENOVATIE as ROUTE} from "@/lib/conversionRoutes";
import {buildPageMetadata} from "@/lib/seo/metadata";

// Vaste route boven de CMS-dienstpagina (/[slug]); het Sanity-document
// "totaalrenovatie" blijft bestaan voor stad x dienst-pagina's en het dienstenoverzicht.
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
