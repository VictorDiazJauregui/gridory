import type { ToolbarCustomSlot } from "../../table";
import { SeatsCounter } from "./SeatsCounter";

// A slot of the demo app itself: the toolbar only places it.
export const SEATS_SLOT: ToolbarCustomSlot = { id: "seats", content: <SeatsCounter /> };
