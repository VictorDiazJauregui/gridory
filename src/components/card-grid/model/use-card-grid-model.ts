import { useViewControls } from "../../shared/controls/use-view-controls";
import { useResolvedLabels } from "../../shared/labels/use-resolved-labels";
import { useVisibleRowsChange } from "../../table/model/use-visible-rows-change";
import { CARD_GRID_LABELS } from "../labels";
import { resolveCardGridSettings } from "../settings";
import type { CardGridProps } from "../types";
import { useCardGridPaging } from "./use-card-grid-paging";
import { useCardGridRows } from "./use-card-grid-rows";

export const useCardGridModel = <TData>(props: CardGridProps<TData>) => {
  const settings = resolveCardGridSettings(props, useResolvedLabels(CARD_GRID_LABELS, props.labels));
  const fieldSettings = { ...settings, fields: settings.columns };
  const viewControls = useViewControls(settings);
  const { visibleRows, filterOptions, rowIds } = useCardGridRows(fieldSettings, viewControls);
  const paging = useCardGridPaging(visibleRows, settings, viewControls);
  useVisibleRowsChange({ pageRows: paging.pageRows, filteredRows: visibleRows }, settings);
  const controls = { ...viewControls, filterOptions };
  return { settings, fieldSettings, controls, visibleRows, rowIds, paging };
};

export type CardGridModel<TData> = ReturnType<typeof useCardGridModel<TData>>;

export interface CardGridModelProps<TData> {
  model: CardGridModel<TData>;
}
