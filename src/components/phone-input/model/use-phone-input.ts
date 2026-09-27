import { useState } from "react";
import { isCountryCode } from "../../shared/countries/country-codes";
import type { PhoneInputSettings } from "../types";
import { applyPhoneInputDefaults, resolvePhoneInputTexts } from "./phone-input-defaults";
import { useDialCodeCatalog } from "./use-dial-code-catalog";
import { usePhoneValue } from "./use-phone-value";

// Choosing a country closes the list and hands the focus back to the prefix
// (Radix does it); choosing the one already chosen only closes.
export const usePhoneInput = (settings: PhoneInputSettings) => {
  const resolvedSettings = applyPhoneInputDefaults(settings);
  const [open, setOpen] = useState(false);
  const phone = usePhoneValue(settings);
  const catalog = useDialCodeCatalog(resolvedSettings);
  const pickCountry = (code: string) => {
    setOpen(false);
    if (isCountryCode(code)) phone.changeCountry(code);
  };
  return {
    ...phone,
    ...catalog,
    resolvedSettings,
    texts: resolvePhoneInputTexts(settings.texts),
    selectedCountry: catalog.findCountry(phone.value.country),
    panel: { open, changeOpen: setOpen },
    pickCountry,
  };
};

export type PhoneInputView = ReturnType<typeof usePhoneInput>;
