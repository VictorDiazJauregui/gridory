import type { Dispatch, SetStateAction } from "react";
import type { MockCompanyRow } from "./company-rows";

export type MockRowsUpdater = Dispatch<SetStateAction<MockCompanyRow[]>>;

export const replaceRow = (
  setRows: MockRowsUpdater,
  updatedRow: MockCompanyRow,
) =>
  setRows((previousRows) =>
    previousRows.map((item) =>
      item.id === updatedRow.id ? updatedRow : item,
    ),
  );

export const removeRow = (setRows: MockRowsUpdater, rowId: string) =>
  setRows((previousRows) => previousRows.filter((item) => item.id !== rowId));
