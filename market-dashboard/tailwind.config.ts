import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: { DEFAULT: "#0d0f14", "1": "#12151c", "2": "#181c25", "3": "#1e2330", "4": "#242a38" },
        border: { DEFAULT: "#2a3040", soft: "#1e2330", bright: "#3a4458" },
        accent: { DEFAULT: "#3b82f6", hover: "#60a5fa", dim: "#1d4ed8" },
        up: "#10b981",
        "up-bg": "#022c22",
        down: "#ef4444",
        "down-bg": "#2d0a0a",
        muted: "#94a3b8",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-down": "slideDown 0.2s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0", transform: "translateY(6px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideDown: { "0%": { opacity: "0", maxHeight: "0" }, "100%": { opacity: "1", maxHeight: "2000px" } },
        shimmer: { "0%": { backgroundPosition: "-700px 0" }, "100%": { backgroundPosition: "700px 0" } },
      },
    },
  },
  plugins: [],
};
export default config;
