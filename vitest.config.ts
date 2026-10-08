import { playwright } from "@vitest/browser-playwright";
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

const BROWSER_TESTS = "src/test/**/*.browser.test.{ts,tsx}";

// jsdom covers behaviour, ARIA and keyboard; it has no layout engine, so styles,
// sizes and positions are checked in a real headless Chrome instead. It runs on
// the installed Google Chrome (the GitHub runner ships one), so neither CI nor a
// contributor downloads a browser.
const installedChrome = playwright({ launchOptions: { channel: "chrome" } });

const LAZY_EDITOR_DEPENDENCIES = [
  "@codemirror/commands",
  "@codemirror/language",
  "@codemirror/search",
  "@codemirror/state",
  "@codemirror/view",
  "@lezer/highlight",
  "@lezer/markdown",
  "highlight.js/lib/core",
  "highlight.js/lib/languages/*",
  "katex",
  "mermaid",
];

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          extends: true,
          test: {
            name: "unit",
            environment: "jsdom",
            setupFiles: ["src/test/setup.ts"],
            css: false,
            include: ["src/test/**/*.test.{ts,tsx}"],
            exclude: [BROWSER_TESTS],
          },
        },
        {
          extends: true,
          optimizeDeps: { include: LAZY_EDITOR_DEPENDENCIES },
          test: {
            name: "browser",
            setupFiles: ["src/test/browser/setup.ts"],
            include: [BROWSER_TESTS],
            browser: {
              enabled: true,
              provider: installedChrome,
              headless: true,
              viewport: { width: 1920, height: 1080 },
              instances: [{ browser: "chromium" }],
            },
          },
        },
      ],
    },
  }),
);
