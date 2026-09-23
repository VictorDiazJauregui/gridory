import { buildToolDefinitions } from "./ai-client";
import type { AIChatMode, AIDataSchema, AIFieldDescriptor } from "./types";

const CHATBOT_BASE_PROMPT =
  "Eres un asistente AI útil, preciso y conciso. Responde siempre en español con Markdown breve y claro cuando aporte valor. Si no tienes información suficiente, pide aclaraciones en lugar de inventar.";

const stringifyValue = (value: unknown): string => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  if (Array.isArray(value))
    return value.map((item) => stringifyValue(item)).join(", ");
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "[objeto]";
    }
  }
  return String(value);
}

const summarizeRows = (rows: Record<string, unknown>[]): string => {
  if (rows.length === 0) return "No hay registros disponibles.";
  const sample = rows.slice(0, 50);
  const numericStats: string[] = [];
  const keys = Object.keys(sample[0] ?? {});

  keys.forEach((key) => {
    const numbers = sample
      .map((row) => row[key])
      .filter((value): value is number => typeof value === "number");
    if (numbers.length === 0) return;
    const sum = numbers.reduce((acc, value) => acc + value, 0);
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const avg = sum / numbers.length;
    numericStats.push(
      `- ${key}: min=${min.toFixed(2)}, max=${max.toFixed(2)}, avg=${avg.toFixed(2)}, count=${numbers.length}`,
    );
  });

  const sampleRows = sample
    .slice(0, 8)
    .map((row, index) => {
      const line = Object.entries(row)
        .slice(0, 8)
        .map(([key, value]) => `${key}: ${stringifyValue(value)}`)
        .join(" | ");
      return `${index + 1}. ${line}`;
    })
    .join("\n");

  return [
    `Total de filas: ${rows.length}.`,
    "Muestra de filas:",
    sampleRows,
    numericStats.length > 0 ? "Estadísticas numéricas:" : "",
    numericStats.join("\n"),
  ]
    .filter(Boolean)
    .join("\n");
}

const describeField = (field: AIFieldDescriptor): string => {
  const requiredLabel = field.required ? " (requerido)" : "";
  const optionsLabel =
    field.type === "select" && field.options && field.options.length > 0
      ? ` Opciones: ${field.options
          .map((option) => `${option.label} (${option.value})`)
          .join(", ")}.`
      : "";
  const descriptionLabel = field.description ? ` ${field.description}.` : "";
  const fixedLabel =
    field.fixedValue !== undefined
      ? ` Valor obligatorio y fijo: ${stringifyValue(field.fixedValue)}.`
      : "";
  const defaultLabel =
    field.defaultValue !== undefined && field.fixedValue === undefined
      ? ` Valor sugerido por defecto si no se especifica: ${stringifyValue(field.defaultValue)}.`
      : "";

  return `- ${field.label} [${field.id}] tipo ${field.type}${requiredLabel}.${descriptionLabel}${optionsLabel}${fixedLabel}${defaultLabel}`;
}

const buildCommonPrompt = (schema: AIDataSchema): string => {
  const rows = schema.rows ?? [];
  return [
    `Entidad principal: ${schema.entityName}.`,
    `Nombre singular: ${schema.entityNameSingular}.`,
    "",
    "Estructura de campos:",
    schema.fields.map((field) => describeField(field)).join("\n"),
    "",
    "Resumen de datos:",
    schema.summary ?? summarizeRows(rows),
    "",
    "Reglas de respuesta:",
    "- Responde siempre en español.",
    "- Usa Markdown legible y directo.",
    "- Sé claro cuando no haya datos suficientes para responder.",
    "- Respeta siempre los valores obligatorios y fijos declarados en los campos.",
    schema.extraInstructions
      ? `\nInstrucciones adicionales del negocio:\n${schema.extraInstructions.trim()}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export const buildChatbotSystemPrompt = (customPrompt?: string): string => {
  if (customPrompt?.trim()) {
    return [CHATBOT_BASE_PROMPT, customPrompt.trim()].join("\n\n");
  }
  return CHATBOT_BASE_PROMPT;
}

export const buildTableSystemPrompt = (
  schema: AIDataSchema,
  customPrompt?: string,
): string => {
  const sections = [
    "Eres un asistente experto analizando tablas de datos de negocio.",
    buildCommonPrompt(schema),
    "Si el usuario pide crear registros, usa la función create_record con los campos correctos.",
    "Si pide actualizar un registro existente, usa update_record con el id y los cambios.",
  ];

  if (customPrompt?.trim()) {
    sections.push("Instrucciones adicionales:", customPrompt.trim());
  }
  return sections.join("\n\n");
}

export const buildKanbanSystemPrompt = (
  schema: AIDataSchema,
  customPrompt?: string,
): string => {
  const groupField = schema.kanbanGroupField ?? "columna";
  const sections = [
    "Eres un asistente experto analizando tableros kanban de negocio.",
    buildCommonPrompt(schema),
    `El campo de agrupación principal del kanban es: ${groupField}.`,
    "Cuando se solicite crear una card, usa create_record. Para actualizar una card existente usa update_record y para moverla entre columnas usa move_card.",
  ];

  if (customPrompt?.trim()) {
    sections.push("Instrucciones adicionales:", customPrompt.trim());
  }
  return sections.join("\n\n");
}

interface ResolveSystemPromptParams {
  mode: AIChatMode;
  dataSchema?: AIDataSchema;
  systemPrompt?: string;
  chatbotPrompt?: string;
}

export const resolveSystemPrompt = (params: ResolveSystemPromptParams): string => {
  const { mode, dataSchema, systemPrompt, chatbotPrompt } = params;

  if (systemPrompt?.trim()) return systemPrompt.trim();

  if (mode === "chatbot") {
    return buildChatbotSystemPrompt(chatbotPrompt);
  }

  if (!dataSchema) {
    return buildChatbotSystemPrompt(chatbotPrompt);
  }

  return mode === "kanban"
    ? buildKanbanSystemPrompt(dataSchema)
    : buildTableSystemPrompt(dataSchema);
}

export { buildToolDefinitions };
