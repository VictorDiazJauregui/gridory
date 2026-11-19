import { expect, test } from "vitest";
import { wheelPointer } from "./browser/pointer-scroll";
import {
  COUNTRY_FIELD,
  DIAL_CODE_FIELD,
  LIST_SELECTOR,
  contactDialog,
  openList,
  renderContactDialog,
  renderContactPage,
  scrollToListEnd,
} from "./contact-dialog-fixture";

const WHEEL_STEP = 400;

const wheelOverList = (deltaY: number) => wheelPointer({ selector: LIST_SELECTOR, deltaY });

test.each([
  ["country", COUNTRY_FIELD],
  ["dial code", DIAL_CODE_FIELD],
])("inside a modal the wheel scrolls the %s list", async (_listName, fieldName) => {
  renderContactDialog();
  const list = await openList(fieldName);
  await wheelOverList(WHEEL_STEP);
  await expect.poll(() => list.scrollTop).toBeGreaterThan(0);
});

test("inside a modal, at the end of the list, the wheel moves neither the page nor the dialog", async () => {
  renderContactDialog();
  const pageScroll = window.scrollY;
  const list = await openList(COUNTRY_FIELD);
  scrollToListEnd(list);
  const listEnd = list.scrollTop;
  await wheelOverList(WHEEL_STEP);
  // The wheel back up is handled after the first one, so once the list moves the first wheel has had its chance.
  await wheelOverList(-WHEEL_STEP);
  await expect.poll(() => list.scrollTop).toBeLessThan(listEnd);
  expect(window.scrollY).toBe(pageScroll);
  expect(contactDialog().scrollTop).toBe(0);
});

test("outside a modal the wheel scrolls the list and, at its end, the page, as in 2.3.0", async () => {
  renderContactPage();
  const list = await openList(COUNTRY_FIELD);
  await wheelOverList(WHEEL_STEP);
  await expect.poll(() => list.scrollTop).toBeGreaterThan(0);
  scrollToListEnd(list);
  const pageScroll = window.scrollY;
  await wheelOverList(WHEEL_STEP);
  await expect.poll(() => window.scrollY).toBeGreaterThan(pageScroll);
  window.scrollTo(0, 0);
});
