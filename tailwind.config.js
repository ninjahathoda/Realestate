module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#f3e8ff",
          DEFAULT: "#c084fc",
          dark: "#a21caf",
        },
        accent: {
          light: "#ffe4fa",
          DEFAULT: "#f472b6",
          dark: "#be185d",
        },
        cutegray: "#f8fafc",
      },
      fontFamily: {
        display: ["'Poppins'", "sans-serif"],
        body: ["'Quicksand'", "sans-serif"],
      },
    },
  },
  plugins: [],
}
