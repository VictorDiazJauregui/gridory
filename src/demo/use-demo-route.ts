import { useEffect, useMemo, useState } from "react";
import { MODULES } from "./demo-modules";

const getModuleIdFromPath = (pathname: string): string => {
  const cleaned = pathname.replace(/\/+$/, "");
  if (!cleaned.startsWith("/mocks/")) {
    return MODULES[0].id;
  }
  const parts = cleaned.split("/");
  return parts[2] ?? MODULES[0].id;
};

const useSelectedModuleId = () => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    getModuleIdFromPath(window.location.pathname),
  );
  useEffect(() => {
    const onPopState = () =>
      setSelectedModuleId(getModuleIdFromPath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  return [selectedModuleId, setSelectedModuleId] as const;
};

const pushModulePath = (moduleId: string) => {
  const targetPath = `/mocks/${moduleId}`;
  if (window.location.pathname === targetPath) return;
  window.history.pushState(null, "", targetPath);
};

export const useDemoRoute = () => {
  const [selectedModuleId, setSelectedModuleId] = useSelectedModuleId();
  const selectedModule = useMemo(
    () =>
      MODULES.find((module) => module.id === selectedModuleId) ?? MODULES[0],
    [selectedModuleId],
  );
  const setRoute = (moduleId: string) => {
    pushModulePath(moduleId);
    setSelectedModuleId(moduleId);
  };
  return { selectedModuleId, selectedModule, setRoute };
};
