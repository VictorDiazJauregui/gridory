import { cn } from "../../../lib/cn";

interface CountrySelectValueProps {
  text: string;
  isPlaceholder: boolean;
  className?: string;
}

export const CountrySelectValue = ({ text, isPlaceholder, className }: CountrySelectValueProps) => (
  <span className={cn("gdy-country-select-value", className)} data-placeholder={isPlaceholder ? "" : undefined}>
    {text}
  </span>
);
