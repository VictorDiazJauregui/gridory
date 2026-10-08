import type { ImageUploadHandler } from "@/components/markdown-editor";

const SIMULATED_UPLOAD_MS = 1200;

const readAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export class SimulatedUploadError extends Error {
  constructor() {
    super("La demo simula que el servidor rechaza la imagen.");
    this.name = "SimulatedUploadError";
  }
}

export const createDemoImageUpload = (shouldFail: () => boolean): ImageUploadHandler => async (file) => {
  await wait(SIMULATED_UPLOAD_MS);
  if (shouldFail()) throw new SimulatedUploadError();
  return { url: await readAsDataUrl(file) };
};
