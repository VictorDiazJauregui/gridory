import { Fragment, type ReactNode } from "react";
import { cn } from "../../../lib/cn";
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
import type { DataViewLabels } from "../labels/data-view-labels";
import type { SelectTheme } from "../select-theme";
import { resolveToolbarClusters, type ToolbarLayout } from "./toolbar-layout";
import { SimpleSelect } from "../../ui/select/select";
import { SegmentedControl } from "../../ui/toggle-group/toggle-group";
import { ToolbarAiButton } from "./ToolbarAiButton";
import { ToolbarClearFilters } from "./ToolbarClearFilters";
import { ToolbarCreateButton } from "./ToolbarCreateButton";
import { ToolbarSearch } from "./ToolbarSearch";
import { ToolbarViewSwitch } from "./ToolbarViewSwitch";
import {
  renderToolbarSlot,
  splitSlotSides,
  validateToolbarSlots,
  type ToolbarCustomSlot,
} from "./toolbar-custom-slots";

export type ToolbarLabels = Pick<
  DataViewLabels,
  | "clearFilters"
  | "archivedView"
  | "archivedActive"
  | "archivedArchived"
  | "archivedAll"
  | "viewSwitchTable"
  | "viewSwitchKanban"
  | "aiButton"
  | "labeledValue"
>;

const ARCHIVED_OPTION_LABEL_KEYS: Record<ArchivedViewMode, "archivedActive" | "archivedArchived" | "archivedAll"> = {
  active: "archivedActive",
  archived: "archivedArchived",
  all: "archivedAll",
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
  toolbarSlots?: ToolbarCustomSlot[];
  selectTheme?: SelectTheme;
  labels: ToolbarLabels;
  className?: string;
}

type ToolbarSlots = Record<string, ReactNode>;

const prefixedOptions = (options: SelectOption[], labels: ToolbarLabels, prefix?: string): SelectOption[] =>
  prefix
    ? options.map((option) => ({
        value: option.value,
        label: labels.labeledValue(prefix, option.label),
      }))
    : options;

const resolveArchivedViewLabel = (props: ToolbarProps) => props.archivedViewLabel ?? props.labels.archivedView;

const buildArchivedOptions = (props: ToolbarProps): SelectOption[] => {
  const { labels } = props;
  const optionLabel = (mode: ArchivedViewMode) =>
    props.archivedViewOptionLabels?.[mode] ?? labels[ARCHIVED_OPTION_LABEL_KEYS[mode]];
  return ARCHIVED_OPTION_ORDER.map((mode) => ({
    value: mode,
    label: labels.labeledValue(resolveArchivedViewLabel(props), optionLabel(mode)),
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
    slots.clearFilters = <ToolbarClearFilters label={props.labels.clearFilters} onClear={props.onClearFilters} />;
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
      ariaLabel={resolveArchivedViewLabel(props)}
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
  if (props.aiButton) slots.ai = <ToolbarAiButton config={props.aiButton} defaultLabel={props.labels.aiButton} />;
  if (props.viewSwitch)
    slots.viewSwitch = <ToolbarViewSwitch config={props.viewSwitch} labels={props.labels} />;
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
        options={prefixedOptions(selector.options, props.labels, selector.label)}
        value={selector.value}
        onValueChange={selector.onChange}
        placeholder={selector.placeholder ?? selector.label}
        ariaLabel={selector.label}
        theme={props.selectTheme}
      />
    );
  });
};

const listControlIds = (props: ToolbarProps) => [
  ...(props.toggleGroups ?? []).map((group) => group.id),
  ...(props.headerSelectors ?? []).map((selector) => selector.id),
];

const fillCustomSlots = (props: ToolbarProps, slots: ToolbarSlots) => {
  validateToolbarSlots(props.toolbarSlots, listControlIds(props)).forEach((slot) => {
    slots[slot.id] = renderToolbarSlot(slot);
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
  fillCustomSlots(props, slots);
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
  const trailing = splitSlotSides(props.toolbarSlots ?? []);
  return resolveToolbarClusters({
    layout: props.toolbarLayout,
    isVisible: (id) => id in slots,
    customLeftIds: custom.left,
    customRightIds: custom.right,
    trailingLeftIds: trailing.left,
    trailingRightIds: trailing.right,
  });
};

export const Toolbar = (props: ToolbarProps) => {
  const slots = buildSlots(props);
  const clusters = resolveClusters(props, slots);
  return (
    <div className={cn("gdy-toolbar", props.className)}>
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
