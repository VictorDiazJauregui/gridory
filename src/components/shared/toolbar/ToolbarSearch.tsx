import { Search } from "lucide-react";

interface ToolbarSearchProps {
  search: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export const ToolbarSearch = (props: ToolbarSearchProps) => (
  <div className="gdy-search">
    <Search size={14} className="gdy-search-icon" />
    <input
      type="search"
      name="gdy-search"
      autoComplete="off"
      data-1p-ignore="true"
      data-lpignore="true"
      data-form-type="other"
      data-bwignore="true"
      value={props.search}
      onChange={(event) => props.onChange(event.target.value)}
      placeholder={props.placeholder}
      className="gdy-input"
    />
  </div>
);
