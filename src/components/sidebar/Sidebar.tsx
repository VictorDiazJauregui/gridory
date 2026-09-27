import { DesktopSidebar } from "./desktop/DesktopSidebar";
import { MobileSidebar } from "./mobile/MobileSidebar";
import { useSidebarContext } from "./model/sidebar-context";
import { pickRegionName, SidebarRegionContext } from "./model/sidebar-region";
import type { SidebarProps } from "./types";

export const Sidebar = (props: SidebarProps) => {
  const { isMobile } = useSidebarContext("Sidebar");
  return (
    <SidebarRegionContext.Provider value={pickRegionName(props)}>
      {isMobile ? <MobileSidebar {...props} /> : <DesktopSidebar {...props} />}
    </SidebarRegionContext.Provider>
  );
};
