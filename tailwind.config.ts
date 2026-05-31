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
          orange: "#ff6a00",
          ink: "#171717",
          soft: "#f6f5f2"
        }
      },
      fontFamily: {
        hand: ['"Comic Sans MS"', '"Comic Sans"', 'var(--font-hand)', 'cursive']
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
