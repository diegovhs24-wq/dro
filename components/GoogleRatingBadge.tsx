type GoogleRatingBadgeProps = {
  compact?: boolean;
  variant?: "light" | "dark";
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
  variant = "light"
}: GoogleRatingBadgeProps) {
  const muted = variant === "dark" ? "text-white/70" : "text-neutral-500";

  return (
    <div
      className={`inline-flex items-center gap-4 rounded-lg ${
        compact ? "px-0 py-0" : "bg-white/95 px-4 py-3 shadow-sm"
      }`}
      aria-label="Google 4.8 Star Rating"
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
            ★★★★★
          </span>
          <span className={`font-bold ${compact ? "text-sm" : "text-lg"} ${muted}`}>
            4.8 Star Rating
          </span>
        </div>
      </div>
    </div>
  );
}
