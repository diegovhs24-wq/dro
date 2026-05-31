type GoogleRatingBadgeProps = {
  compact?: boolean;
  variant?: "light" | "dark";
  ratingScore?: number;
  ratingLabel?: string;
};

const googleLetters = [
  ["G", "#4285f4"],
  ["o", "#ea4335"],
  ["o", "#fbbc05"],
  ["g", "#4285f4"],
  ["l", "#34a853"],
  ["e", "#ea4335"]
];

export default function GoogleRatingBadge({
  compact = false,
  variant = "light",
  ratingScore = 4.8,
  ratingLabel = "4.8 Star Rating",
}: GoogleRatingBadgeProps) {
  const muted = variant === "dark" ? "text-white/70" : "text-neutral-500";
  const filledStars = Math.min(5, Math.max(0, Math.round(ratingScore)));
  const stars = "★".repeat(filledStars) + "☆".repeat(5 - filledStars);

  return (
    <div
      className={`inline-flex items-center gap-4 rounded-lg ${
        compact ? "px-0 py-0" : "bg-white/95 px-4 py-3 shadow-sm"
      }`}
      aria-label={`Google ${ratingLabel}`}
    >
      <div>
        <div
          className={`flex items-baseline font-black leading-none tracking-[-0.06em] ${
            compact ? "text-2xl" : "text-4xl"
          }`}
          aria-hidden="true"
        >
          {googleLetters.map(([letter, color], index) => (
            <span key={`${letter}-${index}`} style={{ color }}>
              {letter}
            </span>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-3">
          <span
            className={`leading-none text-[#fbbc05] ${compact ? "text-base" : "text-2xl"}`}
            aria-hidden="true"
          >
            {stars}
          </span>
          <span className={`font-bold ${compact ? "text-sm" : "text-lg"} ${muted}`}>
            {ratingLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
