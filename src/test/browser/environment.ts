import { page } from "vitest/browser";

export type Theme = "light" | "dark";

export const SCREENS = {
  desktop: { width: 1920, height: 1080 },
  iphone14Pro: { width: 393, height: 852 },
  pixel7: { width: 412, height: 915 },
} as const;

export type ScreenName = keyof typeof SCREENS;

// Same switch a consumer app flips (and the demo does): `.dark` on <html>, so
// portaled panels inherit the theme too.
export const applyTheme = (theme: Theme): void => {
  document.documentElement.classList.toggle("dark", theme === "dark");
};

export const applyScreen = async (name: ScreenName): Promise<void> => {
  const { width, height } = SCREENS[name];
  await page.viewport(width, height);
};
