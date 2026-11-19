import { expect, test } from "vitest";
import { applyScreen, type ScreenName } from "./browser/environment";
import { swipeTouch } from "./browser/pointer-scroll";
import { emulateTouchScreen } from "./browser/touch-screen";
import { COUNTRY_FIELD, DIAL_CODE_FIELD, LIST_SELECTOR, openList, renderContactDialog } from "./contact-dialog-fixture";

// A file of its own: turning touch off leaves `(hover: none)` until the page reloads.

const SWIPE_DISTANCE = 120;

test.each([
  ["iphone14Pro", "country", COUNTRY_FIELD],
  ["pixel7", "dial code", DIAL_CODE_FIELD],
] as [ScreenName, string, string | RegExp][])("on a %s inside a modal a finger scrolls the %s list", async (screen, _listName, fieldName) => {
  await emulateTouchScreen(true);
  await applyScreen(screen);
  renderContactDialog();
  const pageScroll = window.scrollY;
  const list = await openList(fieldName);
  await swipeTouch({ selector: LIST_SELECTOR, deltaY: SWIPE_DISTANCE });
  await expect.poll(() => list.scrollTop).toBeGreaterThan(0);
  expect(window.scrollY).toBe(pageScroll);
});
