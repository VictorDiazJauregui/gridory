import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import { afterEach } from "vitest";
import "../../styles/index.css";
import { applyScreen, applyTheme } from "./environment";
import { undoPageChanges } from "./page-changes";

// On a cold cache (a fresh clone, the CI) the Markdown editor's lazy CodeMirror chunks can outlast the 1 s
// default of findBy*/waitFor while the whole suite runs, so the browser tests wait up to 5 s.
configure({ asyncUtilTimeout: 5_000 });

// The page outlives the file, so whatever a test leaves in the body goes before the next test sees it.
const removeLeftoverNodes = (): void => {
  [...document.body.children].filter((node) => node.tagName !== "SCRIPT").forEach((node) => node.remove());
};

afterEach(async () => {
  cleanup();
  removeLeftoverNodes();
  applyTheme("light");
  await applyScreen("desktop");
  await undoPageChanges();
});
