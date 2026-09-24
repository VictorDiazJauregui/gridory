import { act, renderHook } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { DEFAULT_TEXTS } from "../components/ai/constants";
import { useAIChat } from "../components/ai/useAIChat";
import type { UseAIChatConfig } from "../components/ai/chat/chat-config";
import {
  contentChunk,
  createCompletion,
  streamOf,
  toolCallChunk,
} from "./fake-openai";

vi.mock("openai", async () => ({
  default: (await import("./fake-openai")).FakeOpenAI,
}));

const PROVIDER = {
  apiKey: "test-key",
  baseURL: "https://provider.test/v1",
  model: "test-model",
};
const CREATE_ROW = { type: "create-row", payload: { name: "Nueva" } };
const UPDATE_ROW = { type: "update-row", payload: { id: "c1", name: "X" } };
const JSON_REPLY = [
  "Propongo esto:",
  "```json",
  '{"type":"create_record","record":{"name":"Otra"}}',
  "```",
].join("\n");

const buildConfig = (
  overrides: Partial<UseAIChatConfig> = {},
): UseAIChatConfig => ({
  providerConfig: PROVIDER,
  systemPrompt: "Eres un asistente de pruebas.",
  mode: "table",
  dataSchema: {
    entityName: "Empresas",
    entityNameSingular: "Empresa",
    fields: [{ id: "name", label: "Nombre", type: "text" }],
  },
  enableActions: true,
  ...overrides,
});

const renderChat = (overrides?: Partial<UseAIChatConfig>) => {
  const config = buildConfig(overrides);
  return renderHook(() => useAIChat(config));
};

const lastMessage = (result: {
  current: { messages: { content: string }[] };
}) => result.current.messages.at(-1)?.content;

beforeEach(() => {
  createCompletion.mockReset();
});

test("rejects sending without an api key", async () => {
  const onError = vi.fn();
  const { result } = renderChat({
    providerConfig: { ...PROVIDER, apiKey: "" },
    onError,
  });
  await act(() => result.current.sendMessage("hola"));
  expect(onError).toHaveBeenCalledWith(
    expect.objectContaining({ message: DEFAULT_TEXTS.missingApiKey }),
  );
  expect(lastMessage(result)).toBe(DEFAULT_TEXTS.missingApiKey);
  expect(createCompletion).not.toHaveBeenCalled();
});

test("streams a text reply into the conversation", async () => {
  createCompletion.mockResolvedValue(
    streamOf([contentChunk("Hola"), contentChunk(" mundo")]),
  );
  const { result } = renderChat();
  await act(() => result.current.sendMessage("hola"));
  expect(createCompletion).toHaveBeenCalledWith(
    expect.objectContaining({ model: "test-model", stream: true }),
  );
  expect(
    result.current.messages.map((message) => [message.role, message.content]),
  ).toEqual([
    ["user", "hola"],
    ["assistant", "Hola mundo"],
  ]);
  expect(result.current.isLoading).toBe(false);
  expect(result.current.streamingContent).toBe("");
});

test("turns a tool call into a pending action and confirms it", async () => {
  createCompletion.mockResolvedValue(
    streamOf([toolCallChunk("create_record", '{"record":{"name":"Nueva"}}')]),
  );
  const onAction = vi.fn();
  const { result } = renderChat({ onAction });
  await act(() => result.current.sendMessage("crea una empresa"));
  const [action] = result.current.pendingActions;
  expect(action).toMatchObject(CREATE_ROW);
  expect(lastMessage(result)).toBe(DEFAULT_TEXTS.actionProposed);
  act(() => result.current.confirmAction(action.id));
  expect(onAction).toHaveBeenCalledWith(
    expect.objectContaining({ ...CREATE_ROW, mode: "table" }),
  );
  expect(result.current.pendingActions).toHaveLength(0);
  expect(lastMessage(result)).toBe(DEFAULT_TEXTS.actionConfirmed);
});

test("drops a pending action when it is rejected", async () => {
  createCompletion.mockResolvedValue(
    streamOf([
      toolCallChunk("update_record", '{"id":"c1","updates":{"name":"X"}}'),
    ]),
  );
  const onAction = vi.fn();
  const { result } = renderChat({ onAction });
  await act(() => result.current.sendMessage("renombra c1"));
  const [action] = result.current.pendingActions;
  expect(action).toMatchObject(UPDATE_ROW);
  act(() => result.current.rejectAction(action.id));
  expect(onAction).not.toHaveBeenCalled();
  expect(result.current.pendingActions).toHaveLength(0);
  expect(lastMessage(result)).toBe(DEFAULT_TEXTS.actionCancelled);
});

test("parses an action from json in the reply without tool calls", async () => {
  createCompletion.mockResolvedValue(streamOf([contentChunk(JSON_REPLY)]));
  const { result } = renderChat();
  await act(() => result.current.sendMessage("crea otra"));
  expect(result.current.pendingActions[0]).toMatchObject({
    type: "create-row",
    payload: { name: "Otra" },
  });
  expect(lastMessage(result)).toBe(JSON_REPLY);
});

test("reports a provider failure and finishes loading", async () => {
  createCompletion.mockRejectedValue(new Error("proveedor caído"));
  const onError = vi.fn();
  const { result } = renderChat({ onError });
  await act(() => result.current.sendMessage("hola"));
  expect(onError).toHaveBeenCalledWith(expect.any(Error));
  expect(lastMessage(result)).toMatch(/^Ocurrió un error: /);
  expect(result.current.isLoading).toBe(false);
});

test("resets the conversation", async () => {
  createCompletion.mockResolvedValue(streamOf([contentChunk("Hola")]));
  const { result } = renderChat();
  await act(() => result.current.sendMessage("hola"));
  expect(result.current.messages).toHaveLength(2);
  act(() => result.current.resetConversation());
  expect(result.current.messages).toEqual([]);
  expect(result.current.pendingActions).toEqual([]);
});
