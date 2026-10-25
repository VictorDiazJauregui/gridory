const MAC_SYMBOLS: Record<string, string> = { Mod: "⌘", Shift: "⇧", Alt: "⌥" };
const PC_NAMES: Record<string, string> = { Mod: "Ctrl", Shift: "Shift", Alt: "Alt" };

export const isApplePlatform = (): boolean =>
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent);

export const formatShortcut = (shortcut: string, onApple: boolean): string => {
  const parts = shortcut.split("-");
  const key = parts.pop()?.toUpperCase() ?? "";
  if (onApple) return [...parts.map((part) => MAC_SYMBOLS[part] ?? part), key].join("");
  return [...parts.map((part) => PC_NAMES[part] ?? part), key].join("+");
};

const readKeyName = (event: KeyboardEvent): string => {
  if (event.code.startsWith("Key")) return event.code.slice(3).toLowerCase();
  if (event.code.startsWith("Digit")) return event.code.slice(5);
  return event.key.toLowerCase();
};

export const readShortcut = (event: KeyboardEvent, onApple: boolean): string => {
  const modifiers = [
    (onApple ? event.metaKey : event.ctrlKey) && "Mod",
    event.altKey && "Alt",
    event.shiftKey && "Shift",
  ].filter(Boolean);
  return [...modifiers, readKeyName(event)].join("-");
};

export const normalizeShortcut = (shortcut: string): string => {
  const parts = shortcut.split("-");
  const key = parts.pop()?.toLowerCase() ?? "";
  const order = ["Mod", "Alt", "Shift"];
  return [...order.filter((modifier) => parts.includes(modifier)), key].join("-");
};
