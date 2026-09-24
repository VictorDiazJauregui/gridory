import { vi } from "vitest";

export const createCompletion = vi.fn();

export class FakeOpenAI {
  chat = { completions: { create: createCompletion } };
}

export const streamOf = (chunks: unknown[]) => ({
  async *[Symbol.asyncIterator]() {
    yield* chunks;
  },
});

export const contentChunk = (content: string) => ({
  choices: [{ delta: { content } }],
});

export const toolCallChunk = (name: string, args: string) => ({
  choices: [
    {
      delta: {
        tool_calls: [
          { index: 0, id: "call-1", function: { name, arguments: args } },
        ],
      },
    },
  ],
});
