import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";
import { EMOJI_CATEGORIES } from "../components/markdown-editor/pickers/emoji-data";
import { HTML_ENTITIES } from "../components/markdown-editor/pickers/html-entities";
import { findEmojiEntries, searchEmojis } from "../components/markdown-editor/pickers/search-emojis";

const openEmojiDialog = async () => {
  render(<MarkdownEditor />);
  await userEvent.click(screen.getByRole("button", { name: "Emoji" }));
  return screen.findByRole("dialog", { name: "Insertar emoji" });
};

test.each([
  { query: "Corazón rojo", expected: "❤️" },
  { query: "red heart", expected: "❤️" },
  { query: "COHETE", expected: "🚀" },
])("finds $expected searching «$query» without caring about accents or case", ({ query, expected }) => {
  expect(searchEmojis(EMOJI_CATEGORIES, query).map((entry) => entry.emoji)).toContain(expected);
});

test("keeps the order of the recent emoji and names unknown ones by themselves", () => {
  expect(findEmojiEntries(EMOJI_CATEGORIES, ["🚀", "🦄‍"]).map((entry) => entry.name)).toEqual(["cohete lanzamiento", "🦄‍"]);
});

test("ships every emoji once with a Spanish name", () => {
  const emojis = EMOJI_CATEGORIES.flatMap((category) => category.emojis);
  expect(new Set(emojis.map((entry) => entry.emoji)).size).toBe(emojis.length);
  expect(emojis.every((entry) => entry.name.trim().length > 0)).toBe(true);
});

test("loads the catalog when the dialog opens and shows one tab per category", async () => {
  const dialog = await openEmojiDialog();
  const tabs = await within(dialog).findAllByRole("tab");
  expect(tabs.map((tab) => tab.getAttribute("aria-label"))).toEqual(EMOJI_CATEGORIES.map((category) => category.label));
  expect(within(dialog).getByRole("group", { name: "Caras" })).toBeInTheDocument();
  expect(within(dialog).getByRole("searchbox", { name: "Buscar emoji" })).toHaveFocus();
});

test("filters by name and says when nothing matches", async () => {
  const dialog = await openEmojiDialog();
  await within(dialog).findAllByRole("tab");
  const search = within(dialog).getByRole("searchbox", { name: "Buscar emoji" });
  await userEvent.type(search, "rocket");
  expect(within(dialog).getByRole("button", { name: "cohete lanzamiento" })).toBeInTheDocument();
  expect(within(dialog).queryByRole("tab")).toBeNull();
  await userEvent.clear(search);
  await userEvent.type(search, "zzzz");
  expect(within(dialog).getByRole("status")).toHaveTextContent("No hay emoji con ese nombre");
});

test("lists every HTML entity with its name and code", async () => {
  render(<MarkdownEditor />);
  await userEvent.click(screen.getByRole("button", { name: "Símbolos" }));
  const dialog = await screen.findByRole("dialog", { name: "Insertar símbolo" });
  expect(within(dialog).getAllByRole("button", { name: /\(&\w+;\)$/ })).toHaveLength(HTML_ENTITIES.length);
  expect(within(dialog).getByRole("button", { name: "Copyright (&copy;)" })).toBeInTheDocument();
  expect(within(dialog).queryByRole("button", { name: "Insertar" })).toBeNull();
});

test("lets the app replace the emoji dialog", async () => {
  const OwnEmojiDialog = ({ open, onInsert }: { open: boolean; onInsert: (value: { text: string }) => void }) =>
    open ? <button type="button" onClick={() => onInsert({ text: "🎉" })}>Fiesta</button> : null;
  render(<MarkdownEditor dialogs={{ emoji: OwnEmojiDialog }} />);
  await userEvent.click(screen.getByRole("button", { name: "Emoji" }));
  expect(screen.getByRole("button", { name: "Fiesta" })).toBeInTheDocument();
  expect(screen.queryByRole("dialog", { name: "Insertar emoji" })).toBeNull();
});
