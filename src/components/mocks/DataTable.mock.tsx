import { DataTable } from "../table";
import { useDataTableMockProps } from "./use-data-table-mock-props";

export const DataTableMock = () => {
  const props = useDataTableMockProps();
  return <DataTable {...props} />;
};
