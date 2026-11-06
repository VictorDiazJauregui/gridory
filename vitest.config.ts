import { playwright } from "@vitest/browser-playwright";
import { defineConfig, mergeConfig } from "vitest/config";
import type { CDPSession } from "playwright";
import type { BrowserCommand } from "vitest/node";
import viteConfig from "./vite.config.ts";

const BROWSER_TESTS = "src/test/**/*.browser.test.{ts,tsx}";
const SERVER_TESTS = "src/test/**/*.server.test.{ts,tsx}";

// jsdom has no layout engine, so styles, sizes and positions are checked in the installed Google Chrome,
// headless (the GitHub runner ships one), so neither CI nor a contributor downloads a browser.
// Reduced motion by default, so only the tests of an animation wait for one: they turn motion back on.
const installedChrome = playwright({
  launchOptions: { channel: "chrome" },
  contextOptions: { reducedMotion: "reduce" },
});

// Vitest's browser API cannot switch the CSS media type, so the print tests reach the Playwright
// page of the provider above through this command.
const emulateMedia: BrowserCommand<[media: "screen" | "print"]> = async ({ page }, media) => {
  await page.emulateMedia({ media });
};

// Nor `prefers-reduced-motion`: the animation tests switch it the same way.
const emulateReducedMotion: BrowserCommand<[isReduced: boolean]> = async ({ page }, isReduced) => {
  await page.emulateMedia({ reducedMotion: isReduced ? "reduce" : "no-preference" });
};

// Nor a touch screen: CDP turns on `(pointer: coarse)`, and its session stays open since closing it undoes that.
// Turning it off leaves `(hover: none)` until the page reloads, so only a file that needs touch calls it.
const touchSessions = new WeakMap<object, CDPSession>();

const emulateTouch: BrowserCommand<[enabled: boolean]> = async ({ page }, enabled) => {
  const session = touchSessions.get(page) ?? (await page.context().newCDPSession(page));
  touchSessions.set(page, session);
  await session.send("Emulation.setTouchEmulationEnabled", { enabled, maxTouchPoints: 5 });
};

interface PointerDrag {
  selector: string;
  deltaX: number;
  steps: number;
}

class MissingDragTargetError extends Error {
  constructor(selector: string) {
    super(`dragPointer: "${selector}" is not on screen.`);
    this.name = "MissingDragTargetError";
  }
}

// Nor a real pointer with coordinates: dragging an edge needs a captured pointer, which a synthetic event cannot
// have. The box comes from the test frame, in the page's coordinates, as the mouse needs.
const dragPointer: BrowserCommand<[drag: PointerDrag]> = async (context, { selector, deltaX, steps }) => {
  const box = await (await context.frame()).locator(selector).first().boundingBox();
  if (!box) throw new MissingDragTargetError(selector);
  const [x, y] = [box.x + box.width / 2, box.y + box.height / 2];
  await context.page.mouse.move(x, y);
  await context.page.mouse.down();
  await context.page.mouse.move(x + deltaX, y, { steps });
  await context.page.mouse.up();
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

// Files share one page per worker, saving its load per file, and the setup leaves it as found. A reload alone undoes
// touch's `(hover: none)` or a click hiding `:focus-visible` from scripted focus; the busy test needs a cold editor and
// the deferred-download tests replace those downloads with mocks.
const OWN_PAGE_BROWSER_TESTS = [
  "src/test/kanban-move-menu.browser.test.tsx",
  "src/test/data-table-resizable-columns-touch.browser.test.tsx",
  "src/test/data-table-row-focus.browser.test.tsx",
  "src/test/markdown-source.browser.test.tsx",
  "src/test/date-filter-deferred-calendar.browser.test.tsx",
  "src/test/data-table-deferred-help-and-selection.browser.test.tsx",
];

// A function, not a shared object: Vitest writes the project name into each instance.
const createHeadlessChrome = () => ({
  enabled: true,
  provider: installedChrome,
  headless: true,
  viewport: { width: 1920, height: 1080 },
  instances: [{ browser: "chromium" as const }],
  commands: { emulateMedia, emulateReducedMotion, emulateTouch, dragPointer },
});

interface BrowserProject {
  name: string;
  include: string[];
  exclude?: string[];
  isolate: boolean;
}

const createBrowserProject = ({ name, include, exclude = [], isolate }: BrowserProject) => ({
  extends: true,
  optimizeDeps: { include: LAZY_EDITOR_DEPENDENCIES },
  test: {
    name,
    isolate,
    maxWorkers: 2,
    // A poll does not react to DOM changes, so it retries once per frame instead of every 50 ms.
    expect: { poll: { interval: 16 } },
    setupFiles: ["src/test/browser/setup.ts"],
    include,
    exclude,
    browser: createHeadlessChrome(),
  },
});

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
            // All projects run at once and need the same value; the default makes jsdom and Chrome fight for cores.
            maxWorkers: 2,
            // One jsdom per worker instead of one per file; each file still gets its own context.
            pool: "vmThreads",
            // The CI runner is slower and busier than a local machine.
            testTimeout: 15_000,
            hookTimeout: 15_000,
            setupFiles: ["src/test/setup.ts"],
            css: false,
            include: ["src/test/**/*.test.{ts,tsx}"],
            exclude: [BROWSER_TESTS, SERVER_TESTS],
          },
        },
        // Next, Remix or renderToString render on a server, where neither `window` nor `document` exist.
        {
          extends: true,
          test: { name: "server", environment: "node", maxWorkers: 2, css: false, include: [SERVER_TESTS] },
        },
        createBrowserProject({
          name: "browser",
          include: [BROWSER_TESTS],
          exclude: OWN_PAGE_BROWSER_TESTS,
          isolate: false,
        }),
        createBrowserProject({ name: "browser-own-page", include: OWN_PAGE_BROWSER_TESTS, isolate: true }),
      ],
    },
  }),
);
