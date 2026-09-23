import { CalendarClock, LayoutList } from "lucide-react";
import type { HeaderSelectConfig, ToggleGroupConfig } from "../../table";

const COUNTRY_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "Chile", label: "Chile" },
  { value: "México", label: "México" },
  { value: "Argentina", label: "Argentina" },
  { value: "Perú", label: "Perú" },
];

const BRAND_OPTIONS = [
  { value: "all", label: "Todas" },
  { value: "Boreal", label: "Boreal" },
  { value: "Glacial", label: "Glacial" },
  { value: "Arctic", label: "Arctic" },
];

type ValueChangeHandler = (value: string) => void;

export const buildScopeToggleGroup = (
  value: string,
  onChange: ValueChangeHandler,
): ToggleGroupConfig => ({
  id: "scope",
  ariaLabel: "Alcance temporal",
  value,
  onChange,
  options: [
    { value: "all", label: "Todas", icon: <LayoutList size={14} /> },
    { value: "recent", label: "2026", icon: <CalendarClock size={14} /> },
  ],
});

export const buildCountrySelector = (
  value: string,
  onChange: ValueChangeHandler,
): HeaderSelectConfig => ({
  id: "country",
  label: "País",
  value,
  onChange,
  options: COUNTRY_OPTIONS,
});

export const buildBrandSelector = (
  value: string,
  onChange: ValueChangeHandler,
): HeaderSelectConfig => ({
  id: "brand",
  label: "Marca",
  value,
  onChange,
  options: BRAND_OPTIONS,
});
