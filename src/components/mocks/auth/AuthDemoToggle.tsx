import type { DemoOption } from "./auth-demo-config";

interface AuthDemoToggleProps<TValue extends string> {
  label: string;
  options: DemoOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
}

const optionClassName = (active: boolean) =>
  `rounded px-3 py-1 text-xs font-medium ${
    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
  }`;

export const AuthDemoToggle = <TValue extends string>({ label, options, value, onChange }: AuthDemoToggleProps<TValue>) => (
  <div role="group" aria-label={label} className="inline-flex rounded-md border bg-muted p-1">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        aria-pressed={value === option.value}
        className={optionClassName(value === option.value)}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);
