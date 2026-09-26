import type { ReactNode } from "react";
import type { AuthCommonTexts, AuthFieldType } from "../types";

export type RequiredMessageTexts = Required<
  Pick<
    AuthCommonTexts,
    | "requiredMessage"
    | "requiredFallback"
    | "checkboxRequired"
    | "selectRequired"
  >
>;

interface RequiredMessageSource {
  label: ReactNode;
  type: AuthFieldType;
  requiredMessage?: string;
}

// "Email" reads "Ingresa tu email", but an acronym such as "DNI" keeps its case.
const toInlineLabel = (label: string): string => {
  const second = label.charAt(1);
  const isAcronym = second !== second.toLowerCase();
  return isAcronym ? label : label.charAt(0).toLowerCase() + label.slice(1);
};

export const resolveRequiredMessage = (
  source: RequiredMessageSource,
  texts: RequiredMessageTexts,
): string => {
  if (source.requiredMessage) return source.requiredMessage;
  if (source.type === "checkbox") return texts.checkboxRequired;
  if (source.type === "select") return texts.selectRequired;
  if (typeof source.label !== "string") return texts.requiredFallback;
  return texts.requiredMessage.replace("{label}", toInlineLabel(source.label));
};
