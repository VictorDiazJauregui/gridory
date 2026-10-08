import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";

test.each(["Enlace", "Tabla", "Emoji", "Guía de Markdown"])("gives the focus back to the %s button when its dialog closes", async (tool) => {
  render(<MarkdownEditor defaultValue="Texto" />);
  await screen.findByRole("textbox", { name: "Texto en Markdown" });
  const button = screen.getByRole("button", { name: tool });
  await userEvent.click(button);
  await screen.findByRole("dialog");
  await userEvent.keyboard("{Escape}");
  await vi.waitFor(() => expect(button).toHaveFocus());
});

test("gives the focus back to the writing area when a shortcut opened the dialog", async () => {
  render(<MarkdownEditor defaultValue="Texto" />);
  const source = await screen.findByRole("textbox", { name: "Texto en Markdown" });
  await userEvent.click(source);
  await userEvent.keyboard("{Control>}k{/Control}");
  await screen.findByRole("dialog", { name: "Insertar enlace" });
  await userEvent.keyboard("{Escape}");
  await vi.waitFor(() => expect(source).toHaveFocus());
});
