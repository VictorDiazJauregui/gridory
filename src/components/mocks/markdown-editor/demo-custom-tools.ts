import { Hand, MessageSquareQuote, PenTool, Sparkles, Stamp, Tag } from "lucide-react";
import { insertBlock, type MarkdownTool, type MarkdownToolbarItem, type ToolRunContext } from "@/components/markdown-editor";

const insert = (text: string) => ({ editor }: ToolRunContext) => editor.apply(insertBlock({ text }));

export const SIGNATURE_TOOL: MarkdownTool = {
  id: "demo-signature",
  label: "Insertar firma",
  icon: PenTool,
  shortcut: "Mod-Shift-f",
  run: insert("— Equipo de Gridory"),
};

const GREETINGS_TOOL: MarkdownTool = {
  id: "demo-greetings",
  label: "Saludos",
  icon: Hand,
  items: [
    { id: "hello", label: "Hola", run: insert("¡Hola!") },
    { id: "thanks", label: "Gracias", run: insert("¡Gracias por escribirnos!") },
  ],
};

const simpleTool = (id: string, label: string, icon: MarkdownTool["icon"]): MarkdownTool => ({ id, label, icon, run: insert(label) });

export const DEMO_TOOLBAR_ITEMS: MarkdownToolbarItem[] = [
  "undo",
  "redo",
  "|",
  SIGNATURE_TOOL,
  GREETINGS_TOOL,
  "|",
  simpleTool("demo-quote", "Cita destacada", MessageSquareQuote),
  simpleTool("demo-stamp", "Sello de aprobado", Stamp),
  "|",
  simpleTool("demo-tag", "Etiqueta", Tag),
  simpleTool("demo-highlight", "Destacado", Sparkles),
];
