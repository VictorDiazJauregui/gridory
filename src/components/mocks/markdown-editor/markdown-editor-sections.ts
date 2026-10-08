export interface MarkdownEditorDemoSectionContent {
  id: string;
  title: string;
  description: string;
}

export const MARKDOWN_EDITOR_DEMO_SECTIONS: MarkdownEditorDemoSectionContent[] = [
  {
    id: "showcase",
    title: "Documento completo",
    description: "Todo junto: títulos de los seis niveles, avisos de GitHub, enlaces, tablas, listas, tareas, código, diagramas, fórmulas e índice.",
  },
  {
    id: "rendering",
    title: "Renderizado",
    description: "Un documento que usa toda la sintaxis soportada, sanitizado y con los estilos del módulo.",
  },
  {
    id: "viewer",
    title: "Solo lectura",
    description: "El mismo resultado que la vista previa, sin editor ni barra.",
  },
  {
    id: "views",
    title: "Vistas",
    description: "Dividida, solo editor y solo vista previa, con el scroll sincronizado por línea.",
  },
  {
    id: "toolbar",
    title: "Barra",
    description: "Compartida, solo sobre el editor, libre en una cabecera propia y plegada en un marco angosto.",
  },
  {
    id: "custom-dialogs",
    title: "Ventanas propias",
    description: "Una ventana reemplazada por la de la app, que solo devuelve datos.",
  },
  {
    id: "diagrams",
    title: "Diagramas",
    description: "Bloques mermaid dibujados a demanda con gridory/markdown-editor/mermaid: flujo, Gantt, secuencia y un error de sintaxis.",
  },
  {
    id: "formulas",
    title: "Fórmulas",
    description: "LaTeX con $…$ y $$…$$ dibujado con KaTeX a demanda desde gridory/markdown-editor/katex; los importes como $5 y $10 quedan como texto.",
  },
  {
    id: "guide",
    title: "Guía",
    description: "La guía de sintaxis sigue a las herramientas habilitadas: con esta barra reducida solo muestra énfasis, listas, enlaces y tablas, más una sección propia.",
  },
  {
    id: "custom",
    title: "Personalizado (solo tokens)",
    description: "Colores, tipografía y bordes cambiados solo con tokens --gdy-md-*.",
  },
];

export const MARKDOWN_EDITOR_EVENT_LOG_DESCRIPTION =
  "El editor no guarda nada: emite eventos y la demo los registra.";
