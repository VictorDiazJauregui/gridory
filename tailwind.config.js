import preset from "./tailwind-preset.js";

/**
 * Tailwind config for the local demo only (index.html, src/App.tsx, mocks);
 * the library ships plain CSS.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  presets: [preset],
  // The demo toggles `.dark` on <html>, the same switch the library reads.
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [],
};
