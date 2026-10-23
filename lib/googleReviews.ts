// Echte Google-reviews, letterlijk overgenomen (naam, datum en project zoals op
// Google). Zelfde bron als de advertentiepagina's. Niet herschrijven of inkorten
// in deze lijst; de weergave mag een fragment tonen met "…".
export type StaticGoogleReview = {name: string; date: string; project: string; quote: string};

export const BIG_PROJECT_REVIEWS: StaticGoogleReview[] = [
  {name: "Allama", date: "13 mei 2026", project: "Totaalrenovatie", quote: "We zijn erg tevreden. Het team was professioneel, kwam alle afspraken na en startte het werk steeds op tijd."},
];
