import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import "../../styles/index.css";
import { applyScreen, applyTheme } from "./environment";

afterEach(async () => {
  cleanup();
  applyTheme("light");
  await applyScreen("desktop");
});
