import { cn } from "../../../lib/cn";
import { SimpleSelect } from "../../ui/select/select";
import type { AuthShellView } from "../model/auth-shell-view";
import type { ResolvedAuthField } from "../config/resolved-field";
import { fieldAriaAttributes, textValueOf } from "./field-attributes";

interface AuthSelectControlProps {
  field: ResolvedAuthField;
  shell: AuthShellView;
}

export const AuthSelectControl = ({ field, shell }: AuthSelectControlProps) => (
  <SimpleSelect
    options={field.options ?? []}
    value={textValueOf(field, shell)}
    onValueChange={(value) => shell.form.changeField(field, value)}
    placeholder={field.placeholder}
    triggerClassName={cn("gdy-auth-select", shell.display.classNames?.input)}
    triggerAttributes={{
      id: shell.form.idFor(field.name),
      ...fieldAriaAttributes(field, shell),
    }}
  />
);
