import type { CountryCode } from "./country-codes";
import { DEFAULT_COUNTRY_FLAG_SETTINGS, type CountryFlagSettings } from "./country-flag-url";

const FLAG_WIDTH = 20;
const FLAG_HEIGHT = 15;
const HIGH_DENSITY_FLAG_WIDTH = FLAG_WIDTH * 2;

interface CountryFlagProps {
  code: CountryCode;
  settings?: CountryFlagSettings;
  label?: string;
}

// The alt text is empty by default because the country name is rendered next to the flag; a
// label is only needed where the flag stands alone.
export const CountryFlag = ({
  code,
  settings = DEFAULT_COUNTRY_FLAG_SETTINGS,
  label,
}: CountryFlagProps) => {
  if (!settings.visible) return null;
  return (
    <img
      className="gdy-country-flag"
      src={settings.resolveUrl(code, FLAG_WIDTH)}
      srcSet={`${settings.resolveUrl(code, HIGH_DENSITY_FLAG_WIDTH)} 2x`}
      width={FLAG_WIDTH}
      height={FLAG_HEIGHT}
      alt={label ?? ""}
      loading="lazy"
      decoding="async"
    />
  );
};
