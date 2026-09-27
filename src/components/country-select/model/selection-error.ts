import type { ReactNode } from "react";
import { hasVisibleContent } from "../../shared/field/visible-content";
import type { CountrySelectTexts } from "../types";
import { fillTextTemplate } from "./fill-text-template";
import { isBelowMinimum, type SelectionRange } from "./selection-range";

interface SelectionErrorInput {
  touched: boolean;
  required: boolean;
  selectedCount: number;
  range: SelectionRange;
  texts: Pick<CountrySelectTexts, "required" | "belowMinimum">;
}

/**
 * The control's own error, shown only once it was touched. Empty is an error
 * only when required; a selection below the minimum always is.
 */
export const resolveOwnSelectionError = (input: SelectionErrorInput): string | null => {
  const { touched, required, selectedCount, range, texts } = input;
  if (!touched) return null;
  if (required && selectedCount === 0) return texts.required;
  if (isBelowMinimum(selectedCount, range)) return fillTextTemplate(texts.belowMinimum, { min: range.minSelected });
  return null;
};

/** The app's error always wins over the control's own one. */
export const resolveDisplayedError = (appError: ReactNode, ownError: string | null): ReactNode =>
  hasVisibleContent(appError) ? appError : ownError;
