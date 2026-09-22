import type {
  AIEmptyState,
  AIMemoryConfig,
  AIProviderConfig,
  AISuggestedMessage,
  AITextOverrides,
} from "./types";

export const AI_PROVIDER_PRESETS = {
  openai: {
    baseURL: "https://api.openai.com/v1/",
    model: "gpt-4o-mini",
  },
  gemini: {
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    model: "gemini-2.5-flash",
  },
  openrouter: {
    baseURL: "https://openrouter.ai/api/v1/",
    model: "anthropic/claude-3.5-sonnet",
  },
  groq: {
    baseURL: "https://api.groq.com/openai/v1/",
    model: "llama-3.3-70b-versatile",
  },
  together: {
    baseURL: "https://api.together.xyz/v1/",
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
  },
  deepseek: {
    baseURL: "https://api.deepseek.com/v1/",
    model: "deepseek-chat",
  },
  ollama: {
    baseURL: "http://localhost:11434/v1/",
    model: "llama3.2",
  },
} as const satisfies Record<
  string,
  Pick<AIProviderConfig, "baseURL" | "model">
>;

export type AIProviderPreset = keyof typeof AI_PROVIDER_PRESETS;

export function resolveProviderConfig(
  preset: AIProviderPreset,
  overrides: Partial<AIProviderConfig> & Pick<AIProviderConfig, "apiKey">,
): AIProviderConfig {
  const base = AI_PROVIDER_PRESETS[preset];
  return {
    apiKey: overrides.apiKey,
    baseURL: overrides.baseURL?.trim() || base.baseURL,
    model: overrides.model?.trim() || base.model,
    temperature: overrides.temperature,
    maxTokens: overrides.maxTokens,
  };
}

export const DEFAULT_MEMORY_CONFIG: Required<AIMemoryConfig> = {
  enabled: true,
  strategy: "sliding-window",
  maxMessages: 20,
};

export const DEFAULT_PROVIDER_CONFIG: Partial<AIProviderConfig> = {
  baseURL: AI_PROVIDER_PRESETS.gemini.baseURL,
  model: AI_PROVIDER_PRESETS.gemini.model,
  temperature: 0.7,
  maxTokens: 2048,
};

export const DEFAULT_SUGGESTED_MESSAGES_DATA: AISuggestedMessage[] = [
  {
    label: "Resumen general",
    prompt: "Dame un resumen general de todos los datos",
  },
  {
    label: "¿Cuántos registros hay?",
    prompt: "¿Cuántos registros hay en total?",
  },
  {
    label: "Estadísticas",
    prompt: "Muéstrame estadísticas de los campos numéricos",
  },
  {
    label: "Top 5",
    prompt: "Muéstrame el top 5 más relevante",
  },
];

export const DEFAULT_SUGGESTED_MESSAGES_CHATBOT: AISuggestedMessage[] = [
  {
    label: "Preséntate",
    prompt: "Hola, ¿quién eres y qué puedes hacer?",
  },
  {
    label: "Dame una idea",
    prompt: "Sugiere tres ideas creativas para comenzar mi día",
  },
  {
    label: "Explica simple",
    prompt: "Explícame un concepto técnico complejo de forma sencilla",
  },
];

export const DEFAULT_EMPTY_STATE_DATA: Required<
  Pick<AIEmptyState, "title" | "description">
> = {
  title: "Consulta tus datos",
  description:
    "Pregúntame sobre la información disponible. Responderé con contexto y sugerencias accionables.",
};

export const DEFAULT_EMPTY_STATE_CHATBOT: Required<
  Pick<AIEmptyState, "title" | "description">
> = {
  title: "¿En qué puedo ayudarte?",
  description:
    "Escríbeme cualquier pregunta o tarea. Estoy listo para asistirte.",
};

export const DEFAULT_TEXTS: Required<
  Omit<AITextOverrides, "emptyChatbot" | "emptyData">
> & {
  emptyChatbot: Required<Pick<AIEmptyState, "title" | "description">>;
  emptyData: Required<Pick<AIEmptyState, "title" | "description">>;
} = {
  placeholder: "Pregunta sobre los datos...",
  thinking: "Pensando...",
  confirmRequired: "Confirmación requerida",
  confirmCta: "Confirmar",
  cancelCta: "Cancelar",
  actionConfirmed:
    "Acción confirmada. Ejecuté el evento en el componente padre.",
  actionCancelled: "Acción cancelada. No realicé ningún cambio.",
  resetTooltip: "Nueva conversación",
  missingApiKey:
    "No se encontró API key. Configura tu proveedor para usar el asistente.",
  genericError: "No se pudo completar la consulta al proveedor AI.",
  noResponse: "No encontré una respuesta para esta solicitud.",
  actionProposed:
    "Te propuse una acción. Revísala y confirma si deseas ejecutarla.",
  emptyChatbot: DEFAULT_EMPTY_STATE_CHATBOT,
  emptyData: DEFAULT_EMPTY_STATE_DATA,
};
