import { useCallback, useEffect, useState } from "react";
import type { DeferredModule } from "./deferred-module";

export type DeferredModuleStatus = "loading" | "ready" | "failed";

export interface DeferredModuleState<TModule> {
  status: DeferredModuleStatus;
  module: TModule | undefined;
  retry: () => void;
}

interface LoadRequest<TModule> {
  deferred: DeferredModule<TModule>;
  attempt: number;
  onLoad: (module: TModule) => void;
  onFail: () => void;
}

const resolveStatus = (hasModule: boolean, failed: boolean): DeferredModuleStatus => {
  if (hasModule) return "ready";
  return failed ? "failed" : "loading";
};

// Each attempt starts one download; an unmounted menu ignores the answer.
const useModuleDownload = <TModule>({ deferred, attempt, onLoad, onFail }: LoadRequest<TModule>, done: boolean) => {
  useEffect(() => {
    if (done) return undefined;
    let active = true;
    deferred.load().then(
      (module) => active && onLoad(module),
      () => active && onFail(),
    );
    return () => {
      active = false;
    };
  }, [deferred, attempt, done, onLoad, onFail]);
};

export const useDeferredModule = <TModule>(deferred: DeferredModule<TModule>): DeferredModuleState<TModule> => {
  const [module, setModule] = useState(deferred.loaded);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const markFailed = useCallback(() => setFailed(true), []);
  useModuleDownload({ deferred, attempt, onLoad: setModule, onFail: markFailed }, module !== undefined);
  const retry = useCallback(() => {
    setFailed(false);
    setAttempt((count) => count + 1);
  }, []);
  return { status: resolveStatus(module !== undefined, failed), module, retry };
};
