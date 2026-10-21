import {NextResponse} from "next/server";
import {getLeadsClient} from "@/lib/sanityLeadsClient";

// Gezondheidscheck van de leadketen voor monitoring (docs/audit/18).
// Controleert alleen of de configuratie aanwezig is; geeft geen geheimen,
// geen ontvangers en geen leaddata terug. 503 = er gaat iets mis met leads.
export const dynamic = "force-dynamic";

export async function GET() {
  let sanityLeads = false;
  try {
    getLeadsClient();
    sanityLeads = true;
  } catch {
    sanityLeads = false;
  }
  const email = Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
  // Leads komen binnen zolang minstens één van beide werkt, maar beide horen aan te staan.
  const ok = sanityLeads && email;

  return NextResponse.json(
    {ok, checks: {sanityLeads, email}, checkedAt: new Date().toISOString()},
    {status: ok ? 200 : 503, headers: {"Cache-Control": "no-store"}}
  );
}
