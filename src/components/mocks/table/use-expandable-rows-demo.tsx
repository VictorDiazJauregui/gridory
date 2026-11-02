import type { DataTableProps } from "../../table";
import type { MockCompanyRow } from "../company/company-rows";
import { hasCompanyContacts } from "./company-contacts";
import { CompanyContacts } from "./CompanyContacts";

/** Expandable rows (1.4.0): each company opens its contacts; one without contacts has no button. */
export const withExpandableRowsDemo = (props: DataTableProps<MockCompanyRow>): DataTableProps<MockCompanyRow> => ({
  ...props,
  renderExpandedRow: (company) => <CompanyContacts company={company} />,
  canExpandRow: hasCompanyContacts,
});
