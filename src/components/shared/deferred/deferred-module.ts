export class DeferredModuleLoadError extends Error {
  constructor(cause: unknown) {
    super("A deferred Gridory module could not be downloaded.", { cause });
    this.name = "DeferredModuleLoadError";
  }
}

export interface DeferredModule<TModule> {
  /** The module once it arrived, so a later mount renders it without a placeholder. */
  loaded: () => TModule | undefined;
  load: () => Promise<TModule>;
}

export const createDeferredModule = <TModule>(importModule: () => Promise<TModule>): DeferredModule<TModule> => {
  let loaded: TModule | undefined;
  let pending: Promise<TModule> | undefined;
  // A dropped connection fails one request, not two in a row: one silent retry before the caller hears of it.
  const importWithRetry = () => importModule().catch(() => importModule());
  const load = () => {
    pending ??= importWithRetry().then(
      (module) => {
        loaded = module;
        return module;
      },
      (error: unknown) => {
        pending = undefined;
        throw new DeferredModuleLoadError(error);
      },
    );
    return pending;
  };
  return { loaded: () => loaded, load };
};
