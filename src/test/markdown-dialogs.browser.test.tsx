import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";

test("inserts a link over the selection and gives the focus back to the editor", async () => {
  const onChange = vi.fn();
  render(<MarkdownEditor defaultValue="" onChange={onChange} />);
  const textbox = await screen.findByRole("textbox", { name: "Texto en Markdown" });
  await userEvent.click(textbox);
  await userEvent.keyboard("ver docs");
  await userEvent.keyboard("{Shift>}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{/Shift}{Control>}k{/Control}");
  expect(await screen.findByRole("textbox", { name: "Texto" })).toHaveValue("docs");
  await userEvent.type(screen.getByRole("textbox", { name: "Dirección" }), "x.dev{Enter}");
  await vi.waitFor(() => expect(onChange).toHaveBeenLastCalledWith("ver [docs](https://x.dev)"));
  expect(textbox).toHaveFocus();
});
