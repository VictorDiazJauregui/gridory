import { useEffect, useState } from "react";
import type { ManualPaginationState } from "../../table";
import type { ColumnSortingState } from "../../shared/data-model";
import { useDemoEventLog } from "../shared/use-demo-event-log";
import { fetchCompanyPage, type ServerPage } from "./simulated-server";

const FIRST_PAGE: ManualPaginationState = { pageIndex: 0, pageSize: 10 };
const EMPTY_PAGE: ServerPage = { rows: [], total: 0 };

interface AnsweredRequest {
  sorting: ColumnSortingState | null;
  page: ManualPaginationState;
  result: ServerPage;
}

// The page is "loading" until the answer for the current sort and page arrives.
const useServerPage = (sorting: ColumnSortingState | null, page: ManualPaginationState) => {
  const [answered, setAnswered] = useState<AnsweredRequest | null>(null);
  useEffect(() => {
    let current = true;
    fetchCompanyPage({ ...page, sorting }).then((result) => {
      if (current) setAnswered({ sorting, page, result });
    });
    return () => {
      current = false;
    };
  }, [sorting, page]);
  const loading = answered?.sorting !== sorting || answered?.page !== page;
  return { result: answered?.result ?? EMPTY_PAGE, loading };
};

export const useServerTableDemo = () => {
  const [sorting, setSorting] = useState<ColumnSortingState | null>(null);
  const [page, setPage] = useState(FIRST_PAGE);
  const { events, record } = useDemoEventLog();
  const { result, loading } = useServerPage(sorting, page);
  const onSortChange = (next: ColumnSortingState | null) => {
    record("onSortChange", next);
    setSorting(next);
  };
  const onPaginationChange = (next: ManualPaginationState) => {
    record("onPaginationChange", next);
    setPage(next);
  };
  return { sorting, page, result, loading, events, onSortChange, onPaginationChange };
};
