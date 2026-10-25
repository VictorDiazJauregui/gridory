import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import { DEFAULT_DIAGRAM_TEMPLATES } from "../components/markdown-editor/diagrams/diagram-templates";
import type { MarkdownDiagramRenderer } from "../components/markdown-editor/diagrams/diagram-types";
import type { DiagramDialogProps } from "../components/markdown-editor/dialogs/dialog-types";
import { MarkdownEditor } from "../components/markdown-editor/MarkdownEditor";

const diagrams: MarkdownDiagramRenderer = {
  load: async () => ({ default: { initialize: vi.fn(), render: vi.fn(async (_id: string, text: string) => ({ svg: `<svg><text>${text.split("\n")[0]}</text></svg>` })) } }),
};

const openDiagramDialog = async () => {
  await userEvent.click(screen.getByRole("button", { name: "Diagrama" }));
  return screen.findByRole("dialog", { name: "Insertar diagrama" });
};

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

test("offers the diagram tool only when the app passes a diagram renderer", () => {
  const { rerender } = render(<MarkdownEditor />);
  expect(screen.queryByRole("button", { name: "Diagrama" })).toBeNull();
  rerender(<MarkdownEditor diagrams={diagrams} />);
  expect(screen.getByRole("button", { name: "Diagrama" })).toBeInTheDocument();
});

test("hides the diagram tool listed by hand when there is no renderer", () => {
  render(<MarkdownEditor tools={["bold", "diagram"]} />);
  expect(screen.getByRole("button", { name: "Negrita" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Diagrama" })).toBeNull();
});

test("starts from the first template, swaps templates and draws the edited code live", async () => {
  render(<MarkdownEditor diagrams={diagrams} />);
  const dialog = await openDiagramDialog();
  const code = within(dialog).getByRole("textbox", { name: "Código Mermaid" });
  expect(within(dialog).getAllByRole("radio")).toHaveLength(DEFAULT_DIAGRAM_TEMPLATES.length);
  expect(within(dialog).getByRole("radio", { name: "Flujo" })).toBeChecked();
  expect(code).toHaveValue(DEFAULT_DIAGRAM_TEMPLATES[0].code);
  await userEvent.click(within(dialog).getByRole("radio", { name: "Gantt" }));
  expect((code as HTMLTextAreaElement).value).toMatch(/^gantt/);
  await userEvent.clear(code);
  await userEvent.type(code, "pie");
  const preview = within(dialog).getByRole("region", { name: "Vista previa del diagrama" });
  await waitFor(() => expect(preview.querySelector("svg")).toHaveTextContent("pie"), { timeout: 2000 });
});

test("gives a replaced dialog the templates and the renderer", async () => {
  const OwnDiagramDialog = vi.fn(({ open, templates }: DiagramDialogProps) => (open ? <p>{templates.length} plantillas</p> : null));
  const templates = [{ id: "mine", label: "Mía", code: "flowchart TD\n  A --> B" }];
  render(<MarkdownEditor diagrams={diagrams} diagramTemplates={templates} dialogs={{ diagram: OwnDiagramDialog }} />);
  await userEvent.click(screen.getByRole("button", { name: "Diagrama" }));
  expect(screen.getByText("1 plantillas")).toBeInTheDocument();
  expect(OwnDiagramDialog.mock.lastCall?.[0]).toMatchObject({ diagrams, templates });
});
