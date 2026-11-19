import { COUNTRY_CODES, type CountryCode } from "./country-codes";
import { DIAL_CODE_BY_COUNTRY } from "./dial-codes";

// Written by hand, not computed: the most populous country or territory of each shared code, so the answer
// never changes between versions or browsers. A test fails when a shared code is missing here.
export const PRIMARY_COUNTRY_BY_SHARED_DIAL_CODE: Readonly<Record<string, CountryCode>> = {
  "+1": "US", "+7": "RU", "+39": "IT", "+44": "GB", "+47": "NO", "+61": "AU", "+64": "NZ",
  "+212": "MA", "+262": "RE", "+358": "FI", "+500": "FK", "+590": "GP", "+599": "CW", "+672": "NF",
};

const DIAL_CODE_FORMAT = /^\+?\d+$/;

const COUNTRY_BY_DIAL_CODE: ReadonlyMap<string, CountryCode> = new Map(
  COUNTRY_CODES.flatMap((code) => {
    const dialCode = DIAL_CODE_BY_COUNTRY[code];
    return dialCode ? [[dialCode, PRIMARY_COUNTRY_BY_SHARED_DIAL_CODE[dialCode] ?? code] as const] : [];
  }),
);

const normalizeDialCode = (dialCode: string): string | undefined => {
  const compact = dialCode.replace(/\s/g, "");
  if (!DIAL_CODE_FORMAT.test(compact)) return undefined;
  return compact.startsWith("+") ? compact : `+${compact}`;
};

/** Country of a dial code, "+" and spaces optional. A shared code gives its fixed representative (+1 → US). */
export const findCountryByDialCode = (dialCode: string): CountryCode | undefined => {
  const normalized = normalizeDialCode(dialCode);
  return normalized ? COUNTRY_BY_DIAL_CODE.get(normalized) : undefined;
};
