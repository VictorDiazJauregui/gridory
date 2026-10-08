export const clampTableSize = (value: number, max: number): number => {
  if (!Number.isFinite(value)) return 1;
  return Math.min(Math.max(Math.trunc(value), 1), max);
};
