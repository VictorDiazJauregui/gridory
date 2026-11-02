import { DataTable, type ColumnDefinition } from "../../table";
import { translateWithCurrentLanguage } from "../shared/demo-dictionary";
import type { MockCompanyRow } from "../company/company-rows";
import { listCompanyContacts, type MockCompanyContact } from "./company-contacts";

const buildContactColumns = (): ColumnDefinition<MockCompanyContact>[] => [
  { id: "name", header: translateWithCurrentLanguage("Contacto"), accessor: (contact) => contact.name, width: 200 },
  { id: "role", header: translateWithCurrentLanguage("Área"), accessor: (contact) => contact.role, width: 140 },
  { id: "email", header: translateWithCurrentLanguage("Correo"), accessor: (contact) => contact.email },
];

/** Detail of an expanded company: a second DataTable without toolbar, filters or pagination. */
export const CompanyContacts = ({ company }: { company: MockCompanyRow }) => (
  <DataTable
    columns={buildContactColumns()}
    data={{ results: listCompanyContacts(company) }}
    getRowId={(contact) => contact.id}
    features={{ toolbar: false, filtering: false, pagination: false }}
    tableMinHeightClassName=""
    label="contactos"
  />
);
