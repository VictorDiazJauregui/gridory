import type {
  ArchivedViewConfig,
  ArchivedViewMode,
  RowActions,
} from "../data-model";
import type { DataViewProps } from "../data-view-props";

interface ArchivedToolbarSettings<TData> {
  archivedView?: ArchivedViewConfig;
  rowActions?: RowActions<TData>;
}

interface ArchivedToolbarState {
  archivedMode: ArchivedViewMode;
  changeArchivedMode: (mode: ArchivedViewMode) => void;
}

export const buildArchivedToolbarProps = <TData>(
  { archivedView, rowActions }: ArchivedToolbarSettings<TData>,
  state: ArchivedToolbarState,
) => ({
  showArchivedView: Boolean(archivedView) && Boolean(rowActions?.getIsArchived),
  archivedMode: state.archivedMode,
  onArchivedModeChange: state.changeArchivedMode,
  archivedViewLabel: archivedView?.label,
  archivedViewOptionLabels: archivedView?.optionLabels,
});

export const pickToolbarPassThrough = <TData>({
  viewSwitch,
  aiButton,
  toggleGroups,
  headerSelectors,
  toolbarLayout,
  selectTheme,
}: DataViewProps<TData>) => ({
  viewSwitch,
  aiButton,
  toggleGroups,
  headerSelectors,
  toolbarLayout,
  selectTheme,
});
