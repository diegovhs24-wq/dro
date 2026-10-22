import localFont from "next/font/local";

// Zelf gehost (OFL), zodat de build niet afhangt van Google Fonts.
// Archivo met breedte-as voor koppen, Hanken Grotesk (ook in de intake) voor tekst.
export const archivo = localFont({
  src: "../../app/(site)/fonts/Archivo-wdth-wght-latin.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-display",
  fallback: ["Arial", "sans-serif"],
});

export const hanken = localFont({
  src: "../../app/(site)/fonts/HankenGrotesk-wght-latin.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-text",
  fallback: ["Arial", "sans-serif"],
});

export const premiumFontClass = `${archivo.variable} ${hanken.variable}`;
