import { useSyncExternalStore } from "react";

export type DemoLanguage = "es" | "en";

const LANGUAGE_PARAM = "lang";
const listeners = new Set<() => void>();

const readLanguageParam = (): DemoLanguage =>
  new URLSearchParams(window.location.search).get(LANGUAGE_PARAM) === "en" ? "en" : "es";

let currentLanguage = readLanguageParam();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getDemoLanguage = () => currentLanguage;

// `?lang=en` opens the demos in English, so a screenshot can be reproduced from its URL.
export const setDemoLanguage = (language: DemoLanguage) => {
  currentLanguage = language;
  const url = new URL(window.location.href);
  if (language === "en") url.searchParams.set(LANGUAGE_PARAM, "en");
  else url.searchParams.delete(LANGUAGE_PARAM);
  window.history.replaceState(window.history.state, "", url);
  listeners.forEach((listener) => listener());
};

/** One language for every demo on the page: the table, the server table and the kanban follow it. */
export const useDemoLanguage = () => useSyncExternalStore(subscribe, getDemoLanguage);
