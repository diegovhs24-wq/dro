"use client";

import {useEffect} from "react";

import {trackFunnel} from "@/lib/analytics";
import type {ConversionRouteKey} from "@/lib/conversionRoutes";

// Eén meting per bezoek aan een routepagina (alleen met cookietoestemming).
export default function RouteViewTracker({route}: {route: ConversionRouteKey}) {
  useEffect(() => {
    trackFunnel("route_view", {route});
  }, [route]);
  return null;
}
