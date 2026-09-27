import { DemoLogo, DemoMobileBarLogo } from "@/components/mocks/sidebar/DemoLogo";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarItem, SidebarPinButton } from "../sidebar";
import { MODULES } from "./demo-modules";
import { DemoThemeToggle } from "./DemoThemeToggle";

interface DemoMenuProps {
  selectedModuleId: string;
  onSelect: (moduleId: string) => void;
}

const DemoModuleItems = ({ selectedModuleId, onSelect }: DemoMenuProps) =>
  MODULES.map((module) => (
    <SidebarItem
      key={module.id}
      icon={module.icon}
      label={module.label}
      active={module.id === selectedModuleId}
      onSelect={() => onSelect(module.id)}
    />
  ));

export const DemoMenu = (props: DemoMenuProps) => (
  <Sidebar aria-label="Módulos" mobileBarLogo={<DemoMobileBarLogo />}>
    <SidebarHeader>
      <DemoLogo />
      <SidebarPinButton />
    </SidebarHeader>
    <SidebarContent>
      <DemoModuleItems {...props} />
    </SidebarContent>
    <SidebarFooter>
      <DemoThemeToggle />
    </SidebarFooter>
  </Sidebar>
);
