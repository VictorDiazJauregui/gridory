import { groupFieldRows } from "../config/field-rows";
import type { AuthShellView } from "../model/auth-shell-view";
import { AuthField } from "./AuthField";

interface AuthFieldListProps {
  shell: AuthShellView;
}

export const AuthFieldList = ({ shell }: AuthFieldListProps) => (
  <div className="gdy-auth-fields">
    {groupFieldRows(shell.fields).map((row) =>
      row.length === 1 ? (
        <AuthField key={row[0].name} field={row[0]} shell={shell} />
      ) : (
        <div key={row.map((field) => field.name).join("-")} className="gdy-auth-name-row">
          {row.map((field) => (
            <AuthField key={field.name} field={field} shell={shell} />
          ))}
        </div>
      ),
    )}
  </div>
);
