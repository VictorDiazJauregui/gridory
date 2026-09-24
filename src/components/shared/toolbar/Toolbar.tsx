import { Fragment, type ReactNode } from "react";
import type {
  AiButtonConfig,
  ArchivedViewMode,
  ViewSwitchConfig,
} from "../data-model";
import type {
  HeaderSelectConfig,
  SelectOption,
  ToggleGroupConfig,
} from "../toolbar-controls";
import type { SelectTheme } from "../select-theme";
import { resolveToolbarClusters, type ToolbarLayout } from "./toolbar-layout";
import { SimpleSelect } from "../../ui/select/select";
import { SegmentedControl } from "../../ui/toggle-group/toggle-group";
import { ToolbarAiButton } from "./ToolbarAiButton";
import { ToolbarClearFilters } from "./ToolbarClearFilters";
import { ToolbarCreateButton } from "./ToolbarCreateButton";
import { ToolbarSearch } from "./ToolbarSearch";
import { ToolbarViewSwitch } from "./ToolbarViewSwitch";

const DEFAULT_ARCHIVED_OPTION_LABELS: Record<ArchivedViewMode, string> = {
  active: "Activos",
  archived: "Archivados",
  all: "Todos",
};

const ARCHIVED_OPTION_ORDER: ArchivedViewMode[] = ["active", "archived", "all"];

interface ToolbarGroupSelector {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
}

interface ToolbarProps {
  showSearch: boolean;
  search: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  showClearFilters: boolean;
  onClearFilters: () => void;
  showCreateButton: boolean;
  createLabel: string;
  onCreate?: () => void;
  groupSelector?: ToolbarGroupSelector;
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

type ToolbarSlots = Record<string, ReactNode>;

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

const buildArchivedOptions = (props: ToolbarProps): SelectOption[] => {
  const label = props.archivedViewLabel ?? "Mostrar";
  const optionLabel = (mode: ArchivedViewMode) =>
    props.archivedViewOptionLabels?.[mode] ??
    DEFAULT_ARCHIVED_OPTION_LABELS[mode];
  return ARCHIVED_OPTION_ORDER.map((mode) => ({
    value: mode,
    label: `${label}: ${optionLabel(mode)}`,
  }));
};

const fillSearchSlots = (props: ToolbarProps, slots: ToolbarSlots) => {
  if (props.showSearch)
    slots.search = (
      <ToolbarSearch
        search={props.search}
        placeholder={props.searchPlaceholder}
        onChange={props.onSearchChange}
      />
    );
  if (props.showClearFilters)
    slots.clearFilters = <ToolbarClearFilters onClear={props.onClearFilters} />;
};

const fillArchivedSlot = (props: ToolbarProps, slots: ToolbarSlots) => {
  if (!props.showArchivedView) return;
  slots.archived = (
    <SimpleSelect
      options={buildArchivedOptions(props)}
      value={props.archivedMode}
      onValueChange={(value) =>
        props.onArchivedModeChange(value as ArchivedViewMode)
      }
      ariaLabel={props.archivedViewLabel ?? "Mostrar"}
      theme={props.selectTheme}
    />
  );
};

const fillGroupSlot = (props: ToolbarProps, slots: ToolbarSlots) => {
  const { groupSelector, selectTheme } = props;
  if (!groupSelector) return;
  slots.group = (
    <SimpleSelect
      options={groupSelector.options}
      value={groupSelector.value}
      onValueChange={groupSelector.onChange}
      ariaLabel={groupSelector.ariaLabel}
      theme={selectTheme}
    />
  );
};

const fillActionSlots = (props: ToolbarProps, slots: ToolbarSlots) => {
  if (props.aiButton) slots.ai = <ToolbarAiButton config={props.aiButton} />;
  if (props.viewSwitch)
    slots.viewSwitch = <ToolbarViewSwitch config={props.viewSwitch} />;
  if (props.showCreateButton && props.onCreate)
    slots.create = (
      <ToolbarCreateButton
        label={props.createLabel}
        onCreate={props.onCreate}
      />
    );
};

const fillToggleGroupSlots = (props: ToolbarProps, slots: ToolbarSlots) => {
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
};

const fillHeaderSelectorSlots = (props: ToolbarProps, slots: ToolbarSlots) => {
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

const buildSlots = (props: ToolbarProps): ToolbarSlots => {
  const slots: ToolbarSlots = {};
  fillSearchSlots(props, slots);
  fillArchivedSlot(props, slots);
  fillGroupSlot(props, slots);
  fillActionSlots(props, slots);
  fillToggleGroupSlots(props, slots);
  fillHeaderSelectorSlots(props, slots);
  return slots;
};

const splitCustomSides = (props: ToolbarProps) => {
  const controls = [
    ...(props.toggleGroups ?? []),
    ...(props.headerSelectors ?? []),
  ];
  const leftControls = controls.filter((item) => item.position === "left");
  const rightControls = controls.filter((item) => item.position !== "left");
  return {
    left: leftControls.map((item) => item.id),
    right: rightControls.map((item) => item.id),
  };
};

const resolveClusters = (props: ToolbarProps, slots: ToolbarSlots) => {
  const custom = splitCustomSides(props);
  return resolveToolbarClusters({
    layout: props.toolbarLayout,
    isVisible: (id) => id in slots,
    customLeftIds: custom.left,
    customRightIds: custom.right,
  });
};

export const Toolbar = (props: ToolbarProps) => {
  const slots = buildSlots(props);
  const clusters = resolveClusters(props, slots);
  return (
    <div className="gdy-toolbar">
      <div className="gdy-toolbar-left">
        {clusters.left.map((id) => (
          <Fragment key={id}>{slots[id]}</Fragment>
        ))}
      </div>
      <div className="gdy-toolbar-right">
        {clusters.right.map((id) => (
          <Fragment key={id}>{slots[id]}</Fragment>
        ))}
      </div>
    </div>
  );
};
