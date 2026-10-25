import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";
import { DEMO_TOOLBAR_ITEMS } from "../components/mocks/markdown-editor/demo-custom-tools";

const VISIBLE_TOOL_COUNT = 8;

const renderInFrame = (width: number) => {
  render(
    <div style={{ width }}>
      <MarkdownEditor tools={DEMO_TOOLBAR_ITEMS} />
    </div>,
  );
  return screen.getByRole("toolbar", { name: "Herramientas de formato" });
};

const readVisibleButtons = (toolbar: HTMLElement) => [...toolbar.querySelectorAll<HTMLElement>(":scope > button")];

test.each([1280, 800, 480])("keeps every visible tool inside a %ipx toolbar", async (width) => {
  const toolbar = renderInFrame(width);
  await new Promise((resolve) => requestAnimationFrame(resolve));
  const toolbarRight = toolbar.getBoundingClientRect().right;
  for (const button of readVisibleButtons(toolbar)) {
    expect(button.getBoundingClientRect().right).toBeLessThanOrEqual(toolbarRight + 0.5);
  }
});

test("shows every tool when there is room and folds the rest into the menu when there is not", async () => {
  const wide = renderInFrame(1280);
  expect(readVisibleButtons(wide)).toHaveLength(VISIBLE_TOOL_COUNT);
  expect(screen.queryByRole("button", { name: "Más herramientas" })).toBeNull();
  wide.closest<HTMLElement>(".gdy-md-editor")!.parentElement!.style.width = "300px";
  await new Promise((resolve) => setTimeout(resolve, 100));
  expect(screen.getByRole("button", { name: "Más herramientas" })).toBeInTheDocument();
  expect(readVisibleButtons(wide).length).toBeLessThan(VISIBLE_TOOL_COUNT);
});
