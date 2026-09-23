import { useRef, useState } from "react";
import type { AIActionEvent } from "../../ai";
import {
  normalizeIncomingRow,
  normalizeOption,
  STATUSES,
  type AiPayload,
} from "./ai-config";
import {
  MOCK_COMPANY_ROWS,
  type MockCompanyRow,
} from "../company/company-rows";
import type { MockRowsUpdater } from "../company/row-updates";

export interface MockAiRows {
  rows: MockCompanyRow[];
  setRows: MockRowsUpdater;
  eventLog: AIActionEvent[];
  handleAIAction: (event: AIActionEvent) => void;
}

interface AiRowsWriter {
  setRows: MockRowsUpdater;
  nextMockId: () => string;
}

const resolvePayloadRecord = (payloadRoot: AiPayload): AiPayload =>
  typeof payloadRoot.record === "object" && payloadRoot.record !== null
    ? (payloadRoot.record as AiPayload)
    : payloadRoot;

const isCreateEvent = (event: AIActionEvent, record: AiPayload): boolean =>
  event.type === "create-row" ||
  event.type === "create-card" ||
  (event.type === "custom" &&
    (typeof record.name === "string" || typeof record.nombre === "string"));

const applyCreate = (
  { setRows, nextMockId }: AiRowsWriter,
  record: AiPayload,
) => {
  const fallbackId = nextMockId();
  const baseRow = normalizeIncomingRow(record, fallbackId);
  setRows((previousRows) => {
    const candidateId = String(baseRow.id || "").trim() || fallbackId;
    const safeId = previousRows.some((row) => row.id === candidateId)
      ? nextMockId()
      : candidateId;
    return [{ ...baseRow, id: safeId }, ...previousRows];
  });
};

const applyUpdate = (setRows: MockRowsUpdater, payloadRoot: AiPayload) => {
  const id = String(payloadRoot.id ?? "");
  if (!id) return;
  setRows((previousRows) =>
    previousRows.map((row) => {
      if (row.id !== id) return row;
      const patch = normalizeIncomingRow(payloadRoot, row.id);
      return { ...row, ...patch, id: row.id };
    }),
  );
};

const applyMove = (setRows: MockRowsUpdater, payloadRoot: AiPayload) => {
  const id = String(payloadRoot.id ?? "");
  if (!id) return;
  const nextStatus = normalizeOption(
    payloadRoot.targetColumn ?? payloadRoot.status,
    STATUSES,
    "Pendiente",
  );
  setRows((previousRows) =>
    previousRows.map((row) =>
      row.id === id ? { ...row, status: nextStatus } : row,
    ),
  );
};

const applyAiAction = (writer: AiRowsWriter, event: AIActionEvent) => {
  const payloadRecord = resolvePayloadRecord(event.payload);
  if (isCreateEvent(event, payloadRecord)) {
    applyCreate(writer, payloadRecord);
    return;
  }
  if (event.type === "update-row") {
    applyUpdate(writer.setRows, event.payload);
    return;
  }
  if (event.type === "move-card") applyMove(writer.setRows, event.payload);
};

export const useMockAiRows = (): MockAiRows => {
  const [rows, setRows] = useState<MockCompanyRow[]>(
    MOCK_COMPANY_ROWS.slice(0, 12),
  );
  const [eventLog, setEventLog] = useState<AIActionEvent[]>([]);
  const createCounterRef = useRef(1);
  const nextMockId = () => {
    const next = `ai-${createCounterRef.current}`;
    createCounterRef.current += 1;
    return next;
  };
  const handleAIAction = (event: AIActionEvent) => {
    setEventLog((previous) => [event, ...previous].slice(0, 8));
    applyAiAction({ setRows, nextMockId }, event);
  };
  return { rows, setRows, eventLog, handleAIAction };
};
