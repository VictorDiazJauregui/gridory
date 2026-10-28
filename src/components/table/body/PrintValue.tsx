interface PrintValueProps {
  text: string | undefined;
}

/** Text that replaces the next sibling on paper with `printMode`; hidden on screen. */
export const PrintValue = ({ text }: PrintValueProps) =>
  text === undefined ? null : <span className="gdy-table-print-value">{text}</span>;
