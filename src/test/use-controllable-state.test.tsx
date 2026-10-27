import { act, renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { useControllableState } from "../components/shared/state/use-controllable-state";

type Props = { value?: number; onChange?: (value: number) => void };

const renderState = (initialProps: Props) =>
  renderHook((props: Props) => useControllableState({ ...props, defaultValue: 1, name: "count" }), {
    initialProps,
  });

afterEach(() => {
  vi.restoreAllMocks();
});

test("uncontrolled: keeps its own value and reports every change", () => {
  const onChange = vi.fn();
  const { result } = renderState({ onChange });
  act(() => result.current[1](5));
  expect(result.current[0]).toBe(5);
  expect(onChange).toHaveBeenCalledWith(5);
});

test("controlled: shows the prop, only reports, and follows the prop", () => {
  const onChange = vi.fn();
  const { result, rerender } = renderState({ value: 3, onChange });
  act(() => result.current[1](7));
  expect(result.current[0]).toBe(3);
  expect(onChange).toHaveBeenCalledWith(7);
  rerender({ value: 7, onChange });
  expect(result.current[0]).toBe(7);
});

test("accepts an updater resolved against the current value", () => {
  const onChange = vi.fn();
  const { result } = renderState({ value: 10, onChange });
  act(() => result.current[1]((previous) => previous + 1));
  expect(onChange).toHaveBeenCalledWith(11);
});

test("chains two updates made before the next render", () => {
  const { result } = renderState({});
  act(() => {
    result.current[1]((previous) => previous + 1);
    result.current[1]((previous) => previous + 1);
  });
  expect(result.current[0]).toBe(3);
});

test("an update to the same value does not report", () => {
  const onChange = vi.fn();
  const { result } = renderState({ onChange });
  act(() => result.current[1](1));
  expect(onChange).not.toHaveBeenCalled();
});

test("warns once in development when the mode changes", () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  const { rerender } = renderState({ value: 2 });
  rerender({});
  rerender({ value: 4 });
  expect(warn).toHaveBeenCalledTimes(1);
  expect(warn.mock.calls[0][0]).toContain("`count` changed from controlled to uncontrolled");
});

test("does not warn in a production build", () => {
  vi.stubEnv("NODE_ENV", "production");
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  const { rerender } = renderState({ value: 2 });
  rerender({});
  expect(warn).not.toHaveBeenCalled();
  vi.unstubAllEnvs();
});
