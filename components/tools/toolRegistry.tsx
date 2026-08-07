import dynamic from "next/dynamic";

import type {ToolId} from "./toolsTypes";

/**
 * Koppelt elke tool-id aan zijn weergavecomponent. Een nieuwe tool
 * toevoegen betekent: 1) config blok in toolsConfig.ts, 2) rekenfunctie in
 * toolsEngine.ts, 3) component in components/tools/views/, 4) hier 1 regel
 * toevoegen. Verder hoeft nergens iets aangepast te worden, de hub en de
 * router lezen alles uit deze registry en uit toolsConfig.ts.
 */
export const TOOL_REGISTRY: Record<ToolId, ReturnType<typeof dynamic>> = {
  bouwtijd: dynamic(() => import("./views/Bouwtijd")),
  vergunning: dynamic(() => import("./views/Vergunning")),
  terugplanner: dynamic(() => import("./views/Terugplanner")),
  bewoning: dynamic(() => import("./views/Bewoning")),
  werktijden: dynamic(() => import("./views/Werktijden")),
  tegels: dynamic(() => import("./views/Tegels")),
  verf: dynamic(() => import("./views/Verf")),
  vloer: dynamic(() => import("./views/Vloer")),
  behang: dynamic(() => import("./views/Behang")),
  plinten: dynamic(() => import("./views/Plinten")),
  kit: dynamic(() => import("./views/Kit")),
  stucwerk: dynamic(() => import("./views/Stucwerk")),
  egaline: dynamic(() => import("./views/Egaline")),
  container: dynamic(() => import("./views/Container")),
  vloerverwarming: dynamic(() => import("./views/Vloerverwarming")),
  ventilatie: dynamic(() => import("./views/Ventilatie")),
  groepenkast: dynamic(() => import("./views/Groepenkast")),
  verwarming: dynamic(() => import("./views/Verwarming")),
  isolatie: dynamic(() => import("./views/Isolatie")),
  afschot: dynamic(() => import("./views/Afschot")),
  "verbouwen-verhuizen": dynamic(() => import("./views/VerbouwenVerhuizen")),
  ruimtewinst: dynamic(() => import("./views/Ruimtewinst")),
  kamermaten: dynamic(() => import("./views/Kamermaten")),
  sloopchecklist: dynamic(() => import("./views/Sloopchecklist")),
  burenbrief: dynamic(() => import("./views/Burenbrief")),
  "vve-onderhoud": dynamic(() => import("./views/VveOnderhoud")),
  transformatie: dynamic(() => import("./views/Transformatie")),
  klusvolgorde: dynamic(() => import("./views/Klusvolgorde")),
  verhuurklaar: dynamic(() => import("./views/Verhuurklaar")),
};
