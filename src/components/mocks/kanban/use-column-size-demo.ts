import { useState } from "react";

export const COLUMN_WIDTH_OPTIONS = [260, 400];

export interface ColumnSizeSettings {
  fillHeight: boolean;
  fillWidth: boolean;
  columnWidth?: number;
}

const readColumnWidth = (params: URLSearchParams) => {
  const width = Number(params.get("columnWidth"));
  return COLUMN_WIDTH_OPTIONS.includes(width) ? width : undefined;
};

// `?fillHeight=1&fillWidth=1&columnWidth=400` opens the demo with the controls set, so a screenshot can be reproduced.
const readInitialSettings = (): ColumnSizeSettings => {
  const params = new URLSearchParams(window.location.search);
  return {
    fillHeight: params.get("fillHeight") === "1",
    fillWidth: params.get("fillWidth") === "1",
    columnWidth: readColumnWidth(params),
  };
};

/** Demo controls of the 2.1.0 column size props: the board only reads them. */
export const useColumnSizeDemo = () => {
  const [settings, setSettings] = useState(readInitialSettings);
  const changeSettings = (change: Partial<ColumnSizeSettings>) => setSettings((current) => ({ ...current, ...change }));
  return { settings, changeSettings };
};
