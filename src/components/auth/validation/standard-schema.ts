import type {
  AuthFieldErrors,
  AuthFormValues,
  AuthSchemaIssue,
  AuthStandardSchema,
} from "../types";

/** Issues without a path belong to the whole form, shown above the submit button. */
export const FORM_ERROR_KEY = "";

const issueFieldName = (issue: AuthSchemaIssue): string => {
  const segment = issue.path?.[0];
  if (segment === undefined) return FORM_ERROR_KEY;
  return String(typeof segment === "object" ? segment.key : segment);
};

export const validateWithSchema = async (
  schema: AuthStandardSchema,
  values: AuthFormValues,
): Promise<AuthFieldErrors> => {
  const result = await schema["~standard"].validate(values);
  if (!result.issues) return {};
  return result.issues.reduce<AuthFieldErrors>((errors, issue) => {
    const name = issueFieldName(issue);
    return name in errors ? errors : { ...errors, [name]: issue.message };
  }, {});
};
