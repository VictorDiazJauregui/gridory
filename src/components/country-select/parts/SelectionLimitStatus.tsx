interface SelectionLimitStatusProps {
  message: string | null;
}

// Mounted even while empty: a live region only announces changes once it is in the page.
export const SelectionLimitStatus = ({ message }: SelectionLimitStatusProps) => (
  <p role="status" className="gdy-country-select-status">
    {message}
  </p>
);
