import { useMemo, useState } from "react";
import type { KanbanBoardProps, KanbanMoveEvent } from "../kanban";
import { MOCK_COMPANY_ROWS, type MockCompanyRow } from "./data/mockCompanyRows";
import { KANBAN_STATIC_PROPS } from "./data/mockKanbanConfig";
import { filterByScope, filterByValue } from "./data/mockRowFilters";
import { replaceRow } from "./data/mockRowUpdates";
import {
  buildBrandSelector,
  buildScopeToggleGroup,
} from "./data/mockToolbarControls";
import {
  useMockRowCreator,
  type CreatedRowTemplate,
} from "./use-mock-row-creator";
import { useViewSwitch } from "./use-view-switch";

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
  const onCardMove = (event: KanbanMoveEvent<MockCompanyRow>) =>
    replaceRow(setCards, event.updatedCard);
  return {
    data: { results: displayedCards },
    onCreate,
    onCardMove,
    toggleGroups: [buildScopeToggleGroup(scope, setScope)],
    headerSelectors: [buildBrandSelector(brand, setBrand)],
  };
};

export const useKanbanMockProps = (): KanbanBoardProps<MockCompanyRow> => {
  const cardProps = useKanbanCardProps();
  const viewSwitch = useViewSwitch("kanban");
  return { ...KANBAN_STATIC_PROPS, ...cardProps, viewSwitch };
};
