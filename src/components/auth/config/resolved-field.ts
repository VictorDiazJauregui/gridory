import type { ReactNode } from "react";
import type {
  AuthFieldOption,
  AuthFieldType,
  AuthFieldValue,
  AuthFormValues,
} from "../types";

export type AuthRule = (
  value: AuthFieldValue,
  values: AuthFormValues,
) => string | undefined;

export interface ResolvedAuthField {
  name: string;
  label: ReactNode;
  type: AuthFieldType;
  required: boolean;
  placeholder?: string;
  autoComplete?: string;
  options?: AuthFieldOption[];
  rules: AuthRule[];
}
