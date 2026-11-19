import { cn } from "../../../lib/cn";
import type { CountryCode } from "./country-codes";
import { resolveFlagcdnUrl, type FlagUrlResolver } from "./country-flag-url";

const FLAG_WIDTH = 20;
const FLAG_HEIGHT = 15;
const HIGH_DENSITY_FLAG_WIDTH = FLAG_WIDTH * 2;

export interface CountryFlagProps {
  code: CountryCode;
  /** Alternative text. Empty by default: next to the country name the flag is decoration. */
  label?: string;
  /** Builds the image URL. flagcdn.com by default. */
  flagUrl?: FlagUrlResolver;
  className?: string;
}

export const CountryFlag = ({ code, label, flagUrl = resolveFlagcdnUrl, className }: CountryFlagProps) => (
  <img
    className={cn("gdy-country-flag", className)}
    src={flagUrl(code, FLAG_WIDTH)}
    srcSet={`${flagUrl(code, HIGH_DENSITY_FLAG_WIDTH)} 2x`}
    width={FLAG_WIDTH}
    height={FLAG_HEIGHT}
    alt={label ?? ""}
    loading="lazy"
    decoding="async"
  />
);
