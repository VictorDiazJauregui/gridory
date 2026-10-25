import { useObjectUrl } from "./use-object-url";
import type { useImageForm } from "./use-image-form";

interface ImagePreviewProps {
  form: ReturnType<typeof useImageForm>;
  label: string;
}

export const ImagePreview = ({ form, label }: ImagePreviewProps) => {
  const fileUrl = useObjectUrl(form.source === "file" ? form.file : null);
  const urlPreview = form.source === "url" && !form.url.error && form.url.value.trim() ? form.url.normalized : null;
  const src = fileUrl ?? urlPreview;
  if (!src) return null;
  return (
    <figure className="gdy-md-image-preview" aria-label={label}>
      <img src={src} alt={form.alt} />
    </figure>
  );
};
