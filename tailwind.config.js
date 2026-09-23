import preset from "./tailwind-preset.js";

/**
 * Tailwind config for the local demo (index.html + src/App.tsx + mocks).
 * The library stylesheet uses tailwind.lib.config.js instead.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  presets: [preset],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [],
};
