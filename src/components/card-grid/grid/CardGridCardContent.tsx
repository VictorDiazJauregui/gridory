import { DefaultKanbanCardFields } from "../../kanban/card/DefaultKanbanCardFields";
import { DefaultKanbanCardHead } from "../../kanban/card/DefaultKanbanCardHead";
import { KanbanCardMenu } from "../../kanban/card/KanbanCardMenu";
import type { CardGridSettings } from "../settings";

interface CardGridCardContentProps<TData> {
  row: TData;
  settings: CardGridSettings<TData>;
}

const resolveRowActions = <TData,>({ flags, rowActions }: CardGridSettings<TData>) =>
  flags.rowActions ? rowActions : undefined;

const CardGridCustomContent = <TData,>({ row, settings }: CardGridCardContentProps<TData>) => {
  const rowActions = resolveRowActions(settings);
  return (
    <>
      {settings.renderCard?.(row)}
      {rowActions ? (
        <div className="gdy-kanban-card-actions">
          <KanbanCardMenu card={row} rowActions={rowActions} labels={settings.labels} />
        </div>
      ) : null}
    </>
  );
};

// The kanban card without its group tag and without "Move to": a grid has no columns to move to.
export const CardGridCardContent = <TData,>({ row, settings }: CardGridCardContentProps<TData>) => {
  if (settings.renderCard) return <CardGridCustomContent row={row} settings={settings} />;
  return (
    <>
      <DefaultKanbanCardHead card={row} fields={settings.columns} rowActions={resolveRowActions(settings)} labels={settings.labels} />
      <DefaultKanbanCardFields card={row} fields={settings.columns} labels={settings.labels} />
    </>
  );
};
