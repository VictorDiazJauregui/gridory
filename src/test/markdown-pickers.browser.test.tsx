import { render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";

const renderEditor = async () => {
  const onChange = vi.fn();
  const onEmojiSelect = vi.fn();
  render(<MarkdownEditor defaultValue="" onChange={onChange} onEmojiSelect={onEmojiSelect} />);
  await userEvent.click(await screen.findByRole("textbox", { name: "Texto en Markdown" }));
  return { onChange, onEmojiSelect };
};

const openEmojiDialog = async () => {
  await userEvent.click(screen.getByRole("button", { name: "Emoji" }));
  const dialog = await screen.findByRole("dialog", { name: "Insertar emoji" });
  await within(dialog).findAllByRole("tab");
  return dialog;
};

test("moves through the grid with the arrows and inserts with Enter", async () => {
  const { onChange, onEmojiSelect } = await renderEditor();
  const dialog = await openEmojiDialog();
  const grid = within(dialog).getByRole("group", { name: "Caras" });
  within(grid).getAllByRole("button")[0].focus();
  await userEvent.keyboard("{ArrowRight}{ArrowDown}{Enter}");
  await vi.waitFor(() => expect(onChange).toHaveBeenLastCalledWith("😉"));
  expect(onEmojiSelect).toHaveBeenCalledWith("😉");
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(screen.getByRole("textbox", { name: "Texto en Markdown" })).toHaveFocus();
});

test("offers the picked emoji first under Recientes", async () => {
  await renderEditor();
  const firstDialog = await openEmojiDialog();
  await userEvent.fill(within(firstDialog).getByRole("searchbox", { name: "Buscar emoji" }), "cohete");
  await userEvent.click(within(firstDialog).getByRole("button", { name: "cohete lanzamiento" }));
  await vi.waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  const dialog = await openEmojiDialog();
  expect(within(dialog).getAllByRole("tab")[0]).toHaveAccessibleName("Recientes");
  expect(within(within(dialog).getByRole("group", { name: "Recientes" })).getByRole("button")).toHaveAccessibleName("cohete lanzamiento");
});

test("keeps the dialog height while switching categories or searching", async () => {
  await renderEditor();
  const dialog = await openEmojiDialog();
  const initialHeight = dialog.getBoundingClientRect().height;
  await userEvent.click(within(dialog).getByRole("tab", { name: "Comida y bebida" }));
  expect(dialog.getBoundingClientRect().height).toBe(initialHeight);
  await userEvent.fill(within(dialog).getByRole("searchbox", { name: "Buscar emoji" }), "gato");
  expect(dialog.getBoundingClientRect().height).toBe(initialHeight);
});

test("inserts the entity code of the picked symbol", async () => {
  const { onChange } = await renderEditor();
  await userEvent.click(screen.getByRole("button", { name: "Símbolos" }));
  await userEvent.click(await screen.findByRole("button", { name: "Euro (&euro;)" }));
  await vi.waitFor(() => expect(onChange).toHaveBeenLastCalledWith("&euro;"));
});
