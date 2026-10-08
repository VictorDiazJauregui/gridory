import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";

const renderEditorWithSelectedWord = async (word: string) => {
  const onChange = vi.fn();
  render(<MarkdownEditor defaultValue="" onChange={onChange} />);
  await userEvent.click(await screen.findByRole("textbox", { name: "Texto en Markdown" }));
  await userEvent.keyboard(word);
  await userEvent.keyboard(`{Shift>}${"{ArrowLeft}".repeat(word.length)}{/Shift}`);
  return () => onChange.mock.lastCall?.[0];
};

test.each([
  { tool: "Negrita", expected: "**hola**" },
  { tool: "Cursiva", expected: "*hola*" },
  { tool: "Tachado", expected: "~~hola~~" },
  { tool: "Código en línea", expected: "`hola`" },
  { tool: "MAYÚSCULAS", expected: "HOLA" },
  { tool: "Cada Palabra En Mayúscula", expected: "Hola" },
  { tool: "Cita", expected: "> hola" },
  { tool: "Lista con viñetas", expected: "- hola" },
  { tool: "Lista numerada", expected: "1. hola" },
  { tool: "Lista de tareas", expected: "- [ ] hola" },
  { tool: "Línea horizontal", expected: "---\n\n" },
])("the $tool button writes $expected", async ({ tool, expected }) => {
  const readValue = await renderEditorWithSelectedWord("hola");
  await userEvent.click(screen.getByRole("button", { name: tool }));
  expect(readValue()).toBe(expected);
});

test.each([
  { keys: "{Control>}b{/Control}", expected: "**hola**" },
  { keys: "{Control>}i{/Control}", expected: "*hola*" },
  { keys: "{Control>}{Shift>}x{/Shift}{/Control}", expected: "~~hola~~" },
  { keys: "{Control>}e{/Control}", expected: "`hola`" },
  { keys: "{Control>}{Alt>}2{/Alt}{/Control}", expected: "## hola" },
])("the shortcut $keys writes $expected", async ({ keys, expected }) => {
  const readValue = await renderEditorWithSelectedWord("hola");
  await userEvent.keyboard(keys);
  expect(readValue()).toBe(expected);
});

test("the heading and alert menus write their choice", async () => {
  const readValue = await renderEditorWithSelectedWord("hola");
  await userEvent.click(screen.getByRole("button", { name: "Títulos" }));
  await userEvent.click(await screen.findByRole("menuitem", { name: /Título 3/ }));
  await vi.waitFor(() => expect(readValue()).toBe("### hola"));
  await userEvent.click(screen.getByRole("button", { name: "Avisos" }));
  await userEvent.click(await screen.findByRole("menuitem", { name: "Importante" }));
  await vi.waitFor(() => expect(readValue()).toContain("> [!IMPORTANT]"));
});
