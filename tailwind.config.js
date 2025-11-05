/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          // Telegram brand colors
          telegram: "#0088cc",
          // Main brand colors
          electric: "#00D9FF",
          neon: "#7B2FFF",
          mint: "#00FFA3",
          // Accent colors
          coral: "#FF6B6B",
          gold: "#FFD93D",
          violet: "#A855F7",
          // Additional colors
          blue: "#3B82F6",
          teal: "#14B8A6",
        },
        bg: {
          primary: "#F8FAFC",
          secondary: "#F1F5F9",
          accent: "#FFFFFF",
        },
        text: {
          primary: "#0F172A",
          secondary: "#64748B",
          muted: "#94A3B8",
        },
      },
      fontFamily: {
        heading: ["TT Travels Next", "sans-serif"],
        body: ["Open Sans", "sans-serif"],
      },
      backgroundImage: {
        "gradient-hero":
          "linear-gradient(135deg, #00D9FF 0%, #7B2FFF 50%, #00FFA3 100%)",
        "gradient-card": "linear-gradient(120deg, #7B2FFF 0%, #00D9FF 100%)",
        "gradient-cta": "linear-gradient(90deg, #00D9FF 0%, #7B2FFF 100%)",
      },
      animation: {
        "gradient-shift": "gradient-shift 8s ease infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.6s ease-out",
        "fade-in": "fade-in 0.8s ease-out",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,217,255,0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(0,217,255,0.8)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

