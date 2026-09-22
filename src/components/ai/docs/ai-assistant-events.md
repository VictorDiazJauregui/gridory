# AI Assistant — Eventos y prompts

Este documento describe el contrato de eventos que `AIChatSidebar` dispara hacia el componente consumidor y cómo se genera el system prompt por modo.

---

## Eventos

### `onAction(event: AIActionEvent)`

Se dispara cuando el usuario confirma una propuesta de acción en la tarjeta interactiva. El payload ya viene **mergeado con los `fixedValue` y `defaultValue`** declarados en el schema.

```ts
interface AIActionEvent {
  type: AIActionType;
  mode: AIChatMode;
  payload: Record<string, unknown>;
  rawResponse: string;
}

type AIActionType =
  | "create-row"
  | "create-card"
  | "update-row"
  | "move-card"
  | "custom";
```

| `type`        | Cuándo se dispara                                                            | `payload`                                                               |
| ------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `create-row`  | El modelo llamó `create_record` en modo `table`.                             | Objeto con los campos del schema (`{ name, country, ...fixedValues }`). |
| `create-card` | El modelo llamó `create_record` en modo `kanban`.                            | Igual a `create-row`.                                                   |
| `update-row`  | El modelo llamó `update_record`.                                             | `{ id, ...fieldsActualizados }`.                                        |
| `move-card`   | El modelo llamó `move_card` (solo modo kanban).                              | `{ id, targetColumn }`.                                                 |
| `custom`      | El modelo produjo una tool call desconocida o un JSON estructurado fallback. | Los argumentos tal como los devolvió el modelo.                         |

### `onError(error: Error)`

Se dispara cuando:

- No hay `apiKey` configurada.
- El proveedor responde con error (CORS, 401, 429, 500, context_length_exceeded tras todos los reintentos).
- Ocurre una excepción al confirmar una acción (`onAction` tira).

Los errores de CORS hacia Gemini directo desde navegador se normalizan con un mensaje explicativo que sugiere usar proxy Vite.

### `onResetConversation()`

Se dispara después de limpiar el chat por el botón de "Nueva conversación" (o por llamada programática a `resetConversation()` si usas el hook directo).

### `onClose()`

Se dispara al clickear el botón X del header o el backdrop oscuro (móvil).

---

## System prompt por modo

El prompt que se envía al modelo se arma en este orden de precedencia:

1. Si el consumidor pasa `systemPrompt`, se usa tal cual (máxima prioridad).
2. Si no, y `mode === "chatbot"`, se usa `buildChatbotSystemPrompt(chatbotPrompt?)`.
3. Si no, y hay `dataSchema`, se usa `buildTableSystemPrompt(schema)` o `buildKanbanSystemPrompt(schema)` según `mode`.
4. Si no hay schema ni prompt, cae al prompt chatbot base.

### `buildChatbotSystemPrompt(customPrompt?)`

Base:

> Eres un asistente AI útil, preciso y conciso. Responde siempre en español con Markdown breve y claro cuando aporte valor. Si no tienes información suficiente, pide aclaraciones en lugar de inventar.

Si pasas `customPrompt`, se concatena al final separado por doble salto de línea.

### `buildTableSystemPrompt(schema, customPrompt?)` / `buildKanbanSystemPrompt(schema, customPrompt?)`

Ambos incluyen:

- Rol del asistente ("Eres un asistente experto analizando tablas/kanban…").
- Detalle del schema: `entityName`, `entityNameSingular`, cada field con tipo, descripción, opciones, requerido, `fixedValue` (como "valor obligatorio y fijo"), `defaultValue` (como "valor sugerido").
- Resumen de filas (si pasas `rows` y no hay `summary` custom): total, muestra de 8 filas, estadísticas numéricas de los primeros 50 registros.
- Reglas:
  - Responde siempre en español.
  - Usa Markdown legible y directo.
  - Sé claro cuando no haya datos suficientes.
  - Respeta siempre los valores obligatorios y fijos.
- `extraInstructions` del schema (si existe).
- Instrucción de usar `create_record` / `update_record` (y `move_card` en kanban).
- `customPrompt` al final si se provee.

---

## Tool definitions (OpenAI)

En modo `table`:

- `create_record(record: object)` — todos los campos del schema con `required` y `fixedValue` como `const`.
- `update_record(id: string, updates: object)` — mismo schema parcial.

En modo `kanban` se suma:

- `move_card(id: string, targetColumn: string)`.

En modo `chatbot` no se envían tools (el modelo no puede proponer acciones).

---

## Ciclo de vida de una acción

1. Usuario escribe: "Crea una empresa llamada Boreal en Chile".
2. El modelo responde con un tool call `create_record({ record: { name: "Boreal", country: "Chile", ... } })`.
3. El hook mapea el tool call a `AIPendingAction` (mergea `fixedValue` / `defaultValue`) y lo agrega al estado `pendingActions`.
4. La UI renderiza `ActionConfirmCard` con título, payload visible y botones Confirmar / Cancelar.
5. Al confirmar, se dispara `onAction(event)` y se remueve de pending.
6. Al cancelar, solo se remueve; `onAction` NO se dispara.
