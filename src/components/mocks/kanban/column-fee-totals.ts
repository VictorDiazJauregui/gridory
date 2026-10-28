import type { KanbanColumnHeaderContext } from "../../kanban";
import type { MockCompanyRow } from "../company/company-rows";

const FEE_FORMAT = new Intl.NumberFormat("es-PE");

const sumMonthlyFees = (cards: MockCompanyRow[]) => cards.reduce((total, card) => total + (card.monthlyFee ?? 0), 0);

const formatFee = (amount: number) => `S/ ${FEE_FORMAT.format(amount)}`;

// Visible total first: it follows the search, the filters and the archived view; the column total does not.
export const renderColumnFeeTotals = ({ cards, allCards }: KanbanColumnHeaderContext<MockCompanyRow>) =>
  `${formatFee(sumMonthlyFees(cards))} · ${formatFee(sumMonthlyFees(allCards))}`;
