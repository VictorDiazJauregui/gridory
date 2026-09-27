import { applyPropDefaults } from "../../shared/prop-defaults";
import { DEFAULT_PHONE_INPUT_TEXTS, PHONE_INPUT_DEFAULTS } from "../constants";
import type { PhoneInputSettings, PhoneInputTexts } from "../types";

export interface PhoneInputResolvedDefaults {
  locale: string;
  showFlags: boolean;
  thinScrollbars: boolean;
}

// Typed wider than the literal constants, so a resolved flag reads as a boolean.
export const applyPhoneInputDefaults = (settings: PhoneInputSettings) =>
  applyPropDefaults<PhoneInputSettings, PhoneInputResolvedDefaults>(PHONE_INPUT_DEFAULTS, settings);

export type ResolvedPhoneInputSettings = ReturnType<typeof applyPhoneInputDefaults>;

export const resolvePhoneInputTexts = (texts: Partial<PhoneInputTexts> = {}): PhoneInputTexts =>
  applyPropDefaults(DEFAULT_PHONE_INPUT_TEXTS, texts);
