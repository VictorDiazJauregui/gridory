import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import { formatImage, replaceMarker } from "../components/markdown-editor/commands/insertions";
import { DEFAULT_MARKDOWN_EDITOR_TEXTS } from "../components/markdown-editor/constants";
import { altFromFileName, findFileProblem, formatMegabytes } from "../components/markdown-editor/dialogs/image-file-rules";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";

beforeEach(() => {
  URL.createObjectURL = vi.fn(() => "blob:preview");
  URL.revokeObjectURL = vi.fn();
});

const RULES = { acceptedTypes: ["image/png"], maxBytes: 1024 };
const TEXTS = DEFAULT_MARKDOWN_EDITOR_TEXTS.dialogs.image;

test("formats an image with alt text, destination and title", () => {
  expect(formatImage({ url: "/a b.png", alt: "Logo [v2]", title: "Logo" })).toBe('![Logo \\[v2\\]](</a b.png> "Logo")');
});

test("replaces a marker and keeps the selection after it in place", () => {
  const result = replaceMarker("[m]", "IMG")({ text: "a [m] b", selection: { from: 7, to: 7 } });
  expect(result.changes).toEqual([{ from: 2, to: 5, insert: "IMG" }]);
  expect(result.selection).toEqual({ from: 7, to: 7 });
  expect(replaceMarker("[x]", "IMG")({ text: "nothing", selection: { from: 0, to: 0 } }).changes).toEqual([]);
});

test("checks the file type and size and suggests an alt text", () => {
  expect(findFileProblem(new File(["x"], "a.gif", { type: "image/gif" }), RULES, TEXTS)).toBe(TEXTS.invalidType);
  expect(findFileProblem(new File([new Uint8Array(2048)], "a.png", { type: "image/png" }), RULES, TEXTS)).toBe("La imagen supera el tamaño máximo (0 MB).");
  expect(findFileProblem(new File(["x"], "a.png", { type: "image/png" }), RULES, TEXTS)).toBeNull();
  expect(formatMegabytes(5 * 1024 * 1024)).toBe("5 MB");
  expect(altFromFileName(new File([""], "captura_de-pantalla.png"))).toBe("captura de pantalla");
});

const openImageDialog = async (onImageUpload?: () => Promise<{ url: string }>) => {
  render(<MarkdownEditor defaultValue="hola" onImageUpload={onImageUpload} />);
  await userEvent.click(screen.getByRole("button", { name: "Imagen" }));
  return screen.findByRole("dialog", { name: "Insertar imagen" });
};

test("offers only URLs when the app does not upload", async () => {
  await openImageDialog();
  expect(screen.queryByRole("tab", { name: "Subir archivo" })).toBeNull();
  await userEvent.type(screen.getByRole("textbox", { name: "Dirección de la imagen" }), "/a.png");
  await userEvent.click(screen.getByRole("button", { name: "Insertar" }));
  expect(screen.getByRole("textbox", { name: "Texto alternativo" })).toHaveAccessibleDescription(expect.stringContaining("Escribe un texto alternativo."));
});

test("keeps the dialog open and explains a failed upload", async () => {
  const upload = vi.fn().mockRejectedValue(new Error("server down"));
  await openImageDialog(upload);
  await userEvent.click(screen.getByRole("tab", { name: "Subir archivo" }));
  await userEvent.upload(screen.getByLabelText("Archivo"), new File(["png"], "foto.png", { type: "image/png" }));
  expect(screen.getByRole("textbox", { name: "Texto alternativo" })).toHaveValue("foto");
  await userEvent.click(screen.getByRole("button", { name: "Insertar" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo subir la imagen.");
  expect(upload).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});

test("rejects a file of a type that is not accepted", async () => {
  await openImageDialog(vi.fn());
  await userEvent.click(screen.getByRole("tab", { name: "Subir archivo" }));
  await userEvent.upload(screen.getByLabelText("Archivo"), new File(["x"], "doc.pdf", { type: "application/pdf" }), { applyAccept: false });
  expect(screen.getByRole("alert")).toHaveTextContent("Ese tipo de archivo no está permitido.");
});
