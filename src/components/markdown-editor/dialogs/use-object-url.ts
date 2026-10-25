import { useEffect, useMemo } from "react";

export const useObjectUrl = (file: File | null): string | null => {
  const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(
    () => () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    },
    [objectUrl],
  );
  return objectUrl;
};
