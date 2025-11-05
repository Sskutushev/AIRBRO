/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          // Telegram brand colors
          telegram: "var(--primary-telegram)",
          // Main brand colors
          electric: "var(--primary-electric)",
          neon: "var(--primary-neon)",
          mint: "var(--primary-mint)",
          // Accent colors
          coral: "var(--accent-coral)",
          gold: "var(--accent-gold)",
          violet: "var(--accent-violet)",
          // Additional colors
          blue: "#3B82F6",
          teal: "#14B8A6",
        },
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
          accent: "#FFFFFF",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          muted: "var(--text-tertiary)",
        },
        border: "var(--border)",
        shadow: "var(--shadow)",
      },
      fontFamily: {
        heading: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-hero":
          "linear-gradient(135deg, var(--primary-telegram) 0%, var(--primary-electric) 50%, var(--primary-neon) 100%)",
        "gradient-card": "linear-gradient(120deg, var(--primary-neon) 0%, var(--primary-electric) 100%)",
        "gradient-cta": "linear-gradient(90deg, var(--primary-electric) 0%, var(--primary-neon) 100%)",
      },
      animation: {
        "gradient-shift": "gradient-shift 15s ease infinite",
        "gradient-x": "gradient-x 15s ease infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.6s ease-out",
        "fade-in": "fade-in 0.8s ease-out",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(5deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,136,204,0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(0,136,204,0.8)" },
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

