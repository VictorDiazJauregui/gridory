import { expect, test, vi } from "vitest";
import { createDeferredModule, DeferredModuleLoadError } from "../components/shared/deferred/deferred-module";

const MODULE = { name: "pickers" };

test("loads once and remembers the module", async () => {
  const importModule = vi.fn().mockResolvedValue(MODULE);
  const deferred = createDeferredModule(importModule);
  expect(deferred.loaded()).toBeUndefined();
  await expect(deferred.load()).resolves.toBe(MODULE);
  await deferred.load();
  expect(importModule).toHaveBeenCalledOnce();
  expect(deferred.loaded()).toBe(MODULE);
});

test("a single failed download is retried without reporting it", async () => {
  const importModule = vi.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValue(MODULE);
  await expect(createDeferredModule(importModule).load()).resolves.toBe(MODULE);
  expect(importModule).toHaveBeenCalledTimes(2);
});

test("two failed downloads in a row reject with the cause, and the next load tries again", async () => {
  const cause = new Error("chunk not found");
  const importModule = vi.fn().mockRejectedValueOnce(cause).mockRejectedValueOnce(cause).mockResolvedValue(MODULE);
  const deferred = createDeferredModule(importModule);
  const failure = await deferred.load().catch((error: unknown) => error);
  expect(failure).toBeInstanceOf(DeferredModuleLoadError);
  expect((failure as DeferredModuleLoadError).cause).toBe(cause);
  await expect(deferred.load()).resolves.toBe(MODULE);
  expect(importModule).toHaveBeenCalledTimes(3);
});
