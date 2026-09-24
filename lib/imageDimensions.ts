// Losstaand van lib/sanity.ts (dat next/headers importeert en dus niet in
// client components mag landen). Puur string-parsing, geen server-only deps,
// veilig te importeren vanuit "use client"-componenten zoals Header/Footer.
//
// Sanity CDN-URL's coderen de echte pixelafmetingen van het origineel in het
// pad (…-989x252-png?w=…). Zo krijgen we het echte breedte/hoogte-aspect voor
// next/image (nodig voor CLS-preventie bij "auto width" logo's) zonder een
// aparte GROQ-query of asset-fetch.
export function getSanityImageDimensions(url: string | null | undefined): {width: number; height: number} | null {
  if (!url) return null
  const match = url.match(/-(\d+)x(\d+)-\w+(?:\?|$)/)
  if (!match) return null
  const width = Number(match[1])
  const height = Number(match[2])
  if (!width || !height) return null
  return {width, height}
}
