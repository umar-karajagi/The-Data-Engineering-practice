import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[class*="theme-dark"]'],
  theme: {
    extend: {
      colors: {
        forge: {
          bg: "var(--bg-primary)",
          card: "var(--bg-secondary)",
          surface: "var(--bg-tertiary)",
          canvas: "var(--bg-canvas)",
          border: "var(--border-color)",
          subtle: "var(--border-subtle)",
          text: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        track: {
          sql: "var(--track-sql)",
          python: "var(--track-python)",
          pyspark: "var(--track-pyspark)",
          warehousing: "var(--track-warehousing)",
          architecture: "var(--track-architecture)",
          dsa: "var(--track-dsa)",
          azure: "var(--track-azure)",
          behavioral: "var(--track-behavioral)",
        },
        brand: {
          blue: "#0050FF",
          hover: "#1C449A",
          light: "rgba(0, 80, 255, 0.08)",
          subtle: "rgba(0, 80, 255, 0.15)",
        },
        vidhya: {
          bg: "#0C0C0C",
          card: "#141414",
          elevated: "#1C1C1E",
          border: "#262626",
          subtle: "#1C1C1C",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
