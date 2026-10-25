import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";

test("inserts a code block in the chosen language with the selection as its code", async () => {
  const onChange = vi.fn();
  render(<MarkdownEditor defaultValue="" onChange={onChange} />);
  await userEvent.click(await screen.findByRole("textbox", { name: "Texto en Markdown" }));
  await userEvent.keyboard("SELECT 1;{Shift>}{Home}{/Shift}");
  await userEvent.click(screen.getByRole("button", { name: "Bloque de código" }));
  expect(await screen.findByRole("textbox", { name: "Código" })).toHaveValue("SELECT 1;");
  await userEvent.click(screen.getByRole("option", { name: "SQL" }));
  await userEvent.click(screen.getByRole("button", { name: "Insertar" }));
  await vi.waitFor(() => expect(onChange).toHaveBeenLastCalledWith("```sql\nSELECT 1;\n```\n\n"));
});
