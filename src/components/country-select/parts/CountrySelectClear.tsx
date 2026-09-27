import { X } from "lucide-react";
import { cn } from "../../../lib/cn";

interface CountrySelectClearProps {
  label: string;
  className?: string;
  onClear: (clearButton: HTMLElement) => void;
}

export const CountrySelectClear = ({ label, className, onClear }: CountrySelectClearProps) => (
  <button type="button" className={cn("gdy-country-select-clear", className)} aria-label={label} onClick={(event) => onClear(event.currentTarget)}>
    <X size={14} aria-hidden="true" />
  </button>
);
