import { cn } from "../../../lib/cn";
import { resolveRootStyle } from "../root-style";
import { ListboxEmpty } from "./ListboxEmpty";
import { ListboxOptionList } from "./ListboxOptionList";
import { ListboxSearch } from "./ListboxSearch";
import { applyListboxDefaults, resolveListboxTexts, type ListboxProps } from "./listbox-props";
import { useActiveOptionScroll } from "./use-active-option-scroll";
import { useListboxInteraction } from "./use-listbox-interaction";

export const Listbox = (props: ListboxProps) => {
  const resolvedProps = applyListboxDefaults(props);
  const interaction = useListboxInteraction(resolvedProps);
  const listRef = useActiveOptionScroll(interaction.activeOptionId, interaction.scrollsToActiveOption);
  const texts = resolveListboxTexts(resolvedProps.texts);
  return (
    <div
      className={cn("gdy-listbox", resolvedProps.thinScrollbars && "gdy-thin-scroll")}
      style={resolveRootStyle({ scrollbarColor: resolvedProps.scrollbarColor })}
    >
      <ListboxSearch interaction={interaction} texts={texts} />
      <ListboxOptionList interaction={interaction} resolvedProps={resolvedProps} listRef={listRef} />
      <ListboxEmpty text={texts.noResults} hasResults={interaction.visibleOptions.length > 0} />
    </div>
  );
};
