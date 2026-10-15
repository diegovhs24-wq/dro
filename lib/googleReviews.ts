import {unstable_cache} from "next/cache";

// Reviewbron voor /ervaringen. Alles wat de pagina nodig heeft zit achter
// getReviewsData(), zodat de bron later te wisselen is (bijvoorbeeld een
// Featurable-feed met meer dan de 5 reviews die de Places API teruggeeft)
// zonder dat de pagina of de kaartjes hoeven te veranderen.

export type GoogleReview = {
  id: string;
  authorName: string;
  authorUrl?: string;
  photoUrl?: string;
  rating: number;
  text: string;
  relativeTime: string;
};

export type ReviewsData = {
  rating: number;
  total: number;
  reviews: GoogleReview[];
  profileUrl?: string;
  // true als de cijfers vers uit Google komen (of uit de laatste gecachte
  // Google-respons), false als we terugvallen op de vaste sitebrede waarden.
  live: boolean;
};

// Zelfde waarden die overal op de site al staan (hero, footer, schema.org).
const FALLBACK: ReviewsData = {rating: 4.8, total: 273, reviews: [], live: false};

const REVALIDATE_SECONDS = 60 * 60 * 12;

type PlacesReview = {
  name?: string;
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: {text?: string};
  originalText?: {text?: string};
  authorAttribution?: {displayName?: string; uri?: string; photoUri?: string};
};

type PlacesResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesReview[];
};

async function fetchFromGoogle(): Promise<ReviewsData> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    throw new Error("GOOGLE_PLACES_API_KEY / GOOGLE_PLACE_ID not configured");
  }

  const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=nl`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Places API responded ${res.status}`);
  }

  const data = (await res.json()) as PlacesResponse;

  if (typeof data.rating !== "number" || typeof data.userRatingCount !== "number") {
    throw new Error("Places API returned no rating");
  }

  const reviews: GoogleReview[] = (data.reviews || [])
    .map((review, index) => ({
      id: review.name || `review-${index}`,
      authorName: review.authorAttribution?.displayName || "",
      authorUrl: review.authorAttribution?.uri,
      photoUrl: review.authorAttribution?.photoUri,
      rating: review.rating || 5,
      // Reviewtekst ongewijzigd tonen (Google-richtlijnen): liefst de
      // originele tekst, niet de eventueel vertaalde versie.
      text: (review.originalText?.text || review.text?.text || "").trim(),
      relativeTime: review.relativePublishTimeDescription || "",
    }))
    .filter((review) => review.authorName && review.text);

  return {
    rating: data.rating,
    total: data.userRatingCount,
    reviews,
    profileUrl: data.googleMapsUri,
    live: true,
  };
}

// Een fout wordt niet door unstable_cache opgeslagen, dus een mislukte
// Google-aanroep overschrijft nooit een eerdere goede respons.
const cachedFetch = unstable_cache(fetchFromGoogle, ["google-reviews-v1"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["google-reviews"],
});

let lastGood: ReviewsData | null = null;

export async function getReviewsData(): Promise<ReviewsData> {
  try {
    const data = await cachedFetch();
    lastGood = data;
    return data;
  } catch (err) {
    if (process.env.GOOGLE_PLACES_API_KEY) {
      console.error("Google reviews fetch failed, using last known data:", err);
    }
    return lastGood || FALLBACK;
  }
}

export function formatRating(rating: number): string {
  return rating.toFixed(1).replace(".", ",");
}
