import { useEffect, useState } from "react";
import type { MockCompanyRow } from "../company/company-rows";

const DETAIL_PARAM = "empresa";

const readDetailId = () => new URLSearchParams(window.location.search).get(DETAIL_PARAM);

export const buildCompanyHref = (company: MockCompanyRow) => {
  const params = new URLSearchParams(window.location.search);
  params.set(DETAIL_PARAM, company.id);
  return `${window.location.pathname}?${params.toString()}`;
};

const withoutDetailParam = () => {
  const params = new URLSearchParams(window.location.search);
  params.delete(DETAIL_PARAM);
  const query = params.toString();
  return query ? `${window.location.pathname}?${query}` : window.location.pathname;
};

// The demo has no detail page: the row link points back here with `?empresa=<id>`, which works in a
// new tab too, and a plain click updates the URL without reloading, as a router would.
export const useCompanyDetail = () => {
  const [detailId, setDetailId] = useState(readDetailId);
  useEffect(() => {
    const syncWithUrl = () => setDetailId(readDetailId());
    window.addEventListener("popstate", syncWithUrl);
    return () => window.removeEventListener("popstate", syncWithUrl);
  }, []);
  const openCompany = (company: MockCompanyRow) => {
    window.history.pushState(null, "", buildCompanyHref(company));
    setDetailId(company.id);
  };
  const closeCompany = () => {
    window.history.pushState(null, "", withoutDetailParam());
    setDetailId(null);
  };
  return { detailId, openCompany, closeCompany };
};
