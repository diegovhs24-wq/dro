import type {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pagina niet gevonden | DRO Renovaties",
  description:
    "De pagina die u zoekt bestaat niet meer of is verplaatst. Ga terug naar de homepage of neem contact op.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden bg-white py-16 sm:py-20">
      <div className="section-shell">
        <div className="mx-auto max-w-xl text-center">
          <p
            aria-hidden="true"
            className="text-[7.5rem] font-extrabold leading-none tracking-[-0.06em] text-brand-orange sm:text-[10rem]"
          >
            404
          </p>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
            Pagina niet gevonden
          </h1>

          <p className="mx-auto mt-4 max-w-md text-base font-semibold leading-7 text-neutral-600">
            De pagina bestaat niet meer, is verplaatst of het adres klopt niet. Ga terug naar de
            homepage of start direct een intake.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link className="btn-primary min-w-[180px]" href="/">
              Naar homepage
            </Link>
            <Link
              className="inline-flex min-w-[180px] items-center justify-center rounded-md border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-brand-ink shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-brand-orange/30 hover:bg-brand-soft focus:outline-none focus:ring-4 focus:ring-orange-100"
              href="/contact"
            >
              Start intake
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
