import { afterEach, expect, test, vi } from "vitest";
import { openInNewTab } from "../components/table/body/browser-navigation";

afterEach(() => vi.restoreAllMocks());

test("a row link opens in a new tab without access to the opener", () => {
  const open = vi.spyOn(window, "open").mockReturnValue(null);
  openInNewTab("/empresas/b1");
  expect(open).toHaveBeenCalledWith("/empresas/b1", "_blank", "noopener");
});
