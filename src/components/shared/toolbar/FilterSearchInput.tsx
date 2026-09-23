import { Search } from "lucide-react";

interface FilterSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const FilterSearchInput = ({
  value,
  onChange,
}: FilterSearchInputProps) => (
  <div className="gdy-search-sm">
    <Search className="gdy-search-sm-icon" size={14} />
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Buscar..."
      className="gdy-input gdy-input-sm"
    />
  </div>
);
