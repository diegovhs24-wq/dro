import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";

type ServicePageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<{ title: string; items: string[] }>;
  processTitle: string;
  processText: string;
};

export default function ServicePage({
  eyebrow,
  title,
  intro,
  sections,
  processTitle,
  processText
}: ServicePageProps) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} text={intro} />
      <section className="bg-white py-24">
        <div className="section-shell grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-6">
            {sections.map((section) => (
              <div className="rounded-lg border border-black/10 bg-white p-7" key={section.title}>
                <h2 className="text-2xl font-bold">{section.title}</h2>
                <ul className="mt-5 grid gap-3 text-neutral-700">
                  {section.items.map((item) => (
                    <li className="flex gap-3" key={item}>
                      <span className="mt-1 text-brand-orange">✔</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <aside className="rounded-lg bg-brand-soft p-7 lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Duidelijkheid vooraf</p>
            <h2 className="mt-3 text-3xl font-bold">{processTitle}</h2>
            <p className="mt-5 leading-8 text-neutral-700">{processText}</p>
            <ul className="mt-6 grid gap-3 text-sm font-semibold text-neutral-700">
              {[
                "Heldere en gespecificeerde offerte",
                "Realistische planning",
                "Eén vast aanspreekpunt",
                "Volledige begeleiding van A tot Z"
              ].map((item) => (
                <li className="flex gap-3" key={item}>
                  <span className="text-brand-orange">✔</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a className="btn-primary mt-7 w-full" href="/contact">
              Plan een vrijblijvend gesprek
            </a>
          </aside>
        </div>
      </section>
      <CTASection />
    </>
  );
}
