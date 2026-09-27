import type { ComponentProps } from "react";
import { render } from "@testing-library/react";
import { SidebarFixture } from "./SidebarFixture";

export type SidebarFixtureOptions = ComponentProps<typeof SidebarFixture>;

export const renderSidebar = (options: SidebarFixtureOptions = {}) => render(<SidebarFixture {...options} />);

export const findSidebarRoot = (container: HTMLElement) => container.querySelector(".gdy-sidebar");
