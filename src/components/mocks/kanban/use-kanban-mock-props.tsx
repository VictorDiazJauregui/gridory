import { useMemo, useState } from "react";
import type { KanbanBoardProps, KanbanMoveEvent } from "../../kanban";
import { MOCK_COMPANY_ROWS, type MockCompanyRow } from "../company/company-rows";
import { KANBAN_STATIC_PROPS } from "./kanban-config";
import { filterByScope, filterByValue } from "../company/row-filters";
import { replaceRow } from "../company/row-updates";
import {
  buildBrandSelector,
  buildScopeToggleGroup,
} from "../company/toolbar-controls";
import {
  useMockRowCreator,
  type CreatedRowTemplate,
} from "../company/use-mock-row-creator";
import { useViewSwitch } from "../company/use-view-switch";
import { isDemoBaseline } from "../../../demo/use-demo-baseline";
import { SEATS_SLOT } from "../company/demo-toolbar-slots";
import { EmptyWithCreate } from "../company/EmptyWithCreate";
import { readKanbanDemoClassNames } from "../company/demo-class-names";
import { useLoadingToggle } from "../shared/use-loading-toggle";
import { useDemoLanguage } from "../shared/demo-language";
import { LANGUAGE_SLOT } from "../shared/demo-language-slot";
import { localizeKanbanDemoProps } from "../shared/localize-demo-props";
import type { RecordDemoEvent } from "../shared/use-demo-event-log";
import { buildKanbanHookProps } from "./kanban-hook-props";
import { useFavoriteCards } from "./use-favorite-cards";

const KANBAN_CREATED_ROW: CreatedRowTemplate = {
  idPrefix: "kanban-new",
  namePrefix: "Empresa Kanban",
  status: "Pendiente",
};

const useKanbanCardProps = () => {
  const [cards, setCards] = useState(MOCK_COMPANY_ROWS);
  const [scope, setScope] = useState("all");
  const [brand, setBrand] = useState("all");
  const displayedCards = useMemo(
    () => filterByValue(filterByScope(cards, scope), "brand", brand),
    [cards, scope, brand],
  );
  const onCreate = useMockRowCreator(setCards, KANBAN_CREATED_ROW);
  const onCardMove = (event: KanbanMoveEvent<MockCompanyRow>) => replaceRow(setCards, event.updatedCard);
  // Memoized so a re-render of the demo (the event log) does not count as new data mid-move.
  const data = useMemo(() => ({ results: displayedCards }), [displayedCards]);
  return {
    setCards,
    data,
    onCreate,
    onCardMove,
    toggleGroups: [buildScopeToggleGroup(scope, setScope)],
    headerSelectors: [buildBrandSelector(brand, setBrand)],
  };
};

// The board has its own toolbarLayout, so the slots are listed there to choose their place.
const KANBAN_TOOLBAR_LAYOUT: KanbanBoardProps<MockCompanyRow>["toolbarLayout"] = {
  ...KANBAN_STATIC_PROPS.toolbarLayout,
  right: ["brand", "archived", "group", "ai", "viewSwitch", "seats", "loading", "language", "create"],
};

export const useKanbanMockProps = (record: RecordDemoEvent): KanbanBoardProps<MockCompanyRow> => {
  const { setCards, ...cardProps } = useKanbanCardProps();
  const favorites = useFavoriteCards();
  const viewSwitch = useViewSwitch("kanban");
  const loadingToggle = useLoadingToggle();
  const language = useDemoLanguage();
  const baseProps = { ...KANBAN_STATIC_PROPS, ...cardProps, viewSwitch };
  if (isDemoBaseline()) return baseProps;
  return localizeKanbanDemoProps({
    ...baseProps,
    toolbarSlots: [SEATS_SLOT, loadingToggle.slot, LANGUAGE_SLOT],
    toolbarLayout: KANBAN_TOOLBAR_LAYOUT,
    loading: loadingToggle.loading,
    emptyMessage: <EmptyWithCreate onCreate={cardProps.onCreate} />,
    classNames: readKanbanDemoClassNames(),
    ...buildKanbanHookProps({ setCards, record, favorites }),
  }, language);
};
