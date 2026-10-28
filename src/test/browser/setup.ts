import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import { afterEach } from "vitest";
import "../../styles/index.css";
import { applyScreen, applyTheme } from "./environment";

// On a cold cache (a fresh clone, the CI) the Markdown editor's lazy CodeMirror chunks can outlast the 1 s
// default of findBy*/waitFor while the whole suite runs, so the browser tests wait up to 5 s.
configure({ asyncUtilTimeout: 5_000 });

afterEach(async () => {
  cleanup();
  applyTheme("light");
  await applyScreen("desktop");
});
