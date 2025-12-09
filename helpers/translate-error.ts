/**
 * Translates error messages if they are translation keys, otherwise returns the original message
 * Handles both Error objects and string messages
 */
export function translateError(
  error: Error | string | undefined,
  translator: (key: string) => string,
  namespace: string = "admin.messages."
): string {
  // Handle undefined or null
  if (!error) return "";

  // Extract message from Error object or use string directly
  const message = error instanceof Error ? error.message : error;

  // Translate if message starts with namespace
  if (message.startsWith(namespace)) {
    const key = message.replace(namespace, "");
    return translator(key);
  }

  return message;
}
