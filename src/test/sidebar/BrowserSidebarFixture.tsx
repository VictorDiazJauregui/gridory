import { Fragment } from "react";
import { Bell, Home } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLayout,
  SidebarLogo,
  SidebarPinButton,
  SidebarSeparator,
} from "../../components/sidebar";
import type { SidebarLayoutProps } from "../../components/sidebar";

interface BrowserSidebarOptions {
  itemCount?: number;
  layout?: Partial<SidebarLayoutProps>;
}

const NavItems = ({ count }: { count: number }) =>
  Array.from({ length: count }, (_, index) => (
    <Fragment key={index}>
      {index > 0 && index % 10 === 0 ? <SidebarSeparator /> : null}
      <SidebarItem icon={<Home />} label={`Ítem ${index + 1}`} active={index === 0} />
    </Fragment>
  ));

// No hover delays: the pointer moves are real, the waits would only slow the suite.
export const BrowserSidebarFixture = ({ itemCount = 6, layout = {} }: BrowserSidebarOptions) => (
  <SidebarLayout hoverOpenDelay={0} hoverCloseDelay={0} animated={false} {...layout}>
    <Sidebar aria-label="Principal" mobileBarLogo={<span>Gridory</span>}>
      <SidebarHeader>
        <SidebarLogo full={<span>Gridory</span>} compact={<span>G</span>} />
        <SidebarPinButton />
      </SidebarHeader>
      <SidebarContent>
        <NavItems count={itemCount} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarItem icon={<Bell />} label="Avisos" />
      </SidebarFooter>
    </Sidebar>
    <main style={{ padding: 16 }}>Contenido</main>
  </SidebarLayout>
);
