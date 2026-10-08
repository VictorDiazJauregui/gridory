export interface MarkdownDiagramTemplate {
  id: string;
  label: string;
  /** Mermaid source the dialog starts from. */
  code: string;
}

export const DEFAULT_DIAGRAM_TEMPLATES: readonly MarkdownDiagramTemplate[] = [
  { id: "flowchart", label: "Flujo", code: "flowchart LR\n  Inicio --> Decisión{¿Continuar?}\n  Decisión -- Sí --> Fin\n  Decisión -- No --> Inicio" },
  { id: "sequence", label: "Secuencia", code: "sequenceDiagram\n  Cliente->>Servidor: Pedido\n  Servidor-->>Cliente: Respuesta" },
  { id: "gantt", label: "Gantt", code: "gantt\n  dateFormat YYYY-MM-DD\n  section Etapa\n    Tarea uno :a1, 2026-01-05, 5d\n    Tarea dos :after a1, 3d" },
  { id: "class", label: "Clases", code: "classDiagram\n  class Pedido {\n    +fecha\n    +confirmar()\n  }\n  Cliente --> Pedido" },
  { id: "state", label: "Estados", code: "stateDiagram-v2\n  [*] --> Borrador\n  Borrador --> Publicado\n  Publicado --> [*]" },
  { id: "entity-relationship", label: "Entidad-relación", code: "erDiagram\n  CLIENTE ||--o{ PEDIDO : hace\n  PEDIDO ||--|{ LINEA : contiene" },
  { id: "pie", label: "Torta", code: 'pie title Ventas\n  "Norte" : 40\n  "Sur" : 25\n  "Centro" : 35' },
];
