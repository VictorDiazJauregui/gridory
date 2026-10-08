import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";
import { applyScreen } from "./browser/environment";

const renderEditor = async (props: Parameters<typeof MarkdownEditor>[0] = {}) => {
  const onChange = vi.fn();
  render(<MarkdownEditor onChange={onChange} {...props} />);
  await userEvent.click(await screen.findByRole("textbox", { name: "Texto en Markdown" }));
  return () => onChange.mock.lastCall?.[0];
};

test("inserts the formatted date at the cursor", async () => {
  const readValue = await renderEditor({ defaultValue: "", formatDateTime: () => "7 de octubre de 2026" });
  await userEvent.keyboard("Hoy: ");
  await userEvent.click(screen.getByRole("button", { name: "Fecha y hora" }));
  expect(readValue()).toBe("Hoy: 7 de octubre de 2026");
});

test("clears everything after confirming and brings it back with undo", async () => {
  const readValue = await renderEditor({ defaultValue: "texto" });
  await userEvent.click(screen.getByRole("button", { name: "Borrar todo" }));
  await screen.findByRole("alertdialog");
  await userEvent.click(screen.getAllByRole("button", { name: "Borrar todo" }).at(-1) as HTMLElement);
  await vi.waitFor(() => expect(readValue()).toBe(""));
  await userEvent.keyboard("{Control>}z{/Control}");
  expect(readValue()).toBe("texto");
});

test.each(["desktop", "iphone14Pro"] as const)("covers the whole viewport in fullscreen on %s", async (screenName) => {
  await applyScreen(screenName);
  const { container } = render(<MarkdownEditor defaultValue="hola" tools={["fullscreen"]} />);
  await userEvent.click(screen.getByRole("button", { name: "Pantalla completa" }));
  const frame = (container.querySelector(".gdy-md-editor") as HTMLElement).getBoundingClientRect();
  expect([frame.left, frame.top, frame.width, frame.height]).toEqual([0, 0, window.innerWidth, window.innerHeight]);
});
