"use client";

import {useSyncExternalStore} from "react";

import {readConsent, subscribeConsent, type ConsentChoice} from "@/lib/analytics";

// "unknown" tijdens server-rendering en hydratie, zodat de banner niet
// flitst en server en client hetzelfde renderen.
export function useConsent(): ConsentChoice | null | "unknown" {
  return useSyncExternalStore(subscribeConsent, readConsent, () => "unknown" as const);
}
