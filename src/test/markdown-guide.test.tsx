import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import type { GuideDialogProps } from "../components/markdown-editor/dialogs/dialog-types";
import { DEFAULT_GUIDE_SECTIONS } from "../components/markdown-editor/guide/default-guide-sections";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";
import { MARKDOWN_TOOL_IDS } from "../components/markdown-editor/tools/built-in-tools";

const GUIDE_TOOL_ID = "guide";

const openGuide = async () => {
  await userEvent.click(screen.getByRole("button", { name: "Guía de Markdown" }));
  return screen.findByRole("dialog", { name: "Guía de Markdown" });
};

const readSectionTitles = (dialog: HTMLElement) => within(dialog).queryAllByRole("heading", { level: 3 }).map((heading) => heading.textContent);

test("gives every built-in tool a section of the guide", () => {
  const documentedTools = new Set(DEFAULT_GUIDE_SECTIONS.flatMap((section) => section.toolIds));
  expect(MARKDOWN_TOOL_IDS.filter((id) => id !== GUIDE_TOOL_ID && !documentedTools.has(id))).toEqual([]);
});

test("ties every built-in section to tools that exist", () => {
  const toolIds = new Set<string>(MARKDOWN_TOOL_IDS);
  DEFAULT_GUIDE_SECTIONS.forEach((section) => {
    expect(section.toolIds.length).toBeGreaterThan(0);
    expect(section.toolIds.filter((id) => !toolIds.has(id))).toEqual([]);
  });
});

test("shows only the sections the toolbar writes, plus the app's own", async () => {
  const sections = (defaults: typeof DEFAULT_GUIDE_SECTIONS) => [...defaults, { id: "mine", tab: "write" as const, title: "Firma", description: "Propia", examples: ["— *Equipo*"], toolIds: [] }];
  render(<MarkdownEditor tools={["bold", "link", "|", "guide"]} guide={{ sections }} />);
  const dialog = await openGuide();
  expect(readSectionTitles(dialog)).toEqual(["Énfasis", "Firma"]);
  expect(within(dialog).getByText("**negrita**, *cursiva* y ~~tachado~~")).toBeInTheDocument();
  expect(within(dialog).getAllByRole("region", { name: "Se ve" })[0].querySelector("strong")).toHaveTextContent("negrita");
  await userEvent.click(within(dialog).getByRole("tab", { name: "Insertar" }));
  expect(readSectionTitles(dialog)).toEqual(["Enlaces"]);
});

test("leaves out optional sections without their renderer", async () => {
  render(<MarkdownEditor />);
  const dialog = await openGuide();
  await userEvent.click(within(dialog).getByRole("tab", { name: "Insertar" }));
  expect(readSectionTitles(dialog)).not.toContain("Diagramas");
  expect(readSectionTitles(dialog)).not.toContain("Fórmulas");
});

test("removes the guide button with guide={false}", () => {
  render(<MarkdownEditor guide={false} />);
  expect(screen.queryByRole("button", { name: "Guía de Markdown" })).toBeNull();
});

test("lets the app replace the guide's frame", async () => {
  const OwnGuide = vi.fn(({ open, sections }: GuideDialogProps) => (open ? <p>{sections.length} temas</p> : null));
  render(<MarkdownEditor tools={["bold", "italic", "guide"]} dialogs={{ guide: OwnGuide }} />);
  await userEvent.click(screen.getByRole("button", { name: "Guía de Markdown" }));
  expect(screen.getByText("1 temas")).toBeInTheDocument();
  expect(OwnGuide.mock.lastCall?.[0].tools.map((tool) => tool.id)).toEqual(["bold", "italic", "guide"]);
});
