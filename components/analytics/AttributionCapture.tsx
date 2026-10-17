"use client";

import {useEffect} from "react";
import {captureAttribution} from "@/lib/attribution";

// Onthoudt bij binnenkomst op de site waar de bezoeker vandaan kwam (campagne,
// zoekwoord, verwijzende site), zodat ook een aanvraag via het gewone
// intakeformulier aan het juiste kanaal wordt gekoppeld. Toont niets.
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
