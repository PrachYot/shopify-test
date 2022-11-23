/* eslint-disable no-undef, @typescript-eslint/no-var-requires */
const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
        secondary: colors.neutral,
        danger: colors.red,
      },
    },
    screens: {
      sm: { raw: "(min-width: 640px)" },
      md: { raw: "(min-width: 768px)" },
      lg: { raw: "(min-width: 1024px)" },
      xl: { raw: "(min-width: 1280px)" },

      smd: { raw: "(min-device-width: 640px)" },
      mdd: { raw: "(min-device-width: 768px)" },
      lgd: { raw: "(min-device-width: 1024px)" },
      xld: { raw: "(min-device-width: 1280px)" },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
  ],
};
