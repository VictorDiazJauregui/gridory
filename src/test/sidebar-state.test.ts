import { describe, expect, test } from "vitest";
import { INITIAL_INTERACTION, reduceInteraction, resolveExpanded } from "../components/sidebar/model/interaction-state";
import type { SidebarInteraction, SidebarInteractionEvent } from "../components/sidebar/model/interaction-state";

const run = (...events: SidebarInteractionEvent[]): SidebarInteraction => events.reduce(reduceInteraction, INITIAL_INTERACTION);

describe("reduceInteraction", () => {
  test("tracks the pointer and the focus separately", () => {
    expect(run({ type: "pointer", inside: true })).toEqual({ pointerInside: true, focusInside: false, retainCount: 0 });
    expect(run({ type: "focus", inside: true }, { type: "pointer", inside: false }).focusInside).toBe(true);
  });

  test("dismiss clears the pointer and the focus but keeps the retentions", () => {
    const state = run({ type: "pointer", inside: true }, { type: "focus", inside: true }, { type: "retain" }, { type: "dismiss" });
    expect(state).toEqual({ pointerInside: false, focusInside: false, retainCount: 1 });
  });

  test("counts retentions and never goes below zero", () => {
    expect(run({ type: "retain" }, { type: "retain" }, { type: "release" }).retainCount).toBe(1);
    expect(run({ type: "release" }).retainCount).toBe(0);
  });
});

describe("resolveExpanded", () => {
  const hovered = run({ type: "pointer", inside: true });
  const retained = run({ type: "retain" });

  test("pinned always expands", () => {
    expect(resolveExpanded({ pinned: true, expandOnHover: false, interaction: INITIAL_INTERACTION })).toBe(true);
  });

  test("hover, focus or a retention expand only with hover expansion on", () => {
    expect(resolveExpanded({ pinned: false, expandOnHover: true, interaction: hovered })).toBe(true);
    expect(resolveExpanded({ pinned: false, expandOnHover: true, interaction: retained })).toBe(true);
    expect(resolveExpanded({ pinned: false, expandOnHover: false, interaction: hovered })).toBe(false);
  });

  test("stays collapsed with nothing inside", () => {
    expect(resolveExpanded({ pinned: false, expandOnHover: true, interaction: INITIAL_INTERACTION })).toBe(false);
  });
});
