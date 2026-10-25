import type { KeyboardEvent, MouseEvent } from "react";
import type { RowClickEvent } from "../types";
import { navigateTo, openInNewTab } from "./browser-navigation";
import type { TableRowConfig } from "./row-attributes";

const MIDDLE_BUTTON = 1;

// Gestures that only exist since 1.1.0 (opening a link, Enter, middle click) skip the controls a
// consumer puts in a cell; a plain click keeps reaching `onRowClick` as it did in 1.0.1.
const INTERACTIVE_ELEMENTS = [
  "a[href]", "button", "input", "select", "textarea", "label", "summary", "[contenteditable]",
  "[role='button']", "[role='link']", "[role='menuitem']", "[role='checkbox']", "[role='switch']",
  "[role='combobox']", "[role='option']", "[tabindex]",
].join(", ");

const UNSAFE_SCHEMES = ["javascript:", "data:", "vbscript:"];

export interface RowNavigation<TData> {
  row: TData;
  href?: string;
  config: TableRowConfig<TData>;
}

const targetElementOf = (event: RowClickEvent) =>
  event.target instanceof Element ? event.target : null;

const isFromInteractiveElement = (event: RowClickEvent) => {
  const control = targetElementOf(event)?.closest(INTERACTIVE_ELEMENTS);
  return Boolean(control) && control !== event.currentTarget;
};

const isFromIgnoredColumn = (event: RowClickEvent, ignoredColumnIds: ReadonlySet<string>) => {
  const columnId = targetElementOf(event)?.closest("td[data-column-id]")?.getAttribute("data-column-id");
  return columnId ? ignoredColumnIds.has(columnId) : false;
};

const wantsNewTab = (event: RowClickEvent) => event.ctrlKey || event.metaKey;

// Browsers drop whitespace and control characters inside a scheme ("java\nscript:").
export const resolveSafeRowHref = (href: string | undefined) => {
  if (!href) return undefined;
  const scheme = [...href].filter((character) => character > " ").join("").toLowerCase();
  return UNSAFE_SCHEMES.some((unsafe) => scheme.startsWith(unsafe)) ? undefined : href;
};

export const hasRowAction = <TData,>({ href, config }: RowNavigation<TData>) =>
  Boolean(href || config.onRowClick);

export const isRowFocusable = <TData,>(navigation: RowNavigation<TData>) => {
  if (!hasRowAction(navigation)) return false;
  return navigation.config.focusableRows ?? Boolean(navigation.href);
};

const followsHref = <TData,>({ href, config }: RowNavigation<TData>, event: RowClickEvent) =>
  Boolean(href) && (wantsNewTab(event) || !config.onRowClick);

const runRowAction = <TData,>(navigation: RowNavigation<TData>, event: RowClickEvent) => {
  const { row, href, config } = navigation;
  if (href && wantsNewTab(event)) return openInNewTab(href);
  if (config.onRowClick) return config.onRowClick(row, event);
  if (href) navigateTo(href);
};

const isSkipped = <TData,>(navigation: RowNavigation<TData>, event: RowClickEvent, isNewGesture: boolean) => {
  if (isFromIgnoredColumn(event, navigation.config.ignoredColumnIds)) return true;
  return isNewGesture && isFromInteractiveElement(event);
};

const handleClick = <TData,>(navigation: RowNavigation<TData>) => (event: MouseEvent<HTMLTableRowElement>) => {
  if (isSkipped(navigation, event, followsHref(navigation, event))) return;
  runRowAction(navigation, event);
};

const handleMiddleClick = <TData,>(navigation: RowNavigation<TData>) => (event: MouseEvent<HTMLTableRowElement>) => {
  const { href } = navigation;
  if (!href || event.button !== MIDDLE_BUTTON || isSkipped(navigation, event, true)) return;
  event.preventDefault();
  openInNewTab(href);
};

// Stops the browser's autoscroll on middle-button press, as a native link does.
const preventMiddleAutoscroll = <TData,>(navigation: RowNavigation<TData>) => (event: MouseEvent<HTMLTableRowElement>) => {
  if (navigation.href && event.button === MIDDLE_BUTTON && !isSkipped(navigation, event, true)) event.preventDefault();
};

const handleEnter = <TData,>(navigation: RowNavigation<TData>) => (event: KeyboardEvent<HTMLTableRowElement>) => {
  if (event.key !== "Enter" || event.target !== event.currentTarget) return;
  event.preventDefault();
  runRowAction(navigation, event);
};

export const buildRowHandlers = <TData,>(navigation: RowNavigation<TData>) => {
  if (!hasRowAction(navigation)) return {};
  const linkHandlers = navigation.href
    ? { onAuxClick: handleMiddleClick(navigation), onMouseDown: preventMiddleAutoscroll(navigation) }
    : {};
  const keyHandlers = isRowFocusable(navigation) ? { onKeyDown: handleEnter(navigation), tabIndex: 0 } : {};
  return { onClick: handleClick(navigation), ...linkHandlers, ...keyHandlers };
};
