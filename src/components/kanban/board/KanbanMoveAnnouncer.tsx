import type { MoveMenuState } from "../model/use-move-menu";

const NO_BREAK_SPACE = "\u00a0";

// Screen readers skip a live region whose text did not change: every other announcement carries a
// trailing no-break space, so moving two cards to the same column is read twice.
const resolveSpokenText = ({ text, count }: MoveMenuState["feedback"]["announcement"]) =>
  count % 2 === 0 ? `${text}${NO_BREAK_SPACE}` : text;

/** Live region of the "Move to" menu; rendered only while the menu is offered. */
export const KanbanMoveAnnouncer = ({ moveMenu }: { moveMenu: MoveMenuState }) => {
  if (!moveMenu.enabled) return null;
  const { announcement } = moveMenu.feedback;
  return (
    <div className="gdy-kanban-live" role="status" aria-live="polite">
      {announcement.text ? resolveSpokenText(announcement) : null}
    </div>
  );
};
