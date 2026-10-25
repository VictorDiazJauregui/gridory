import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { wrapSelection } from "../components/markdown-editor/commands/wrap-selection";
import { MarkdownEditorProvider } from "../components/markdown-editor/MarkdownEditorProvider";
import { useMarkdownEditor } from "../components/markdown-editor/model/markdown-editor-context";
import { MarkdownSource } from "../components/markdown-editor/source/MarkdownSource";

const EditorControls = () => {
  const editor = useMarkdownEditor();
  return (
    <>
      <button type="button" onClick={() => editor.apply(wrapSelection("**"))}>bold</button>
      <button type="button" disabled={!editor.canUndo} onClick={editor.undo}>undo</button>
      <output>{editor.value}</output>
    </>
  );
};

const readValue = () => screen.getByRole("status").textContent;

test("types, applies a command as one step and undoes it", async () => {
  const onChange = vi.fn();
  render(
    <MarkdownEditorProvider defaultValue="" onChange={onChange}>
      <MarkdownSource />
      <EditorControls />
    </MarkdownEditorProvider>,
  );
  await userEvent.click(await screen.findByRole("textbox", { name: "Texto en Markdown" }));
  await userEvent.keyboard("word");
  await userEvent.keyboard("{Shift>}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{/Shift}");
  await userEvent.click(screen.getByRole("button", { name: "bold" }));
  expect(readValue()).toBe("**word**");
  expect(onChange).toHaveBeenLastCalledWith("**word**");
  await userEvent.click(screen.getByRole("button", { name: "undo" }));
  expect(readValue()).toBe("word");
});

const ControlledEditor = () => {
  const [value, setValue] = useState("first");
  return (
    <MarkdownEditorProvider value={value} onChange={setValue}>
      <MarkdownSource />
      <button type="button" onClick={() => setValue((current) => `${current} (saved)`)}>append</button>
      <button type="button" onClick={() => setValue("replaced")}>replace</button>
      <EditorControls />
    </MarkdownEditorProvider>
  );
};

test("keeps the typing history when the controlled value changes elsewhere", async () => {
  render(<ControlledEditor />);
  const textbox = await screen.findByRole("textbox", { name: "Texto en Markdown" });
  await userEvent.click(textbox);
  await userEvent.keyboard("{Control>}{End}{/Control}!");
  await userEvent.click(screen.getByRole("button", { name: "append" }));
  await waitFor(() => expect(textbox).toHaveTextContent("first! (saved)"));
  await userEvent.click(screen.getByRole("button", { name: "undo" }));
  expect(readValue()).toBe("first (saved)");
});

test("an outside replacement is not undoable", async () => {
  render(<ControlledEditor />);
  const textbox = await screen.findByRole("textbox", { name: "Texto en Markdown" });
  await userEvent.click(screen.getByRole("button", { name: "replace" }));
  await waitFor(() => expect(textbox).toHaveTextContent("replaced"));
  expect(screen.getByRole("button", { name: "undo" })).toBeDisabled();
});

test("names the writing area and shows the placeholder", async () => {
  render(
    <MarkdownEditorProvider texts={{ placeholder: "Escribí acá" }}>
      <MarkdownSource aria-label="Descripción" />
    </MarkdownEditorProvider>,
  );
  expect(await screen.findByRole("textbox", { name: "Descripción" })).toBeInTheDocument();
  expect(screen.getByText("Escribí acá")).toBeInTheDocument();
});

test("marks the writing area busy until the editor engine loads", async () => {
  const { container } = render(
    <MarkdownEditorProvider>
      <MarkdownSource />
    </MarkdownEditorProvider>,
  );
  const source = container.querySelector(".gdy-md-source");
  expect(source).toHaveAttribute("aria-busy", "true");
  await screen.findByRole("textbox", { name: "Texto en Markdown" });
  expect(source).not.toHaveAttribute("aria-busy");
});
