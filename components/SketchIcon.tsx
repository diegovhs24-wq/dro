export type SketchIconName =
  | "bathroom"
  | "renovation"
  | "extension"
  | "newbuild"
  | "floorHeating"
  | "heatPump"
  | "solar"
  | "paint"
  | "maintenance"
  | "planning"
  | "checklist"
  | "team"
  | "quality"
  | "shield"
  | "handshake"
  | "materials"
  | "tools"
  | "location"
  | "finish"
  | "contact"
  | "idea"
  | "talk"
  | "delivery";

const iconPaths: Record<SketchIconName, { main: string[]; accent?: string[] }> = {
  bathroom: {
    main: [
      "M5 13h14v2a5 5 0 0 1-5 5h-4a5 5 0 0 1-5-5v-2z",
      "M7 13V8a4 4 0 0 1 4-4h1",
      "M15 6h3M7 20l-1 2M18 20l1 2"
    ],
    accent: ["M9 9h7"]
  },
  renovation: {
    main: ["M3 20h18", "M5 20V9l7-5 7 5v11", "M9 20v-6h6v6"],
    accent: ["M4 10l8-6 8 6"]
  },
  extension: {
    main: ["M4 19h16", "M5 19V8h8v11", "M13 12h6v7", "M8 12h2M8 16h2"],
    accent: ["M13 12l3-3 3 3"]
  },
  newbuild: {
    main: ["M4 20h16", "M6 20V8l6-4 6 4v12", "M9 20v-6h6v6"],
    accent: ["M4 9l8-5 8 5", "M17 6l2-2"]
  },
  floorHeating: {
    main: ["M4 17h16", "M4 13h16", "M4 9h16", "M7 7v12M12 7v12M17 7v12"],
    accent: ["M7 4c1.5 1 1.5 2 0 3", "M12 4c1.5 1 1.5 2 0 3", "M17 4c1.5 1 1.5 2 0 3"]
  },
  heatPump: {
    main: ["M5 7h14v10H5z", "M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0z", "M12 9v6M9 12h6"],
    accent: ["M7 19h10"]
  },
  solar: {
    main: ["M5 13l12-2 2 7-12 2z", "M8 13l2 6M12 12l2 6", "M4 20h16"],
    accent: ["M17 5v2M17 9v2M14 8h6"]
  },
  paint: {
    main: ["M5 6h10v6H5z", "M8 12v4", "M8 16h6v4H8z", "M15 7h3v3"],
    accent: ["M5 6c3 2 7-2 10 0"]
  },
  maintenance: {
    main: ["M6 18l6-6", "M8 20l6-6", "M15 5l4 4", "M14 6l4 4", "M5 19l2 2"],
    accent: ["M13 11l3-3"]
  },
  planning: {
    main: ["M5 5h14v15H5z", "M8 3v4M16 3v4", "M5 9h14"],
    accent: ["M8 13h3M8 16h6"]
  },
  checklist: {
    main: ["M7 4h10v16H7z", "M9 8h6M9 12h6M9 16h6"],
    accent: ["M6 9l1 1 2-3", "M6 13l1 1 2-3"]
  },
  team: {
    main: [
      "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
      "M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
      "M4 20a4 4 0 0 1 8 0",
      "M12 20a4 4 0 0 1 8 0"
    ],
    accent: ["M12 14c1 .5 1.5 1.3 2 2"]
  },
  quality: {
    main: ["M12 3l3 6 6 .8-4.5 4.4 1.2 6.3L12 17l-5.7 3.5 1.2-6.3L3 9.8 9 9z"],
    accent: ["M12 7l1 2"]
  },
  shield: {
    main: ["M12 3l8 4v5c0 5-3.2 8.5-8 10-4.8-1.5-8-5-8-10V7z"],
    accent: ["M8.5 12l2.2 2.2L15.5 9"]
  },
  handshake: {
    main: ["M4 12l4-4 4 4", "M20 12l-4-4-4 4", "M8 12l4 4 4-4", "M9 17l2 2 2-2"],
    accent: ["M7 9l-3 3", "M17 9l3 3"]
  },
  materials: {
    main: ["M4 18h16", "M5 14h14", "M6 10h12", "M7 6h10"],
    accent: ["M5 14l2-4M10 14l2-4M15 14l2-4"]
  },
  tools: {
    main: ["M6 18l8-8", "M13 5l6 6", "M4 20l3-3", "M15 7l2-2"],
    accent: ["M10 14l2 2"]
  },
  location: {
    main: ["M12 21s6-5 6-11a6 6 0 1 0-12 0c0 6 6 11 6 11z", "M10 10a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"],
    accent: ["M8 20h8"]
  },
  finish: {
    main: ["M5 16l11-11 3 3L8 19H5z", "M14 7l3 3"],
    accent: ["M4 21h16"]
  },
  contact: {
    main: ["M4 6h16v12H4z", "M4 7l8 6 8-6"],
    accent: ["M18 4l2-2M20 6h2"]
  },
  idea: {
    main: [
      "M9 14c-1.7-1.2-2.8-3.2-2.8-5.3A5.8 5.8 0 0 1 12 3a5.8 5.8 0 0 1 5.8 5.7c0 2.1-1.1 4.1-2.8 5.3",
      "M9 14h6",
      "M10 17h4",
      "M10.8 20h2.4",
      "M12 6v4",
      "M10.4 9.6 12 11l1.6-1.4"
    ],
    accent: ["M5 4.5 3.6 3.1M19 4.5l1.4-1.4M3.5 10H2M22 10h-1.5"]
  },
  talk: {
    main: [
      "M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
      "M5 20a4 4 0 0 1 7.5-2",
      "M16 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
      "M12.5 18a4 4 0 0 1 6.5 2",
      "M11 4h8a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-2l-3 3v-3h-3"
    ],
    accent: ["M15 8h.1M17.5 8h.1"]
  },
  delivery: {
    main: [
      "M3 20h18",
      "M5 20V9l7-5 7 5v11",
      "M9 20v-6h6v6",
      "M15 8h2v2h-2",
      "M7 8h2v2H7"
    ],
    accent: ["M15.5 17.5l1.5 1.5 3-4"]
  }
};

type SketchIconProps = {
  name: SketchIconName;
  className?: string;
};

export default function SketchIcon({ name, className = "h-10 w-10" }: SketchIconProps) {
  const icon = iconPaths[name];

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      {icon.main.map((path) => (
        <path
          d={path}
          key={path}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      ))}
      {icon.accent?.map((path) => (
        <path
          d={path}
          key={path}
          stroke="#ff6a00"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.1"
        />
      ))}
    </svg>
  );
}
