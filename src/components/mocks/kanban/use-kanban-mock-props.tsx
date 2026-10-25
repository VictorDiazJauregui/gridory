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

// The board has its own toolbarLayout, so the slot is listed there to choose its place.
const KANBAN_SLOT_PROPS: Pick<KanbanBoardProps<MockCompanyRow>, "toolbarSlots" | "toolbarLayout"> = {
  toolbarSlots: [SEATS_SLOT],
  toolbarLayout: {
    ...KANBAN_STATIC_PROPS.toolbarLayout,
    right: ["brand", "archived", "group", "ai", "viewSwitch", "seats", "create"],
  },
};

export const useKanbanMockProps = (): KanbanBoardProps<MockCompanyRow> => {
  const cardProps = useKanbanCardProps();
  const viewSwitch = useViewSwitch("kanban");
  const baseProps = { ...KANBAN_STATIC_PROPS, ...cardProps, viewSwitch };
  if (isDemoBaseline()) return baseProps;
  return { ...baseProps, ...KANBAN_SLOT_PROPS, emptyMessage: <EmptyWithCreate onCreate={cardProps.onCreate} /> };
};
