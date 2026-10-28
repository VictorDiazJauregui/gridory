import type { RowActions } from "../../shared/data-model";
import type { MenuItem } from "../../shared/menu/menu-nodes";
import {
  isRowActionSubmenu,
  type RowAction,
  type RowActionEntry,
  type RowActionLabel,
} from "../../shared/menu/row-action";
import type { MockCompanyRow } from "../company/company-rows";
import { translateDemoText } from "./demo-dictionary";

type CompanyLabel = RowActionLabel<MockCompanyRow>;

const toEnglish = (text: string) => translateDemoText(text, "en");

const localizeLabel = (label: CompanyLabel): CompanyLabel =>
  typeof label === "function" ? (row) => toEnglish(label(row)) : toEnglish(label);

const localizeAction = (action: RowAction<MockCompanyRow>) => ({ ...action, label: localizeLabel(action.label) });

const localizeEntry = <TEntry extends RowActionEntry<MockCompanyRow>>(entry: TEntry): TEntry => {
  if (!isRowActionSubmenu(entry)) return localizeAction(entry) as TEntry;
  const { items } = entry;
  const localizedItems =
    typeof items === "function" ? (row: MockCompanyRow) => items(row).map(localizeAction) : items.map(localizeAction);
  return { ...entry, label: localizeLabel(entry.label), items: localizedItems };
};

const localizeMenuItem = (item: MenuItem<MockCompanyRow>): MenuItem<MockCompanyRow> => {
  if (item.kind === "label") return { ...item, label: toEnglish(item.label) };
  if (item.kind === "builtin" || item.kind === "separator") return item;
  return localizeEntry(item);
};

export const localizeRowActions = (actions: RowActions<MockCompanyRow> | undefined) =>
  actions && {
    ...actions,
    columnLabel: actions.columnLabel && toEnglish(actions.columnLabel),
    triggerLabel: actions.triggerLabel && toEnglish(actions.triggerLabel),
    customActions: actions.customActions?.map(localizeEntry),
    menuActions: actions.menuActions?.map(localizeMenuItem),
  };
