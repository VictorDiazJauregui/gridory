import { useId, type ReactNode } from "react";
import { ExpandedContentIdContext } from "./expanded-content-id";

// Mounted only with `renderExpandedRow`: a client `useId` advances a page-wide counter, so calling it in every
// table would shift the ids Radix gives the rest of the page.
export const ExpandedContentIdScope = ({ children }: { children: ReactNode }) => (
  <ExpandedContentIdContext.Provider value={useId()}>{children}</ExpandedContentIdContext.Provider>
);
