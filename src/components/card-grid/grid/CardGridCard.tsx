import { cn } from "../../../lib/cn";
import { resolveSafeRowHref } from "../../table/body/row-navigation";
import type { CardGridSettings } from "../settings";
import { buildCardHandlers, hasCardAction } from "./card-navigation";
import { CardGridCardContent } from "./CardGridCardContent";

interface CardGridCardProps<TData> {
  row: TData;
  rowId: string;
  settings: CardGridSettings<TData>;
}

export const CardGridCard = <TData,>({ row, rowId, settings }: CardGridCardProps<TData>) => {
  const { getRowHref, onRowClick, ignoreTextSelectionClick } = settings;
  const navigation = { row, href: resolveSafeRowHref(getRowHref?.(row)), onRowClick, ignoreTextSelectionClick };
  return (
    <li
      className={cn("gdy-kanban-card gdy-card-grid-card", settings.classNames?.card)}
      data-row-id={settings.getRowId ? rowId : undefined}
      data-clickable={hasCardAction(navigation) || undefined}
      data-href={navigation.href}
      {...buildCardHandlers(navigation)}
    >
      <CardGridCardContent row={row} settings={settings} />
    </li>
  );
};
