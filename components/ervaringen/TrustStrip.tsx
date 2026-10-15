import SketchIcon, {type SketchIconName} from "@/components/SketchIcon";

const ITEMS: Array<{icon: SketchIconName; label: string}> = [
  {icon: "quality", label: "VLOK-erkend"},
  {icon: "safety", label: "VCA-gecertificeerd"},
  {icon: "shield", label: "Verzekerd"},
  {icon: "budget", label: "Vaste prijs"},
  {icon: "payment", label: "Geen aanbetaling"},
];

export default function TrustStrip() {
  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="section-shell">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {ITEMS.map((item) => (
            <li
              className="flex items-center gap-3 rounded-lg border border-black/10 bg-brand-soft px-4 py-3.5"
              key={item.label}
            >
              <SketchIcon className="h-7 w-7 shrink-0 text-brand-orange" name={item.icon} />
              <span className="text-sm font-bold text-brand-ink">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
