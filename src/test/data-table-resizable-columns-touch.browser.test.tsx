import { render } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { DataTable } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROWS } from "./baseline-fixture";
import { findRequiredElement } from "./browser/elements";
import { applyScreen, type ScreenName } from "./browser/environment";
import { readStyle } from "./browser/measure";
import { emulateTouchScreen } from "./browser/touch-screen";

// A file of its own: turning touch off leaves `(hover: none)` until the page reloads.
afterEach(async () => {
  await emulateTouchScreen(false);
  await applyScreen("desktop");
});

test.each(["iphone14Pro", "pixel7"] as ScreenName[])("on a %s the resize handle does not show", async (screen) => {
  await emulateTouchScreen(true);
  await applyScreen(screen);
  const { container } = render(<DataTable columns={BASELINE_COLUMNS} data={BASELINE_ROWS} resizableColumns />);
  const handle = findRequiredElement(container, ".gdy-table-resize-handle");
  expect(readStyle(handle, "display")).toBe("none");
});
