import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";

const PNG = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);

const pasteImage = (content: Element) => {
  const transfer = new DataTransfer();
  transfer.items.add(new File([PNG], "captura.png", { type: "image/png" }));
  content.dispatchEvent(new ClipboardEvent("paste", { clipboardData: transfer, bubbles: true, cancelable: true }));
};

const renderWithUpload = async (upload: () => Promise<{ url: string }>) => {
  const onChange = vi.fn();
  render(<MarkdownEditor defaultValue="texto" onChange={onChange} onImageUpload={upload} />);
  const textbox = await screen.findByRole("textbox", { name: "Texto en Markdown" });
  await userEvent.click(textbox);
  return { textbox, readValue: () => onChange.mock.lastCall?.[0] as string };
};

test("shows a placeholder while a pasted image uploads and swaps it for the image", async () => {
  let resolveUpload: (value: { url: string }) => void = () => undefined;
  const { textbox, readValue } = await renderWithUpload(() => new Promise((resolve) => (resolveUpload = resolve)));
  pasteImage(textbox);
  await vi.waitFor(() => expect(readValue()).toContain("![Subiendo imagen…](#image-upload-"), { timeout: 3000 });
  resolveUpload({ url: "https://cdn.example/captura.png" });
  await vi.waitFor(() => expect(readValue()).toContain("![captura](https://cdn.example/captura.png)"), { timeout: 3000 });
  expect(readValue()).not.toContain("Subiendo imagen");
});

test("removes the placeholder when the upload fails", async () => {
  const rejectLater = () => new Promise<{ url: string }>((_, reject) => setTimeout(() => reject(new Error("rejected")), 300));
  const { textbox, readValue } = await renderWithUpload(rejectLater);
  pasteImage(textbox);
  await vi.waitFor(() => expect(readValue()).toContain("Subiendo imagen"), { timeout: 3000 });
  await vi.waitFor(() => expect(readValue()).not.toContain("Subiendo imagen"), { timeout: 3000 });
  expect(readValue()).not.toContain("captura");
});
