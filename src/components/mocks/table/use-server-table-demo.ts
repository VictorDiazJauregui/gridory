import { useEffect, useMemo, useState } from "react";
import type { ColumnFiltersState, ManualPaginationState } from "../../table";
import type { ColumnSortingState } from "../../shared/data-model";
import { useDemoEventLog } from "../shared/use-demo-event-log";
import { fetchCompanyPage, type ServerPage, type ServerPageRequest } from "./simulated-server";

const FIRST_REQUEST: ServerPageRequest = {
  pageIndex: 0,
  pageSize: 10,
  sorting: null,
  filters: { values: {}, dates: {} },
  search: "",
};
const EMPTY_PAGE: ServerPage = { rows: [], total: 0 };

interface AnsweredRequest {
  request: ServerPageRequest;
  result: ServerPage;
}

// The page is "loading" until the answer for the current request arrives.
const useServerPage = (request: ServerPageRequest) => {
  const [answered, setAnswered] = useState<AnsweredRequest | null>(null);
  useEffect(() => {
    let current = true;
    fetchCompanyPage(request).then((result) => {
      if (current) setAnswered({ request, result });
    });
    return () => {
      current = false;
    };
  }, [request]);
  return { result: answered?.result ?? EMPTY_PAGE, loading: answered?.request !== request };
};

// Each event updates the request the "server" answers; one request covers changes that come together.
const useServerRequest = () => {
  const [request, setRequest] = useState(FIRST_REQUEST);
  const { events, record } = useDemoEventLog();
  const patch = (changes: Partial<ServerPageRequest>) => setRequest((previous) => ({ ...previous, ...changes }));
  const update = (type: string, payload: unknown, changes: Partial<ServerPageRequest>) => {
    record(type, payload);
    patch(changes);
  };
  return { request, events, update, patch };
};

// "Rows by height" owns the page size: the measured size replaces the requested one.
const useEffectiveRequest = (request: ServerPageRequest, measuredPageSize: number | null) =>
  useMemo(
    () => (measuredPageSize === null ? request : { ...request, pageSize: measuredPageSize }),
    [request, measuredPageSize],
  );

export const useServerTableDemo = (measuredPageSize: number | null) => {
  const { request: requested, events, update, patch } = useServerRequest();
  const request = useEffectiveRequest(requested, measuredPageSize);
  const { result, loading } = useServerPage(request);
  return {
    request,
    result,
    loading,
    events,
    onSortChange: (sorting: ColumnSortingState | null) => update("onSortChange", sorting, { sorting }),
    onFiltersChange: (filters: ColumnFiltersState) => update("onFiltersChange", filters, { filters }),
    onPaginationChange: (page: ManualPaginationState) => update("onPaginationChange", page, page),
    onSearchChange: (search: string) => update("onSearchChange", search, { search }),
    goToFirstPage: () => patch({ pageIndex: 0 }),
  };
};
