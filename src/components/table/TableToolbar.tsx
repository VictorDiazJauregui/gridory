import { Fragment, type ReactNode } from "react";
import { FilterX, Plus, Search } from "lucide-react";
import type {
  ArchivedViewMode,
  AiButtonConfig,
  ViewSwitchConfig,
} from "./types";
import type {
  HeaderSelectConfig,
  SelectOption,
  ToggleGroupConfig,
} from "../shared/toolbar-controls";
import type { SelectTheme } from "../shared/select-theme";
import {
  resolveToolbarClusters,
  type ToolbarLayout,
} from "../shared/toolbar-layout";
import { SimpleSelect } from "../ui/select";
import { SegmentedControl } from "../ui/toggle-group";
import { ToolbarAiButton } from "./ToolbarAiButton";
import { ToolbarViewSwitch } from "./ToolbarViewSwitch";

interface GroupOption {
  id: string;
  label: string;
}

const GROUP_NONE_VALUE = "__rdt_group_none__";

const DEFAULT_ARCHIVED_OPTION_LABELS: Record<ArchivedViewMode, string> = {
  active: "Activos",
  archived: "Archivados",
  all: "Todos",
};

const ARCHIVED_OPTION_ORDER: ArchivedViewMode[] = ["active", "archived", "all"];

interface TableToolbarProps {
  showSearch: boolean;
  search: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  showClearFilters: boolean;
  onClearFilters: () => void;
  showCreateButton: boolean;
  createLabel: string;
  onCreate?: () => void;
  showGroupSelector: boolean;
  groupOptions: GroupOption[];
  activeGroupBy: string | null;
  onGroupByChange: (groupBy: string | null) => void;
  groupSelectorLabel: string;
  groupNoneLabel: string;
  showArchivedView: boolean;
  archivedMode: ArchivedViewMode;
  onArchivedModeChange: (mode: ArchivedViewMode) => void;
  archivedViewLabel?: string;
  archivedViewOptionLabels?: Partial<Record<ArchivedViewMode, string>>;
  viewSwitch?: ViewSwitchConfig;
  aiButton?: AiButtonConfig;
  toggleGroups?: ToggleGroupConfig[];
  headerSelectors?: HeaderSelectConfig[];
  toolbarLayout?: ToolbarLayout;
  selectTheme?: SelectTheme;
}

const prefixedOptions = (
  options: SelectOption[],
  prefix?: string,
): SelectOption[] =>
  prefix
    ? options.map((option) => ({
        value: option.value,
        label: `${prefix}: ${option.label}`,
      }))
    : options;

const buildArchivedOptions = (props: TableToolbarProps): SelectOption[] => {
  const label = props.archivedViewLabel ?? "Mostrar";
  const optionLabel = (mode: ArchivedViewMode) =>
    props.archivedViewOptionLabels?.[mode] ?? DEFAULT_ARCHIVED_OPTION_LABELS[mode];
  return ARCHIVED_OPTION_ORDER.map((mode) => ({
    value: mode,
    label: `${label}: ${optionLabel(mode)}`,
  }));
};

const buildGroupSelectOptions = (props: TableToolbarProps): SelectOption[] => [
  { value: GROUP_NONE_VALUE, label: `${props.groupSelectorLabel}: ${props.groupNoneLabel}` },
  ...props.groupOptions.map((option) => ({
    value: option.id,
    label: `${props.groupSelectorLabel}: ${option.label}`,
  })),
];

const SearchSlot = ({
  search,
  placeholder,
  onChange,
}: {
  search: string;
  placeholder: string;
  onChange: (value: string) => void;
}) => (
  <div className="rdt-search">
    <Search size={14} className="rdt-search-icon" />
    <input
      type="search"
      name="rdt-search"
      autoComplete="off"
      data-1p-ignore="true"
      data-lpignore="true"
      data-form-type="other"
      data-bwignore="true"
      value={search}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="rdt-input"
    />
  </div>
);

const ClearFiltersSlot = ({ onClear }: { onClear: () => void }) => (
  <button type="button" className="rdt-btn rdt-btn-ghost" onClick={onClear}>
    <div>Limpiar filtros</div>
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
  <button type="button" className="rdt-btn rdt-btn-primary" onClick={onCreate}>
    <Plus size={14} />
    {label}
  </button>
);

const fillFixedSlots = (
  props: TableToolbarProps,
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
  if (props.showGroupSelector && props.groupOptions.length > 0)
    slots.group = (
      <SimpleSelect
        options={buildGroupSelectOptions(props)}
        value={props.activeGroupBy ?? GROUP_NONE_VALUE}
        onValueChange={(value) =>
          props.onGroupByChange(value === GROUP_NONE_VALUE ? null : value)
        }
        ariaLabel={props.groupSelectorLabel}
        theme={selectTheme}
      />
    );
  if (props.aiButton) slots.ai = <ToolbarAiButton config={props.aiButton} />;
  if (props.viewSwitch) slots.viewSwitch = <ToolbarViewSwitch config={props.viewSwitch} />;
  if (props.showCreateButton && props.onCreate)
    slots.create = <CreateSlot label={props.createLabel} onCreate={props.onCreate} />;
};

const fillCustomSlots = (
  props: TableToolbarProps,
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
        options={prefixedOptions(selector.options, selector.label)}
        value={selector.value}
        onValueChange={selector.onChange}
        placeholder={selector.placeholder ?? selector.label}
        ariaLabel={selector.label}
        theme={props.selectTheme}
      />
    );
  });
};

const splitCustomSides = (props: TableToolbarProps) => {
  const controls = [
    ...(props.toggleGroups ?? []),
    ...(props.headerSelectors ?? []),
  ];
  return {
    left: controls.filter((control) => control.position === "left").map((c) => c.id),
    right: controls.filter((control) => control.position !== "left").map((c) => c.id),
  };
};

export const TableToolbar = (props: TableToolbarProps) => {
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
    <div className="rdt-toolbar">
      <div className="rdt-toolbar-left">
        {clusters.left.map((id) => (
          <Fragment key={id}>{slots[id]}</Fragment>
        ))}
      </div>
      <div className="rdt-toolbar-right">
        {clusters.right.map((id) => (
          <Fragment key={id}>{slots[id]}</Fragment>
        ))}
      </div>
    </div>
  );
};
