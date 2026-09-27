import { screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { findRequiredElement } from "./browser/elements";
import { applyScreen, applyTheme } from "./browser/environment";
import type { ScreenName, Theme } from "./browser/environment";
import { measureBox, readStyle } from "./browser/measure";
import { findPart, renderBrowserSidebar } from "./sidebar/browser-sidebar";

const RAIL_WIDTH = 80;
const EXPANDED_WIDTH = 280;
const MOBILE_SCREENS: ScreenName[] = ["iphone14Pro", "pixel7"];
const THEMES: Theme[] = ["light", "dark"];

// The page margin would push the sidebar down and hide a real overflow.
beforeEach(() => {
  document.body.style.margin = "0";
});

afterEach(() => {
  document.body.style.margin = "";
});

const findMain = () => screen.getByRole("main");
const expectState = (container: Element, state: string) =>
  expect.poll(() => findPart(container, "panel").closest(".gdy-sidebar")?.getAttribute("data-state")).toBe(state);

test("with 60 items the header and footer stay on screen, the middle scrolls and the page does not grow", () => {
  const container = renderBrowserSidebar({ itemCount: 60 });
  const content = findPart(container, "content");
  expect(measureBox(findPart(container, "header")).top).toBe(0);
  expect(measureBox(findPart(container, "footer")).bottom).toBe(window.innerHeight);
  expect(content.scrollHeight).toBeGreaterThan(content.clientHeight);
  expect(document.documentElement.scrollHeight).toBeLessThanOrEqual(window.innerHeight);
});

test("expanded by hover it covers the content without moving it; pinned it pushes it by the width difference", async () => {
  const container = renderBrowserSidebar();
  const restingLeft = measureBox(findMain()).left;
  await userEvent.hover(findPart(container, "panel"));
  await expectState(container, "expanded");
  expect(measureBox(findPart(container, "panel")).width).toBe(EXPANDED_WIDTH);
  expect(measureBox(findMain()).left).toBe(restingLeft);
  await userEvent.click(screen.getByRole("button", { name: "Fijar menú" }));
  expect(measureBox(findMain()).left).toBe(restingLeft + EXPANDED_WIDTH - RAIL_WIDTH);
});

test("collapses again when the pointer leaves", async () => {
  const container = renderBrowserSidebar();
  await userEvent.hover(findPart(container, "panel"));
  await expectState(container, "expanded");
  await userEvent.hover(findMain());
  await expectState(container, "collapsed");
});

test.each(MOBILE_SCREENS)("on %s it becomes a 56px bar and a drawer, with no sideways page scroll", async (screenName) => {
  await applyScreen(screenName);
  const container = renderBrowserSidebar({ itemCount: 30 });
  expect(measureBox(findPart(container, "mobile-bar")).height).toBe(56);
  await userEvent.click(screen.getByRole("button", { name: "Abrir menú" }));
  const drawer = findRequiredElement(document, ".gdy-sidebar-drawer");
  expect(measureBox(drawer).width).toBe(Math.min(280, Math.round(window.innerWidth * 0.85)));
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
});

test("the icon column and the footer height do not move between the two states", async () => {
  const container = renderBrowserSidebar();
  const icon = findRequiredElement(container, ".gdy-sidebar-item-icon");
  const collapsed = { icon: measureBox(icon).left, footer: measureBox(findPart(container, "footer")).height };
  await userEvent.hover(findPart(container, "panel"));
  await expectState(container, "expanded");
  expect(measureBox(icon).left).toBe(collapsed.icon);
  expect(measureBox(findPart(container, "footer")).height).toBe(collapsed.footer);
  expect(measureBox(icon).left + measureBox(icon).width / 2).toBe(RAIL_WIDTH / 2);
});

test.each(THEMES)("reads the background, the separator and the active item from the tokens (%s)", (theme) => {
  applyTheme(theme);
  const container = renderBrowserSidebar({ itemCount: 12 });
  const reference = document.createElement("span");
  document.body.append(reference);
  const tokenColor = (token: string) => {
    reference.style.color = `var(${token})`;
    return readStyle(reference, "color");
  };
  expect(readStyle(findPart(container, "panel"), "background-color")).toBe(tokenColor("--gdy-card"));
  expect(readStyle(findPart(container, "separator"), "background-color")).toBe(tokenColor("--gdy-border"));
  const active = findRequiredElement(container, '[aria-current="page"]');
  expect(readStyle(active, "background-color")).toBe(tokenColor("--gdy-primary"));
  reference.remove();
});
