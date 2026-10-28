import { createContext, useContext } from "react";

export const ExpandedContentIdContext = createContext("");

export const useExpandedContentId = (rowId: string) =>
  `${useContext(ExpandedContentIdContext)}detail-${encodeURIComponent(rowId)}`;
