import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";

const DOCUMENT = "uno dos\ndos tres\ndos";

const renderFocusedEditor = async () => {
  const onChange = vi.fn();
  const { container } = render(<MarkdownEditor defaultValue={DOCUMENT} onChange={onChange} />);
  await userEvent.click(await screen.findByRole("textbox", { name: "Texto en Markdown" }));
  return { container, readValue: () => onChange.mock.lastCall?.[0] };
};

test("opens the search panel in Spanish with Ctrl+F", async () => {
  await renderFocusedEditor();
  await userEvent.keyboard("{Control>}f{/Control}");
  expect(await screen.findByRole("textbox", { name: "Buscar" })).toHaveFocus();
  expect(screen.getByRole("button", { name: "Reemplazar todo" })).toBeInTheDocument();
  expect(screen.getByRole("checkbox", { name: "Expresión regular" })).toBeInTheDocument();
});

test("replaces every match from the replace panel", async () => {
  const { readValue } = await renderFocusedEditor();
  await userEvent.keyboard("{Control>}h{/Control}");
  expect(await screen.findByRole("textbox", { name: "Reemplazar" })).toHaveFocus();
  await userEvent.type(screen.getByRole("textbox", { name: "Buscar" }), "dos");
  await userEvent.type(screen.getByRole("textbox", { name: "Reemplazar" }), "2");
  await userEvent.click(screen.getByRole("button", { name: "Reemplazar todo" }));
  expect(readValue()).toBe("uno 2\n2 tres\n2");
});

test("goes to a line and clamps a number past the end", async () => {
  const { readValue } = await renderFocusedEditor();
  await userEvent.click(screen.getByRole("button", { name: "Ir a línea" }));
  const lineField = await screen.findByRole("textbox", { name: /Ir a la línea/ });
  await userEvent.clear(lineField);
  await userEvent.type(lineField, "99{Enter}");
  await userEvent.keyboard("!");
  expect(readValue()).toBe("uno dos\ndos tres\n!dos");
});

test("leaves Ctrl+F to the browser outside the editor", async () => {
  const { container } = await renderFocusedEditor();
  (document.activeElement as HTMLElement).blur();
  const event = new KeyboardEvent("keydown", { key: "f", code: "KeyF", ctrlKey: true, bubbles: true, cancelable: true });
  document.body.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(false);
  expect(container.querySelector(".cm-search")).toBeNull();
});
