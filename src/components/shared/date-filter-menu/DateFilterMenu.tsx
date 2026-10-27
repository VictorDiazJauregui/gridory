import { DateFilterActions } from "./DateFilterActions";
import { DateFilterDatesSection } from "./DateFilterDatesSection";
import { DateOperatorSection } from "./DateOperatorSection";
import { DateSortSection } from "./DateSortSection";
import { resolveDateFilterMenuSettings } from "./date-filter-menu-settings";
import type { DateFilterMenuProps } from "./date-filter-menu-settings";
import { useDateFilterDraft } from "./use-date-filter-draft";

export const DateFilterMenu = (props: DateFilterMenuProps) => {
  const settings = resolveDateFilterMenuSettings(props);
  const draft = useDateFilterDraft(settings);
  const { labels } = settings;
  return (
    <div className="gdy-panel gdy-panel-date">
      <DateSortSection sort={settings} labels={labels} />
      <DateOperatorSection draft={draft} labels={labels} />
      <DateFilterDatesSection draft={draft} settings={settings} />
      <DateFilterActions draft={draft} labels={labels} />
    </div>
  );
};
