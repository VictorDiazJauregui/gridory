import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";
import { formatDateTimeByDefault } from "../components/markdown-editor/model/format-date-time";

test("formats the date and time with the given locale", () => {
  const date = new Date(2026, 9, 7, 9, 30);
  expect(formatDateTimeByDefault(date, "es-AR")).toBe(new Intl.DateTimeFormat("es-AR", { dateStyle: "long", timeStyle: "short" }).format(date));
});

test("toggles fullscreen from the toolbar and leaves it with Escape", async () => {
  const onFullscreenChange = vi.fn();
  const { container } = render(<MarkdownEditor defaultValue="hola" onFullscreenChange={onFullscreenChange} />);
  const toggle = screen.getByRole("button", { name: "Pantalla completa" });
  await userEvent.click(toggle);
  expect(container.querySelector(".gdy-md-editor")).toHaveAttribute("data-fullscreen");
  expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(document.documentElement.style.overflow).toBe("hidden");
  await userEvent.keyboard("{Escape}");
  expect(container.querySelector(".gdy-md-editor")).not.toHaveAttribute("data-fullscreen");
  expect(document.documentElement.style.overflow).toBe("");
  expect(onFullscreenChange.mock.calls).toEqual([[true], [false]]);
});

test("asks before clearing and keeps the text when cancelled", async () => {
  render(<MarkdownEditor defaultValue="hola" />);
  await userEvent.click(screen.getByRole("button", { name: "Borrar todo" }));
  const dialog = await screen.findByRole("alertdialog", { name: "¿Borrar todo el contenido?" });
  expect(dialog).toHaveTextContent("Puedes recuperarlo con Deshacer");
  await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
  expect(screen.queryByRole("alertdialog")).toBeNull();
  expect(screen.getByRole("region", { name: "Vista previa" })).toHaveTextContent("hola");
});

test("disables clearing an empty document", () => {
  render(<MarkdownEditor />);
  expect(screen.getByRole("button", { name: "Borrar todo" })).toBeDisabled();
});
