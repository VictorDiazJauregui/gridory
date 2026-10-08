import { Tabs } from "radix-ui";
import { GuideSection } from "../guide/GuideSection";
import type { MarkdownGuideTab } from "../guide/guide-types";
import { useMarkdownEditorContext } from "../model/markdown-editor-context";
import type { GuideDialogProps } from "./dialog-types";
import { MarkdownDialogFrame } from "./MarkdownDialogFrame";

const GUIDE_TABS: readonly MarkdownGuideTab[] = ["write", "insert"];

const GuideTabPanel = ({ tab, sections, tools }: Pick<GuideDialogProps, "sections" | "tools"> & { tab: MarkdownGuideTab }) => {
  const texts = useMarkdownEditorContext("GuideDialog").texts.dialogs.guide;
  const tabSections = sections.filter((section) => section.tab === tab);
  return (
    <Tabs.Content value={tab} className="gdy-md-guide-panel">
      {tabSections.length === 0 && <p className="gdy-md-guide-description">{texts.empty}</p>}
      {tabSections.map((section) => <GuideSection key={section.id} section={section} tools={tools} />)}
    </Tabs.Content>
  );
};

export const GuideDialog = ({ open, onOpenChange, sections, tools }: GuideDialogProps) => {
  const texts = useMarkdownEditorContext("GuideDialog").texts.dialogs.guide;
  return (
    <MarkdownDialogFrame open={open} onOpenChange={onOpenChange} title={texts.title} className="gdy-md-guide-dialog">
      <Tabs.Root defaultValue={GUIDE_TABS[0]}>
        <Tabs.List className="gdy-md-image-tab-list" aria-label={texts.title}>
          {GUIDE_TABS.map((tab) => <Tabs.Trigger key={tab} value={tab} className="gdy-md-image-tab">{texts[tab]}</Tabs.Trigger>)}
        </Tabs.List>
        {GUIDE_TABS.map((tab) => <GuideTabPanel key={tab} tab={tab} sections={sections} tools={tools} />)}
      </Tabs.Root>
    </MarkdownDialogFrame>
  );
};
