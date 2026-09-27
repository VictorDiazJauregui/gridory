import type { CSSProperties } from "react";

// Restyles the field through its tokens alone: taller, rounder and with the
// primary color on the border and the focus.
export const CUSTOM_PHONE_TOKENS = {
  "--gdy-phone-input-height": "48px",
  "--gdy-phone-input-radius": "9999px",
  "--gdy-phone-input-border": "var(--gdy-primary)",
  "--gdy-phone-input-focus-ring": "var(--gdy-primary)",
  "--gdy-phone-input-gap": "12px",
} as CSSProperties;

export const PHONE_ERROR_MESSAGE = "Ingresa un teléfono válido";
