// The demo keeps the user's widths in localStorage, the recipe of docs/table.md: the table only reports them.
const STORAGE_KEY = "gridory-demo-column-widths";

const isWidthMap = (value: unknown): value is Record<string, number> =>
  typeof value === "object" &&
  value !== null &&
  Object.values(value).every((width) => typeof width === "number" && Number.isFinite(width));

export const readStoredColumnWidths = (): Record<string, number> => {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return {};
  try {
    const parsed: unknown = JSON.parse(stored);
    return isWidthMap(parsed) ? parsed : {};
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    // A value another version of the demo left behind: start again from the declared widths.
    return {};
  }
};

export const storeColumnWidths = (widths: Record<string, number>) => {
  if (Object.keys(widths).length === 0) window.localStorage.removeItem(STORAGE_KEY);
  else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(widths));
};
