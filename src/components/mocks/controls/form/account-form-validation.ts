import type { CountryCode } from "../../../../country-select";
import type { PhoneInputValue } from "../../../../phone-input";

export type AccountCountry = CountryCode | "none" | null;

export interface AccountFormErrors {
  country?: string;
  whatsapp?: string;
}

export const ACCOUNT_COUNTRY_ID = "account-country";
export const ACCOUNT_WHATSAPP_NAME = "whatsapp";

// "none" is the not applicable answer: a valid one, unlike null.
export const validateAccountForm = (country: AccountCountry, whatsapp: PhoneInputValue): AccountFormErrors => ({
  country: country === null ? "Elige un país o indica que no aplica" : undefined,
  whatsapp: whatsapp.number === "" ? "Ingresa un número de WhatsApp" : undefined,
});

/** By id for the country and by name for the number: the two ways a form reaches its first error. */
export const focusFirstError = (form: HTMLFormElement, errors: AccountFormErrors): void => {
  if (errors.country) {
    document.getElementById(ACCOUNT_COUNTRY_ID)?.focus();
    return;
  }
  if (errors.whatsapp) form.querySelector<HTMLElement>(`[name=${ACCOUNT_WHATSAPP_NAME}]`)?.focus();
};
