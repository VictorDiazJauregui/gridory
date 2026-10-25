import { useState } from "react";
import type { MarkdownDialogTexts } from "../types";
import { findUrlProblem, normalizeUrl, type UrlProblem } from "./url-policy";

const PROBLEM_TEXTS: Record<UrlProblem, keyof MarkdownDialogTexts> = {
  missing: "missingUrl",
  invalid: "invalidUrl",
  unsafe: "unsafeUrl",
};

export const useUrlField = (texts: MarkdownDialogTexts, initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  const [showsProblem, setShowsProblem] = useState(false);
  const problem = findUrlProblem(value);
  return {
    value,
    setValue,
    normalized: normalizeUrl(value),
    error: showsProblem && problem ? (texts[PROBLEM_TEXTS[problem]] as string) : null,
    validate: () => {
      setShowsProblem(true);
      return problem === null;
    },
  };
};
