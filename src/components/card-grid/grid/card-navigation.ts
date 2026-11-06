import type { KeyboardEvent, MouseEvent } from "react";
import { navigateTo, openInNewTab } from "../../table/body/browser-navigation";
import { isFromInteractiveElement } from "../../table/body/row-navigation";
import type { CardClickEvent } from "../types";

const MIDDLE_BUTTON = 1;

export interface CardNavigation<TData> {
  row: TData;
  /** Already checked with `resolveSafeRowHref`. */
  href?: string;
  onRowClick?: (row: TData, event: CardClickEvent) => void;
}

const wantsNewTab = (event: CardClickEvent) => event.ctrlKey || event.metaKey;

export const hasCardAction = <TData>({ href, onRowClick }: CardNavigation<TData>) => Boolean(href || onRowClick);

const runCardAction = <TData>({ row, href, onRowClick }: CardNavigation<TData>, event: CardClickEvent) => {
  if (href && wantsNewTab(event)) return openInNewTab(href);
  if (onRowClick) return onRowClick(row, event);
  if (href) navigateTo(href);
};

// Unlike the table, which keeps its 1.0.1 plain click, a card never fires from a control inside it.
const handleClick = <TData>(navigation: CardNavigation<TData>) => (event: MouseEvent<HTMLElement>) => {
  if (isFromInteractiveElement(event)) return;
  runCardAction(navigation, event);
};

const isLinkMiddleClick = <TData>({ href }: CardNavigation<TData>, event: MouseEvent<HTMLElement>) =>
  Boolean(href) && event.button === MIDDLE_BUTTON && !isFromInteractiveElement(event);

const handleMiddleClick = <TData>(navigation: CardNavigation<TData>) => (event: MouseEvent<HTMLElement>) => {
  if (!navigation.href || !isLinkMiddleClick(navigation, event)) return;
  event.preventDefault();
  openInNewTab(navigation.href);
};

// Stops the browser's autoscroll on middle-button press, as a native link does.
const preventMiddleAutoscroll = <TData>(navigation: CardNavigation<TData>) => (event: MouseEvent<HTMLElement>) => {
  if (isLinkMiddleClick(navigation, event)) event.preventDefault();
};

const handleEnter = <TData>(navigation: CardNavigation<TData>) => (event: KeyboardEvent<HTMLElement>) => {
  if (event.target !== event.currentTarget || event.key !== "Enter") return;
  event.preventDefault();
  runCardAction(navigation, event);
};

export const buildCardHandlers = <TData>(navigation: CardNavigation<TData>) => {
  if (!hasCardAction(navigation)) return {};
  const linkHandlers = navigation.href
    ? { onAuxClick: handleMiddleClick(navigation), onMouseDown: preventMiddleAutoscroll(navigation) }
    : {};
  return { onClick: handleClick(navigation), onKeyDown: handleEnter(navigation), tabIndex: 0, ...linkHandlers };
};
