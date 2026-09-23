import type { Dispatch, SetStateAction } from "react";
import type { MockCompanyRow } from "./mockCompanyRows";

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
