import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#d95b16",
          ink: "#181613",
          "ink-soft": "#3a3733",
          soft: "#fbfaf7",
          "soft-deep": "#f3f0ea",
          stone: "#87816f",
          line: "#e7e3da"
        },
        "deep-slate": "var(--color-deep-slate)",
        "muted-slate": "var(--color-muted-slate)",
        "rich-ink": "var(--color-rich-ink)",
      },
      fontFamily: {
        hand: ['"Comic Sans MS"', '"Comic Sans"', 'var(--font-hand)', 'cursive'],
        serif: ['var(--font-newsreader)', 'Georgia', 'serif']
      },
      boxShadow: {
        premium: "0 24px 70px rgba(23, 23, 23, 0.10)"
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
