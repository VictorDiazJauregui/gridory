import { playwright } from "@vitest/browser-playwright";
import { defineConfig, mergeConfig } from "vitest/config";
import type { BrowserCommand } from "vitest/node";
import viteConfig from "./vite.config.ts";

const BROWSER_TESTS = "src/test/**/*.browser.test.{ts,tsx}";

// jsdom covers behaviour, ARIA and keyboard; it has no layout engine, so styles,
// sizes and positions are checked in a real headless Chrome instead. It runs on
// the installed Google Chrome (the GitHub runner ships one), so neither CI nor a
// contributor downloads a browser.
const installedChrome = playwright({ launchOptions: { channel: "chrome" } });

// Vitest's browser API cannot switch the CSS media type, so the print tests reach the Playwright
// page of the provider above through this command.
const emulateMedia: BrowserCommand<[media: "screen" | "print"]> = async ({ page }, media) => {
  await page.emulateMedia({ media });
};

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
            // One jsdom per worker instead of one per file; each file still gets its own context.
            pool: "vmThreads",
            // The CI runner is slower and busier than a local machine.
            testTimeout: 15_000,
            hookTimeout: 15_000,
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
              commands: { emulateMedia },
            },
          },
        },
      ],
    },
  }),
);
