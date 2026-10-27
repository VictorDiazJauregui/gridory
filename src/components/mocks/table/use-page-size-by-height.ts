import { useEffect, useState } from "react";

const ROW_HEIGHT = 40;
const CHROME_HEIGHT = 140;
const DEFAULT_PAGE_SIZE = 10;

// The recipe of docs/table.md: the app measures its container and passes the page size controlled.
export const usePageSizeByHeight = (element: HTMLElement | null) => {
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  useEffect(() => {
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setPageSize(Math.max(1, Math.floor((entry.contentRect.height - CHROME_HEIGHT) / ROW_HEIGHT)));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);
  return pageSize;
};
