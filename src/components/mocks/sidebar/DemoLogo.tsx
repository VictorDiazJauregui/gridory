import { SidebarLogo } from "../../../sidebar";

const LogoMark = () => (
  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">G</span>
);

export const DemoLogo = () => (
  <SidebarLogo
    full={
      <span className="flex items-center gap-2 text-base font-semibold">
        <LogoMark />
        Gridory
      </span>
    }
    compact={<LogoMark />}
  />
);

export const DemoMobileBarLogo = () => (
  <span className="flex items-center gap-2 text-base font-semibold">
    <LogoMark />
    Gridory
  </span>
);
