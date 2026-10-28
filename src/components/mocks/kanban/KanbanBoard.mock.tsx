import { KanbanBoard } from "../../kanban";
import { isDemoBaseline } from "../../../demo/use-demo-baseline";
import { DemoEventLog } from "../shared/DemoEventLog";
import { useDemoLanguage } from "../shared/demo-language";
import { useDemoEventLog } from "../shared/use-demo-event-log";
import { useKanbanMockProps } from "./use-kanban-mock-props";

const EVENT_LOG_DESCRIPTION = {
  es: "onVisibleCardsChange avisa cuántas tarjetas se ven, en total y por columna, cada vez que cambian. El servidor simulado responde en 800 ms y rechaza todo movimiento a Archivada: la tarjeta queda atenuada mientras espera y vuelve sola a su columna.",
  en: "onVisibleCardsChange reports how many cards are shown, in total and per column, whenever they change. The simulated server answers in 800 ms and rejects every move to Archivada: the card stays dimmed while it waits and goes back to its column on its own.",
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
