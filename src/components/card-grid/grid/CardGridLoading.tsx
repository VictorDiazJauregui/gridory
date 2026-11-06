import { cn } from "../../../lib/cn";
import { buildPlaceholderKeys, resolveLoadingRowCount } from "../../shared/loading/loading-state";
import { SkeletonBar } from "../../shared/loading/SkeletonBar";
import type { CardGridSettings } from "../settings";

interface CardGridLoadingProps<TData> {
  settings: CardGridSettings<TData>;
}

export const CardGridLoading = <TData,>({ settings }: CardGridLoadingProps<TData>) => {
  if (settings.renderLoading) return <div className="gdy-card-grid-loading">{settings.renderLoading()}</div>;
  return (
    <ul className={cn("gdy-card-grid-list", settings.classNames?.list)} role="list">
      {buildPlaceholderKeys(resolveLoadingRowCount(settings.loadingRowCount)).map((key) => (
        <li key={key} className="gdy-kanban-card-skeleton gdy-card-grid-skeleton" aria-hidden="true">
          <SkeletonBar />
          <SkeletonBar />
          <SkeletonBar />
        </li>
      ))}
    </ul>
  );
};
