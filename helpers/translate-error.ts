/**
 * Translates error messages if they are translation keys, otherwise returns the original message
 * @param error - The error object
 * @param translator - The translation function (e.g., from useTranslations)
 * @param namespace - The namespace prefix to strip (e.g., "admin.messages.")
 * @returns The translated error message or original message
 */
export function translateError(
  error: Error,
  translator: (key: string) => string,
  namespace: string = "admin.messages."
): string {
  if (error.message.startsWith(namespace)) {
    const key = error.message.replace(namespace, "");
    return translator(key);
  }
  return error.message;
}
