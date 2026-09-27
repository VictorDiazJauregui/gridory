import type { ComponentProps } from "react";
import { render } from "@testing-library/react";
import { findRequiredElement } from "../browser/elements";
import { BrowserSidebarFixture } from "./BrowserSidebarFixture";

export const renderBrowserSidebar = (options: ComponentProps<typeof BrowserSidebarFixture> = {}) =>
  render(<BrowserSidebarFixture {...options} />).container;

export const findPart = (container: Element, part: string) => findRequiredElement(container, `.gdy-sidebar-${part}`);
