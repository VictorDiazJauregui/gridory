import type { ReactNode } from "react";
import { Home, Settings, Users } from "lucide-react";
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

interface SidebarFixtureOptions {
  layout?: Partial<SidebarLayoutProps>;
  pinPlacement?: "header" | "footer";
  onSelect?: (label: string) => void;
  footerBlock?: ReactNode;
}

const NAV = [
  { label: "Inicio", icon: <Home /> },
  { label: "Clientes", icon: <Users /> },
];

const FixtureHeader = ({ withPin }: { withPin: boolean }) => (
  <SidebarHeader>
    <SidebarLogo full={<span>Gridory</span>} compact={<span>G</span>} />
    {withPin ? <SidebarPinButton /> : null}
  </SidebarHeader>
);

const FixtureNav = ({ onSelect }: Pick<SidebarFixtureOptions, "onSelect">) => (
  <SidebarContent>
    <SidebarItem icon={NAV[0].icon} label={NAV[0].label} active onSelect={() => onSelect?.(NAV[0].label)} />
    <SidebarSeparator />
    <SidebarItem icon={NAV[1].icon} label={NAV[1].label} onSelect={() => onSelect?.(NAV[1].label)} />
  </SidebarContent>
);

const FixtureFooter = ({ withPin, footerBlock }: { withPin: boolean; footerBlock?: ReactNode }) => (
  <SidebarFooter>
    <SidebarItem icon={<Settings />} label="Ajustes" />
    {withPin ? <SidebarPinButton /> : null}
    {footerBlock}
  </SidebarFooter>
);

// Shared by the jsdom suites: a header, two items and a separator, a footer.
export const SidebarFixture = ({ layout = {}, pinPlacement = "header", onSelect, footerBlock }: SidebarFixtureOptions) => (
  <SidebarLayout hoverOpenDelay={150} hoverCloseDelay={300} {...layout}>
    <Sidebar aria-label="Principal" mobileBarLogo={<span>Logo</span>}>
      <FixtureHeader withPin={pinPlacement === "header"} />
      <FixtureNav onSelect={onSelect} />
      <FixtureFooter withPin={pinPlacement === "footer"} footerBlock={footerBlock} />
    </Sidebar>
    <main>Contenido</main>
  </SidebarLayout>
);
