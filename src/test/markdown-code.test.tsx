import { render, screen, waitFor } from "@testing-library/react";
import { expect, test } from "vitest";
import { DEFAULT_CODE_LANGUAGES, findCodeLanguage } from "../components/markdown-editor/code/code-languages";
import { formatCodeBlock } from "../components/markdown-editor/commands/insertions";
import { MarkdownViewer } from "../components/markdown-editor/viewer/MarkdownViewer";

test.each([
  { block: { language: "python", code: "print(1)" }, markdown: "```python\nprint(1)\n```" },
  { block: { language: "text", code: "plain\n" }, markdown: "```\nplain\n```" },
  { block: { language: "md", code: "```js\nx\n```" }, markdown: "````md\n```js\nx\n```\n````" },
])("formats a code block as $markdown", ({ block, markdown }) => {
  expect(formatCodeBlock(block)).toBe(markdown);
});

test("finds a language by id or alias", () => {
  expect(findCodeLanguage(DEFAULT_CODE_LANGUAGES, "TS")?.id).toBe("typescript");
  expect(findCodeLanguage(DEFAULT_CODE_LANGUAGES, "yml")?.id).toBe("yaml");
  expect(findCodeLanguage(DEFAULT_CODE_LANGUAGES, "cobol")).toBeUndefined();
});

test("colors a known language once its grammar loads", async () => {
  render(<MarkdownViewer value={"```ts\nconst total = 1;\n```"} aria-label="Nota" />);
  const code = screen.getByRole("region", { name: "Nota" }).querySelector("pre code") as HTMLElement;
  await waitFor(() => expect(code).toHaveAttribute("data-highlighted", "true"));
  expect(code.querySelector(".hljs-keyword")?.textContent).toBe("const");
  expect(code.textContent).toBe("const total = 1;\n");
});

test("leaves unknown and plain-text blocks uncolored", async () => {
  render(<MarkdownViewer value={"```cobol\nDISPLAY 'X'.\n```\n\n```\nplain\n```"} aria-label="Nota" />);
  await new Promise((resolve) => setTimeout(resolve, 50));
  const blocks = [...screen.getByRole("region", { name: "Nota" }).querySelectorAll("pre code")];
  expect(blocks.map((block) => block.hasAttribute("data-highlighted"))).toEqual([false, false]);
  expect(blocks[0].textContent).toBe("DISPLAY 'X'.\n");
});
