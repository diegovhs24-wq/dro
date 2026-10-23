// Rendert casestudy-onderdelen naar HTML voor de tests (zonder browser).
import {renderToStaticMarkup} from "react-dom/server";

import {CaseStudyDetail, CaseStudyCard} from "@/components/casestudy/CaseStudy";
import ProjectTile from "@/components/premium/ProjectTile";
import {toPublicCaseStudy} from "@/lib/caseStudy";

export function renderDetail(raw: unknown, location = "Den Haag") {
  const cs = toPublicCaseStudy(raw);
  return cs ? renderToStaticMarkup(<CaseStudyDetail caseStudy={cs} location={location} />) : "";
}

export function renderCard(raw: unknown) {
  const cs = toPublicCaseStudy(raw);
  return cs ? renderToStaticMarkup(<CaseStudyCard caseStudy={cs} href="/projecten/x" location="Den Haag" title="Testproject" />) : "";
}

export function renderTile(project: Record<string, unknown>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return renderToStaticMarkup(<ProjectTile project={project as any} />);
}
