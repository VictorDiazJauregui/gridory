import { AI_PROVIDER_CONFIG } from "./ai-config";

const HAS_API_KEY = AI_PROVIDER_CONFIG.apiKey.length > 0;

export const ApiKeyBanner = () => {
  if (!HAS_API_KEY) {
    return (
      <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
        Sin <code>VITE_AI_API_KEY</code> el mock funciona visualmente, pero
        no puede consultar el proveedor AI real.
      </div>
    );
  }
  return (
    <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
      Base URL activa: <code>{AI_PROVIDER_CONFIG.baseURL}</code>
    </div>
  );
};
