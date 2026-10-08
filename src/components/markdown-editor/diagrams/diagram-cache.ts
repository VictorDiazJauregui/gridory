export type DiagramOutcome = { svg: string } | { error: string };

const MAX_CACHED_DIAGRAMS = 50;

const cachedOutcomes = new Map<string, DiagramOutcome>();

const toCacheKey = (themeKey: string, source: string): string => `${themeKey}\n${source}`;

export const readCachedDiagram = (themeKey: string, source: string): DiagramOutcome | undefined =>
  cachedOutcomes.get(toCacheKey(themeKey, source));

export const cacheDiagram = (themeKey: string, source: string, outcome: DiagramOutcome): void => {
  cachedOutcomes.set(toCacheKey(themeKey, source), outcome);
  const oldestKey = cachedOutcomes.keys().next().value;
  if (cachedOutcomes.size > MAX_CACHED_DIAGRAMS && oldestKey !== undefined) cachedOutcomes.delete(oldestKey);
};
