import { useMemo } from "react";
import type { MarkdownEditorProviderProps } from "../types";
import { useControllableValue } from "./use-controllable-value";

type OutlineStateOptions = Pick<MarkdownEditorProviderProps, "showOutline" | "defaultShowOutline" | "onOutlineChange">;

export const useOutlineState = ({ showOutline, defaultShowOutline = false, onOutlineChange }: OutlineStateOptions) => {
  const [outlineOpen, changeOutline] = useControllableValue({ value: showOutline, defaultValue: defaultShowOutline, onChange: onOutlineChange });
  return useMemo(() => ({ outlineOpen, changeOutline }), [outlineOpen, changeOutline]);
};
