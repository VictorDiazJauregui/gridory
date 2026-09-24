# AI assistant

[English](ai-assistant.md) · [Español](ai-assistant.es.md)

The assistant is a chat panel that talks to any OpenAI-compatible chat completions endpoint. It can
hold a free conversation, answer questions about the rows of a table or the cards of a board, and
propose changes that the user confirms before your app receives them.

## Import

```ts
import { AIChatButton, AIChatSidebar, useAIChat } from "gridory/ai";
```

| Export | Purpose |
|---|---|
| `AIChatSidebar`, `AIChatButton` | The chat panel, and a button to open it from your own toolbar. |
| `useAIChat` | The conversation state without UI, for a custom interface. |
| `AI_PROVIDER_PRESETS`, `resolveProviderConfig`, `DEFAULT_PROVIDER_CONFIG` | Provider presets. |
| `buildChatbotSystemPrompt`, `buildTableSystemPrompt`, `buildKanbanSystemPrompt`, `resolveSystemPrompt`, `buildToolDefinitions` | The prompts and tool schemas the panel sends. |
| `DEFAULT_TEXTS`, `DEFAULT_SUGGESTED_MESSAGES_DATA`, `DEFAULT_SUGGESTED_MESSAGES_CHATBOT`, `DEFAULT_EMPTY_STATE_DATA`, `DEFAULT_EMPTY_STATE_CHATBOT`, `DEFAULT_MEMORY_CONFIG` | Built-in texts and defaults. |
| `createAIClient`, `streamChatCompletion`, `applyHistoryStrategy`, `isContextLengthError` | The low-level client the hook uses. Not re-exported from the root `gridory` entry. |

The `AI*` types used on this page are exported too, and the root `gridory` entry re-exports the
rest. Import `gridory/styles.css` once, before any override (see [theming.md](theming.md)).

## How it works

The panel calls your endpoint directly from the browser through the `openai` SDK (a dependency of
the library), created with `dangerouslyAllowBrowser: true`. Replies stream in token by token. In the
`table` and `kanban` modes the request also carries tool definitions built from your fields. When
the model calls a tool, the panel shows a pending action card, and only when the user confirms it
does the component call `onAction`. The library never mutates or persists your data.

The value of `providerConfig.apiKey` reaches the browser, and the SDK sends it as a bearer token on
every request. Do not ship a long-lived provider key to your users. Point `baseURL` at a proxy on
your server that adds the real key, or have your server issue a short-lived key for the session.

## Provider configuration

| Prop | Type | Default | Description |
|---|---|---|---|
| `apiKey` | `string` | — | Sent as a bearer token. A blank value blocks sending (see [Errors](#errors)). |
| `baseURL` | `string` | — | Endpoint base, for example `https://api.openai.com/v1/`. A path without a scheme is resolved against `window.location.origin`. |
| `model` | `string` | — | Model id sent with each request. |
| `temperature` | `number` | `0.7` | Sampling temperature. |
| `maxTokens` | `number` | `2048` | Output limit, sent as `max_completion_tokens`. |

The client is recreated whenever the `providerConfig` object changes, so keep it stable (a module
constant or `useMemo`). `AI_PROVIDER_PRESETS` holds a base URL and a default model per provider:

| Preset | Base URL | Default model |
|---|---|---|
| `openai` | `https://api.openai.com/v1/` | `gpt-4o-mini` |
| `gemini` | `https://generativelanguage.googleapis.com/v1beta/openai/` | `gemini-2.5-flash` |
| `openrouter` | `https://openrouter.ai/api/v1/` | `anthropic/claude-3.5-sonnet` |
| `groq` | `https://api.groq.com/openai/v1/` | `llama-3.3-70b-versatile` |
| `together` | `https://api.together.xyz/v1/` | `meta-llama/Llama-3.3-70B-Instruct-Turbo` |
| `deepseek` | `https://api.deepseek.com/v1/` | `deepseek-chat` |
| `ollama` | `http://localhost:11434/v1/` | `llama3.2` |

`resolveProviderConfig(preset, overrides)` returns a complete `AIProviderConfig` (see the
[example](#example-persisting-a-created-row)). `overrides` needs `apiKey`, and a blank `baseURL` or
`model` falls back to the preset. `DEFAULT_PROVIDER_CONFIG` is a `Partial<AIProviderConfig>` with
the Gemini base URL and model, `temperature: 0.7` and `maxTokens: 2048`; the panel does not use it.

### Gemini in development

Calling Gemini's OpenAI-compatible endpoint directly from a browser can fail with a CORS error. In
development, a Vite proxy avoids it:

```ts
// vite.config.ts, inside defineConfig({ ... })
server: {
  proxy: {
    "/api/google-openai": {
      target: "https://generativelanguage.googleapis.com/v1beta/openai",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/google-openai/, ""),
    },
  },
},
```

Then use `baseURL: "/api/google-openai"`. This proxy only rewrites the path (the key still comes
from the browser), so use a server-side proxy in production. A network error on a direct call to
`generativelanguage.googleapis.com` reaches `onError` as a Spanish message that suggests this proxy.

## Modes

`mode` is `"chatbot"`, `"table"` or `"kanban"`. On `AIChatSidebar` it defaults to `"table"` when
you pass `dataSchema` and to `"chatbot"` otherwise. Without `dataSchema`, the `table` and `kanban`
modes use the chatbot prompt and send no tools.

| Aspect | `chatbot` | `table` | `kanban` |
|---|---|---|---|
| System prompt | `buildChatbotSystemPrompt(chatbotPrompt)` | `buildTableSystemPrompt(dataSchema)` | `buildKanbanSystemPrompt(dataSchema)` |
| Tools | none | `create_record`, `update_record` | `create_record`, `update_record`, `move_card` |
| Suggested messages | `DEFAULT_SUGGESTED_MESSAGES_CHATBOT` | `DEFAULT_SUGGESTED_MESSAGES_DATA` | `DEFAULT_SUGGESTED_MESSAGES_DATA` |
| Empty state | `DEFAULT_EMPTY_STATE_CHATBOT` | `DEFAULT_EMPTY_STATE_DATA` | `DEFAULT_EMPTY_STATE_DATA` |
| Action cards in the panel | never | shown | shown |

### Describing your data

| `AIDataSchema` prop | Type | Default | Description |
|---|---|---|---|
| `entityName` | `string` | — | Plural name, in the prompt and in the default subtitle. |
| `entityNameSingular` | `string` | — | Singular name, in the prompt and in the action card title. |
| `fields` | `AIFieldDescriptor[]` | — | Listed in the prompt and turned into tool parameters. |
| `rows` | `Record<string, unknown>[]` | — | Current data. Unless `summary` is set, the prompt gets the row count, up to 8 sample rows (first 8 keys of each), and the min, max, average and count of each numeric key of the first row, over the first 50 rows. |
| `kanbanGroupField` | `string` | — | Kanban prompt only: the field that decides the column. The prompt says `"columna"` when it is missing. |
| `summary` | `string` | — | Replaces the automatic summary of `rows`. Use it when rows are large or sensitive: the whole prompt goes to the provider. |
| `extraInstructions` | `string` | — | Business rules appended after the data section. |

| `AIFieldDescriptor` prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Key in the tool parameters and in the action payload. |
| `label` | `string` | — | Shown in the prompt and in the action card; the parameter description when `description` is missing. |
| `type` | `AIFieldType` | — | `number` and `boolean` map to JSON Schema types, `date` to a `date-time` string with an ISO 8601 hint, `select` to a string enum, `text` to a string. |
| `description` | `string` | — | Extra context, in the prompt and in the parameter description. |
| `options` | `AIFieldOption[]` | — | For `select`: the values become the `enum`; the prompt lists label and value. |
| `required` | `boolean` | `false` | Marked in the prompt, required in `create_record`, flagged with `*` in the action card. |
| `fixedValue` | `unknown` | — | A `const` in the tool schema (required in `create_record`), written over the payload before the card appears. |
| `defaultValue` | `unknown` | — | Suggested in the prompt, written into the payload when the value is `undefined` or `null`. Ignored when `fixedValue` is set. |

Fixed and default values are applied to `create_record` and `update_record` payloads and to the JSON
fallback, not to `move_card`. On an update, default values also fill fields the model did not touch.

### System prompts

`resolveSystemPrompt` sends `systemPrompt`, trimmed, when it is not blank. Otherwise, in `chatbot`
mode or without `dataSchema`, it uses `buildChatbotSystemPrompt(chatbotPrompt)`: a base prompt with
`chatbotPrompt` appended. In the data modes it uses the table or kanban builder, and `chatbotPrompt`
has no effect; add instructions with `dataSchema.extraInstructions`, or with the builder's second
argument: `systemPrompt={buildTableSystemPrompt(dataSchema, "Never propose duplicate names.")}`.

The built-in prompts are written in Spanish and ask the model to answer in Spanish; for another
language, write your own `systemPrompt`. Tools are sent whatever the prompt says, so a custom prompt
should still tell the model when to call `create_record`, `update_record` and `move_card`.

| Function | Signature |
|---|---|
| `buildChatbotSystemPrompt` | `(customPrompt?: string) => string` |
| `buildTableSystemPrompt` | `(schema: AIDataSchema, customPrompt?: string) => string` |
| `buildKanbanSystemPrompt` | `(schema: AIDataSchema, customPrompt?: string) => string` |
| `resolveSystemPrompt` | `(params: { mode: AIChatMode; dataSchema?: AIDataSchema; systemPrompt?: string; chatbotPrompt?: string }) => string` |
| `buildToolDefinitions` | `(fields: AIFieldDescriptor[], mode: AIChatMode) => ChatCompletionTool[]` (the `openai` SDK type; empty in `chatbot` mode or without fields) |

## Actions

`enableActions` turns tool calling on. On `AIChatSidebar` it defaults to `true` when the mode is not
`chatbot` and `dataSchema` is set. Tools are sent only when actions are enabled and
`dataSchema.fields` is not empty.

| Tool | Modes | Parameters | Action `type` | Payload |
|---|---|---|---|---|
| `create_record` | `table`, `kanban` | `record`: one property per field | `create-row` (table), `create-card` (kanban) | the `record` object |
| `update_record` | `table`, `kanban` | `id`: string, `updates`: field properties, none required | `update-row` | `{ id, ...updates }` |
| `move_card` | `kanban` | `id`: string, `targetColumn`: string | `move-card` | `{ id, targetColumn }` |
| any other name | any | anything | `custom` | the arguments, when there are any |

A reply with several tool calls produces one card per call. Each card shows the `confirmRequired`
kicker, a title built from the type and `entityNameSingular` (default `"registro"`), such as
`"Crear nuevo {entity}"`, `"Actualizar {entity}"`, `"Mover {entity}"` or `"Acción personalizada"`,
one row per payload key (labelled with the field `label` when the key matches a field `id`), and
the `cancelCta` and `confirmCta` buttons.

### AIActionEvent

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `AIActionType` | — | `"create-row" \| "create-card" \| "update-row" \| "move-card" \| "custom"`. |
| `mode` | `AIChatMode` | — | The mode that produced the action. |
| `payload` | `Record<string, unknown>` | — | The values to apply, with fixed and default values merged. |
| `rawResponse` | `string` | — | The text of the reply that carried the action (often empty for a tool call). |

The tools offered in `table` mode produce `create-row` and `update-row`; in `kanban` mode they
produce `create-card`, `update-row` and `move-card`. Mapping is by name, so a stray tool call or the
JSON fallback can produce any type, `custom` included, in either mode: ignore the ones you skip.

### JSON fallback

Some models write the action as JSON in the reply instead of calling a tool. When actions are
enabled and no tool call produced an action, the component takes the first `` ```json `` fenced
block of the reply, or else everything from the first `{` to the last `}`. If it parses:

- The `type` or `action` property (case-insensitive) sets the type: `create`, `create_record` and
  `create-row` give the create type of the mode; `update_record` gives `update-row`; `move_card`
  gives `move-card`; `create-card`, `update-row` and `move-card` stay; anything else is `custom`.
- Without `type` or `action`, a `record` object means create, an `updates` object means
  `update-row`, a string `id` with a string `targetColumn` (or `target_column`) means `move-card`,
  and anything else `custom`.
- The payload is the `payload` property, else `record`, else the whole object. An update in the
  `{ id, updates }` shape therefore arrives with `updates` nested, unlike the tool call.

The reply text stays in the transcript. Any parseable object counts, so a reply that shows JSON as an
example also produces a card, usually `custom`.

### Lifecycle

1. The user sends a message; it joins the transcript and `isLoading` turns `true`.
2. The request carries the system prompt, the history chosen by the memory strategy and the tools.
3. The reply streams in (a "thinking" row shows until the first token). Then tool calls become
   pending actions, or the JSON fallback runs when there are none.
4. The assistant message is added: the reply text, `actionProposed` (no text, but actions from tool
   calls) or `noResponse` (neither).
5. Cancel removes the card and adds `actionCancelled`. Confirm removes it, calls `onAction` and adds
   `actionConfirmed` once `onAction` returns, without waiting for a promise.

### Example: persisting a created row

```tsx
import { useMemo, useState } from "react";
import { AIChatSidebar, resolveProviderConfig } from "gridory/ai";
import type { AIActionEvent, AIFieldDescriptor } from "gridory/ai";

type Customer = { id: string; name: string; plan: string; tenantId: string };
type Props = { apiKey: string; initialRows: Customer[]; open: boolean; onClose: () => void };

const fields: AIFieldDescriptor[] = [
  { id: "name", label: "Name", type: "text", required: true },
  { id: "plan", label: "Plan", type: "text", description: "free or pro", defaultValue: "free" },
  { id: "tenantId", label: "Tenant", type: "text", fixedValue: "acme" },
];

export const CustomersAssistant = ({ apiKey, initialRows, open, onClose }: Props) => {
  const [rows, setRows] = useState(initialRows);
  const [saveError, setSaveError] = useState<string | null>(null);
  const providerConfig = useMemo(
    () => resolveProviderConfig("openai", { apiKey, baseURL: "/api/ai/" }),
    [apiKey],
  );

  const handleAction = async (event: AIActionEvent) => {
    if (event.type !== "create-row") return;
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event.payload),
      });
      if (!response.ok) throw new Error(`Save failed (${response.status})`);
      const created = (await response.json()) as Customer;
      setRows((previous) => [created, ...previous]);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Save failed");
    }
  };

  return (
    <>
      {saveError ? <p role="alert">{saveError}</p> : null}
      <AIChatSidebar
        open={open}
        onClose={onClose}
        providerConfig={providerConfig}
        dataSchema={{ entityName: "Customers", entityNameSingular: "Customer", fields, rows }}
        onAction={handleAction}
      />
    </>
  );
};
```

The mode defaults to `table` and actions are on. `payload` already holds `tenantId: "acme"`, and
`plan: "free"` when the model left it out.

## Memory and token limits

`memory` (`AIMemoryConfig`) controls how much of the conversation goes into each request. The
transcript on screen always keeps everything.

| Prop | Type | Default | Description |
|---|---|---|---|
| `enabled` | `boolean` | `true` | Required when you pass `memory`. `false` behaves like `strategy: "none"`. |
| `strategy` | `AIHistoryStrategy` | `"sliding-window"` | Which messages are sent. |
| `maxMessages` | `number` | `20` | Window size for `sliding-window`. |

`DEFAULT_MEMORY_CONFIG` holds these defaults. Each request contains the system prompt plus:

| Strategy | Messages sent | Retry on a context-length error |
|---|---|---|
| `sliding-window` | The last `maxMessages` messages (at least 2), the new one included. | Once, with half the window (at least 2). |
| `minimal` | The last assistant message and the last user message. | None. |
| `none` | The last user message only. Also used when `enabled` is `false`. | Once, with `minimal`. |

The history is the whole transcript, including the confirmation, cancellation and error messages the
component adds as assistant messages. `applyHistoryStrategy(messages, strategy, maxMessages)` does
this selection on `openai` message params, for a custom client. To fit a small context window,
lower `maxMessages`, replace `rows` with a short `summary`, or lower `providerConfig.maxTokens`.

`isContextLengthError` decides whether to retry: it looks for `context_length_exceeded`,
`maximum context length`, `context window`, `too many tokens`, `prompt is too long` or
`reduce the length` in the error message, ignoring case. Other errors, and a failed retry, are
reported as described in [Errors](#errors).

## Sidebar and button

`AIChatSidebar` is a fixed panel on the right edge (props in [Reference](#reference)). It stays
mounted while closed (`data-state="closed"`), so the conversation survives closing and reopening;
unmounting the component discards it.

- Below 768px an overlay covers the page while the panel is open; a click on it calls `onClose`.
- When `open` turns `true`, the textarea gets focus after 250 ms, while the panel slides in. The
  slide runs only under `prefers-reduced-motion: no-preference`.
- The body scrolls to the end whenever messages, streamed text or pending actions change.
- Enter sends and Shift+Enter inserts a line break. While a reply loads, the textarea and the send
  button are disabled; the send button is also disabled while the input is empty.
- The reset button (`showResetButton`) clears messages and pending actions, calls
  `onResetConversation` and focuses the textarea. It is disabled while loading or with nothing to
  clear.
- Assistant replies render a Markdown subset: `### ` headings, `- ` bullets, `1. ` numbered items,
  `**bold**` and blank lines. Anything else, and every user message, shows as plain text.
- The empty state shows `emptyState`, field by field over `texts.emptyChatbot` or `texts.emptyData`
  (by mode), over the defaults below. Its chips come from `suggestedMessages` (`[]` hides them),
  and a click sends the chip's `prompt`.

| Constant | Value |
|---|---|
| `DEFAULT_EMPTY_STATE_CHATBOT` | title `"¿En qué puedo ayudarte?"`, description `"Escríbeme cualquier pregunta o tarea. Estoy listo para asistirte."` |
| `DEFAULT_EMPTY_STATE_DATA` | title `"Consulta tus datos"`, description `"Pregúntame sobre la información disponible. Responderé con contexto y sugerencias accionables."` |
| `DEFAULT_SUGGESTED_MESSAGES_CHATBOT` | chips `"Preséntate"`, `"Dame una idea"`, `"Explica simple"` |
| `DEFAULT_SUGGESTED_MESSAGES_DATA` | chips `"Resumen general"`, `"¿Cuántos registros hay?"`, `"Estadísticas"`, `"Top 5"` |

### Texts

The built-in texts are in Spanish. `texts` (`AITextOverrides`) overrides any of them; missing keys
keep the value from `DEFAULT_TEXTS`.

| Key | Default | Used for |
|---|---|---|
| `placeholder` | `"Pregunta sobre los datos..."` | Textarea placeholder, in every mode. |
| `thinking` | `"Pensando..."` | Row shown before the first token. |
| `confirmRequired` | `"Confirmación requerida"` | Action card kicker. |
| `confirmCta` | `"Confirmar"` | Confirm button. |
| `cancelCta` | `"Cancelar"` | Cancel button. |
| `actionConfirmed` | `"Acción confirmada. Ejecuté el evento en el componente padre."` | Message after a confirm. |
| `actionCancelled` | `"Acción cancelada. No realicé ningún cambio."` | Message after a cancel. |
| `resetTooltip` | `"Nueva conversación"` | Title and accessible name of the reset button. |
| `missingApiKey` | `"No se encontró API key. Configura tu proveedor para usar el asistente."` | Error when `apiKey` is blank. |
| `genericError` | `"No se pudo completar la consulta al proveedor AI."` | Error message when the failure is not an `Error`. |
| `noResponse` | `"No encontré una respuesta para esta solicitud."` | Reply with no text and no action. |
| `actionProposed` | `"Te propuse una acción. Revísala y confirma si deseas ejecutarla."` | Reply with no text but with actions. |
| `emptyChatbot` | `DEFAULT_EMPTY_STATE_CHATBOT` | Empty state in chatbot mode. |
| `emptyData` | `DEFAULT_EMPTY_STATE_DATA` | Empty state in the data modes. |

Some strings are outside `texts`: the accessible names of the close and send buttons (`"Cerrar"`,
`"Enviar"`), the action card titles, the `"Sin datos para mostrar."` line of a card with an empty
payload, and the error prefixes listed in [Errors](#errors).

### AIChatButton

`AIChatButton` renders an outline button with a sparkles icon and a label. It accepts every
`<button>` attribute (`type` defaults to `"button"`) plus `label` (`string`, default `"AI"`). The
label is hidden below 640px, where only the icon shows, so pass `aria-label` to keep an accessible
name. `DataTable` and `KanbanBoard` render their own assistant button through `aiButton` (see
[toolbar.md](toolbar.md)); use `AIChatButton` anywhere else.

## useAIChat

`useAIChat(config)` runs the conversation without any UI. `providerConfig`, `dataSchema`, `memory`,
`texts`, `onAction` and `onError` work as on `AIChatSidebar`; `systemPrompt` (sent as is) and `mode`
are required; `enableActions` defaults to `true` in any mode but `chatbot`, even without
`dataSchema`. The config type is not exported by name: use `Parameters<typeof useAIChat>[0]`.

| Returned | Type | Description |
|---|---|---|
| `messages` | `AIChatMessage[]` | The transcript. |
| `pendingActions` | `AIPendingAction[]` | Actions waiting for a decision. Render them with your own confirm and cancel buttons. |
| `isLoading` | `boolean` | A request is in flight. |
| `streamingContent` | `string` | Text streamed so far; empty when idle. |
| `sendMessage` | `(text: string) => Promise<void>` | Trims and sends. Ignored when the text is blank or a request is in flight. |
| `confirmAction` | `(actionId: string) => void` | Removes the action and calls `onAction`. |
| `rejectAction` | `(actionId: string) => void` | Removes the action without calling `onAction`. |
| `resetConversation` | `() => void` | Clears messages, pending actions and streamed text. |
| `clearMessages` | `() => void` | Same as `resetConversation`. |

```tsx
import { useState } from "react";
import { useAIChat } from "gridory/ai";

const providerConfig = { apiKey: "session-key", baseURL: "/api/ai/", model: "gpt-4o-mini" };
const systemPrompt = "You are a support assistant. Answer in English, in two sentences at most.";

export const SupportChat = () => {
  const [draft, setDraft] = useState("");
  const chat = useAIChat({ providerConfig, systemPrompt, mode: "chatbot" });

  const send = () => {
    void chat.sendMessage(draft);
    setDraft("");
  };

  return (
    <section>
      {chat.messages.map((message) => (
        <p key={message.id} data-role={message.role}>{message.content}</p>
      ))}
      {chat.streamingContent ? <p data-role="assistant">{chat.streamingContent}</p> : null}
      <input value={draft} onChange={(event) => setDraft(event.target.value)} aria-label="Message" />
      <button type="button" onClick={send} disabled={chat.isLoading}>Send</button>
    </section>
  );
};
```

## Errors

`onError` receives every failure. The component also adds a message to the transcript, so the user
sees the problem without extra code, and `isLoading` returns to `false`.

- **Missing API key.** When `apiKey` is blank, no request is made and the user's message is not
  added. `onError` gets an `Error` whose message, `texts.missingApiKey`, also shows in the transcript.
- **Provider failure.** The SDK error (after the context-length retry, when it applies) goes to
  `onError`; a thrown value that is not an `Error` becomes `new Error(texts.genericError)`. The
  transcript shows `"Ocurrió un error: "` and the message.
- **Empty reply.** A reply with no text and no action adds `texts.noResponse`. It is not an error.
- **`onAction` throws.** A synchronous throw goes to `onError` and adds
  `"No pude confirmar la acción: "` and the message; the card is already gone. A rejected promise
  from an async handler is not caught, so handle errors inside the handler.

## Styling

Tokens and light/dark themes are covered in [theming.md](theming.md), and every hook, state
selector and token is listed in [style-hooks.md](style-hooks.md).

| Area | Hooks |
|---|---|
| Button | `gdy-ai-button`, `gdy-ai-button-icon`, `gdy-ai-button-label` |
| Panel | `gdy-ai-overlay`, `gdy-ai-sidebar` |
| Header | `gdy-ai-header`, `gdy-ai-header-badge`, `gdy-ai-header-icon`, `gdy-ai-heading`, `gdy-ai-title`, `gdy-ai-subtitle`, `gdy-ai-reset`, `gdy-ai-reset-icon`, `gdy-ai-close`, `gdy-ai-close-icon` |
| Body | `gdy-ai-body`, `gdy-ai-empty`, `gdy-ai-empty-badge`, `gdy-ai-empty-icon`, `gdy-ai-empty-text`, `gdy-ai-empty-title`, `gdy-ai-empty-description`, `gdy-ai-chips`, `gdy-ai-chip`, `gdy-ai-end` |
| Messages | `gdy-ai-message`, `gdy-ai-avatar`, `gdy-ai-avatar-icon`, `gdy-ai-bubble`, `gdy-ai-text`, `gdy-ai-thinking`, `gdy-ai-thinking-content`, `gdy-ai-thinking-icon`, `gdy-ai-thinking-label` |
| Markdown | `gdy-ai-markdown`, `gdy-ai-md-heading`, `gdy-ai-md-item`, `gdy-ai-md-bullet`, `gdy-ai-md-number`, `gdy-ai-md-item-text`, `gdy-ai-md-paragraph`, `gdy-ai-md-text`, `gdy-ai-md-strong`, `gdy-ai-md-gap` |
| Action card | `gdy-ai-action-card`, `gdy-ai-action-header`, `gdy-ai-action-kicker`, `gdy-ai-action-title`, `gdy-ai-action-fields`, `gdy-ai-action-field`, `gdy-ai-action-field-label`, `gdy-ai-action-required`, `gdy-ai-action-field-value`, `gdy-ai-action-empty`, `gdy-ai-action-actions`, `gdy-ai-action-cancel`, `gdy-ai-action-confirm` |
| Footer | `gdy-ai-footer`, `gdy-ai-input-wrapper`, `gdy-ai-textarea`, `gdy-ai-send`, `gdy-ai-send-icon` |

| Element | State attribute | Values |
|---|---|---|
| `gdy-ai-sidebar` | `data-state` | `"open"`, `"closed"` |
| `gdy-ai-body` | `data-empty` | Present while the transcript is empty. |
| `gdy-ai-message`, `gdy-ai-bubble` | `data-role` | `"user"`, `"assistant"` |
| `gdy-ai-message` | `data-streaming`, `data-thinking` | Present on the reply being streamed and on the thinking row. |
| `gdy-ai-action-card` | `data-action-type` | An `AIActionType` value. |
| `gdy-ai-md-item` | `data-list` | `"unordered"`, `"ordered"` |

The library does not define the component tokens: each one is read with a fallback, so set only the
ones you need, on `:root` or a shared ancestor to also reach `AIChatButton` (it renders outside the
panel), for example `:root { --gdy-ai-accent: #0f766e; }`.

| Token | Fallback | Used by |
|---|---|---|
| `--gdy-ai-accent` | `--gdy-primary` | Icons, avatar, chips, card border and kicker, button, user bubble. |
| `--gdy-ai-accent-fg` | `--gdy-primary-foreground` | User bubble text. |
| `--gdy-ai-bg` | `--gdy-background` | Panel and footer background. |
| `--gdy-ai-user-bubble-bg` | `--gdy-ai-accent` | User bubble background. |
| `--gdy-ai-user-bubble-fg` | `--gdy-ai-accent-fg` | User bubble text. |
| `--gdy-ai-assistant-bubble-bg` | `--gdy-muted` at 60% | Assistant bubbles and the thinking row. |
| `--gdy-ai-assistant-bubble-fg` | `--gdy-foreground` | Assistant bubble text. |

The library rules weigh one class and the `data-role` variants sit inside `:where()`, so one class of
yours wins when your stylesheet loads after `gridory/styles.css`. The button, send, cancel and
confirm hooks sit on the shared `gdy-button` and use two classes (`.gdy-button.gdy-ai-send`); match
that weight to override them. `className` and the [`classNames` slots](#other-types) add your own
classes next to these hooks, for example `classNames={{ assistantBubble: "support-bubble" }}`.

## Reference

| `AIChatSidebarProps` prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Shows or hides the panel. |
| `onClose` | `() => void` | — | Close button and overlay click. |
| `providerConfig` | `AIProviderConfig` | — | Endpoint, key and model. |
| `mode` | `AIChatMode` | — | `"table"` with `dataSchema`, `"chatbot"` without. |
| `dataSchema` | `AIDataSchema` | — | Entity, fields and rows for the data modes. |
| `systemPrompt` | `string` | — | Replaces the generated prompt. |
| `chatbotPrompt` | `string` | — | Appended to the base prompt in chatbot mode. |
| `suggestedMessages` | `AISuggestedMessage[]` | — | Empty state chips. Defaults per mode; `[]` hides them. |
| `title` | `string` | `"Asistente AI"` | Header title. |
| `subtitle` | `string` | — | Header subtitle. Defaults to `"{rows.length} registros · {entityName}"` with `dataSchema`, else `"Chat asistido"` (chatbot) or `"Asistente contextual"`. |
| `emptyState` | `AIEmptyState` | — | Title, description and icon before the first message. |
| `texts` | `AITextOverrides` | — | Text overrides (see [Texts](#texts)). |
| `enableActions` | `boolean` | — | `true` when the mode is not `chatbot` and `dataSchema` is set. |
| `onAction` | `(event: AIActionEvent) => void` | — | Called when the user confirms an action. |
| `onError` | `(error: Error) => void` | — | Called on every failure. |
| `onResetConversation` | `() => void` | — | Called after the reset button clears the chat. |
| `memory` | `AIMemoryConfig` | `DEFAULT_MEMORY_CONFIG` | History sent with each request. |
| `showResetButton` | `boolean` | `true` | Shows the new conversation button in the header. |
| `className` | `string` | — | Class on the panel root. |
| `classNames` | `AIChatClassNames` | — | Classes per element. |
| `width` | `number \| string` | `380` | Panel width; a number is pixels. The stylesheet caps it at `90vw`. |

### Other types

| Name | Prop | Type | Description |
|---|---|---|---|
| `AIChatClassNames` | `root` | `string` | Added to `gdy-ai-sidebar`, like `className`. |
| `AIChatClassNames` | `header`, `body`, `footer`, `chip`, `inputWrapper`, `textarea` | `string` | Added to `gdy-ai-header`, `gdy-ai-body`, `gdy-ai-footer`, each `gdy-ai-chip`, `gdy-ai-input-wrapper` and `gdy-ai-textarea`. |
| `AIChatClassNames` | `userBubble`, `assistantBubble` | `string` | Added to the `gdy-ai-bubble` of user or assistant messages (streaming included). |
| `AIChatMessage` | `id` | `string` | Unique id. |
| `AIChatMessage` | `role` | `"user" \| "assistant" \| "system"` | The component creates only `"user"` and `"assistant"`. |
| `AIChatMessage` | `content` | `string` | Message text. |
| `AIChatMessage` | `timestamp` | `number` | Creation time in milliseconds (`Date.now()`). |
| `AIChatMessage` | `metadata` | `Record<string, unknown>` | Optional and free-form; the component does not set it. |
| `AIPendingAction` | all of `AIActionEvent` | — | See [AIActionEvent](#aiactionevent). |
| `AIPendingAction` | `id` | `string` | Pass it to `confirmAction` or `rejectAction`. |
| `AIPendingAction` | `title` | `string` | Optional; the built-in card builds its own title and does not read it. |
| `AISuggestedMessage` | `label` | `string` | Chip text. |
| `AISuggestedMessage` | `prompt` | `string` | Message sent when the chip is clicked. |
| `AIEmptyState` | `title`, `description` | `string` | Optional heading and text. |
| `AIEmptyState` | `icon` | `ReactNode` | Optional; replaces the default bot icon. |
| `AIFieldOption` | `value` | `string` | Value in the tool `enum` and in the payload. |
| `AIFieldOption` | `label` | `string` | Label shown to the model in the prompt. |
| `AIChatMode` | union | `"chatbot" \| "table" \| "kanban"` | Panel mode. |
| `AIFieldType` | union | `"text" \| "number" \| "date" \| "select" \| "boolean"` | Field type. |
| `AIHistoryStrategy` | union | `"sliding-window" \| "minimal" \| "none"` | Memory strategy. |
| `AIActionType` | union | `"create-row" \| "create-card" \| "update-row" \| "move-card" \| "custom"` | Action type. |
| `AIProviderPreset` | union | `"openai" \| "gemini" \| "openrouter" \| "groq" \| "together" \| "deepseek" \| "ollama"` | Keys of `AI_PROVIDER_PRESETS`. |
