import { useDemoText } from "../shared/demo-dictionary";

interface ColumnLoadMoreProps {
  loaded: number;
  total: number;
  onLoadMore: () => void;
}

// The demo's own footer: the board only places it under the cards of each column.
export const ColumnLoadMore = ({ loaded, total, onLoadMore }: ColumnLoadMoreProps) => {
  const translate = useDemoText();
  return (
    <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
      <span>{`${loaded} ${translate("de")} ${total}`}</span>
      {loaded < total ? (
        <button type="button" onClick={onLoadMore} className="rounded-md border px-2 py-1 text-foreground hover:bg-muted">
          {translate("Cargar más")}
        </button>
      ) : null}
    </div>
  );
};
