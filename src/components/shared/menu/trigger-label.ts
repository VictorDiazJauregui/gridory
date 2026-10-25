import type { RowActions } from "../data-model";

const DEFAULT_TRIGGER_LABEL = "Opciones";

/** Accessible name and tooltip of the ⋯ button that opens the row or card actions. */
export const resolveTriggerLabel = <TData,>(actions: RowActions<TData> | undefined) =>
  actions?.triggerLabel ?? DEFAULT_TRIGGER_LABEL;
