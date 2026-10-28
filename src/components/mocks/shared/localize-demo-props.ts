import { enUS } from "date-fns/locale";
import type { DataTableProps } from "../../table";
import type { KanbanBoardProps, KanbanGroupOption } from "../../kanban";
import type { ColumnDefinition, FilterOption } from "../../shared/data-model";
import type { HeaderSelectConfig, ToggleGroupConfig } from "../../shared/toolbar-controls";
import type { MockCompanyRow } from "../company/company-rows";
import { describeCompanyNoteInEnglish } from "../table/company-notes";
import { translateDemoText } from "./demo-dictionary";
import type { DemoLanguage } from "./demo-language";
import { ENGLISH_KANBAN_LABELS, ENGLISH_TABLE_LABELS } from "./english-labels";
import { localizeRowActions } from "./localize-row-actions";

type Translate = (text: string) => string;
type CompanyColumn = ColumnDefinition<MockCompanyRow>;

const STATUS_VALUES = ["Activa", "Pendiente", "Archivada"];
const toEnglish: Translate = (text) => translateDemoText(text, "en");

const translateOptions = <TOption extends FilterOption>(options: TOption[] | undefined) =>
  options?.map((option) => ({ ...option, label: toEnglish(option.label) }));

const statusFilterOptions = (column: CompanyColumn) =>
  column.filterOptions ?? STATUS_VALUES.map((value) => ({ value, label: value }));

const formatUsDate = (value: string) => {
  const [year, month, day] = value.split("-");
  return `${month}/${day}/${year}`;
};

// The inline select shows its option labels; a plain status cell shows the raw value.
const localizeStatusColumn = (column: CompanyColumn): Partial<CompanyColumn> => ({
  filterOptions: translateOptions(statusFilterOptions(column)),
  cell: column.inlineEditOptions ? column.cell : (row) => toEnglish(row.status),
});

const localizeColumnContent = (column: CompanyColumn): Partial<CompanyColumn> => {
  if (column.id === "status") return localizeStatusColumn(column);
  if (column.id === "notes") return { accessor: describeCompanyNoteInEnglish };
  if (column.id === "createdAt" && column.cell) return { cell: (row) => formatUsDate(row.createdAt) };
  return {};
};

const localizeColumn = (column: CompanyColumn): CompanyColumn => ({
  ...column,
  header: toEnglish(column.header),
  inlineEditOptions: translateOptions(column.inlineEditOptions),
  ...localizeColumnContent(column),
});

const localizeToggleGroup = (group: ToggleGroupConfig): ToggleGroupConfig => ({
  ...group,
  ariaLabel: group.ariaLabel && toEnglish(group.ariaLabel),
  options: group.options.map((option) => ({ ...option, label: toEnglish(option.label) })),
});

const localizeSelector = (selector: HeaderSelectConfig): HeaderSelectConfig => ({
  ...selector,
  label: selector.label && toEnglish(selector.label),
  options: translateOptions(selector.options) ?? [],
});

// The group tag of a card shows the raw value ("Activa"): the demo translates it as it joins it.
const labeledValueInEnglish = (label: string, value: string) => `${label}: ${toEnglish(value)}`;

const localizeViewProps = <TProps extends DataTableProps<MockCompanyRow> | KanbanBoardProps<MockCompanyRow>>(
  props: TProps,
): TProps => ({
  ...props,
  calendarLocale: enUS,
  createLabel: props.createLabel && toEnglish(props.createLabel),
  rowActions: localizeRowActions(props.rowActions),
  toggleGroups: props.toggleGroups?.map(localizeToggleGroup),
  headerSelectors: props.headerSelectors?.map(localizeSelector),
});

export const localizeTableDemoProps = (props: DataTableProps<MockCompanyRow>, language: DemoLanguage) => {
  if (language === "es") return props;
  return {
    ...localizeViewProps(props),
    columns: props.columns.map(localizeColumn),
    label: props.label && toEnglish(props.label),
    labels: { ...ENGLISH_TABLE_LABELS, labeledValue: labeledValueInEnglish },
  };
};

const localizeGroup = (group: KanbanGroupOption<MockCompanyRow>) => ({
  ...group,
  label: toEnglish(group.label),
  values: translateOptions(group.values),
});

type DropReason = KanbanBoardProps<MockCompanyRow>["getDropDisabledReason"];

const localizeDropReason = (explain: DropReason): DropReason =>
  explain && ((context) => {
    const reason = explain(context);
    return reason && toEnglish(reason);
  });

export const localizeKanbanDemoProps = (props: KanbanBoardProps<MockCompanyRow>, language: DemoLanguage) => {
  if (language === "es") return props;
  return {
    ...localizeViewProps(props),
    fields: props.fields.map(localizeColumn),
    groups: props.groups.map(localizeGroup),
    labels: { ...ENGLISH_KANBAN_LABELS, labeledValue: labeledValueInEnglish },
    getDropDisabledReason: localizeDropReason(props.getDropDisabledReason),
  };
};
