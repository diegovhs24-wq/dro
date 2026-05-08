const team = [
  {
    name: "Therab",
    role: "Eerste aanspreekpunt",
    image: "/therab-eerste-aanspreekpunt.jpg",
    text: "Vanaf het eerste contact zorgt hij dat alles duidelijk is en blijft."
  },
  {
    name: "Jarek",
    role: "Uitvoering",
    image: "/jarek-hoofd-uitvoering.jpg",
    text: "Stuurt de uitvoering aan en zorgt dat alles loopt zoals afgesproken."
  },
  {
    name: "Scott",
    role: "Klantcontact",
    image: "/scott-klantcontact.png",
    text:
      "Is dagelijks op kantoor, houdt klanten op de hoogte van updates en brengt vanuit zijn interieurfamilie een scherp oog voor afwerking mee."
  }
];

const questions = [
  {
    question: "Wat gebeurt er nadat ik mijn aanvraag heb gedaan?",
    answer:
      "U ontvangt binnen 24 uur een reactie. We kijken eerst of het project bij ons past en nemen daarna contact met u op om alles rustig door te nemen."
  },
  {
    question: "Hoe snel weet ik waar ik aan toe ben?",
    answer:
      "Na het eerste gesprek kunnen we meestal snel duidelijkheid geven over aanpak, planning en mogelijkheden. Geen lange wachttijden of onduidelijke trajecten."
  },
  {
    question: "Hoe zorgen jullie dat een project niet uitloopt?",
    answer:
      "We werken met een duidelijke planning en vaste teams. Daardoor blijft het overzicht behouden en kunnen we snel schakelen wanneer dat nodig is."
  },
  {
    question: "Heb ik één aanspreekpunt tijdens het project?",
    answer:
      "Ja. U heeft altijd één aanspreekpunt die het overzicht houdt en bereikbaar is voor vragen of updates."
  },
  {
    question: "Wat gebeurt er als er iets verandert tijdens de verbouwing?",
    answer:
      "Dan bespreken we dat direct. We houden het transparant en zorgen dat u altijd weet waar u aan toe bent voordat er iets wordt aangepast."
  },
  {
    question: "Werken jullie met vaste mensen?",
    answer:
      "Ja. We werken met vaste teams en partners die op elkaar zijn ingespeeld. Dat zorgt voor rust en kwaliteit tijdens de uitvoering."
  },
  {
    question: "Voor welke projecten zijn jullie de juiste partij?",
    answer:
      "Voor projecten waar duidelijke afspraken, goede communicatie en een strakke uitvoering belangrijk zijn. Dan maken wij het verschil."
  }
];

export default function TeamFaqSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="eyebrow">Duidelijkheid vooraf</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-5xl">
            Voordat we starten, dit wilt u weten
          </h2>
          <p className="mt-5 text-base font-semibold leading-8 text-neutral-600 sm:text-lg">
            Een verbouwing begint niet met slopen, maar met duidelijkheid. Daarom
            vinden we het belangrijk dat u vooraf precies weet waar u aan toe bent.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="eyebrow">Dit zijn de mensen die u spreekt</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {team.map((member) => (
                <article className="group" key={member.name}>
                  <div
                    className="min-h-[280px] rounded-lg bg-cover bg-center shadow-premium transition duration-300 group-hover:-translate-y-1 sm:min-h-[340px]"
                    style={{ backgroundImage: `url(${member.image})` }}
                  />
                  <div className="-mt-10 mx-4 rounded-lg bg-white p-5 shadow-sm">
                    <h3 className="text-xl font-bold text-brand-ink">
                      {member.name} — {member.role}
                    </h3>
                    <p className="mt-3 text-sm font-semibold leading-6 text-neutral-600">
                      {member.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-5 overflow-hidden rounded-lg bg-neutral-950 text-white shadow-premium">
              <div className="min-h-[220px] bg-[url('/dro-renovaties-team.jpg')] bg-cover bg-center opacity-85" />
              <p className="p-5 text-sm font-semibold leading-7 text-white/80">
                Daarachter staat een vast team van vakmensen dat dagelijks
                samenwerkt aan projecten.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-brand-soft p-4 sm:p-6">
            <div className="grid gap-3">
              {questions.map((item, index) => (
                <details
                  className="group rounded-lg bg-white px-5 py-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-premium open:shadow-premium"
                  key={item.question}
                  open={index === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-bold text-brand-ink">
                    <span>{item.question}</span>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-orange/10 text-brand-orange transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-sm font-semibold leading-7 text-neutral-600">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
