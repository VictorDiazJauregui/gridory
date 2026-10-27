export const DEFAULT_LOADING_ROW_COUNT = 5;

export const resolveLoadingRowCount = (count: number | undefined) =>
  Math.max(0, Math.floor(count ?? DEFAULT_LOADING_ROW_COUNT));

// Spread on the root only while loading, so the markup without `loading` stays as it was.
export const buildLoadingRootAttributes = (loading: boolean | undefined) =>
  loading ? { "aria-busy": true, "data-loading": "" } : {};

export const buildPlaceholderKeys = (count: number) =>
  Array.from({ length: count }, (_, index) => `placeholder-${index}`);
