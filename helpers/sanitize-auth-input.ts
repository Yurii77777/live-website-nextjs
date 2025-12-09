/**
 * Simple sanitization helpers for authentication inputs
 * For name and email only - passwords are not sanitized, only validated
 */

/**
 * Sanitizes name input - removes dangerous HTML/script characters
 */
export function sanitizeNameInput(input: string): string {
  return input
    .trim()
    .replace(/[<>"'`]/g, "") // Remove HTML dangerous chars
    .replace(/\s+/g, " "); // Normalize whitespace
}

/**
 * Sanitizes email input - removes dangerous characters and normalizes
 */
export function sanitizeEmailInput(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[<>"'`]/g, "") // Remove HTML dangerous chars
    .replace(/\s/g, ""); // Remove all spaces from email
}
