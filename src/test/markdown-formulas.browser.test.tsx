import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { katexFormulas } from "../components/markdown-editor/formulas/katex-formulas";
import { MarkdownViewer } from "../components/markdown-editor/viewer/MarkdownViewer";
import { applyTheme } from "./browser/environment";

test.each(["light", "dark"] as const)("lays out KaTeX formulas with its stylesheet in %s", async (theme) => {
  applyTheme(theme);
  render(<MarkdownViewer value={"Fracción $\\frac{1}{2}$ en línea.\n\n$$\n\\int_0^1 x\\,dx\n$$"} aria-label="Nota" formulas={katexFormulas} />);
  const region = screen.getByRole("region", { name: "Nota" });
  await vi.waitFor(() => expect(region.querySelectorAll('[data-math-state="ready"]')).toHaveLength(2), { timeout: 15000 });
  const block = region.querySelector(".gdy-md-math-block .katex-display") as HTMLElement;
  expect(getComputedStyle(block).textAlign).toBe("center");
  expect(getComputedStyle(region.querySelector(".katex-mathml") as Element).position).toBe("absolute");
  expect(getComputedStyle(region.querySelector(".katex") as Element).color).toBe(getComputedStyle(region).color);
});
