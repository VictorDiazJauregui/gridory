import { render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { mermaidDiagrams } from "../components/markdown-editor/diagrams/mermaid-diagrams";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";

test("inserts the edited template as a mermaid block and draws it in the preview", async () => {
  const onChange = vi.fn();
  render(<MarkdownEditor defaultValue="" onChange={onChange} diagrams={mermaidDiagrams} />);
  await userEvent.click(await screen.findByRole("textbox", { name: "Texto en Markdown" }));
  await userEvent.click(screen.getByRole("button", { name: "Diagrama" }));
  const dialog = await screen.findByRole("dialog", { name: "Insertar diagrama" });
  await userEvent.click(within(dialog).getByRole("radio", { name: "Torta" }));
  await userEvent.fill(within(dialog).getByRole("textbox", { name: "Código Mermaid" }), 'pie\n  "Sí" : 3\n  "No" : 1');
  await userEvent.click(within(dialog).getByRole("button", { name: "Insertar" }));
  await vi.waitFor(() => expect(onChange).toHaveBeenLastCalledWith('```mermaid\npie\n  "Sí" : 3\n  "No" : 1\n```\n\n'));
  const preview = screen.getByRole("region", { name: "Vista previa" });
  await vi.waitFor(() => expect(preview.querySelector('[data-diagram-state="ready"] svg')).not.toBeNull(), { timeout: 15000 });
});
