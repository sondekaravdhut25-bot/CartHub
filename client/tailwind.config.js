/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Kiln & Co palette — grounded in the material itself (stoneware,
        // clay, glaze tones) rather than a generic SaaS palette.
        base: "#EDE7DD",      // warm putty background
        surface: "#F7F4EE",   // card surface, slightly lighter than base
        ink: "#2B2622",       // near-black warm charcoal for text
        clay: "#8A6D5C",      // primary accent — muted mocha clay
        "clay-dark": "#6E5548",
        sage: "#5C6B57",      // secondary accent
        "sage-dark": "#48544",
        border: "#D8D0C2",
        rust: "#A85D3E",      // used sparingly — sale/status highlight only
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
