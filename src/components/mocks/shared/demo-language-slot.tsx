import type { ToolbarCustomSlot } from "../../table";
import { LanguageToggle } from "./LanguageToggle";

// Demo switch for `labels` and `calendarLocale`: the app picks the language of every text.
export const LANGUAGE_SLOT: ToolbarCustomSlot = { id: "language", content: <LanguageToggle /> };
