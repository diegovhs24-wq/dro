import SketchIcon, { type SketchIconName } from "@/components/SketchIcon";

type TrustSignalItem = {
  icon: SketchIconName;
  label: string;
};

const DEFAULT_SIGNALS: TrustSignalItem[] = [
  { icon: "quality", label: "4,8 uit 273 Google-reviews" },
  { icon: "handshake", label: "Vaste prijs vooraf, geen verrassingen" },
  { icon: "payment", label: "Geen aanbetaling" },
  { icon: "shield", label: "VCA-gecertificeerd en verzekerd" },
];

export default function TrustSignals({ signals = DEFAULT_SIGNALS }: { signals?: TrustSignalItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {signals.map((signal) => (
        <div
          className="flex items-center gap-3 rounded-lg bg-brand-soft p-4"
          key={signal.label}
        >
          <SketchIcon name={signal.icon} className="h-8 w-8 shrink-0 text-brand-orange" />
          <span className="text-sm font-bold leading-5 text-brand-ink">{signal.label}</span>
        </div>
      ))}
    </div>
  );
}
