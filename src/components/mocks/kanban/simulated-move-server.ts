import type { KanbanMoveEvent } from "../../kanban";
import type { MockCompanyRow } from "../company/company-rows";

const SERVER_DELAY_MS = 800;
const REJECTED_COLUMN = "Archivada";

export class DemoMoveRejectedError extends Error {
  constructor(toValue: string) {
    super(`The simulated server does not accept moves to "${toValue}".`);
    this.name = "DemoMoveRejectedError";
  }
}

/** Answers after 800 ms and rejects every move to "Archivada", to show the board sending a card back. */
export const saveMoveOnServer = (event: KanbanMoveEvent<MockCompanyRow>) =>
  new Promise<void>((resolve, reject) => {
    const answer = () =>
      event.toValue === REJECTED_COLUMN ? reject(new DemoMoveRejectedError(event.toValue)) : resolve();
    window.setTimeout(answer, SERVER_DELAY_MS);
  });
