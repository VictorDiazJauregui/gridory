import type { DataViewLabels } from "../labels/data-view-labels";
import type { RowActions } from "../data-model";

/** Accessible name and tooltip of the ⋯ button that opens the row or card actions. */
export const resolveTriggerLabel = <TData,>(
  actions: RowActions<TData> | undefined,
  labels: Pick<DataViewLabels, "rowActionsTrigger">,
) => actions?.triggerLabel ?? labels.rowActionsTrigger;
