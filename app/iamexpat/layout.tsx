import type {Metadata, Viewport} from "next";
import {Poppins} from "next/font/google";
import "../globals.css";

// Standalone campaign layout: deliberately does NOT render the main site's
// Header/Footer/nav (this page is only reachable via its direct URL, per
// the campaign brief) and imports its own fonts + globals.css, since the
// root app/layout.tsx intentionally loads neither.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#181613",
};

export const metadata: Metadata = {
  title: "Renovating in the Netherlands? | DRO Renovaties x IamExpat",
  description:
    "DRO Renovaties helps expats in and around The Hague renovate with confidence. English-speaking, fixed price, and we handle the Dutch paperwork.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function IamExpatLayout({children}: {children: React.ReactNode}) {
  return <div className={poppins.className}>{children}</div>;
}
