export default function Footer() {
  const services = [
    ["Badkamer renovatie", "/diensten/badkamer-renovatie"],
    ["Totaalrenovatie", "/diensten/totaalrenovatie"],
    ["Uitbouw / aanbouw", "/diensten/uitbouw-aanbouw"],
    ["Afbouw nieuwbouw", "/diensten/afbouw-nieuwbouw"],
    ["Vloerverwarming", "/diensten/vloerverwarming"],
    ["Warmtepomp", "/diensten/warmtepomp"],
    ["Zonnepanelen", "/diensten/zonnepanelen"],
    ["Stuc- en schilderwerk", "/diensten/stuc-schilderwerk"],
    ["Onderhoud", "/diensten/onderhoud"]
  ];

  const businessItems = [
    "Projectmatige renovaties",
    "Seriematige afbouw",
    "Mutatiewoningen",
    "Uitvoering op schaal"
  ];

  return (
    <footer className="bg-brand-ink text-white">
      <div className="section-shell py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[1.15fr_0.85fr_1.1fr_1fr]">
          <div>
            <a className="inline-flex items-center" href="/">
              <img
                alt="DRO Bouw en aannemingsbedrijf"
                className="h-10 w-auto object-contain"
                src="/drobouwlogo.png"
              />
            </a>
            <p className="mt-3 text-sm font-bold">DRO Renovaties</p>
            <p className="mt-2 max-w-sm text-xs leading-5 text-white/60">
              Uw partner voor complete renovatie- en afbouwprojecten. Wij
              combineren vakmanschap met structuur voor particuliere en zakelijke
              opdrachtgevers.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
              Contact
            </p>
            <div className="mt-3 grid gap-2 text-xs leading-5 text-white/65">
              <p>Den Haag en omgeving · Randstad</p>
              <a className="transition hover:text-brand-orange" href="tel:+31850871814">
                +31 85 087 1814 <span className="text-white/40">(ook via WhatsApp)</span>
              </a>
              <a className="transition hover:text-brand-orange" href="mailto:info@drobouwgroep.nl">
                info@drobouwgroep.nl
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
              Diensten
            </p>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-white/65">
              {services.map(([label, href]) => (
                <a className="transition hover:text-brand-orange" href={href} key={href}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
              Zakelijk
            </p>
            <p className="mt-3 text-xs leading-5 text-white/60">
              Voor vastgoedpartijen, ontwikkelaars en aannemers verzorgen wij:
            </p>
            <div className="mt-3 grid gap-1.5 text-xs text-white/70">
              {businessItems.map((item) => (
                <p key={item}>
                  <span className="mr-2 text-brand-orange">✔</span>
                  {item}
                </p>
              ))}
            </div>
            <p className="mt-3 text-xs font-semibold leading-5 text-white">
              Uitvoeringspartner met capaciteit en continuïteit.
            </p>
          </div>
        </div>

        <div className="mt-6 border-y border-white/10 py-3">
          <p className="text-sm font-bold tracking-tight text-white/90 sm:text-base">
            Eén partij. Volledige uitvoering. Volledige controle.
          </p>
        </div>

        <div className="mt-4 flex flex-col justify-between gap-3 text-xs text-white/40 md:flex-row md:items-center">
          <p>© DRO Renovaties</p>
          <div className="flex flex-wrap gap-5">
            <a className="transition hover:text-brand-orange" href="/privacy">
              Privacyverklaring
            </a>
            <a className="transition hover:text-brand-orange" href="/algemene-voorwaarden">
              Algemene voorwaarden
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
