import { useState } from "react";
import type { ImageUploadHandler } from "./dialog-types";

export const useImageUpload = (uploadImage: ImageUploadHandler | undefined, failureText: string) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const upload = async (file: File): Promise<string | null> => {
    if (!uploadImage) return null;
    setUploading(true);
    setUploadError(null);
    try {
      return (await uploadImage(file)).url;
    } catch {
      setUploadError(failureText);
      return null;
    } finally {
      setUploading(false);
    }
  };
  return { uploading, uploadError, upload, clearUploadError: () => setUploadError(null) };
};
