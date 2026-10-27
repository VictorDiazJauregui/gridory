import { Search } from "lucide-react";

interface FilterSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const FilterSearchInput = ({
  value,
  onChange,
  placeholder,
}: FilterSearchInputProps) => (
  <div className="gdy-search-sm">
    <Search className="gdy-search-sm-icon" size={14} />
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="gdy-input gdy-input-sm"
    />
  </div>
);
