import { useId, useState, type FormEvent } from "react";
import { useMarkdownEditorContext } from "../model/markdown-editor-context";
import type { MarkdownTableDialogTexts } from "../types";
import type { TableAlignment, TableDialogProps } from "./dialog-types";
import { MarkdownDialogFrame } from "./MarkdownDialogFrame";
import { TableAlignmentChoice } from "./TableAlignmentChoice";
import { TableGridPreview } from "./TableGridPreview";
import { TableSizeField } from "./TableSizeField";
import { clampTableSize } from "./table-size";

const DEFAULT_TABLE = { rows: 3, columns: 3 };

type TableFormProps = Pick<TableDialogProps, "onInsert" | "limits"> & { formId: string };

const useTableSize = (initial: number, max: number) => {
  const [value, setValue] = useState(Math.min(initial, max));
  const [clamped, setClamped] = useState(false);
  const change = (next: number) => {
    const safe = clampTableSize(next, max);
    setClamped(Number.isFinite(next) && safe !== next);
    setValue(safe);
  };
  return { value, change, clamped };
};

const TableLimitHint = ({ clamped, limits, texts }: { clamped: boolean; limits: TableDialogProps["limits"]; texts: MarkdownTableDialogTexts }) => (
  <p className="gdy-md-dialog-hint" role="status">
    {clamped ? `${texts.clamped} ` : ""}
    {texts.limitHint.replace("{rows}", String(limits.tableRows)).replace("{columns}", String(limits.tableColumns))}
  </p>
);

const useTableForm = ({ onInsert, limits }: Pick<TableDialogProps, "onInsert" | "limits">) => {
  const rows = useTableSize(DEFAULT_TABLE.rows, limits.tableRows);
  const columns = useTableSize(DEFAULT_TABLE.columns, limits.tableColumns);
  const [alignment, setAlignment] = useState<TableAlignment>("left");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onInsert({ rows: rows.value, columns: columns.value, alignment });
  };
  return { rows, columns, alignment, setAlignment, submit };
};

const TableForm = ({ onInsert, limits, formId }: TableFormProps) => {
  const { texts } = useMarkdownEditorContext("TableDialog");
  const { rows, columns, alignment, setAlignment, submit } = useTableForm({ onInsert, limits });
  const tableTexts = texts.dialogs.table;
  return (
    <form id={formId} className="gdy-md-dialog-fields" noValidate onSubmit={submit}>
      <div className="gdy-md-table-size">
        <TableSizeField label={tableTexts.rows} value={rows.value} max={limits.tableRows} onChange={rows.change} />
        <TableSizeField label={tableTexts.columns} value={columns.value} max={limits.tableColumns} onChange={columns.change} />
      </div>
      <TableLimitHint clamped={rows.clamped || columns.clamped} limits={limits} texts={tableTexts} />
      <TableAlignmentChoice alignment={alignment} onChange={setAlignment} texts={tableTexts} />
      <TableGridPreview rows={rows.value} columns={columns.value} alignment={alignment} label={tableTexts.preview} />
    </form>
  );
};

export const TableDialog = ({ open, onOpenChange, onInsert, limits }: TableDialogProps) => {
  const { texts } = useMarkdownEditorContext("TableDialog");
  const formId = useId();
  return (
    <MarkdownDialogFrame open={open} onOpenChange={onOpenChange} title={texts.dialogs.table.title} formId={formId}>
      <TableForm formId={formId} onInsert={onInsert} limits={limits} />
    </MarkdownDialogFrame>
  );
};
