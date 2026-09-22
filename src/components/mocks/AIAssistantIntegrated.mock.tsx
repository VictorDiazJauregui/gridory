import { useMemo, useRef, useState } from "react";
import { ReusableDataTable, type ReusableColumn } from "../table";
import {
  ReusableKanban,
  type ReusableKanbanGroupOption,
} from "../kanban";
import {
  AIChatButton,
  AIChatSidebar,
  buildKanbanSystemPrompt,
  buildTableSystemPrompt,
  type AIActionEvent,
  type AIDataSchema,
  type AIFieldDescriptor,
  type AIProviderConfig,
} from "../ai";
import { MOCK_COMPANY_ROWS, type MockCompanyRow } from "./data/mockCompanyRows";

const BRANDS = ["Boreal", "Arctic", "Glacial"] as const;
const COUNTRIES = ["Chile", "Perú", "México", "Argentina"] as const;
const STATUSES = ["Activa", "Pendiente", "Archivada"] as const;
const APPS = ["CRM", "Analytics", "Support"] as const;

type DemoView = "table" | "kanban";

const toDateString = (value: Date) => value.toISOString().slice(0, 10);

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

const normalizeOption = <T extends readonly string[]>(
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

const fields: AIFieldDescriptor[] = [
  { id: "name", label: "Nombre", type: "text", required: true },
  {
    id: "brand",
    label: "Marca",
    type: "select",
    required: true,
    options: BRANDS.map((value) => ({ value, label: value })),
  },
  {
    id: "country",
    label: "País",
    type: "select",
    required: true,
    options: COUNTRIES.map((value) => ({ value, label: value })),
  },
  {
    id: "status",
    label: "Estado",
    type: "select",
    required: true,
    options: STATUSES.map((value) => ({ value, label: value })),
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

export const AIAssistantIntegratedMock = () => {
  const [view, setView] = useState<DemoView>("table");
  const [rows, setRows] = useState<MockCompanyRow[]>(
    MOCK_COMPANY_ROWS.slice(0, 12),
  );
  const [aiOpen, setAiOpen] = useState(false);
  const [eventLog, setEventLog] = useState<AIActionEvent[]>([]);
  const createCounterRef = useRef(1);

  const nextMockId = (prefix = "ai") => {
    const next = `${prefix}-${createCounterRef.current}`;
    createCounterRef.current += 1;
    return next;
  };

  const providerConfig = useMemo<AIProviderConfig>(
    () => ({
      apiKey: String(import.meta.env.VITE_AI_API_KEY ?? "").trim(),
      baseURL:
        String(import.meta.env.VITE_AI_BASE_URL ?? "").trim() ||
        (import.meta.env.DEV
          ? "/api/google-openai"
          : "https://generativelanguage.googleapis.com/v1beta/openai/"),
      model:
        String(import.meta.env.VITE_AI_MODEL ?? "").trim() ||
        "gemini-2.5-flash",
      temperature: 0.7,
      maxTokens: 2048,
    }),
    [],
  );
  const hasApiKey = providerConfig.apiKey.length > 0;

  const tableColumns = useMemo<ReusableColumn<MockCompanyRow>[]>(
    () => [
      {
        id: "name",
        header: "Empresa",
        accessor: (row) => row.name,
        searchable: true,
        filterable: true,
        sortable: true,
        width: 220,
      },
      {
        id: "brand",
        header: "Marca",
        accessor: (row) => row.brand,
        searchable: true,
        filterable: true,
        sortable: true,
        width: 130,
      },
      {
        id: "country",
        header: "País",
        accessor: (row) => row.country,
        searchable: true,
        filterable: true,
        sortable: true,
        width: 130,
      },
      {
        id: "apps",
        header: "Apps",
        accessor: (row) => row.apps,
        searchable: true,
        filterable: true,
        sortable: false,
        width: 220,
      },
      {
        id: "status",
        header: "Estado",
        accessor: (row) => row.status,
        searchable: false,
        filterable: true,
        sortable: true,
        width: 150,
      },
      {
        id: "createdAt",
        header: "Alta",
        accessor: (row) => row.createdAt,
        type: "date",
        searchable: false,
        filterable: true,
        sortable: true,
        width: 120,
      },
    ],
    [],
  );

  const kanbanFields = tableColumns;
  const kanbanGroups = useMemo<ReusableKanbanGroupOption<MockCompanyRow>[]>(
    () => [
      {
        id: "status",
        label: "Estado",
        accessor: (card) => card.status,
        setValue: (card, nextValue) => ({
          ...card,
          status: normalizeOption(nextValue, STATUSES, card.status),
        }),
        values: STATUSES.map((status) => ({ value: status, label: status })),
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
    ],
    [],
  );

  const dataSchema = useMemo<AIDataSchema>(
    () => ({
      entityName: "Empresas demo",
      entityNameSingular: "Empresa",
      fields,
      rows: rows.map((row) => ({
        id: row.id,
        name: row.name,
        brand: row.brand,
        country: row.country,
        apps: row.apps,
        status: row.status,
        createdAt: row.createdAt,
      })),
      kanbanGroupField: "status",
      summary: `Dataset demo de ${rows.length} empresas. Estados válidos: ${STATUSES.join(", ")}.`,
    }),
    [rows],
  );

  const systemPrompt = useMemo(() => {
    const customPrompt = [
      "Si el usuario solicita crear una empresa, utiliza SIEMPRE create_record con los campos:",
      "name, brand, country, status, apps, createdAt.",
      "No inventes estados fuera de: Activa, Pendiente, Archivada.",
      "Si falta createdAt usa la fecha de hoy.",
    ].join("\n");
    return view === "kanban"
      ? buildKanbanSystemPrompt(dataSchema, customPrompt)
      : buildTableSystemPrompt(dataSchema, customPrompt);
  }, [dataSchema, view]);

  const normalizeIncomingRow = (
    payload: Record<string, unknown>,
    fallbackId: string,
  ): MockCompanyRow => {
    const name = String(payload.name ?? payload.nombre ?? "").trim();
    const normalizedApps = parseStringList(
      payload.apps ?? payload.enabledAppIds,
    ).filter((app) => APPS.includes(app as (typeof APPS)[number]));

    return {
      id: String(payload.id ?? fallbackId),
      name: name || `Empresa AI ${fallbackId}`,
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
      apps: normalizedApps.length > 0 ? normalizedApps : ["CRM"],
      createdAt:
        typeof payload.createdAt === "string" && payload.createdAt.trim()
          ? payload.createdAt.slice(0, 10)
          : toDateString(new Date()),
    };
  };

  const handleAIAction = (event: AIActionEvent) => {
    setEventLog((previous) => [event, ...previous].slice(0, 8));

    const payloadRoot = event.payload as Record<string, unknown>;
    const payloadRecord =
      typeof payloadRoot.record === "object" && payloadRoot.record !== null
        ? (payloadRoot.record as Record<string, unknown>)
        : payloadRoot;

    const treatAsCreate =
      event.type === "create-row" ||
      event.type === "create-card" ||
      (event.type === "custom" &&
        (typeof payloadRecord.name === "string" ||
          typeof payloadRecord.nombre === "string"));

    if (treatAsCreate) {
      const fallbackId = nextMockId("ai");
      const baseRow = normalizeIncomingRow(payloadRecord, fallbackId);
      setRows((previousRows) => {
        const candidateId = String(baseRow.id || "").trim() || fallbackId;
        const safeId = previousRows.some((row) => row.id === candidateId)
          ? nextMockId("ai")
          : candidateId;
        return [{ ...baseRow, id: safeId }, ...previousRows];
      });
      return;
    }

    if (event.type === "update-row") {
      const id = String(payloadRoot.id ?? "");
      if (!id) return;
      setRows((previousRows) =>
        previousRows.map((row) => {
          if (row.id !== id) return row;
          const patch = normalizeIncomingRow(payloadRoot, row.id);
          return {
            ...row,
            ...patch,
            id: row.id,
          };
        }),
      );
      return;
    }

    if (event.type === "move-card") {
      const id = String(payloadRoot.id ?? "");
      const nextStatus = normalizeOption(
        payloadRoot.targetColumn ?? payloadRoot.status,
        STATUSES,
        "Pendiente",
      );
      if (!id) return;
      setRows((previousRows) =>
        previousRows.map((row) =>
          row.id === id ? { ...row, status: nextStatus } : row,
        ),
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold">
            Mock AI Assistant (Tabla + Kanban)
          </h2>
          <div className="ml-auto flex items-center gap-2">
            <div className="inline-flex rounded-md border bg-slate-100 p-1">
              <button
                type="button"
                className={`rounded px-3 py-1 text-xs font-medium ${
                  view === "table"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => setView("table")}
              >
                Tabla
              </button>
              <button
                type="button"
                className={`rounded px-3 py-1 text-xs font-medium ${
                  view === "kanban"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                onClick={() => setView("kanban")}
              >
                Kanban
              </button>
            </div>
            <AIChatButton
              onClick={() => setAiOpen(true)}
              label="Asistente AI"
            />
          </div>
        </div>

        <p className="mt-2 text-sm text-slate-600">
          Prueba mensajes como:{" "}
          <span className="font-medium">
            “Crea una empresa llamada Boreal en Chile con estado Pendiente”
          </span>{" "}
          y luego confirma la acción en la tarjeta del chat.
        </p>

        {!hasApiKey && (
          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Sin <code>VITE_AI_API_KEY</code> el mock funciona visualmente, pero
            no puede consultar el proveedor AI real.
          </div>
        )}
        {hasApiKey && (
          <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
            Base URL activa: <code>{providerConfig.baseURL}</code>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        <div className="rounded-lg border bg-white p-3">
          {view === "table" ? (
            <ReusableDataTable
              columns={tableColumns}
              data={{ results: rows }}
              getRowId={(row) => row.id}
              label="empresas"
              createLabel="Nueva empresa"
              features={{ createButton: true }}
              onCreate={() =>
                setRows((previousRows) => [
                  {
                    id: `manual-${Date.now()}`,
                    name: "Empresa manual",
                    brand: "Boreal",
                    country: "Chile",
                    apps: ["CRM"],
                    status: "Pendiente",
                    createdAt: toDateString(new Date()),
                  },
                  ...previousRows,
                ])
              }
              rowActions={{
                onEdit: (row) => window.alert(`onEdit -> ${row.name}`),
                onArchiveToggle: (row) =>
                  setRows((previousRows) =>
                    previousRows.map((item) =>
                      item.id === row.id
                        ? {
                            ...item,
                            status:
                              item.status === "Archivada"
                                ? "Activa"
                                : "Archivada",
                          }
                        : item,
                    ),
                  ),
                onRemove: (row) =>
                  setRows((previousRows) =>
                    previousRows.filter((item) => item.id !== row.id),
                  ),
                onHistory: (row) => window.alert(`onHistory -> ${row.name}`),
              }}
            />
          ) : (
            <ReusableKanban
              fields={kanbanFields}
              data={{ results: rows }}
              groups={kanbanGroups}
              defaultGroupId="status"
              getCardId={(card) => card.id}
              createLabel="Nueva empresa"
              onCreate={() =>
                setRows((previousRows) => [
                  {
                    id: `manual-k-${Date.now()}`,
                    name: "Empresa manual kanban",
                    brand: "Boreal",
                    country: "Chile",
                    apps: ["CRM"],
                    status: "Pendiente",
                    createdAt: toDateString(new Date()),
                  },
                  ...previousRows,
                ])
              }
              onCardMove={({ updatedCard }) => {
                setRows((previousRows) =>
                  previousRows.map((item) =>
                    item.id === updatedCard.id ? updatedCard : item,
                  ),
                );
              }}
              rowActions={{
                onEdit: (row) => window.alert(`onEdit -> ${row.name}`),
                onArchiveToggle: (row) =>
                  setRows((previousRows) =>
                    previousRows.map((item) =>
                      item.id === row.id
                        ? {
                            ...item,
                            status:
                              item.status === "Archivada"
                                ? "Activa"
                                : "Archivada",
                          }
                        : item,
                    ),
                  ),
                onRemove: (row) =>
                  setRows((previousRows) =>
                    previousRows.filter((item) => item.id !== row.id),
                  ),
                onHistory: (row) => window.alert(`onHistory -> ${row.name}`),
              }}
            />
          )}
        </div>

        <aside className="space-y-3">
          <div className="rounded-lg border bg-white p-3">
            <h3 className="text-sm font-semibold">Cómo probar el flujo</h3>
            <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-slate-600">
              <li>Abre el Asistente AI.</li>
              <li>Pide crear una empresa desde chat.</li>
              <li>Confirma la acción en la tarjeta.</li>
              <li>Revisa el evento emitido y la fila/card agregada.</li>
            </ol>
          </div>

          <div className="rounded-lg border bg-white p-3">
            <h3 className="text-sm font-semibold">Últimos eventos</h3>
            <div className="mt-2 space-y-2">
              {eventLog.length === 0 ? (
                <p className="text-xs text-slate-500">Aún no hay eventos.</p>
              ) : (
                eventLog.map((event, index) => (
                  <div
                    key={`${event.type}-${index}`}
                    className="rounded border bg-slate-50 p-2"
                  >
                    <p className="text-[11px] font-medium text-slate-700">
                      {event.type}
                    </p>
                    <pre className="mt-1 overflow-x-auto text-[10px] text-slate-600">
                      {JSON.stringify(event.payload, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>

      <AIChatSidebar
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        providerConfig={providerConfig}
        title="Asistente AI - Demo"
        subtitle={`${rows.length} empresas · ${view === "table" ? "Vista tabla" : "Vista kanban"}`}
        mode={view}
        dataSchema={dataSchema}
        systemPrompt={systemPrompt}
        enableActions
        onAction={handleAIAction}
      />
    </div>
  );
};
