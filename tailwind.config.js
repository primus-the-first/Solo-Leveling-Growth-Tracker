/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        hunter: {
          dark: "#0a0a0f",
          darker: "#050508",
          card: "rgba(17, 17, 24, 0.7)",
          border: "rgba(255, 255, 255, 0.1)",
        },
        glow: {
          cyan: "#22d3ee",
          blue: "#3b82f6",
          purple: "#a855f7",
          green: "#4ade80",
          pink: "#ec4899",
          red: "#ef4444",
          orange: "#f97316",
          emerald: "#10b981",
        },
      },
      fontFamily: {
        display: ["Cinzel", "serif"],
        body: ["Rajdhani", "sans-serif"],
        sans: ["Rajdhani", "sans-serif"],
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite alternate",
        shimmer: "shimmer 2s linear infinite",
        float: "float 3s ease-in-out infinite",
        "border-glow": "border-glow 3s ease-in-out infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%": { boxShadow: "0 0 5px currentColor, 0 0 10px currentColor" },
          "100%": { boxShadow: "0 0 20px currentColor, 0 0 40px currentColor" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "border-glow": {
          "0%, 100%": { borderColor: "rgba(34, 211, 238, 0.5)" },
          "50%": { borderColor: "rgba(168, 85, 247, 0.5)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-pattern":
          "linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
      },
      boxShadow: {
        "glow-cyan":
          "0 0 20px rgba(34, 211, 238, 0.4), 0 0 40px rgba(34, 211, 238, 0.2)",
        "glow-purple":
          "0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)",
        "glow-green":
          "0 0 20px rgba(74, 222, 128, 0.4), 0 0 40px rgba(74, 222, 128, 0.2)",
        "glow-blue":
          "0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)",
        "glow-red":
          "0 0 20px rgba(239, 68, 68, 0.4), 0 0 40px rgba(239, 68, 68, 0.2)",
        "glow-orange":
          "0 0 20px rgba(249, 115, 22, 0.4), 0 0 40px rgba(249, 115, 22, 0.2)",
        "glow-pink":
          "0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(236, 72, 153, 0.2)",
      },
    },
  },
  plugins: [],
};
