// Same boxes and classes as the real fields, so the panel keeps its size while the calendar downloads.
const PlaceholderField = () => (
  <div className="gdy-date-picker-input">
    <div className="gdy-date-input" />
  </div>
);

export const DatePickersPlaceholder = ({ isRange }: { isRange: boolean }) => {
  if (!isRange) return <PlaceholderField />;
  return (
    <div className="gdy-date-range-inputs">
      <PlaceholderField />
      <PlaceholderField />
    </div>
  );
};
