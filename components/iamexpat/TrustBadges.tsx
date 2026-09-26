import SketchIcon, {type SketchIconName} from "@/components/SketchIcon";

type Credential = {
  icon: SketchIconName;
  label: string;
  description: string;
};

const CREDENTIALS: Credential[] = [
  {
    icon: "quality",
    label: "VLOK-certified",
    description: "A recognized Dutch quality mark for renovation contractors.",
  },
  {
    icon: "safety",
    label: "VCA-certified",
    description: "Certified for safe working practices on site.",
  },
  {
    icon: "shield",
    label: "CAR-insured",
    description: "Construction All Risk insurance: your project is covered against damage during the works.",
  },
  {
    icon: "warranty",
    label: "Liability insured",
    description: "Covered against damage or injury caused during the renovation.",
  },
];

// Certifications, front and center: for a visitor who cannot check DRO's
// reputation through a local network, these carry more weight than almost
// anything else on the page.
export default function TrustBadges({compact = false}: {compact?: boolean}) {
  return (
    <div className={compact ? "grid grid-cols-2 gap-2.5 sm:grid-cols-4" : "grid gap-3 sm:grid-cols-2 lg:grid-cols-4"}>
      {CREDENTIALS.map((credential) => (
        <div
          className={`flex items-start gap-2.5 rounded-lg border border-black/10 bg-white ${compact ? "p-2.5" : "p-3.5"}`}
          key={credential.label}
        >
          <SketchIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" name={credential.icon} />
          <div>
            <p className={`font-bold text-brand-ink ${compact ? "text-[12px] leading-tight" : "text-sm"}`}>
              {credential.label}
            </p>
            {!compact ? <p className="mt-0.5 text-xs leading-5 text-neutral-600">{credential.description}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
