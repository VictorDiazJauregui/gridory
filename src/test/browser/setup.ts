import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import { afterEach } from "vitest";
import "../../styles/index.css";
import { applyScreen, applyTheme } from "./environment";

// Components that load code on demand (the Markdown editor and its CodeMirror chunks) can take
// longer than the 1 s default of findBy*/waitFor on a cold cache (a fresh clone, the CI) while
// the whole suite runs, so the browser tests wait up to 5 s.
configure({ asyncUtilTimeout: 5_000 });

afterEach(async () => {
  cleanup();
  applyTheme("light");
  await applyScreen("desktop");
});
