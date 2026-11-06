import { VisuallyHidden } from "radix-ui";

interface HelpDescriptionProps {
  text: string;
  descriptionId: string;
}

/** The help text for screen readers, linked from the header trigger with aria-describedby. */
export const TableHeaderHelpDescription = ({ text, descriptionId }: HelpDescriptionProps) => (
  <VisuallyHidden.Root id={descriptionId}>{text}</VisuallyHidden.Root>
);
