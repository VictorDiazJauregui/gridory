import { useMemo } from "react";
import { applyPropDefaults } from "../prop-defaults";

/**
 * Merges the consumer's labels over the defaults once per `labels` object: memoized columns and
 * menus that read the labels only rebuild when the consumer passes a new object.
 */
export const useResolvedLabels = <TLabels extends object>(defaults: TLabels, labels: Partial<TLabels> | undefined) =>
  useMemo(() => applyPropDefaults(defaults, labels ?? {}), [defaults, labels]);
