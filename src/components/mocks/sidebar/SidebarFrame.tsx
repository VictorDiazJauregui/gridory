import { Fragment, useState } from "react";
import type { CSSProperties } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLayout,
  SidebarPinButton,
  SidebarSeparator,
} from "../../../sidebar";
import type { RecordDemoEvent } from "../shared/use-demo-event-log";
import { buildDemoNavItems, SEPARATOR_EVERY, SETTINGS_ITEM } from "./demo-nav-items";
import type { DemoNavItem } from "./demo-nav-items";
import { DemoLogo, DemoMobileBarLogo } from "./DemoLogo";

export interface SidebarFrameConfig {
  name: string;
  itemCount: number;
  pinPlacement: "header" | "footer";
  expandOnHover?: boolean;
  /** Only `--gdy-sidebar-*` tokens: the example never touches the component's CSS. */
  tokens?: CSSProperties;
}

interface SidebarFrameProps {
  config: SidebarFrameConfig;
  record: RecordDemoEvent;
}

const FRAME_HEIGHT = "480px";

const NavItems = ({ items, activeId, onSelect }: { items: DemoNavItem[]; activeId: string; onSelect: (item: DemoNavItem) => void }) =>
  items.map((item, index) => (
    <Fragment key={item.id}>
      {index > 0 && index % SEPARATOR_EVERY === 0 ? <SidebarSeparator /> : null}
      <SidebarItem icon={item.icon} label={item.label} active={item.id === activeId} onSelect={() => onSelect(item)} />
    </Fragment>
  ));

const FrameSidebar = ({ config, activeId, onSelect }: { config: SidebarFrameConfig; activeId: string; onSelect: (item: DemoNavItem) => void }) => (
  <Sidebar aria-label={config.name} mobileBarLogo={<DemoMobileBarLogo />}>
    <SidebarHeader>
      <DemoLogo />
      {config.pinPlacement === "header" ? <SidebarPinButton /> : null}
    </SidebarHeader>
    <SidebarContent>
      <NavItems items={buildDemoNavItems(config.itemCount)} activeId={activeId} onSelect={onSelect} />
    </SidebarContent>
    <SidebarFooter>
      <SidebarItem icon={SETTINGS_ITEM.icon} label={SETTINGS_ITEM.label} active={activeId === SETTINGS_ITEM.id} onSelect={() => onSelect(SETTINGS_ITEM)} />
      {config.pinPlacement === "footer" ? <SidebarPinButton /> : null}
    </SidebarFooter>
  </Sidebar>
);

export const SidebarFrame = ({ config, record }: SidebarFrameProps) => {
  const [activeId, setActiveId] = useState("item-0");
  const select = (item: DemoNavItem) => {
    setActiveId(item.id);
    record("onSelect", { sidebar: config.name, item: item.label });
  };
  const style = { "--gdy-sidebar-height": FRAME_HEIGHT, ...config.tokens } as CSSProperties;
  return (
    <div role="group" aria-label={config.name} className="relative overflow-hidden rounded-md border" style={{ height: FRAME_HEIGHT, ...style }}>
      <SidebarLayout expandOnHover={config.expandOnHover} onPinnedChange={(pinned) => record("onPinnedChange", { sidebar: config.name, pinned })}>
        <FrameSidebar config={config} activeId={activeId} onSelect={select} />
        <div className="p-4 text-xs text-muted-foreground">Contenido de la página: el menú no la hace scrollear.</div>
      </SidebarLayout>
    </div>
  );
};
