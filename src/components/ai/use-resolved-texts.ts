import { useMemo } from "react";
import { DEFAULT_TEXTS } from "./constants";
import type { AITextOverrides } from "./types";

const resolveTexts = (texts: AITextOverrides | undefined) => ({
  ...DEFAULT_TEXTS,
  ...texts,
});

export type ResolvedTexts = ReturnType<typeof resolveTexts>;

export const useResolvedTexts = (
  texts: AITextOverrides | undefined,
): ResolvedTexts => useMemo(() => resolveTexts(texts), [texts]);
