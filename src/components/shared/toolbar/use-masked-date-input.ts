import { useState } from "react";
import type { ChangeEvent } from "react";
import type { DateInputFormat } from "../data-model";
import { formatDateToInput, parseInputToDate } from "../date-filter";

export interface DateInputMask {
  dateInputFormat: DateInputFormat;
  placeholder?: string;
}

/** Props of the masked `<input>`, in the order its attributes are emitted. */
export interface MaskedDateField {
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
}

/** While the input has focus the typed text replaces the formatted date. */
const useInputDraft = (formatted: string) => {
  const [localInput, setLocalInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const setDraft = (text: string, editing: boolean) => {
    setLocalInput(text);
    setIsEditing(editing);
  };
  return {
    value: isEditing ? localInput : formatted,
    startEditing: (text: string) => setDraft(text, true),
    onFocus: () => setDraft(formatted, true),
    onBlur: () => setDraft("", false),
    stopEditing: () => setIsEditing(false),
  };
};

interface MaskedDateInput {
  field: MaskedDateField;
  stopEditing: () => void;
}

export const useMaskedDateInput = (
  date: Date | undefined,
  onParse: (date: Date) => void,
  mask: DateInputMask,
): MaskedDateInput => {
  const { dateInputFormat, placeholder = dateInputFormat } = mask;
  const draft = useInputDraft(formatDateToInput(date, dateInputFormat));
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    draft.startEditing(event.target.value);
    const parsed = parseInputToDate(event.target.value, dateInputFormat);
    if (parsed) onParse(parsed);
  };
  const { value, onFocus, onBlur, stopEditing } = draft;
  return {
    field: { placeholder, value, onChange, onFocus, onBlur },
    stopEditing,
  };
};
