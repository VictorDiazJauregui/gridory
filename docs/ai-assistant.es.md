# Asistente de IA

[English](ai-assistant.md) · [Español](ai-assistant.es.md)

El asistente es un panel de chat que habla con cualquier endpoint de chat completions compatible con
OpenAI. Puede mantener una conversación libre, responder preguntas sobre las filas de una tabla o las
tarjetas de un tablero y proponer cambios que el usuario confirma antes de que lleguen a tu app.

## Importación

```ts
import { AIChatButton, AIChatSidebar, useAIChat } from "gridory/ai";
```

El asistente necesita el SDK `openai`, una peer dependency opcional que instalas junto a Gridory:

```bash
npm install openai
```

| Export | Para qué sirve |
|---|---|
| `AIChatSidebar`, `AIChatButton` | El panel de chat y un botón para abrirlo desde tu propia toolbar. |
| `useAIChat` | El estado de la conversación sin UI, para una interfaz propia. |
| `AI_PROVIDER_PRESETS`, `resolveProviderConfig`, `DEFAULT_PROVIDER_CONFIG` | Presets de proveedor. |
| `buildChatbotSystemPrompt`, `buildTableSystemPrompt`, `buildKanbanSystemPrompt`, `resolveSystemPrompt`, `buildToolDefinitions` | Los prompts y los esquemas de tools que envía el panel. |
| `DEFAULT_TEXTS`, `DEFAULT_SUGGESTED_MESSAGES_DATA`, `DEFAULT_SUGGESTED_MESSAGES_CHATBOT`, `DEFAULT_EMPTY_STATE_DATA`, `DEFAULT_EMPTY_STATE_CHATBOT`, `DEFAULT_MEMORY_CONFIG` | Textos integrados y valores por defecto. |
| `createAIClient`, `streamChatCompletion`, `applyHistoryStrategy`, `isContextLengthError` | El cliente de bajo nivel que usa el hook. |

Los tipos `AI*` que aparecen en esta página también se exportan. El asistente solo está disponible en
`gridory/ai`: la entrada raíz `gridory` no lo incluye, así que una app sin asistente no necesita
`openai`. Importa `gridory/styles.css` una sola vez, antes de cualquier regla que la sobrescriba
(consulta [theming.es.md](theming.es.md)).

## Cómo funciona

El panel llama a tu endpoint directamente desde el navegador con el SDK `openai` (la peer dependency
opcional de arriba), creado con `dangerouslyAllowBrowser: true`. Las respuestas llegan en streaming, token a
token. En los modos `table` y `kanban`, la petición también lleva definiciones de tools generadas a
partir de tus campos. Cuando el modelo llama a una tool, el panel muestra una tarjeta de acción
pendiente, y el componente solo llama a `onAction` cuando el usuario la confirma. La librería nunca
modifica ni persiste tus datos.

El valor de `providerConfig.apiKey` llega al navegador, y el SDK lo envía como bearer token en cada
petición. No entregues a tus usuarios una clave del proveedor de larga duración. Apunta `baseURL` a un
proxy en tu servidor que añada la clave real, o haz que tu servidor emita una clave de corta duración
para la sesión.

## Configuración del proveedor

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `apiKey` | `string` | — | Se envía como bearer token. Un valor vacío bloquea el envío (consulta [Errores](#errores)). |
| `baseURL` | `string` | — | Base del endpoint, por ejemplo `https://api.openai.com/v1/`. Una ruta sin esquema se resuelve contra `window.location.origin`. |
| `model` | `string` | — | Id del modelo que se envía en cada petición. |
| `temperature` | `number` | `0.7` | Temperatura de muestreo. |
| `maxTokens` | `number` | `2048` | Límite de salida, enviado como `max_completion_tokens`. |

El cliente se vuelve a crear cada vez que cambia el objeto `providerConfig`, así que mantenlo estable
(una constante de módulo o `useMemo`). `AI_PROVIDER_PRESETS` guarda una base URL y un modelo por
defecto para cada proveedor:

| Preset | Base URL | Modelo por defecto |
|---|---|---|
| `openai` | `https://api.openai.com/v1/` | `gpt-4o-mini` |
| `gemini` | `https://generativelanguage.googleapis.com/v1beta/openai/` | `gemini-2.5-flash` |
| `openrouter` | `https://openrouter.ai/api/v1/` | `anthropic/claude-3.5-sonnet` |
| `groq` | `https://api.groq.com/openai/v1/` | `llama-3.3-70b-versatile` |
| `together` | `https://api.together.xyz/v1/` | `meta-llama/Llama-3.3-70B-Instruct-Turbo` |
| `deepseek` | `https://api.deepseek.com/v1/` | `deepseek-chat` |
| `ollama` | `http://localhost:11434/v1/` | `llama3.2` |

`resolveProviderConfig(preset, overrides)` devuelve un `AIProviderConfig` completo (consulta el
[ejemplo](#ejemplo-persistir-una-fila-creada)). `overrides` necesita `apiKey`, y si `baseURL` o `model`
están vacíos se usa el valor del preset. `DEFAULT_PROVIDER_CONFIG` es un `Partial<AIProviderConfig>`
con la base URL y el modelo de Gemini, `temperature: 0.7` y `maxTokens: 2048`; el panel no lo usa.

### Gemini en desarrollo

Llamar desde el navegador directamente al endpoint de Gemini compatible con OpenAI puede fallar con un
error de CORS. En desarrollo, un proxy de Vite lo evita:

```ts
// vite.config.ts, dentro de defineConfig({ ... })
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

Después usa `baseURL: "/api/google-openai"`. Este proxy solo reescribe la ruta (la clave sigue saliendo
del navegador), así que en producción usa un proxy en el servidor. Un error de red en una llamada
directa a `generativelanguage.googleapis.com` llega a `onError` como un mensaje en español que sugiere
este proxy.

## Modos

`mode` es `"chatbot"`, `"table"` o `"kanban"`. En `AIChatSidebar` vale `"table"` por defecto cuando
pasas `dataSchema`, y `"chatbot"` en caso contrario. Sin `dataSchema`, los modos `table` y `kanban`
usan el prompt del chatbot y no envían tools.

| Aspecto | `chatbot` | `table` | `kanban` |
|---|---|---|---|
| Prompt de sistema | `buildChatbotSystemPrompt(chatbotPrompt)` | `buildTableSystemPrompt(dataSchema)` | `buildKanbanSystemPrompt(dataSchema)` |
| Tools | ninguna | `create_record`, `update_record` | `create_record`, `update_record`, `move_card` |
| Mensajes sugeridos | `DEFAULT_SUGGESTED_MESSAGES_CHATBOT` | `DEFAULT_SUGGESTED_MESSAGES_DATA` | `DEFAULT_SUGGESTED_MESSAGES_DATA` |
| Estado vacío | `DEFAULT_EMPTY_STATE_CHATBOT` | `DEFAULT_EMPTY_STATE_DATA` | `DEFAULT_EMPTY_STATE_DATA` |
| Tarjetas de acción en el panel | nunca | se muestran | se muestran |

### Describir tus datos

| Prop de `AIDataSchema` | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `entityName` | `string` | — | Nombre en plural, en el prompt y en el subtítulo por defecto. |
| `entityNameSingular` | `string` | — | Nombre en singular, en el prompt y en el título de la tarjeta de acción. |
| `fields` | `AIFieldDescriptor[]` | — | Se listan en el prompt y se convierten en parámetros de las tools. |
| `rows` | `Record<string, unknown>[]` | — | Datos actuales. Salvo que definas `summary`, el prompt recibe el número de filas, hasta 8 filas de muestra (las primeras 8 claves de cada una) y el mínimo, el máximo, la media y el recuento de cada clave numérica de la primera fila, calculados sobre las primeras 50 filas. |
| `kanbanGroupField` | `string` | — | Solo en el prompt del kanban: el campo que decide la columna. Si falta, el prompt dice `"columna"`. |
| `summary` | `string` | — | Reemplaza el resumen automático de `rows`. Úsalo cuando las filas sean grandes o sensibles: el prompt entero va al proveedor. |
| `extraInstructions` | `string` | — | Reglas de negocio que se añaden después de la sección de datos. |

| Prop de `AIFieldDescriptor` | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `id` | `string` | — | Clave en los parámetros de la tool y en el payload de la acción. |
| `label` | `string` | — | Aparece en el prompt y en la tarjeta de acción; es la descripción del parámetro cuando falta `description`. |
| `type` | `AIFieldType` | — | `number` y `boolean` pasan a tipos de JSON Schema, `date` a un string `date-time` con una indicación de ISO 8601, `select` a un enum de strings y `text` a un string. |
| `description` | `string` | — | Contexto extra, en el prompt y en la descripción del parámetro. |
| `options` | `AIFieldOption[]` | — | Para `select`: los valores forman el `enum`; el prompt lista la etiqueta y el valor. |
| `required` | `boolean` | `false` | Se marca en el prompt, es obligatorio en `create_record` y lleva un `*` en la tarjeta de acción. |
| `fixedValue` | `unknown` | — | Un `const` en el esquema de la tool (obligatorio en `create_record`), que se escribe sobre el payload antes de que aparezca la tarjeta. |
| `defaultValue` | `unknown` | — | Se sugiere en el prompt y se escribe en el payload cuando el valor es `undefined` o `null`. Se ignora si hay `fixedValue`. |

Los valores fijos y por defecto se aplican a los payloads de `create_record` y `update_record` y al
fallback JSON, no a `move_card`. En una actualización, los valores por defecto también rellenan campos
que el modelo no tocó.

### Prompts de sistema

`resolveSystemPrompt` envía `systemPrompt`, sin espacios al inicio ni al final, cuando no está
vacío. Si no, en modo `chatbot` o sin `dataSchema`, usa `buildChatbotSystemPrompt(chatbotPrompt)`:
un prompt base con `chatbotPrompt` añadido al final. En los modos de datos usa la función de tabla o
de kanban, y `chatbotPrompt` no tiene efecto; añade instrucciones con `dataSchema.extraInstructions`
o con el segundo argumento de esa función:
`systemPrompt={buildTableSystemPrompt(dataSchema, "Never propose duplicate names.")}`.

Los prompts integrados están escritos en español y piden al modelo que responda en español; para otro
idioma, escribe tu propio `systemPrompt`. Las tools se envían diga lo que diga el prompt, así que un
prompt propio debería seguir indicando al modelo cuándo llamar a `create_record`, `update_record` y
`move_card`.

| Función | Firma |
|---|---|
| `buildChatbotSystemPrompt` | `(customPrompt?: string) => string` |
| `buildTableSystemPrompt` | `(schema: AIDataSchema, customPrompt?: string) => string` |
| `buildKanbanSystemPrompt` | `(schema: AIDataSchema, customPrompt?: string) => string` |
| `resolveSystemPrompt` | `(params: { mode: AIChatMode; dataSchema?: AIDataSchema; systemPrompt?: string; chatbotPrompt?: string }) => string` |
| `buildToolDefinitions` | `(fields: AIFieldDescriptor[], mode: AIChatMode) => ChatCompletionTool[]` (el tipo del SDK `openai`; vacío en modo `chatbot` o sin campos) |

## Acciones

`enableActions` activa el tool calling. En `AIChatSidebar` vale `true` por defecto cuando el modo no
es `chatbot` y hay `dataSchema`. Las tools solo se envían cuando las acciones están activas y
`dataSchema.fields` no está vacío.

| Tool | Modos | Parámetros | `type` de la acción | Payload |
|---|---|---|---|---|
| `create_record` | `table`, `kanban` | `record`: una propiedad por campo | `create-row` (tabla), `create-card` (kanban) | el objeto `record` |
| `update_record` | `table`, `kanban` | `id`: string, `updates`: propiedades de los campos, ninguna obligatoria | `update-row` | `{ id, ...updates }` |
| `move_card` | `kanban` | `id`: string, `targetColumn`: string | `move-card` | `{ id, targetColumn }` |
| cualquier otro nombre | cualquiera | cualquier cosa | `custom` | los argumentos, si los hay |

Una respuesta con varias llamadas a tools genera una tarjeta por llamada. Cada tarjeta muestra el
antetítulo `confirmRequired`, un título formado a partir del tipo y de `entityNameSingular` (por
defecto `"registro"`), como `"Crear nuevo {entity}"`, `"Actualizar {entity}"`, `"Mover {entity}"` o
`"Acción personalizada"`, una fila por cada clave del payload (con el `label` del campo cuando la clave
coincide con el `id` de un campo) y los botones `cancelCta` y `confirmCta`.

### AIActionEvent

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `type` | `AIActionType` | — | `"create-row" \| "create-card" \| "update-row" \| "move-card" \| "custom"`. |
| `mode` | `AIChatMode` | — | El modo que generó la acción. |
| `payload` | `Record<string, unknown>` | — | Los valores que hay que aplicar, con los valores fijos y por defecto ya incorporados. |
| `rawResponse` | `string` | — | El texto de la respuesta que trajo la acción (a menudo vacío en una llamada a tool). |

Las tools que se ofrecen en modo `table` generan `create-row` y `update-row`; en modo `kanban`,
`create-card`, `update-row` y `move-card`. El tipo se asigna por nombre, así que una llamada a tool
inesperada o el fallback JSON pueden generar cualquier tipo, `custom` incluido, en cualquiera de los
dos modos: ignora los que no manejes.

### Fallback JSON

Algunos modelos escriben la acción como JSON dentro de la respuesta en lugar de llamar a una tool.
Cuando las acciones están activas y ninguna llamada a tool generó una acción, el componente toma el
primer bloque `` ```json `` de la respuesta o, si no lo hay, todo lo que va de la primera `{` a la
última `}`. Si se puede parsear:

- La propiedad `type` o `action` (sin distinguir mayúsculas) define el tipo: `create`, `create_record`
  y `create-row` dan el tipo de creación del modo; `update_record` da `update-row`; `move_card` da
  `move-card`; `create-card`, `update-row` y `move-card` se mantienen; cualquier otro valor es `custom`.
- Sin `type` ni `action`, un objeto `record` indica creación, un objeto `updates` indica `update-row`,
  un `id` de tipo string junto a un `targetColumn` de tipo string (o `target_column`) indica
  `move-card`, y cualquier otra cosa, `custom`.
- El payload es la propiedad `payload`; si no existe, `record`, y si tampoco, el objeto entero. Por eso
  una actualización con la forma `{ id, updates }` llega con `updates` anidado, al contrario que con la
  tool.

El texto de la respuesta se queda en la conversación. Vale cualquier objeto parseable, así que una
respuesta que muestra JSON como ejemplo también genera una tarjeta, normalmente `custom`.

### Ciclo de vida

1. El usuario envía un mensaje: `isLoading` pasa a `true` y el mensaje se añade a la conversación.
2. La petición lleva el prompt de sistema, el historial que elige la estrategia de memoria y las tools.
3. La respuesta llega en streaming (se ve una fila de "pensando" hasta el primer token). Después, las
   llamadas a tools se convierten en acciones pendientes o, si no hay ninguna, se aplica el fallback JSON.
4. Se añade el mensaje del asistente: el texto de la respuesta, `actionProposed` (sin texto, pero con
   acciones de llamadas a tools) o `noResponse` (ni lo uno ni lo otro).
5. Cancelar quita la tarjeta y añade `actionCancelled`. Confirmar la quita, llama a `onAction` y añade
   `actionConfirmed` en cuanto `onAction` retorna, sin esperar a ninguna promesa.

### Ejemplo: persistir una fila creada

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

El modo por defecto es `table` y las acciones están activas. `payload` ya incluye `tenantId: "acme"`, y
`plan: "free"` cuando el modelo no lo indicó.

## Memoria y límites de tokens

`memory` (`AIMemoryConfig`) controla cuánta conversación entra en cada petición. La conversación en
pantalla siempre lo conserva todo.

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `enabled` | `boolean` | `true` | Obligatoria cuando pasas `memory`. `false` se comporta como `strategy: "none"`. |
| `strategy` | `AIHistoryStrategy` | `"sliding-window"` | Qué mensajes se envían. |
| `maxMessages` | `number` | `20` | Tamaño de la ventana en `sliding-window`. |

`DEFAULT_MEMORY_CONFIG` contiene estos valores por defecto. Cada petición lleva el prompt de sistema y,
además:

| Estrategia | Mensajes enviados | Reintento ante un error de longitud de contexto |
|---|---|---|
| `sliding-window` | Los últimos `maxMessages` mensajes (al menos 2), incluido el nuevo. | Uno, con la mitad de la ventana (al menos 2). |
| `minimal` | El último mensaje del asistente y el último del usuario. | Ninguno. |
| `none` | Solo el último mensaje del usuario. También se usa cuando `enabled` es `false`. | Uno, con `minimal`. |

El historial es la conversación completa, incluidos los mensajes de confirmación, cancelación y error
que el componente añade como mensajes del asistente. `applyHistoryStrategy(messages, strategy, maxMessages)`
hace esta selección sobre los message params de `openai`, para un cliente propio. Para caber en una
ventana de contexto pequeña, baja `maxMessages`, reemplaza `rows` por un `summary` corto o baja
`providerConfig.maxTokens`.

`isContextLengthError` decide si se reintenta: busca `context_length_exceeded`,
`maximum context length`, `context window`, `too many tokens`, `prompt is too long` o
`reduce the length` en el mensaje del error, sin distinguir mayúsculas. Los demás errores, y un
reintento fallido, se notifican como se describe en [Errores](#errores).

## Panel lateral y botón

`AIChatSidebar` es un panel fijo en el borde derecho (sus props están en [Referencia](#referencia)).
Sigue montado mientras está cerrado (`data-state="closed"`), así que la conversación sobrevive a
cerrarlo y volver a abrirlo; desmontar el componente la descarta.

- Por debajo de 768px, un overlay cubre la página mientras el panel está abierto; un clic en él llama a
  `onClose`.
- Cuando `open` pasa a `true`, el textarea recibe el foco a los 250 ms, mientras el panel entra
  deslizándose. El deslizamiento solo ocurre con `prefers-reduced-motion: no-preference`.
- El cuerpo hace scroll hasta el final cada vez que cambian los mensajes, el texto en streaming o las
  acciones pendientes.
- Enter envía y Shift+Enter inserta un salto de línea. Mientras carga una respuesta, el textarea y el
  botón de enviar están deshabilitados; el botón de enviar también lo está mientras el campo esté vacío.
- El botón de reinicio (`showResetButton`) borra los mensajes y las acciones pendientes, llama a
  `onResetConversation` y pone el foco en el textarea. Está deshabilitado mientras carga o cuando no hay
  nada que borrar.
- Las respuestas del asistente renderizan un subconjunto de Markdown: encabezados `### `, viñetas `- `,
  elementos numerados `1. `, `**negrita**` y líneas en blanco. Todo lo demás, y todos los mensajes del
  usuario, se muestra como texto plano.
- El estado vacío muestra `emptyState`, campo por campo, por encima de `texts.emptyChatbot` o
  `texts.emptyData` (según el modo), que a su vez van por encima de los valores por defecto de abajo.
  Sus chips salen de `suggestedMessages` (`[]` los oculta), y un clic envía el `prompt` del chip.

| Constante | Valor |
|---|---|
| `DEFAULT_EMPTY_STATE_CHATBOT` | título `"¿En qué puedo ayudarte?"`, descripción `"Escríbeme cualquier pregunta o tarea. Estoy listo para asistirte."` |
| `DEFAULT_EMPTY_STATE_DATA` | título `"Consulta tus datos"`, descripción `"Pregúntame sobre la información disponible. Responderé con contexto y sugerencias accionables."` |
| `DEFAULT_SUGGESTED_MESSAGES_CHATBOT` | chips `"Preséntate"`, `"Dame una idea"`, `"Explica simple"` |
| `DEFAULT_SUGGESTED_MESSAGES_DATA` | chips `"Resumen general"`, `"¿Cuántos registros hay?"`, `"Estadísticas"`, `"Top 5"` |

### Textos

Los textos integrados están en español. `texts` (`AITextOverrides`) reemplaza cualquiera de ellos; las
claves que no pases mantienen el valor de `DEFAULT_TEXTS`.

| Clave | Por defecto | Se usa en |
|---|---|---|
| `placeholder` | `"Pregunta sobre los datos..."` | Placeholder del textarea, en todos los modos. |
| `thinking` | `"Pensando..."` | Fila que aparece antes del primer token. |
| `confirmRequired` | `"Confirmación requerida"` | Antetítulo de la tarjeta de acción. |
| `confirmCta` | `"Confirmar"` | Botón de confirmar. |
| `cancelCta` | `"Cancelar"` | Botón de cancelar. |
| `actionConfirmed` | `"Acción confirmada. Ejecuté el evento en el componente padre."` | Mensaje después de confirmar. |
| `actionCancelled` | `"Acción cancelada. No realicé ningún cambio."` | Mensaje después de cancelar. |
| `resetTooltip` | `"Nueva conversación"` | Título y nombre accesible del botón de reinicio. |
| `missingApiKey` | `"No se encontró API key. Configura tu proveedor para usar el asistente."` | Error cuando `apiKey` está vacía. |
| `genericError` | `"No se pudo completar la consulta al proveedor AI."` | Mensaje de error cuando el fallo no es un `Error`. |
| `noResponse` | `"No encontré una respuesta para esta solicitud."` | Respuesta sin texto y sin acción. |
| `actionProposed` | `"Te propuse una acción. Revísala y confirma si deseas ejecutarla."` | Respuesta sin texto pero con acciones. |
| `emptyChatbot` | `DEFAULT_EMPTY_STATE_CHATBOT` | Estado vacío en modo chatbot. |
| `emptyData` | `DEFAULT_EMPTY_STATE_DATA` | Estado vacío en los modos de datos. |

Algunos textos no están en `texts`: los nombres accesibles de los botones de cerrar y enviar
(`"Cerrar"`, `"Enviar"`), los títulos de las tarjetas de acción, la línea `"Sin datos para mostrar."`
de una tarjeta con el payload vacío y los prefijos de error que aparecen en [Errores](#errores).

### AIChatButton

`AIChatButton` renderiza un botón outline con un icono de destellos y una etiqueta. Acepta cualquier
atributo de `<button>` (`type` vale `"button"` por defecto) y además `label` (`string`, por defecto
`"AI"`). La etiqueta se oculta por debajo de 640px, donde solo se ve el icono, así que pasa `aria-label`
para conservar un nombre accesible. `DataTable` y `KanbanBoard` renderizan su propio botón de asistente
con `aiButton` (consulta [toolbar.es.md](toolbar.es.md)); usa `AIChatButton` en cualquier otro sitio.

## useAIChat

`useAIChat(config)` gestiona la conversación sin ninguna UI. `providerConfig`, `dataSchema`, `memory`,
`texts`, `onAction` y `onError` funcionan igual que en `AIChatSidebar`; `systemPrompt` (se envía tal
cual) y `mode` son obligatorios; `enableActions` vale `true` por defecto en cualquier modo salvo
`chatbot`, incluso sin `dataSchema`. El tipo de la configuración no se exporta con nombre: usa
`Parameters<typeof useAIChat>[0]`.

| Valor devuelto | Tipo | Descripción |
|---|---|---|
| `messages` | `AIChatMessage[]` | La conversación. |
| `pendingActions` | `AIPendingAction[]` | Acciones a la espera de una decisión. Renderízalas con tus propios botones de confirmar y cancelar. |
| `isLoading` | `boolean` | Hay una petición en curso. |
| `streamingContent` | `string` | Texto recibido en streaming hasta el momento; vacío cuando no hay ninguna petición. |
| `sendMessage` | `(text: string) => Promise<void>` | Quita los espacios de los extremos y envía. No hace nada si el texto está vacío o hay una petición en curso. |
| `confirmAction` | `(actionId: string) => void` | Quita la acción y llama a `onAction`. |
| `rejectAction` | `(actionId: string) => void` | Quita la acción sin llamar a `onAction`. |
| `resetConversation` | `() => void` | Borra los mensajes, las acciones pendientes y el texto en streaming. |
| `clearMessages` | `() => void` | Igual que `resetConversation`. |

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

## Errores

`onError` recibe todos los fallos. El componente también añade un mensaje a la conversación, para que
el usuario vea el problema sin código extra, y devuelve `isLoading` a `false`.

- **Falta la API key.** Si `apiKey` está vacía, no se hace ninguna petición y el mensaje del usuario no
  se añade. `onError` recibe un `Error` cuyo mensaje, `texts.missingApiKey`, también aparece en la
  conversación.
- **Fallo del proveedor.** El error del SDK (después del reintento por longitud de contexto, cuando
  corresponde) va a `onError`; un valor lanzado que no es un `Error` se convierte en
  `new Error(texts.genericError)`. La conversación muestra `"Ocurrió un error: "` seguido del mensaje.
- **Respuesta vacía.** Una respuesta sin texto y sin acción añade `texts.noResponse`. No es un error.
- **`onAction` lanza una excepción.** Una excepción síncrona va a `onError` y añade
  `"No pude confirmar la acción: "` seguido del mensaje; para entonces la tarjeta ya no está. Una
  promesa rechazada de un handler async no se captura, así que gestiona los errores dentro del handler.

## Estilos

Los tokens y los temas claro y oscuro se explican en [theming.es.md](theming.es.md), y todos los
ganchos, selectores de estado y tokens aparecen en [style-hooks.es.md](style-hooks.es.md).

| Zona | Ganchos |
|---|---|
| Botón | `gdy-ai-button`, `gdy-ai-button-icon`, `gdy-ai-button-label` |
| Panel | `gdy-ai-overlay`, `gdy-ai-sidebar` |
| Encabezado | `gdy-ai-header`, `gdy-ai-header-badge`, `gdy-ai-header-icon`, `gdy-ai-heading`, `gdy-ai-title`, `gdy-ai-subtitle`, `gdy-ai-reset`, `gdy-ai-reset-icon`, `gdy-ai-close`, `gdy-ai-close-icon` |
| Cuerpo | `gdy-ai-body`, `gdy-ai-empty`, `gdy-ai-empty-badge`, `gdy-ai-empty-icon`, `gdy-ai-empty-text`, `gdy-ai-empty-title`, `gdy-ai-empty-description`, `gdy-ai-chips`, `gdy-ai-chip`, `gdy-ai-end` |
| Mensajes | `gdy-ai-message`, `gdy-ai-avatar`, `gdy-ai-avatar-icon`, `gdy-ai-bubble`, `gdy-ai-text`, `gdy-ai-thinking`, `gdy-ai-thinking-content`, `gdy-ai-thinking-icon`, `gdy-ai-thinking-label` |
| Markdown | `gdy-ai-markdown`, `gdy-ai-md-heading`, `gdy-ai-md-item`, `gdy-ai-md-bullet`, `gdy-ai-md-number`, `gdy-ai-md-item-text`, `gdy-ai-md-paragraph`, `gdy-ai-md-text`, `gdy-ai-md-strong`, `gdy-ai-md-gap` |
| Tarjeta de acción | `gdy-ai-action-card`, `gdy-ai-action-header`, `gdy-ai-action-kicker`, `gdy-ai-action-title`, `gdy-ai-action-fields`, `gdy-ai-action-field`, `gdy-ai-action-field-label`, `gdy-ai-action-required`, `gdy-ai-action-field-value`, `gdy-ai-action-empty`, `gdy-ai-action-actions`, `gdy-ai-action-cancel`, `gdy-ai-action-confirm` |
| Pie | `gdy-ai-footer`, `gdy-ai-input-wrapper`, `gdy-ai-textarea`, `gdy-ai-send`, `gdy-ai-send-icon` |

| Elemento | Atributo de estado | Valores |
|---|---|---|
| `gdy-ai-sidebar` | `data-state` | `"open"`, `"closed"` |
| `gdy-ai-body` | `data-empty` | Presente mientras la conversación está vacía. |
| `gdy-ai-message`, `gdy-ai-bubble` | `data-role` | `"user"`, `"assistant"` |
| `gdy-ai-message` | `data-streaming`, `data-thinking` | Presentes en la respuesta que llega en streaming y en la fila de "pensando". |
| `gdy-ai-action-card` | `data-action-type` | Un valor de `AIActionType`. |
| `gdy-ai-md-item` | `data-list` | `"unordered"`, `"ordered"` |

La librería no define los tokens del componente: cada uno se lee con un fallback, así que declara solo
los que necesites, en `:root` o en un ancestro común para llegar también a `AIChatButton` (se renderiza
fuera del panel), por ejemplo `:root { --gdy-ai-accent: #0f766e; }`.

| Token | Fallback | Se usa en |
|---|---|---|
| `--gdy-ai-accent` | `--gdy-primary` | Iconos, avatar, chips, borde y antetítulo de la tarjeta, botón, burbuja del usuario. |
| `--gdy-ai-accent-fg` | `--gdy-primary-foreground` | Texto de la burbuja del usuario. |
| `--gdy-ai-bg` | `--gdy-background` | Fondo del panel y del pie. |
| `--gdy-ai-user-bubble-bg` | `--gdy-ai-accent` | Fondo de la burbuja del usuario. |
| `--gdy-ai-user-bubble-fg` | `--gdy-ai-accent-fg` | Texto de la burbuja del usuario. |
| `--gdy-ai-assistant-bubble-bg` | `--gdy-muted` al 60% | Burbujas del asistente y fila de "pensando". |
| `--gdy-ai-assistant-bubble-fg` | `--gdy-foreground` | Texto de las burbujas del asistente. |

Las reglas de la librería tienen la especificidad de una clase y las variantes de `data-role` van dentro
de `:where()`, así que una clase tuya gana cuando tu hoja de estilos se carga después de
`gridory/styles.css`. Los ganchos del botón, de enviar, de cancelar y de confirmar van sobre el
`gdy-button` compartido y usan dos clases (`.gdy-button.gdy-ai-send`); iguala esa especificidad para
sobrescribirlos. `className` y los [slots de `classNames`](#otros-tipos) añaden tus propias clases junto
a estos ganchos, por ejemplo `classNames={{ assistantBubble: "support-bubble" }}`.

## Referencia

| Prop de `AIChatSidebarProps` | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `open` | `boolean` | — | Muestra u oculta el panel. |
| `onClose` | `() => void` | — | Botón de cerrar y clic en el overlay. |
| `providerConfig` | `AIProviderConfig` | — | Endpoint, clave y modelo. |
| `mode` | `AIChatMode` | — | `"table"` con `dataSchema`, `"chatbot"` sin él. |
| `dataSchema` | `AIDataSchema` | — | Entidad, campos y filas para los modos de datos. |
| `systemPrompt` | `string` | — | Reemplaza el prompt generado. |
| `chatbotPrompt` | `string` | — | Se añade al prompt base en modo chatbot. |
| `suggestedMessages` | `AISuggestedMessage[]` | — | Chips del estado vacío. Hay valores por defecto según el modo; `[]` los oculta. |
| `title` | `string` | `"Asistente AI"` | Título del encabezado. |
| `subtitle` | `string` | — | Subtítulo del encabezado. Por defecto, `"{rows.length} registros · {entityName}"` con `dataSchema`; si no, `"Chat asistido"` (chatbot) o `"Asistente contextual"`. |
| `emptyState` | `AIEmptyState` | — | Título, descripción e icono antes del primer mensaje. |
| `texts` | `AITextOverrides` | — | Reemplazos de textos (consulta [Textos](#textos)). |
| `enableActions` | `boolean` | — | `true` cuando el modo no es `chatbot` y hay `dataSchema`. |
| `onAction` | `(event: AIActionEvent) => void` | — | Se llama cuando el usuario confirma una acción. |
| `onError` | `(error: Error) => void` | — | Se llama en cada fallo. |
| `onResetConversation` | `() => void` | — | Se llama después de que el botón de reinicio limpia el chat. |
| `memory` | `AIMemoryConfig` | `DEFAULT_MEMORY_CONFIG` | Historial que se envía con cada petición. |
| `showResetButton` | `boolean` | `true` | Muestra el botón de nueva conversación en el encabezado. |
| `className` | `string` | — | Clase en la raíz del panel. |
| `classNames` | `AIChatClassNames` | — | Clases por elemento. |
| `width` | `number \| string` | `380` | Ancho del panel; un número se toma en píxeles. La hoja de estilos lo limita a `90vw`. |

### Otros tipos

| Nombre | Prop | Tipo | Descripción |
|---|---|---|---|
| `AIChatClassNames` | `root` | `string` | Se añade a `gdy-ai-sidebar`, igual que `className`. |
| `AIChatClassNames` | `header`, `body`, `footer`, `chip`, `inputWrapper`, `textarea` | `string` | Se añaden a `gdy-ai-header`, `gdy-ai-body`, `gdy-ai-footer`, cada `gdy-ai-chip`, `gdy-ai-input-wrapper` y `gdy-ai-textarea`. |
| `AIChatClassNames` | `userBubble`, `assistantBubble` | `string` | Se añaden al `gdy-ai-bubble` de los mensajes del usuario o del asistente (incluido el que llega en streaming). |
| `AIChatMessage` | `id` | `string` | Id único. |
| `AIChatMessage` | `role` | `"user" \| "assistant" \| "system"` | El componente solo crea `"user"` y `"assistant"`. |
| `AIChatMessage` | `content` | `string` | Texto del mensaje. |
| `AIChatMessage` | `timestamp` | `number` | Momento de creación en milisegundos (`Date.now()`). |
| `AIChatMessage` | `metadata` | `Record<string, unknown>` | Opcional y de forma libre; el componente no lo rellena. |
| `AIPendingAction` | todas las de `AIActionEvent` | — | Consulta [AIActionEvent](#aiactionevent). |
| `AIPendingAction` | `id` | `string` | Pásalo a `confirmAction` o `rejectAction`. |
| `AIPendingAction` | `title` | `string` | Opcional; la tarjeta integrada forma su propio título y no lo lee. |
| `AISuggestedMessage` | `label` | `string` | Texto del chip. |
| `AISuggestedMessage` | `prompt` | `string` | Mensaje que se envía al hacer clic en el chip. |
| `AIEmptyState` | `title`, `description` | `string` | Encabezado y texto opcionales. |
| `AIEmptyState` | `icon` | `ReactNode` | Opcional; reemplaza el icono de bot por defecto. |
| `AIFieldOption` | `value` | `string` | Valor en el `enum` de la tool y en el payload. |
| `AIFieldOption` | `label` | `string` | Etiqueta que ve el modelo en el prompt. |
| `AIChatMode` | unión | `"chatbot" \| "table" \| "kanban"` | Modo del panel. |
| `AIFieldType` | unión | `"text" \| "number" \| "date" \| "select" \| "boolean"` | Tipo de campo. |
| `AIHistoryStrategy` | unión | `"sliding-window" \| "minimal" \| "none"` | Estrategia de memoria. |
| `AIActionType` | unión | `"create-row" \| "create-card" \| "update-row" \| "move-card" \| "custom"` | Tipo de acción. |
| `AIProviderPreset` | unión | `"openai" \| "gemini" \| "openrouter" \| "groq" \| "together" \| "deepseek" \| "ollama"` | Claves de `AI_PROVIDER_PRESETS`. |
