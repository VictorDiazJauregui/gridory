import type { ReactNode } from "react";

const HEADING_ID = "controls-scroll-area-title";

interface ControlsScrollAreaProps {
  /** Controls mounted at the very bottom of the scrolling area. */
  children?: ReactNode;
}

// Sits at the bottom of the page on purpose: a control mounted here has little
// room below it (its panel must open upwards) and a scrolling ancestor that can
// clip a panel that is not portaled.
export const ControlsScrollArea = ({ children }: ControlsScrollAreaProps) => (
  <section aria-labelledby={HEADING_ID} className="rounded-lg border bg-card p-4">
    <h3 id={HEADING_ID} className="text-base font-semibold">Contenedor con scroll</h3>
    <p className="mt-1 text-xs text-muted-foreground">
      Para probar la apertura hacia arriba y que los paneles no queden recortados.
    </p>
    <div role="region" tabIndex={0} aria-label="Área con scroll" className="mt-3 h-40 overflow-y-auto rounded-md border border-dashed">
      <div className="flex h-96 flex-col items-center justify-end gap-3 bg-muted/40 p-4">
        <p className="text-center text-xs text-muted-foreground">
          Final del área con scroll: aquí se montan los controles que abren un panel.
        </p>
        {children}
      </div>
    </div>
  </section>
);
