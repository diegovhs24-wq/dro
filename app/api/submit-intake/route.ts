import {NextResponse} from "next/server";

// Oude intake-route (BE-11). Het bijbehorende formulier (IntakeWizard) wordt
// nergens meer gebruikt; alle formulieren posten naar /api/submit-request.
// De route bleef bereikbaar zonder spamcontrole en is daarom uitgeschakeld.
export function POST() {
  return NextResponse.json(
    {error: "Deze route is vervangen. Gebruik het formulier op de website of bel 085 087 1814."},
    {status: 410}
  );
}
