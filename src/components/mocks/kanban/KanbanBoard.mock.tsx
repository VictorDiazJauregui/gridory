import { KanbanBoard } from "../../kanban";
import { isDemoBaseline } from "../../../demo/use-demo-baseline";
import { DemoEventLog } from "../shared/DemoEventLog";
import { useDemoLanguage } from "../shared/demo-language";
import { useDemoEventLog } from "../shared/use-demo-event-log";
import { ColumnSizePanel } from "./ColumnSizePanel";
import { useColumnSizeDemo } from "./use-column-size-demo";
import { useKanbanMockProps } from "./use-kanban-mock-props";

const EVENT_LOG_DESCRIPTION = {
  es: "onVisibleCardsChange avisa cuántas tarjetas se ven, en total y por columna, cada vez que cambian. El servidor simulado responde en 800 ms y rechaza todo movimiento a Archivada: la tarjeta queda atenuada mientras espera y vuelve sola a su columna. Cada columna muestra la suma de la cuota mensual de sus tarjetas visibles y la de todas sus tarjetas, incluidas las ocultas. Una empresa activa no puede pasar directo a Archivada (canDrop): al arrastrarla, esa columna se marca en rojo y no la acepta; desde Pendiente sí se puede, pero el servidor lo rechaza. En una pantalla táctil (o con \"Mover a…: Siempre\") el menú ⋯ de cada tarjeta empieza con \"Mover a…\", que respeta las mismas reglas y explica por qué Archivada no está disponible. Cada columna se puede colapsar (Archivada empieza colapsada) y muestra de a 10 tarjetas, con \"Cargar más\" en su pie. \"Tamaño de las columnas\" prueba fillHeight (el tablero ocupa un contenedor del alto de la pantalla), columnWidth y fillWidth.",
  en: "onVisibleCardsChange reports how many cards are shown, in total and per column, whenever they change. The simulated server answers in 800 ms and rejects every move to Archivada: the card stays dimmed while it waits and goes back to its column on its own. Each column shows the monthly fee of its visible cards and of all its cards, hidden ones included. An active company cannot go straight to Archivada (canDrop): while it is dragged that column turns red and does not take it; from Pendiente it can, but the server rejects it. On a touch screen (or with \"Move to…: Always\") the ⋯ menu of each card starts with \"Move to…\", which follows the same rules and explains why Archivada is not available. Every column can be collapsed (Archivada starts collapsed) and shows 10 cards at a time, with \"Load more\" in its footer. \"Column size\" tries fillHeight (the board fills a container as tall as the screen), columnWidth and fillWidth.",
};

// fillHeight needs a parent with a bounded height: the screen minus the size panel and the page padding, never under
// 48rem so the tall toolbar of a phone leaves room for the columns.
const FULL_HEIGHT_CONTAINER = "h-[calc(100dvh-6.5rem)] min-h-[48rem]";

export const KanbanBoardMock = () => {
  const eventLog = useDemoEventLog();
  const props = useKanbanMockProps(eventLog.record);
  const language = useDemoLanguage();
  const columnSize = useColumnSizeDemo();
  if (isDemoBaseline()) return <KanbanBoard {...props} />;
  return (
    <div className="flex flex-col gap-4">
      <ColumnSizePanel {...columnSize} />
      <div className={columnSize.settings.fillHeight ? FULL_HEIGHT_CONTAINER : undefined}>
        <KanbanBoard {...props} {...columnSize.settings} />
      </div>
      <DemoEventLog events={eventLog.events} description={EVENT_LOG_DESCRIPTION[language]} />
    </div>
  );
};
