import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // DRO-huisstijl (referentie: Over ons). Eén set kleuren voor de hele site;
        // de waarden staan ook als CSS-variabelen (--dro-*) in app/globals.css.
        // Oranje #c4520f haalt met witte tekst WCAG AA (4,6:1).
        brand: {
          orange: "#c4520f",
          "orange-hover": "#a9450c",
          ink: "#181613",
          "ink-soft": "#3a3733",
          soft: "#fbfaf7",
          "soft-deep": "#f3f0ea",
          cream: "#f7f3ec",
          stone: "#6b665b",
          line: "#e7e3da"
        },
        // Advertentiepagina's gebruiken dezelfde huisstijl; deze namen blijven
        // bestaan zodat de pagina's niet per klasse herschreven hoeven te worden.
        lp: {
          ink: "#181613",
          muted: "#5c574d",
          plaster: "#f7f3ec",
          line: "#e7e3da",
          slate: "#1f1c18",
          orange: "#c4520f",
          "orange-hover": "#a9450c"
        },
        "deep-slate": "var(--color-deep-slate)",
        "muted-slate": "var(--color-muted-slate)",
        "rich-ink": "var(--color-rich-ink)",
      },
      // Eén lettertype voor de hele site: Poppins. De oude namen hand en serif
      // verwijzen er ook naar, zodat bestaande CMS-blokken niet afwijken.
      fontFamily: {
        sans: ["var(--font-poppins)", "Arial", "sans-serif"],
        hand: ["var(--font-poppins)", "Arial", "sans-serif"],
        serif: ["var(--font-poppins)", "Arial", "sans-serif"]
      },
      borderRadius: {
        btn: "8px",
        card: "12px",
        img: "16px"
      },
      boxShadow: {
        premium: "0 24px 70px rgba(23, 23, 23, 0.10)",
        cta: "0 10px 22px -12px rgba(196, 82, 15, 0.55)",
        img: "0 18px 40px -24px rgba(24, 22, 19, 0.35)"
      },
      animation: {
        "fade-in": "fadeIn 700ms ease-out both",
        "float-in": "floatIn 800ms ease-out both"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        floatIn: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
