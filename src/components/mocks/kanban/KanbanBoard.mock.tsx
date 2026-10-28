import { KanbanBoard } from "../../kanban";
import { isDemoBaseline } from "../../../demo/use-demo-baseline";
import { DemoEventLog } from "../shared/DemoEventLog";
import { useDemoLanguage } from "../shared/demo-language";
import { useDemoEventLog } from "../shared/use-demo-event-log";
import { useKanbanMockProps } from "./use-kanban-mock-props";

const EVENT_LOG_DESCRIPTION = {
  es: "onVisibleCardsChange avisa cuántas tarjetas se ven, en total y por columna, cada vez que cambian. El servidor simulado responde en 800 ms y rechaza todo movimiento a Archivada: la tarjeta queda atenuada mientras espera y vuelve sola a su columna. Cada columna muestra la suma de la cuota mensual de sus tarjetas visibles y la de todas sus tarjetas, incluidas las ocultas. Una empresa activa no puede pasar directo a Archivada (canDrop): al arrastrarla, esa columna se marca en rojo y no la acepta; desde Pendiente sí se puede, pero el servidor lo rechaza.",
  en: "onVisibleCardsChange reports how many cards are shown, in total and per column, whenever they change. The simulated server answers in 800 ms and rejects every move to Archivada: the card stays dimmed while it waits and goes back to its column on its own. Each column shows the monthly fee of its visible cards and of all its cards, hidden ones included. An active company cannot go straight to Archivada (canDrop): while it is dragged that column turns red and does not take it; from Pendiente it can, but the server rejects it.",
};

export const KanbanBoardMock = () => {
  const eventLog = useDemoEventLog();
  const props = useKanbanMockProps(eventLog.record);
  const language = useDemoLanguage();
  if (isDemoBaseline()) return <KanbanBoard {...props} />;
  return (
    <div className="flex flex-col gap-4">
      <KanbanBoard {...props} />
      <DemoEventLog events={eventLog.events} description={EVENT_LOG_DESCRIPTION[language]} />
    </div>
  );
};
