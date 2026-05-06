const teamMembers = [
  {
    name: "Therab",
    role: "Eerste aanspreekpunt",
    image: "/therab-eerste-aanspreekpunt.jpg",
    bullets: [
      "Eerste contact & intake",
      "Planning & projectoverzicht",
      "Duidelijke communicatie",
      "Afstemming voor de start"
    ],
    paragraphs: [
      "Mijn naam is Therab en bij DRO Renovaties ben ik vaak jullie eerste aanspreekpunt. Vanaf het eerste contact denk ik met jullie mee en zorg ik ervoor dat jullie duidelijkheid hebben over de mogelijkheden, planning en vervolgstappen.",
      "Ik kom uit een echte bouwfamilie en ben inmiddels de tweede generatie die de bouw ingaat. Van jongs af aan ben ik omringd door vakmensen, waardoor ik het werk van binnenuit begrijp en precies weet waar ik op moet letten.",
      "Voor mij is het belangrijk dat alles helder en eerlijk verloopt. Geen onduidelijkheden, maar gewoon duidelijke communicatie en realistische verwachtingen.",
      "Of het nu gaat om een kleine verbouwing of een groot project, ik zorg dat alles goed wordt afgestemd voordat we starten.",
      "In mijn vrije tijd sport ik graag om mijn hoofd leeg te maken en energie op te laden. Daarnaast hou ik van goed eten en gezelligheid met vrienden en familie."
    ]
  },
  {
    name: "Jarek",
    role: "Hoofd Uitvoering",
    image: "/jarek-hoofd-uitvoering.jpg",
    bullets: [
      "Aansturing op locatie",
      "Planning & coördinatie",
      "Technische controle",
      "Oplevering & kwaliteit"
    ],
    paragraphs: [
      "Mijn naam is Jarek en ik ben hoofd uitvoering bij DRO Renovaties. Wat begon als werk als elektricien, waarbij ik af en toe projecten voor DRO uitvoerde, groeide al snel uit tot een vaste samenwerking.",
      "De manier van werken sloot perfect aan: duidelijke communicatie, korte lijnen en altijd gericht op kwaliteit. Omdat dit zo goed werkte, hebben we besloten om samen verder te bouwen. Inmiddels ben ik verantwoordelijk voor de volledige uitvoering van projecten binnen DRO Renovaties.",
      "Ik zorg ervoor dat elk project van A tot Z strak wordt uitgevoerd — van voorbereiding en planning tot aansturing op locatie en oplevering.",
      "Met een technische achtergrond als elektricien en doordat ik ben opgegroeid in de bouw — mijn vader zat ook in de elektra — heb ik een scherp oog voor detail en weet ik precies waar het in de praktijk om draait.",
      "Voor mij is het simpel: afspraken nakomen, kwaliteit leveren en zorgen dat alles klopt."
    ]
  }
];

export default function TeamMember() {
  return (
    <section className="bg-brand-soft py-16 sm:py-20">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="eyebrow">Ons team</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
            De mensen achter de uitvoering.
          </h2>
          <p className="mt-5 text-base leading-8 text-neutral-700">
            U heeft korte lijnen met de mensen die uw project voorbereiden,
            aansturen en opleveren.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {teamMembers.map((member) => (
            <article className="card overflow-hidden bg-white" key={member.name}>
            <div
              className="min-h-[340px] bg-cover bg-center sm:min-h-[420px]"
              style={{ backgroundImage: `url(${member.image})` }}
            />
            <div className="p-6 sm:p-8">
              <p className="eyebrow">{member.role}</p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-brand-ink">
                {member.name} – {member.role}
              </h3>
              <div className="mt-4 h-1 w-20 rounded-full bg-brand-orange" />
              <div className="mt-6 space-y-4 text-sm leading-7 text-neutral-700 sm:text-base">
                {member.paragraphs.slice(0, 2).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {member.bullets.map((bullet) => (
                  <div
                    className="flex items-center gap-3 rounded-lg bg-brand-soft px-4 py-3 text-sm font-bold text-brand-ink"
                    key={bullet}
                  >
                    <span className="text-brand-orange">✔</span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}
