# AI Assistant — Guía completa

`gridory/ai` expone un chat lateral (sidebar) listo para producción que trabaja en tres modos:

- **`chatbot`** — conversación libre, sin contexto de datos ni acciones.
- **`table`** — asistente contextual sobre una tabla, con capacidad de proponer creación/actualización de filas que el consumidor confirma.
- **`kanban`** — igual que `table`, pero además puede mover cards entre columnas.

Este documento cubre instalación, configuración del proveedor, todos los modos, personalización de prompts, memoria conversacional, manejo de límites de tokens, botón de nueva conversación, estilos y ejemplos completos.

---

## 1. Instalación

```bash
npm install gridory
# o
pnpm add gridory
```

### Peer dependencies

- React 18.2+ o 19.0+
- React DOM 18.2+ o 19.0+
- Los estilos van en `gridory/styles.css` (impórtalo una vez en la app). No hace falta Tailwind.

La dependencia `openai` viene empaquetada como dependencia directa del paquete y se usa para hablar con cualquier proveedor compatible con el formato `chat.completions` de OpenAI.

### Importar

Desde el root:

```ts
import {
  AIChatSidebar,
  AIChatButton,
  useAIChat,
} from "gridory";
```

O desde el subpath para tree-shaking máximo:

```ts
import {
  AIChatSidebar,
  AIChatButton,
  AI_PROVIDER_PRESETS,
  resolveProviderConfig,
} from "gridory/ai";
```

### Estilos

El asistente no depende de Tailwind: cada elemento lleva una clase `gdy-ai-*` con sus reglas en `gridory/styles.css`, y los colores salen de los tokens `--gdy-*` (claro por defecto; oscuro con `.dark` o `data-theme="dark"` en `<html>`). Tokens de componente, opcionales y siempre con fallback:

| Token | Por defecto | Uso |
|---|---|---|
| `--gdy-ai-accent` / `--gdy-ai-accent-fg` | `--gdy-primary` / `--gdy-primary-foreground` | tintes del icono y del avatar, chips, kicker de la tarjeta, burbuja del usuario, lanzador |
| `--gdy-ai-bg` | `--gdy-background` | fondo del panel y del pie |
| `--gdy-ai-user-bubble-bg` / `--gdy-ai-user-bubble-fg` | el acento y su texto | burbuja del usuario |
| `--gdy-ai-assistant-bubble-bg` / `--gdy-ai-assistant-bubble-fg` | `--gdy-muted` al 60 % / `--gdy-foreground` | burbujas del asistente y fila "Pensando" |

Ganchos (una clase por elemento; las reglas de la librería pesan una sola clase):

| Zona | Clases y atributos |
|---|---|
| Lanzador | `gdy-ai-button` sobre el primitivo `gdy-button` (outline, sm), `gdy-ai-button-icon`, `gdy-ai-button-label` (oculto por debajo de 640px) |
| Panel | `gdy-ai-overlay` (solo por debajo de 768px), `gdy-ai-sidebar` con `data-state="open\|closed"` |
| Cabecera | `gdy-ai-header`, `gdy-ai-header-badge`, `gdy-ai-header-icon`, `gdy-ai-heading`, `gdy-ai-title`, `gdy-ai-subtitle`, `gdy-ai-reset`, `gdy-ai-close` |
| Cuerpo | `gdy-ai-body` con `data-empty`; estado vacío `gdy-ai-empty`, `gdy-ai-empty-badge`, `gdy-ai-empty-icon`, `gdy-ai-empty-title`, `gdy-ai-empty-description`, `gdy-ai-chips`, `gdy-ai-chip` |
| Mensajes | `gdy-ai-message` y `gdy-ai-bubble` con `data-role="user\|assistant"` (`data-streaming` y `data-thinking` en las filas transitorias), `gdy-ai-avatar`, `gdy-ai-avatar-icon`, `gdy-ai-text`, `gdy-ai-thinking`, `gdy-ai-thinking-icon`, `gdy-ai-thinking-label` |
| Tarjeta de acción | `gdy-ai-action-card` con `data-action-type`, `gdy-ai-action-kicker`, `gdy-ai-action-title`, `gdy-ai-action-fields`, `gdy-ai-action-field`, `gdy-ai-action-field-label`, `gdy-ai-action-required`, `gdy-ai-action-field-value`, `gdy-ai-action-actions`, `gdy-ai-action-cancel`, `gdy-ai-action-confirm` |
| Pie | `gdy-ai-footer`, `gdy-ai-input-wrapper`, `gdy-ai-textarea`, `gdy-ai-send`, `gdy-ai-send-icon` |
| Markdown | `gdy-ai-markdown`, `gdy-ai-md-heading`, `gdy-ai-md-item` con `data-list="unordered\|ordered"`, `gdy-ai-md-bullet`, `gdy-ai-md-number`, `gdy-ai-md-paragraph`, `gdy-ai-md-gap`, `gdy-ai-md-strong` |

Una regla tuya con el mismo selector, cargada después de `gridory/styles.css`, gana. `data-role` es una variante y va dentro de `:where()`, así que una clase de una sola palabra también gana a los colores de las burbujas:

```css
.gdy-ai-sidebar { --gdy-ai-accent: #0f766e; }
.gdy-ai-chip { border-radius: 6px; }
.dark .gdy-ai-bubble:where([data-role="assistant"]) { background: #1f2937; }
```

---

## 2. Configurar el proveedor

Todos los proveedores soportados son compatibles con el endpoint OpenAI `chat/completions`:

- OpenAI
- Google Gemini (vía capa OpenAI-compatible)
- OpenRouter (útil para Claude, Gemini, Llama, etc. con una sola key)
- Groq
- Together.ai
- DeepSeek
- Ollama local
- Cualquier otro que exponga `/v1/chat/completions`

### Opción A — Preset

```ts
import { resolveProviderConfig } from "gridory/ai";

const providerConfig = resolveProviderConfig("openai", {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: "gpt-4o", // opcional, sobrescribe el default del preset
  temperature: 0.5, // opcional
  maxTokens: 2048, // opcional
});
```

Presets disponibles (`AI_PROVIDER_PRESETS`):

| Preset       | `baseURL`                                                  | Modelo default                            |
| ------------ | ---------------------------------------------------------- | ----------------------------------------- |
| `openai`     | `https://api.openai.com/v1/`                               | `gpt-4o-mini`                             |
| `gemini`     | `https://generativelanguage.googleapis.com/v1beta/openai/` | `gemini-2.5-flash`                        |
| `openrouter` | `https://openrouter.ai/api/v1/`                            | `anthropic/claude-3.5-sonnet`             |
| `groq`       | `https://api.groq.com/openai/v1/`                          | `llama-3.3-70b-versatile`                 |
| `together`   | `https://api.together.xyz/v1/`                             | `meta-llama/Llama-3.3-70B-Instruct-Turbo` |
| `deepseek`   | `https://api.deepseek.com/v1/`                             | `deepseek-chat`                           |
| `ollama`     | `http://localhost:11434/v1/`                               | `llama3.2`                                |

### Opción B — Config manual

```ts
const providerConfig: AIProviderConfig = {
  apiKey: import.meta.env.VITE_AI_API_KEY,
  baseURL: "https://api.openai.com/v1/",
  model: "gpt-4o-mini",
  temperature: 0.7,
  maxTokens: 2048,
};
```

### CORS con Gemini en desarrollo

Llamar `generativelanguage.googleapis.com` directo desde el navegador puede fallar por CORS. Monta un proxy en tu `vite.config.ts`:

```ts
server: {
  proxy: {
    "/api/google-openai": {
      target: "https://generativelanguage.googleapis.com/v1beta/openai",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/google-openai/, ""),
    },
  },
}
```

Y usa `baseURL: "/api/google-openai"`.

---

## 3. Entregar la API key

`providerConfig.apiKey` se consume directamente. Opciones:

1. **Desarrollo**: variable `import.meta.env.VITE_*` (Vite expone solo ese prefijo al cliente).
2. **Producción**: **NO** expongas la key en el cliente. Monta un backend/proxy que inyecte la key y apunta `baseURL` a tu proxy.
3. **CLI / Electron**: usa el secret manager del sistema.

El cliente OpenAI se instancia con `dangerouslyAllowBrowser: true` para operar en navegador. Úsalo solo si la key está restringida por IP/dominio o si vas detrás de un proxy controlado.

---

## 4. Modo chatbot puro

No requiere `dataSchema`. Ideal para asistentes generalistas, onboarding, FAQ.

```tsx
<AIChatSidebar
  open={open}
  onClose={() => setOpen(false)}
  providerConfig={providerConfig}
  mode="chatbot"
  title="Asistente Gridory"
  emptyState={{
    title: "Hola, soy tu asistente",
    description: "Pregúntame sobre el producto o pide ayuda con tareas.",
  }}
  chatbotPrompt="Eres el asistente oficial de Gridory. Responde de forma amistosa y ejecutiva."
/>
```

- `mode="chatbot"` desactiva automáticamente las herramientas create/update/move.
- Si no pasas `systemPrompt`, el componente usa un prompt base en español; `chatbotPrompt` se concatena al final para darle personalidad sin reescribir el prompt completo.
- Si pasas `systemPrompt` toma precedencia absoluta.

---

## 5. Modo tabla

Requiere `dataSchema` con los campos de tu entidad.

```tsx
<AIChatSidebar
  open={open}
  onClose={() => setOpen(false)}
  providerConfig={providerConfig}
  mode="table"
  dataSchema={{
    entityName: "Empresas",
    entityNameSingular: "Empresa",
    fields: [
      { id: "name", label: "Nombre", type: "text", required: true },
      {
        id: "country",
        label: "País",
        type: "select",
        required: true,
        options: [
          { value: "Chile", label: "Chile" },
          { value: "Perú", label: "Perú" },
        ],
      },
      { id: "createdAt", label: "Fecha alta", type: "date" },
      { id: "tenantId", label: "Tenant", type: "text", fixedValue: "acme-001" },
    ],
    rows: currentRows,
    summary: "Tabla de empresas activas del tenant acme-001.",
    extraInstructions: "No propongas registros con nombres duplicados.",
  }}
  enableActions
  onAction={handleAIAction}
/>
```

Cada `AIFieldDescriptor` admite:

| Propiedad      | Descripción                                                                               |
| -------------- | ----------------------------------------------------------------------------------------- |
| `id`           | Clave del campo tal como viaja al BE.                                                     |
| `label`        | Etiqueta humana.                                                                          |
| `type`         | `"text" \| "number" \| "date" \| "select" \| "boolean"`.                                  |
| `description`  | Contexto para el modelo (muy útil para guiar la generación).                              |
| `options`      | Sólo para `select`. El modelo recibirá el `enum` y no podrá salirse de ese conjunto.      |
| `required`     | Marca el campo como obligatorio. Se refleja en el schema JSON de la tool.                 |
| `fixedValue`   | Valor que siempre se manda al BE. El modelo lo recibe como `const` y no puede cambiarlo.  |
| `defaultValue` | Valor sugerido si el modelo no lo especifica. Se aplica justo antes de emitir `onAction`. |

---

## 6. Modo kanban

Además de crear y actualizar, habilita la tool `move_card`.

```tsx
<AIChatSidebar
  open={open}
  onClose={() => setOpen(false)}
  providerConfig={providerConfig}
  mode="kanban"
  dataSchema={{
    entityName: "Tareas",
    entityNameSingular: "Tarea",
    fields: [
      { id: "title", label: "Título", type: "text", required: true },
      {
        id: "status",
        label: "Estado",
        type: "select",
        required: true,
        options: [
          { value: "todo", label: "Por hacer" },
          { value: "doing", label: "En curso" },
          { value: "done", label: "Listo" },
        ],
      },
    ],
    rows: cards,
    kanbanGroupField: "status",
  }}
  enableActions
  onAction={handleAIAction}
/>
```

- `kanbanGroupField` es **obligatorio** para que el modelo entienda qué columna modificar con `move_card`.
- `move_card` emite eventos `type: "move-card"` con `{ id, targetColumn }` como payload.

---

## 7. Evento `onAction` y persistencia en BE

Cuando el usuario confirma una acción, se dispara `onAction(event)` con:

```ts
{
  type: "create-row" | "create-card" | "update-row" | "move-card" | "custom",
  mode: "chatbot" | "table" | "kanban",
  payload: Record<string, unknown>,
  rawResponse: string
}
```

Los `fixedValue` y `defaultValue` del schema ya vienen **mergeados** en `payload`, por lo que puedes enviarlo directo al BE.

### Ejemplo completo

```tsx
const handleAIAction = async (event: AIActionEvent) => {
  if (event.type === "create-row") {
    const res = await fetch("/api/empresas", {
      method: "POST",
      body: JSON.stringify(event.payload),
      headers: { "Content-Type": "application/json" },
    });
    const created = await res.json();
    setRows((prev) => [created, ...prev]);
    return;
  }

  if (event.type === "update-row") {
    const { id, ...updates } = event.payload;
    await fetch(`/api/empresas/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
      headers: { "Content-Type": "application/json" },
    });
    return;
  }

  if (event.type === "move-card") {
    const { id, targetColumn } = event.payload;
    await fetch(`/api/tareas/${id}/move`, {
      method: "POST",
      body: JSON.stringify({ status: targetColumn }),
      headers: { "Content-Type": "application/json" },
    });
  }
};
```

Si el usuario clickea **Cancelar** en la tarjeta, no se dispara `onAction`; solo se limpia el pending.

---

## 8. Memoria conversacional

El componente mantiene dos listas: la de UI (siempre completa) y la que se envía al modelo (filtrada). Se controla con el prop `memory`:

```tsx
<AIChatSidebar
  // ...
  memory={{
    enabled: true, // default true
    strategy: "sliding-window", // default
    maxMessages: 20, // default 20 (10 pares user/assistant)
  }}
/>
```

### Estrategias

| Estrategia       | Qué envía al modelo                        | Cuándo usarla                                          |
| ---------------- | ------------------------------------------ | ------------------------------------------------------ |
| `sliding-window` | `system` + últimos `maxMessages` mensajes. | **Default**. Cobertura general.                        |
| `minimal`        | `system` + último user + último assistant. | Refinamientos rápidos basados solo en el turno previo. |
| `none`           | `system` + último user.                    | "Sin memoria falsa". Cada pregunta es independiente.   |

### Apagar la memoria

```tsx
memory={{ enabled: false }}
```

Equivale a `strategy: "none"`. Útil para asistentes tipo "una pregunta, una respuesta" donde no quieres que recuerde nada del chat anterior.

### Mensajes del sistema en UI vs. modelo

Los textos como "Acción confirmada" / "Acción cancelada" que aparecen en la UI **no** se envían al modelo: se filtran antes de construir el historial.

---

## 9. Manejo de límites de tokens

Cuando un modelo rechaza la llamada por exceso de contexto (`context_length_exceeded`, "maximum context length", etc.), el hook reintenta automáticamente con una estrategia más agresiva:

1. `sliding-window` con `maxMessages` normal → si falla por tokens…
2. `sliding-window` con `maxMessages / 2` → si falla…
3. `minimal` (solo system + último par) → si falla, se propaga el error.

### Ajustes útiles

- **Reducir `maxMessages`**: para modelos con contexto pequeño (Gemma 7B, GPT-3.5).
- **Reducir `maxTokens`** del `providerConfig`: baja el techo de salida.
- **Cambiar modelo**: `gpt-4o-mini` (128k), `gemini-2.5-flash` (1M), `claude-3.5-sonnet` (200k) tienen mucho contexto.

---

## 10. Botón "Nueva conversación"

Aparece en el header junto al botón cerrar (ícono `RotateCcw` de lucide). Al clickearse:

- Limpia `messages`, `pendingActions` y `streamingContent`.
- Dispara `onResetConversation?.()` para que el padre pueda limpiar estado relacionado.

```tsx
<AIChatSidebar
  // ...
  showResetButton={true} // default true
  onResetConversation={() => {
    console.log("chat reiniciado");
    setEventLog([]);
  }}
/>
```

Para ocultarlo:

```tsx
<AIChatSidebar showResetButton={false} />
```

El botón se deshabilita automáticamente cuando no hay nada que resetear o cuando hay una respuesta cargando.

---

## 11. Customización visual

### Overrides de microcopy (`texts`)

```tsx
<AIChatSidebar
  texts={{
    placeholder: "Escribe tu pregunta...",
    thinking: "Procesando...",
    confirmRequired: "Requiere tu visto bueno",
    confirmCta: "Aplicar",
    cancelCta: "Descartar",
    actionConfirmed: "Listo, ejecutado en el padre.",
    actionCancelled: "No hice nada.",
    resetTooltip: "Empezar de cero",
    missingApiKey: "Falta configurar tu API key.",
    genericError: "Ups, no se pudo.",
    noResponse: "El modelo no respondió nada.",
    actionProposed: "Revisa la propuesta y decide.",
    emptyChatbot: { title: "¡Hola!", description: "..." },
    emptyData: { title: "Consulta", description: "..." },
  }}
/>
```

Todos son opcionales; lo no definido cae al default en español.

### `classNames` — slots de estilo

```tsx
<AIChatSidebar
  classNames={{
    root: "bg-white",
    header: "bg-slate-50",
    body: "bg-white",
    footer: "bg-white",
    userBubble: "bg-sky-600",
    assistantBubble: "bg-slate-100",
    chip: "bg-emerald-100 text-emerald-900",
    inputWrapper: "gap-3",
    textarea: "placeholder:text-slate-400",
  }}
/>
```

Cada slot se añade detrás del gancho del elemento que nombra (`root` → `gdy-ai-sidebar`, `header` → `gdy-ai-header`, `body` → `gdy-ai-body`, `footer` → `gdy-ai-footer`, `userBubble` / `assistantBubble` → `gdy-ai-bubble`, `chip` → `gdy-ai-chip`, `inputWrapper` → `gdy-ai-input-wrapper`, `textarea` → `gdy-ai-textarea`). El ejemplo usa utilidades de Tailwind porque esa app las tiene; sirve cualquier clase tuya. Los slots y `className` se concatenan tal cual al gancho (la librería no fusiona utilidades ni depende de Tailwind) y, como sus reglas pesan una sola clase, la tuya gana si su hoja carga después de `gridory/styles.css`.

### Ancho y `className`

- `width`: número (px) o string (`"420px"`, `"30vw"`). Default `380`.
- `className`: se aplica al `<aside>` raíz.

---

## 12. Chips de sugerencias rápidas

Cuando no hay mensajes, el estado vacío muestra chips clickeables:

```tsx
<AIChatSidebar
  suggestedMessages={[
    {
      label: "Crear empresa",
      prompt: "Crea una empresa llamada Boreal en Chile",
    },
    { label: "Buscar", prompt: "¿Cuántas empresas hay en Perú?" },
  ]}
/>
```

Si no lo defines se usan defaults por modo (`DEFAULT_SUGGESTED_MESSAGES_CHATBOT` o `DEFAULT_SUGGESTED_MESSAGES_DATA`). Pasa `suggestedMessages={[]}` para ocultar la fila de chips.

---

## 13. Campos custom: título, subtítulo, metadata fija

### Kanban con tarjetas "title/subtitle/description"

```tsx
fields: [
  {
    id: "title",
    label: "Título",
    type: "text",
    required: true,
    description: "Título corto de la tarjeta (máx 60 chars).",
  },
  {
    id: "subtitle",
    label: "Subtítulo",
    type: "text",
    description: "Información secundaria bajo el título.",
  },
  {
    id: "description",
    label: "Descripción",
    type: "text",
    description: "Detalle expandido.",
  },
  {
    id: "priority",
    label: "Prioridad",
    type: "select",
    options: [
      { value: "low", label: "Baja" },
      { value: "mid", label: "Media" },
      { value: "high", label: "Alta" },
    ],
    defaultValue: "mid",
  },
];
```

### Campos fijos por sesión (multi-tenant)

```tsx
{ id: "tenantId", label: "Tenant", type: "text", fixedValue: currentTenantId },
{ id: "userId", label: "Creado por", type: "text", fixedValue: currentUserId },
{ id: "source", label: "Origen", type: "text", fixedValue: "ai-assistant" },
```

El modelo verá estos valores como `const` en el schema de la tool. Siempre se fusionan al `payload` antes de emitir `onAction`, garantizando integridad hacia el BE.

---

## 14. Ejemplos completos

### Chatbot mínimo

```tsx
import { useState } from "react";
import {
  AIChatButton,
  AIChatSidebar,
  resolveProviderConfig,
} from "gridory/ai";

export function HelpChat() {
  const [open, setOpen] = useState(false);
  const providerConfig = resolveProviderConfig("openai", {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });

  return (
    <>
      <AIChatButton onClick={() => setOpen(true)} label="Ayuda" />
      <AIChatSidebar
        open={open}
        onClose={() => setOpen(false)}
        providerConfig={providerConfig}
        mode="chatbot"
        title="¿Necesitas ayuda?"
        chatbotPrompt="Eres el asistente de soporte. Responde en máximo 3 párrafos."
      />
    </>
  );
}
```

### Tabla con inserción hacia BE

```tsx
<AIChatSidebar
  open={open}
  onClose={() => setOpen(false)}
  providerConfig={providerConfig}
  mode="table"
  dataSchema={{
    entityName: "Clientes",
    entityNameSingular: "Cliente",
    fields: [
      { id: "name", label: "Nombre", type: "text", required: true },
      { id: "email", label: "Email", type: "text", required: true },
      { id: "tenantId", label: "Tenant", type: "text", fixedValue: tenantId },
    ],
    rows,
  }}
  enableActions
  onAction={async (event) => {
    if (event.type === "create-row") {
      const res = await fetch("/api/clientes", {
        method: "POST",
        body: JSON.stringify(event.payload),
      });
      const created = await res.json();
      setRows((prev) => [created, ...prev]);
    }
  }}
/>
```

### Sin memoria falsa, con sliding window custom

```tsx
<AIChatSidebar
  /* ... */
  memory={{ enabled: true, strategy: "sliding-window", maxMessages: 6 }}
/>
```

### Asistente independiente por consulta (sin memoria)

```tsx
<AIChatSidebar
  /* ... */
  memory={{ enabled: false }}
/>
```

---

## 15. API reference — `AIChatSidebarProps`

| Prop                  | Tipo                               | Default                                     | Descripción                                           |
| --------------------- | ---------------------------------- | ------------------------------------------- | ----------------------------------------------------- |
| `open`                | `boolean`                          | —                                           | Controla visibilidad del sidebar.                     |
| `onClose`             | `() => void`                       | —                                           | Se dispara al clickear X o backdrop.                  |
| `providerConfig`      | `AIProviderConfig`                 | —                                           | apiKey, baseURL, model, temperature, maxTokens.       |
| `mode`                | `"chatbot" \| "table" \| "kanban"` | `chatbot` sin schema, `table` con schema    | Modo de operación.                                    |
| `dataSchema`          | `AIDataSchema`                     | `undefined`                                 | Requerido para `table` y `kanban`.                    |
| `systemPrompt`        | `string`                           | Autogenerado                                | Sobrescribe completamente el prompt.                  |
| `chatbotPrompt`       | `string`                           | Genérico en español                         | Complementa el prompt base en modo chatbot.           |
| `suggestedMessages`   | `AISuggestedMessage[]`             | Defaults por modo                           | Chips del estado vacío.                               |
| `title`               | `string`                           | `"Asistente AI"`                            | Header título.                                        |
| `subtitle`            | `string`                           | Autogenerado                                | Header subtítulo.                                     |
| `emptyState`          | `AIEmptyState`                     | Default por modo                            | `{ title, description, icon }` del estado vacío.      |
| `texts`               | `AITextOverrides`                  | Defaults en español                         | Overrides de microcopy.                               |
| `enableActions`       | `boolean`                          | `true` si `mode !== "chatbot"` y hay schema | Habilita tool-calling y tarjeta de confirmación.      |
| `onAction`            | `(event: AIActionEvent) => void`   | —                                           | Se dispara al confirmar una acción.                   |
| `onError`             | `(error: Error) => void`           | —                                           | Errores del cliente AI.                               |
| `onResetConversation` | `() => void`                       | —                                           | Se dispara tras resetear.                             |
| `memory`              | `AIMemoryConfig`                   | `{ enabled: true, "sliding-window", 20 }`   | Configuración de historial.                           |
| `showResetButton`     | `boolean`                          | `true`                                      | Muestra/oculta el botón de nueva conversación.        |
| `className`           | `string`                           | —                                           | Clases extra al `<aside>` raíz.                       |
| `classNames`          | `AIChatClassNames`                 | —                                           | Slots granulares (root, header, body, userBubble...). |
| `width`               | `number \| string`                 | `380`                                       | Ancho del sidebar.                                    |

---

## 16. Hook expuesto

Si prefieres controlar la UI tú mismo:

```tsx
import { useAIChat } from "gridory/ai";

const {
  messages,
  pendingActions,
  isLoading,
  streamingContent,
  sendMessage,
  confirmAction,
  rejectAction,
  resetConversation,
} = useAIChat({
  providerConfig,
  systemPrompt,
  mode: "table",
  dataSchema,
  enableActions: true,
  memory: { enabled: true, strategy: "sliding-window", maxMessages: 20 },
  onAction: (event) => {
    /* ... */
  },
});
```
