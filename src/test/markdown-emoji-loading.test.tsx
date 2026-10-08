import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";

const catalogRequest = vi.hoisted(() => {
  let release = () => {};
  const released = new Promise<void>((resolve) => {
    release = resolve;
  });
  return { released, release: () => release() };
});

vi.mock("../components/markdown-editor/pickers/emoji-data", async () => {
  await catalogRequest.released;
  return { EMOJI_CATEGORIES: [{ id: "faces", label: "Caras", emojis: [{ emoji: "🙂", name: "sonrisa leve", keywords: "slightly smiling" }] }] };
});

test("shows a loading message until the catalog arrives on demand", async () => {
  render(<MarkdownEditor />);
  await userEvent.click(screen.getByRole("button", { name: "Emoji" }));
  const dialog = await screen.findByRole("dialog", { name: "Insertar emoji" });
  expect(within(dialog).getByRole("status")).toHaveTextContent("Cargando emoji…");
  catalogRequest.release();
  expect(await within(dialog).findByRole("button", { name: "sonrisa leve" })).toBeInTheDocument();
  expect(within(dialog).queryByRole("status")).toBeNull();
});
