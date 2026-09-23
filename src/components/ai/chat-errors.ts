export const toError = (candidate: unknown, fallbackMessage: string): Error =>
  candidate instanceof Error ? candidate : new Error(fallbackMessage);

export const normalizeAIError = (error: Error, baseURL: string): Error => {
  const message = error.message?.toLowerCase() ?? "";
  const isConnectionError =
    message.includes("connection error") ||
    message.includes("failed to fetch") ||
    message.includes("network");
  const looksLikeDirectGoogleEndpoint = baseURL.includes(
    "generativelanguage.googleapis.com",
  );

  if (isConnectionError && looksLikeDirectGoogleEndpoint) {
    return new Error(
      "Connection error. Posible CORS al llamar Gemini directo desde navegador. En desarrollo usa un proxy (ej. /api/google-openai en Vite) o realiza la llamada desde backend.",
    );
  }
  return error;
};
