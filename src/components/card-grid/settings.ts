import type { ReactNode } from "react";
import { applyPropDefaults, resolveCalendarYearDefaults } from "../shared/prop-defaults";
import type { DateInputFormat } from "../shared/data-model";
import { DEFAULT_PAGE_SIZES } from "../table/constants";
import { DEFAULT_CARD_GRID_FEATURES, DEFAULT_CARD_GRID_PAGE_SIZE } from "./constants";
import type { CardGridFeatures, CardGridLabels, CardGridProps } from "./types";

interface CardGridDefaults {
  searchPlaceholder: string;
  createLabel: string;
  emptyMessage: ReactNode;
  pageSizeOptions: number[];
  defaultPageSize: number;
  thinScrollbars: boolean;
  dateFilterRequireOperator: boolean;
  dateInputFormat: DateInputFormat;
  calendarMonthYearDropdown: boolean;
  calendarFromYear: number;
  calendarToYear: number;
}

export type CardGridSettings<TData> = CardGridProps<TData> &
  CardGridDefaults & { labels: CardGridLabels; flags: Required<CardGridFeatures> };

// The single-text props predate `labels` in the other views: they default to their key and still win over it.
const resolveCardGridDefaults = (labels: CardGridLabels): CardGridDefaults => ({
  searchPlaceholder: labels.searchPlaceholder,
  createLabel: labels.createButton,
  emptyMessage: labels.emptyMessage,
  pageSizeOptions: DEFAULT_PAGE_SIZES,
  defaultPageSize: DEFAULT_CARD_GRID_PAGE_SIZE,
  thinScrollbars: true,
  dateFilterRequireOperator: true,
  dateInputFormat: "dd/mm/yyyy",
  calendarMonthYearDropdown: true,
  ...resolveCalendarYearDefaults(),
});

export const resolveCardGridSettings = <TData>(
  props: CardGridProps<TData>,
  labels: CardGridLabels,
): CardGridSettings<TData> => ({
  ...applyPropDefaults(resolveCardGridDefaults(labels), props),
  labels,
  flags: { ...DEFAULT_CARD_GRID_FEATURES, ...props.features },
});
