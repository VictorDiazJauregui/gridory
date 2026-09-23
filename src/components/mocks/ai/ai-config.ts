import type { AIFieldDescriptor, AIProviderConfig } from "../../ai";
import type { KanbanGroupOption } from "../../kanban";
import { buildCompanyColumns } from "../company/company-columns";
import type { MockCompanyRow } from "../company/company-rows";

export type DemoView = "table" | "kanban";

export type AiPayload = Record<string, unknown>;

const BRANDS = ["Boreal", "Arctic", "Glacial"] as const;
const COUNTRIES = ["Chile", "Perú", "México", "Argentina"] as const;
export const STATUSES = ["Activa", "Pendiente", "Archivada"] as const;
const APPS = ["CRM", "Analytics", "Support"] as const;

const toSelectOptions = (values: readonly string[]) =>
  values.map((value) => ({ value, label: value }));

export const AI_MOCK_FIELDS: AIFieldDescriptor[] = [
  { id: "name", label: "Nombre", type: "text", required: true },
  {
    id: "brand",
    label: "Marca",
    type: "select",
    required: true,
    options: toSelectOptions(BRANDS),
  },
  {
    id: "country",
    label: "País",
    type: "select",
    required: true,
    options: toSelectOptions(COUNTRIES),
  },
  {
    id: "status",
    label: "Estado",
    type: "select",
    required: true,
    options: toSelectOptions(STATUSES),
  },
  {
    id: "apps",
    label: "Apps",
    type: "text",
    description:
      "Lista separada por coma. Opciones sugeridas: CRM, Analytics, Support.",
  },
  { id: "createdAt", label: "Fecha alta", type: "date" },
];

export const CUSTOM_PROMPT = [
  "Si el usuario solicita crear una empresa, utiliza SIEMPRE create_record con los campos:",
  "name, brand, country, status, apps, createdAt.",
  "No inventes estados fuera de: Activa, Pendiente, Archivada.",
  "Si falta createdAt usa la fecha de hoy.",
].join("\n");

export const AI_PROVIDER_CONFIG: AIProviderConfig = {
  apiKey: String(import.meta.env.VITE_AI_API_KEY ?? "").trim(),
  baseURL:
    String(import.meta.env.VITE_AI_BASE_URL ?? "").trim() ||
    (import.meta.env.DEV
      ? "/api/google-openai"
      : "https://generativelanguage.googleapis.com/v1beta/openai/"),
  model:
    String(import.meta.env.VITE_AI_MODEL ?? "").trim() || "gemini-2.5-flash",
  temperature: 0.7,
  maxTokens: 2048,
};

export const AI_MOCK_COLUMNS = buildCompanyColumns({
  appsWidth: 220,
  statusSearchable: false,
});

export const toDateString = (value: Date) => value.toISOString().slice(0, 10);

const parseStringList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

export const normalizeOption = <T extends readonly string[]>(
  value: unknown,
  options: T,
  fallback: T[number],
): T[number] => {
  const text = String(value ?? "")
    .trim()
    .toLowerCase();
  const found = options.find((option) => option.toLowerCase() === text);
  return found ?? fallback;
};

const normalizeApps = (value: unknown): string[] => {
  const known = parseStringList(value).filter((app) =>
    APPS.includes(app as (typeof APPS)[number]),
  );
  return known.length > 0 ? known : ["CRM"];
};

const normalizeCreatedAt = (value: unknown): string => {
  if (typeof value === "string" && value.trim()) return value.slice(0, 10);
  return toDateString(new Date());
};

const normalizeName = (payload: AiPayload, fallbackId: string): string => {
  const name = String(payload.name ?? payload.nombre ?? "").trim();
  return name || `Empresa AI ${fallbackId}`;
};

export const normalizeIncomingRow = (
  payload: AiPayload,
  fallbackId: string,
): MockCompanyRow => ({
  id: String(payload.id ?? fallbackId),
  name: normalizeName(payload, fallbackId),
  brand: normalizeOption(payload.brand ?? payload.marca, BRANDS, "Boreal"),
  country: normalizeOption(
    payload.country ?? payload.pais ?? payload.país,
    COUNTRIES,
    "Chile",
  ),
  status: normalizeOption(
    payload.status ?? payload.estado,
    STATUSES,
    "Pendiente",
  ),
  apps: normalizeApps(payload.apps ?? payload.enabledAppIds),
  createdAt: normalizeCreatedAt(payload.createdAt),
});

export const AI_KANBAN_GROUPS: KanbanGroupOption<MockCompanyRow>[] = [
  {
    id: "status",
    label: "Estado",
    accessor: (card) => card.status,
    setValue: (card, nextValue) => ({
      ...card,
      status: normalizeOption(nextValue, STATUSES, card.status),
    }),
    values: toSelectOptions(STATUSES),
  },
  {
    id: "country",
    label: "País",
    accessor: (card) => card.country,
    setValue: (card, nextValue) => ({
      ...card,
      country: normalizeOption(nextValue, COUNTRIES, "Chile"),
    }),
  },
];
