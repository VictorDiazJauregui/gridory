import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";

test("inserts the table and leaves the cursor in its first cell", async () => {
  const onChange = vi.fn();
  render(<MarkdownEditor defaultValue="" onChange={onChange} />);
  await userEvent.click(await screen.findByRole("textbox", { name: "Texto en Markdown" }));
  await userEvent.click(screen.getByRole("button", { name: "Tabla" }));
  await userEvent.fill(await screen.findByRole("spinbutton", { name: "Filas" }), "1");
  await userEvent.fill(screen.getByRole("spinbutton", { name: "Columnas" }), "2");
  await userEvent.click(screen.getByRole("button", { name: "Insertar" }));
  await vi.waitFor(() => expect(onChange).toHaveBeenCalled());
  await userEvent.keyboard("Precio");
  expect(onChange).toHaveBeenLastCalledWith("| Precio |  |\n| :--- | :--- |\n|  |  |\n\n");
});
