import type { ChatCompletionTool } from "openai/resources/chat/completions";
import type { AIChatMode, AIFieldDescriptor } from "../types";

const JSON_SCHEMA_TYPE_BY_VALUE_TYPE: Record<string, string> = {
  number: "number",
  boolean: "boolean",
};

const fixedValueSchema = (
  fixedValue: unknown,
  description: string,
): Record<string, unknown> => ({
  type: JSON_SCHEMA_TYPE_BY_VALUE_TYPE[typeof fixedValue] ?? "string",
  const: fixedValue,
  description: `${description}. Valor fijo obligatorio.`,
});

const dateFieldSchema = (description: string): Record<string, unknown> => ({
  type: "string",
  format: "date-time",
  description: `${description}. Usa formato ISO 8601 cuando aplique.`,
});

const selectFieldSchema = (
  field: AIFieldDescriptor,
  description: string,
): Record<string, unknown> => {
  const options = field.options?.map((option) => option.value) ?? [];
  return {
    type: "string",
    enum: options.length > 0 ? options : undefined,
    description:
      options.length > 0
        ? `${description}. Opciones permitidas: ${options.join(", ")}.`
        : description,
  };
};

const fieldToSchema = (field: AIFieldDescriptor): Record<string, unknown> => {
  const description = field.description ?? field.label;
  if (field.fixedValue !== undefined) {
    return fixedValueSchema(field.fixedValue, description);
  }
  if (field.type === "number") return { type: "number", description };
  if (field.type === "boolean") return { type: "boolean", description };
  if (field.type === "date") return dateFieldSchema(description);
  if (field.type === "select") return selectFieldSchema(field, description);
  return { type: "string", description };
};

const createRecordTool = (
  properties: Record<string, unknown>,
  required: string[],
): ChatCompletionTool => ({
  type: "function",
  function: {
    name: "create_record",
    description:
      "Proponer la creación de un nuevo registro o card con los campos detectados.",
    parameters: {
      type: "object",
      properties: {
        record: { type: "object", properties, required },
      },
      required: ["record"],
    },
  },
});

const updateRecordTool = (
  properties: Record<string, unknown>,
): ChatCompletionTool => ({
  type: "function",
  function: {
    name: "update_record",
    description:
      "Proponer actualización de un registro existente usando un id y cambios parciales.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string", description: "Identificador del registro." },
        updates: { type: "object", properties },
      },
      required: ["id", "updates"],
    },
  },
});

const MOVE_CARD_TOOL: ChatCompletionTool = {
  type: "function",
  function: {
    name: "move_card",
    description: "Mover una card a otra columna del tablero kanban.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "string", description: "Identificador de la card." },
        targetColumn: {
          type: "string",
          description: "Columna destino en el tablero kanban.",
        },
      },
      required: ["id", "targetColumn"],
    },
  },
};

export const buildToolDefinitions = (
  fields: AIFieldDescriptor[],
  mode: AIChatMode,
): ChatCompletionTool[] => {
  if (mode === "chatbot" || fields.length === 0) return [];
  const properties = Object.fromEntries(
    fields.map((field) => [field.id, fieldToSchema(field)]),
  );
  const required = fields
    .filter((field) => field.required || field.fixedValue !== undefined)
    .map((field) => field.id);
  const tools = [
    createRecordTool(properties, required),
    updateRecordTool(properties),
  ];
  if (mode === "kanban") tools.push(MOVE_CARD_TOOL);
  return tools;
};
