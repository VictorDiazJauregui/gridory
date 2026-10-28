import { useLayoutEffect, type ReactNode, type RefObject } from "react";
import { fitPanelInView } from "./fit-in-view";

interface FilterMenuHolderProps {
  className: string;
  holderRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}

export const FilterMenuHolder = ({ className, holderRef, children }: FilterMenuHolderProps) => {
  useLayoutEffect(() => {
    if (holderRef.current) fitPanelInView(holderRef.current);
  }, [holderRef]);
  return (
    <div className={className} ref={holderRef}>
      {children}
    </div>
  );
};
