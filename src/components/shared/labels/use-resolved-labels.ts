import { useMemo } from "react";
import { applyPropDefaults } from "../prop-defaults";

/** Memoized per `labels` object, so columns and menus that read the labels rebuild only when it changes. */
export const useResolvedLabels = <TLabels extends object>(defaults: TLabels, labels: Partial<TLabels> | undefined) =>
  useMemo(() => applyPropDefaults(defaults, labels ?? {}), [defaults, labels]);
