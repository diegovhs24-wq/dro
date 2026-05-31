import GoogleReviews from "@/components/GoogleReviews";
import { getReviews } from "@/lib/cms";

type GoogleReviewsBlockSectionProps = {
  limit?: number;
  compact?: boolean;
};

export default async function GoogleReviewsBlockSection({
  limit = 4,
  compact = true
}: GoogleReviewsBlockSectionProps) {
  const reviews = await getReviews();
  return <GoogleReviews compact={compact} limit={limit} reviews={reviews} />;
}
