import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import type { LinkInsert, MarkdownDialogProps } from "../components/markdown-editor/dialogs/dialog-types";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";

const openLinkDialog = async () => {
  render(<MarkdownEditor defaultValue="hola" />);
  await userEvent.click(screen.getByRole("button", { name: "Enlace" }));
  return screen.findByRole("dialog", { name: "Insertar enlace" });
};

test("validates the address before inserting", async () => {
  await openLinkDialog();
  await userEvent.click(screen.getByRole("button", { name: "Insertar" }));
  expect(screen.getByRole("textbox", { name: "Dirección" })).toHaveAccessibleDescription("Escribe una dirección.");
  await userEvent.type(screen.getByRole("textbox", { name: "Dirección" }), "javascript:alert(1)");
  await userEvent.click(screen.getByRole("button", { name: "Insertar" }));
  expect(screen.getByRole("textbox", { name: "Dirección" })).toHaveAccessibleDescription("Esa dirección no está permitida.");
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});

test("closes without inserting on cancel", async () => {
  await openLinkDialog();
  await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
  expect(screen.queryByRole("dialog")).toBeNull();
});

test("flags a repeated reference id", async () => {
  render(<MarkdownEditor defaultValue={"texto\n\n[^1]: nota"} />);
  await userEvent.click(screen.getByRole("button", { name: "Referencia" }));
  await userEvent.click(await screen.findByRole("radio", { name: "Nota al pie" }));
  await userEvent.type(screen.getByRole("textbox", { name: "Nota" }), "otra");
  await userEvent.type(screen.getByRole("textbox", { name: "Identificador (opcional)" }), "1");
  await userEvent.click(screen.getByRole("button", { name: "Insertar" }));
  expect(screen.getByText("Ese identificador ya existe en el documento.")).toBeInTheDocument();
  expect(screen.getByText("Si lo dejas vacío se usa 2.")).toBeInTheDocument();
});

test("renders a replaced dialog with the selection and the insert callback", async () => {
  const received = vi.fn();
  const CustomLink = ({ open, selectedText, onInsert }: MarkdownDialogProps<LinkInsert>) => {
    if (!open) return null;
    received(selectedText);
    return <button type="button" onClick={() => onInsert({ text: "x", url: "/x" })}>propia</button>;
  };
  render(<MarkdownEditor defaultValue="hola" dialogs={{ link: CustomLink }} />);
  await userEvent.click(screen.getByRole("button", { name: "Enlace" }));
  expect(await screen.findByRole("button", { name: "propia" })).toBeInTheDocument();
  expect(received).toHaveBeenCalledWith("");
});
