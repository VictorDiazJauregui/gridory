import { Fragment, type ReactNode } from "react";
import { FilterX, Plus, Search } from "lucide-react";
import { ToolbarAiButton } from "./ToolbarAiButton";
import { ToolbarViewSwitch } from "./ToolbarViewSwitch";
import { SimpleSelect } from "../ui/select";
import { SegmentedControl } from "../ui/toggle-group";
import type {
  ReusableHeaderSelectConfig,
  ReusableSelectOption,
  ReusableToggleGroupConfig,
} from "../shared/toolbar-controls";
import type { ReusableSelectTheme } from "../shared/select-theme";
import {
  resolveToolbarClusters,
  type ReusableToolbarLayout,
} from "../shared/toolbar-layout";
import type {
  ArchivedViewMode,
  ReusableAiButtonConfig,
  ReusableKanbanGroupOption,
  ReusableViewSwitchConfig,
} from "./types";

const DEFAULT_ARCHIVED_OPTION_LABELS: Record<ArchivedViewMode, string> = {
  active: "Activos",
  archived: "Archivados",
  all: "Todos",
};

const ARCHIVED_OPTION_ORDER: ArchivedViewMode[] = ["active", "archived", "all"];

interface KanbanToolbarProps<TData> {
  showSearch: boolean;
  search: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  showClearFilters: boolean;
  onClearFilters: () => void;
  showGroupSelector: boolean;
  groups: ReusableKanbanGroupOption<TData>[];
  selectedGroupId: string;
  onGroupChange: (groupId: string) => void;
  showCreateButton: boolean;
  createLabel: string;
  onCreate?: () => void;
  showArchivedView: boolean;
  archivedMode: ArchivedViewMode;
  onArchivedModeChange: (mode: ArchivedViewMode) => void;
  archivedViewLabel?: string;
  archivedViewOptionLabels?: Partial<Record<ArchivedViewMode, string>>;
  viewSwitch?: ReusableViewSwitchConfig;
  aiButton?: ReusableAiButtonConfig;
  toggleGroups?: ReusableToggleGroupConfig[];
  headerSelectors?: ReusableHeaderSelectConfig[];
  toolbarLayout?: ReusableToolbarLayout;
  selectTheme?: ReusableSelectTheme;
}

const buildArchivedOptions = <TData,>(
  props: KanbanToolbarProps<TData>,
): ReusableSelectOption[] => {
  const label = props.archivedViewLabel ?? "Mostrar";
  const optionLabel = (mode: ArchivedViewMode) =>
    props.archivedViewOptionLabels?.[mode] ?? DEFAULT_ARCHIVED_OPTION_LABELS[mode];
  return ARCHIVED_OPTION_ORDER.map((mode) => ({
    value: mode,
    label: `${label}: ${optionLabel(mode)}`,
  }));
};

const buildGroupOptions = <TData,>(
  groups: ReusableKanbanGroupOption<TData>[],
): ReusableSelectOption[] =>
  groups.map((group) => ({ value: group.id, label: `Agrupar por: ${group.label}` }));

const buildHeaderSelectOptions = (
  config: ReusableHeaderSelectConfig,
): ReusableSelectOption[] =>
  config.label
    ? config.options.map((option) => ({
        value: option.value,
        label: `${config.label}: ${option.label}`,
      }))
    : config.options;

const SearchSlot = ({
  search,
  placeholder,
  onChange,
}: {
  search: string;
  placeholder: string;
  onChange: (value: string) => void;
}) => (
  <div className="rkb-search">
    <Search size={14} className="rkb-search-icon" />
    <input
      type="text"
      value={search}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="rkb-input"
    />
  </div>
);

const ClearFiltersSlot = ({ onClear }: { onClear: () => void }) => (
  <button type="button" className="rkb-btn rkb-btn-ghost" onClick={onClear}>
    <span>Limpiar filtros</span>
    <FilterX size={12} />
  </button>
);

const CreateSlot = ({
  label,
  onCreate,
}: {
  label: string;
  onCreate: () => void;
}) => (
  <button type="button" className="rkb-btn rkb-btn-primary" onClick={onCreate}>
    <Plus size={14} />
    {label}
  </button>
);

const fillFixedSlots = <TData,>(
  props: KanbanToolbarProps<TData>,
  slots: Record<string, ReactNode>,
) => {
  const { selectTheme } = props;
  if (props.showSearch)
    slots.search = (
      <SearchSlot
        search={props.search}
        placeholder={props.searchPlaceholder}
        onChange={props.onSearchChange}
      />
    );
  if (props.showClearFilters)
    slots.clearFilters = <ClearFiltersSlot onClear={props.onClearFilters} />;
  if (props.showArchivedView)
    slots.archived = (
      <SimpleSelect
        options={buildArchivedOptions(props)}
        value={props.archivedMode}
        onValueChange={(value) => props.onArchivedModeChange(value as ArchivedViewMode)}
        ariaLabel={props.archivedViewLabel ?? "Mostrar"}
        theme={selectTheme}
      />
    );
  if (props.showGroupSelector && props.groups.length > 0)
    slots.group = (
      <SimpleSelect
        options={buildGroupOptions(props.groups)}
        value={props.selectedGroupId}
        onValueChange={props.onGroupChange}
        ariaLabel="Agrupar por"
        theme={selectTheme}
      />
    );
  if (props.aiButton) slots.ai = <ToolbarAiButton config={props.aiButton} />;
  if (props.viewSwitch) slots.viewSwitch = <ToolbarViewSwitch config={props.viewSwitch} />;
  if (props.showCreateButton && props.onCreate)
    slots.create = <CreateSlot label={props.createLabel} onCreate={props.onCreate} />;
};

const fillCustomSlots = <TData,>(
  props: KanbanToolbarProps<TData>,
  slots: Record<string, ReactNode>,
) => {
  (props.toggleGroups ?? []).forEach((group) => {
    slots[group.id] = (
      <SegmentedControl
        options={group.options}
        value={group.value}
        onChange={group.onChange}
        display={group.display}
        ariaLabel={group.ariaLabel}
      />
    );
  });
  (props.headerSelectors ?? []).forEach((selector) => {
    slots[selector.id] = (
      <SimpleSelect
        options={buildHeaderSelectOptions(selector)}
        value={selector.value}
        onValueChange={selector.onChange}
        placeholder={selector.placeholder ?? selector.label}
        ariaLabel={selector.label}
        theme={props.selectTheme}
      />
    );
  });
};

const splitCustomSides = <TData,>(props: KanbanToolbarProps<TData>) => {
  const controls = [
    ...(props.toggleGroups ?? []),
    ...(props.headerSelectors ?? []),
  ];
  return {
    left: controls.filter((control) => control.position === "left").map((c) => c.id),
    right: controls.filter((control) => control.position !== "left").map((c) => c.id),
  };
};

export const KanbanToolbar = <TData,>(props: KanbanToolbarProps<TData>) => {
  const slots: Record<string, ReactNode> = {};
  fillFixedSlots(props, slots);
  fillCustomSlots(props, slots);
  const custom = splitCustomSides(props);
  const clusters = resolveToolbarClusters({
    layout: props.toolbarLayout,
    isVisible: (id) => id in slots,
    customLeftIds: custom.left,
    customRightIds: custom.right,
  });

  return (
    <div className="rkb-toolbar">
      <div className="rkb-toolbar-left">
        {clusters.left.map((id) => (
          <Fragment key={id}>{slots[id]}</Fragment>
        ))}
      </div>
      <div className="rkb-toolbar-right">
        {clusters.right.map((id) => (
          <Fragment key={id}>{slots[id]}</Fragment>
        ))}
      </div>
    </div>
  );
};
