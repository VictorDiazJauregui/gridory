import { DataTable } from "../../table";
import { CompanyDetailNotice } from "./CompanyDetailNotice";
import { useCompanyDetail } from "./use-company-detail";
import { useDataTableMockProps } from "./use-data-table-mock-props";

export const DataTableMock = () => {
  const { detailId, openCompany, closeCompany } = useCompanyDetail();
  const props = useDataTableMockProps(openCompany);
  return (
    <>
      <CompanyDetailNotice detailId={detailId} onClose={closeCompany} />
      <DataTable {...props} />
    </>
  );
};
