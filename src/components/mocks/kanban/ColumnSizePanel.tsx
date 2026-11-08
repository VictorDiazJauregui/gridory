import { useDemoText } from "../shared/demo-dictionary";
import { COLUMN_WIDTH_OPTIONS, type ColumnSizeSettings } from "./use-column-size-demo";

interface ColumnSizePanelProps {
  settings: ColumnSizeSettings;
  changeSettings: (change: Partial<ColumnSizeSettings>) => void;
}

const CHECKBOX_LABEL = "inline-flex items-center gap-1.5 text-xs text-gdy-foreground";

const ColumnWidthSelect = ({ settings, changeSettings }: ColumnSizePanelProps) => {
  const translate = useDemoText();
  return (
    <label className={CHECKBOX_LABEL}>
      {translate("Ancho de columna")}
      <select
        className="h-8 rounded-gdy-md border bg-gdy-background px-2 text-xs text-gdy-foreground"
        value={settings.columnWidth ?? ""}
        onChange={(event) => changeSettings({ columnWidth: Number(event.target.value) || undefined })}
      >
        <option value="">{translate("Por defecto (320 px)")}</option>
        {COLUMN_WIDTH_OPTIONS.map((width) => (
          <option key={width} value={width}>{`${width} px`}</option>
        ))}
      </select>
    </label>
  );
};

export const ColumnSizePanel = ({ settings, changeSettings }: ColumnSizePanelProps) => {
  const translate = useDemoText();
  return (
    <fieldset className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-gdy-md border px-3 py-2">
      <legend className="px-1 text-xs font-medium text-gdy-muted-foreground">{translate("Tamaño de las columnas")}</legend>
      <label className={CHECKBOX_LABEL}>
        <input type="checkbox" checked={settings.fillHeight} onChange={(event) => changeSettings({ fillHeight: event.target.checked })} />
        {translate("Alto completo")}
      </label>
      <ColumnWidthSelect settings={settings} changeSettings={changeSettings} />
      <label className={CHECKBOX_LABEL}>
        <input type="checkbox" checked={settings.fillWidth} onChange={(event) => changeSettings({ fillWidth: event.target.checked })} />
        {translate("Ancho automático")}
      </label>
    </fieldset>
  );
};
