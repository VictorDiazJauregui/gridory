import { cn } from "../../../lib/cn";
import type { CardGridModelProps } from "../model/use-card-grid-model";
import { CardGridCard } from "./CardGridCard";
import { CardGridLoading } from "./CardGridLoading";

const CardGridList = <TData,>({ model }: CardGridModelProps<TData>) => {
  const { settings, paging, rowIds } = model;
  return (
    <ul className={cn("gdy-card-grid-list", settings.classNames?.list)} role="list">
      {paging.pageRows.map((row) => {
        const rowId = rowIds.get(row) ?? "";
        return <CardGridCard key={rowId} row={row} rowId={rowId} settings={settings} />;
      })}
    </ul>
  );
};

export const CardGridBody = <TData,>({ model }: CardGridModelProps<TData>) => {
  const { settings } = model;
  if (settings.loading) return <CardGridLoading settings={settings} />;
  if (model.visibleRows.length === 0) {
    return <div className={cn("gdy-empty", settings.classNames?.empty)}>{settings.emptyMessage}</div>;
  }
  return <CardGridList model={model} />;
};
