interface ListboxEmptyProps {
  text: string;
  hasResults: boolean;
}

// The status stays mounted and only its text changes: screen readers announce
// a live region reliably only when it already exists before the update.
export const ListboxEmpty = ({ text, hasResults }: ListboxEmptyProps) => (
  <p role="status" className="gdy-listbox-empty">
    {hasResults ? null : text}
  </p>
);
