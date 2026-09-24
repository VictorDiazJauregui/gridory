import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import { AIChatSidebar } from "../components/ai/AIChatSidebar";
import { DEFAULT_TEXTS } from "../components/ai/constants";
import type { AIChatSidebarProps } from "../components/ai/types";
import { contentChunk, createCompletion, streamOf } from "./fake-openai";

vi.mock("openai", async () => ({
  default: (await import("./fake-openai")).FakeOpenAI,
}));

const PROVIDER = {
  apiKey: "test-key",
  baseURL: "https://provider.test/v1",
  model: "test-model",
};

const renderSidebar = (props: Partial<AIChatSidebarProps> = {}) =>
  render(
    <AIChatSidebar
      open
      onClose={vi.fn()}
      providerConfig={PROVIDER}
      suggestedMessages={[{ label: "Resumen", prompt: "Dame un resumen" }]}
      {...props}
    />,
  );

beforeEach(() => {
  createCompletion.mockReset();
});

test("opens with the suggestion chips and the composer", () => {
  const { container } = renderSidebar();
  expect(container.querySelector(".gdy-ai-sidebar")).toHaveAttribute(
    "data-state",
    "open",
  );
  expect(screen.getByRole("button", { name: "Resumen" })).toHaveClass(
    "gdy-ai-chip",
  );
  expect(
    screen.getByPlaceholderText(DEFAULT_TEXTS.placeholder),
  ).toBeInTheDocument();
});

test("sends a chip prompt and shows the reply", async () => {
  createCompletion.mockResolvedValue(streamOf([contentChunk("Listo")]));
  const { container } = renderSidebar();
  fireEvent.click(screen.getByRole("button", { name: "Resumen" }));
  expect(await screen.findByText("Dame un resumen")).toBeInTheDocument();
  expect(await screen.findByText("Listo")).toBeInTheDocument();
  expect(
    container.querySelectorAll(".gdy-ai-message[data-role='user']"),
  ).toHaveLength(1);
  expect(screen.queryByRole("button", { name: "Resumen" })).toBeNull();
});

test("sends the typed message with Enter", async () => {
  createCompletion.mockResolvedValue(streamOf([contentChunk("Claro")]));
  const user = userEvent.setup();
  renderSidebar();
  const textarea = screen.getByPlaceholderText(DEFAULT_TEXTS.placeholder);
  await user.type(textarea, "hola{Enter}");
  expect(await screen.findByText("hola")).toBeInTheDocument();
  expect(await screen.findByText("Claro")).toBeInTheDocument();
  expect(textarea).toHaveValue("");
});

test("closes from the header button and from the overlay", () => {
  const onClose = vi.fn();
  const { container } = renderSidebar({ onClose });
  fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));
  fireEvent.click(container.querySelector(".gdy-ai-overlay") as HTMLElement);
  expect(onClose).toHaveBeenCalledTimes(2);
});
