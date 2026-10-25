import type { MarkdownGuideSection } from "./guide-types";

const SAMPLE_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='48'%3E%3Crect width='120' height='48' rx='6' fill='%2394a3b8'/%3E%3C/svg%3E";

const WRITE_SECTIONS: readonly MarkdownGuideSection[] = [
  { id: "headings", tab: "write", title: "Títulos", description: "Un numeral por nivel, del 1 al 6, seguido de un espacio.", examples: ["# Título\n## Subtítulo\n### Apartado"], toolIds: ["heading"] },
  { id: "emphasis", tab: "write", title: "Énfasis", description: "Negrita con dos asteriscos, cursiva con uno y tachado con dos virgulillas.", examples: ["**negrita**, *cursiva* y ~~tachado~~"], toolIds: ["bold", "italic", "strikethrough"] },
  { id: "inline-code", tab: "write", title: "Código en línea", description: "Entre comillas invertidas, para nombres, comandos o valores.", examples: ["Ejecutá `npm install` en la terminal."], toolIds: ["inlineCode"] },
  { id: "text-case", tab: "write", title: "Mayúsculas y minúsculas", description: "Cambian el texto seleccionado a mayúsculas, a minúsculas o con la inicial de cada palabra en mayúscula.", examples: [], toolIds: ["uppercase", "lowercase", "capitalize"] },
  { id: "quote", tab: "write", title: "Citas", description: "Un signo mayor al principio de cada línea.", examples: ["> Lo simple es mejor que lo complejo."], toolIds: ["quote"] },
  { id: "lists", tab: "write", title: "Listas", description: "Con guion para viñetas o con número y punto para listas numeradas.", examples: ["- Leche\n- Pan\n\n1. Primero\n2. Segundo"], toolIds: ["bulletList", "orderedList"] },
  { id: "task-list", tab: "write", title: "Lista de tareas", description: "Corchetes vacíos para lo pendiente y con una x para lo hecho.", examples: ["- [x] Diseño\n- [ ] Desarrollo"], toolIds: ["taskList"] },
  { id: "horizontal-rule", tab: "write", title: "Línea horizontal", description: "Tres guiones solos en una línea separan secciones.", examples: ["Arriba\n\n---\n\nAbajo"], toolIds: ["horizontalRule"] },
  { id: "alerts", tab: "write", title: "Avisos", description: "Una cita que empieza con el tipo de aviso, como en GitHub: NOTE, TIP, IMPORTANT, WARNING o CAUTION.", examples: ["> [!NOTE]\n> Dato útil para el lector.", "> [!WARNING]\n> Revisá esto antes de seguir."], toolIds: ["alert"] },
  { id: "history", tab: "write", title: "Deshacer y rehacer", description: "Cada herramienta aplicada es un solo paso, así que se deshace de una vez.", examples: [], toolIds: ["undo", "redo"] },
  { id: "search", tab: "write", title: "Buscar, reemplazar e ir a una línea", description: "Abren el panel sobre el editor; Escape lo cierra.", examples: [], toolIds: ["search", "replace", "goToLine"] },
  { id: "clear", tab: "write", title: "Borrar todo", description: "Vacía el documento después de confirmar; se puede deshacer.", examples: [], toolIds: ["clear"] },
];

const INSERT_SECTIONS: readonly MarkdownGuideSection[] = [
  { id: "links", tab: "insert", title: "Enlaces", description: "El texto entre corchetes y la dirección entre paréntesis.", examples: ["[Documentación](https://example.com)"], toolIds: ["link"] },
  { id: "references", tab: "insert", title: "Referencias y notas al pie", description: "Enlaces que se definen aparte y notas numeradas al final del documento.", examples: ["Ver [la guía][guia] y una nota.[^1]\n\n[guia]: https://example.com\n[^1]: El texto de la nota."], toolIds: ["reference"] },
  { id: "images", tab: "insert", title: "Imágenes", description: "Como un enlace con un signo de exclamación delante; el texto alternativo describe la imagen.", examples: [`![Rectángulo gris](${SAMPLE_IMAGE})`], toolIds: ["image"] },
  { id: "code-block", tab: "insert", title: "Bloques de código", description: "Entre tres comillas invertidas, con el lenguaje para colorearlo.", examples: ["```ts\nconst total = precio * cantidad;\n```"], toolIds: ["codeBlock"] },
  { id: "tables", tab: "insert", title: "Tablas", description: "Columnas separadas por barras; los dos puntos de la segunda fila alinean.", examples: ["| Producto | Precio |\n| :--- | ---: |\n| Café | 2,50 |"], toolIds: ["table"] },
  { id: "diagrams", tab: "insert", title: "Diagramas", description: "Un bloque de código con el lenguaje mermaid: flujo, secuencia, Gantt y más.", examples: ["```mermaid\nflowchart LR\n  Pedido --> Envío\n```"], toolIds: ["diagram"] },
  { id: "formulas", tab: "insert", title: "Fórmulas", description: "LaTeX entre signos de dólar: uno en línea, dos en bloque.", examples: ["El área es $A = \\pi r^2$.", "$$\n\\frac{a}{b} + c\n$$"], toolIds: ["formula"] },
  { id: "emoji", tab: "insert", title: "Emoji", description: "Se insertan como caracteres, así se ven igual en cualquier visor.", examples: ["¡Listo! 🎉"], toolIds: ["emoji"] },
  { id: "html-entities", tab: "insert", title: "Símbolos", description: "Entidades HTML para caracteres que no están en el teclado.", examples: ["&copy; 2026 &mdash; precio en &euro;"], toolIds: ["htmlEntity"] },
  { id: "date-time", tab: "insert", title: "Fecha y hora", description: "Escribe la fecha y la hora actuales donde está el cursor.", examples: [], toolIds: ["dateTime"] },
  { id: "outline", tab: "insert", title: "Índice", description: "Muestra los títulos del documento en un panel; un clic lleva a cada uno.", examples: [], toolIds: ["outline"] },
  { id: "fullscreen", tab: "insert", title: "Pantalla completa", description: "El editor ocupa toda la ventana; Escape vuelve.", examples: [], toolIds: ["fullscreen"] },
];

export const DEFAULT_GUIDE_SECTIONS: readonly MarkdownGuideSection[] = [...WRITE_SECTIONS, ...INSERT_SECTIONS];
