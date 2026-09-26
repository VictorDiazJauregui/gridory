import type { CountryCode } from "./country-codes";

export type FlagUrlResolver = (code: CountryCode, width: number) => string;

export const resolveFlagcdnUrl: FlagUrlResolver = (code, width) =>
  `https://flagcdn.com/w${width}/${code.toLowerCase()}.png`;

export interface CountryFlagSettings {
  visible: boolean;
  resolveUrl: FlagUrlResolver;
}

export const DEFAULT_COUNTRY_FLAG_SETTINGS: CountryFlagSettings = {
  visible: true,
  resolveUrl: resolveFlagcdnUrl,
};
