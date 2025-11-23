/**
 * Sanitizes and validates chat input to prevent various injection attacks
 */

// SQL injection patterns
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/gi,
  /(--|#|\/\*|\*\/|;)/g,
  /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
  /(\b(OR|AND)\s+['"]\w+['"]\s*=\s*['"]\w+['"])/gi,
];

// XSS patterns
const XSS_PATTERNS = [
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi, // onclick, onerror, onload, etc.
  /<iframe[\s\S]*?>/gi,
  /<object[\s\S]*?>/gi,
  /<embed[\s\S]*?>/gi,
  /<link[\s\S]*?>/gi,
  /<meta[\s\S]*?>/gi,
  /<style[\s\S]*?>[\s\S]*?<\/style>/gi,
  /expression\s*\(/gi,
  /vbscript:/gi,
  /data:text\/html/gi,
];

// JSON injection patterns
const JSON_INJECTION_PATTERNS = [
  /^\s*[\{\[]/, // Starts with { or [
  /["']\s*:\s*["']/, // Key-value pairs
  /__proto__|constructor|prototype/gi,
];

// Prompt injection patterns (attempts to bypass system prompt)
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(previous|all|above|system|instructions)/gi,
  /forget\s+(previous|all|above|system|instructions)/gi,
  /disregard\s+(previous|all|above|system|instructions)/gi,
  /override\s+(previous|all|above|system|instructions)/gi,
  /system\s*:\s*ignore/gi,
  /system\s*:\s*forget/gi,
  /you\s+are\s+now/gi,
  /new\s+instructions?\s*:/gi,
  /act\s+as\s+if/gi,
  /pretend\s+to\s+be/gi,
  /roleplay\s+as/gi,
  /\[SYSTEM\]/gi,
  /\[INST\]/gi,
  /\[\/INST\]/gi,
  /<\|(system|user|assistant)\|>/gi,
];

// Dangerous characters and patterns
const DANGEROUS_PATTERNS = [
  /[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, // Control characters
  /\\x[0-9a-f]{2}/gi, // Hex encoded characters
  /\\u[0-9a-f]{4}/gi, // Unicode escape sequences
  /%[0-9a-f]{2}/gi, // URL encoding
];

/**
 * Sanitizes chat input by removing dangerous patterns
 */
export function sanitizeChatInput(input: string): string {
  let sanitized = input.trim();

  // Remove control characters and dangerous patterns
  DANGEROUS_PATTERNS.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "");
  });

  // Remove SQL injection patterns
  SQL_INJECTION_PATTERNS.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "");
  });

  // Remove XSS patterns
  XSS_PATTERNS.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "");
  });

  // Remove JSON injection patterns (but allow normal text that might contain these)
  // Only flag if it looks like actual JSON structure
  if (JSON_INJECTION_PATTERNS.every((pattern) => pattern.test(sanitized))) {
    // If all patterns match, it's likely JSON injection
    sanitized = sanitized.replace(/[\{\[\]\}]/g, "");
  }

  // Remove prompt injection patterns
  PROMPT_INJECTION_PATTERNS.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "");
  });

  return sanitized.trim();
}

/**
 * Validates if input contains dangerous patterns
 */
export function validateChatInput(input: string): {
  isValid: boolean;
  reason?: string;
} {
  const trimmed = input.trim();

  if (!trimmed) {
    return { isValid: false, reason: "chat.messageRequired" };
  }

  // Check SQL injection
  for (const pattern of SQL_INJECTION_PATTERNS) {
    // Reset regex lastIndex to avoid state issues
    pattern.lastIndex = 0;
    if (pattern.test(trimmed)) {
      return { isValid: false, reason: "chat.containsUnsafeContent" };
    }
  }

  // Check XSS
  for (const pattern of XSS_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(trimmed)) {
      return { isValid: false, reason: "chat.containsUnsafeContent" };
    }
  }

  // Check JSON injection (only if it looks like actual JSON structure)
  // Only flag if it starts with { or [ AND contains key-value patterns AND prototype/constructor
  if (
    (trimmed.startsWith("{") || trimmed.startsWith("[")) &&
    /["']\s*:\s*["']/.test(trimmed) &&
    /__proto__|constructor|prototype/gi.test(trimmed)
  ) {
    return { isValid: false, reason: "chat.containsUnsafeContent" };
  }

  // Check prompt injection
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(trimmed)) {
      return { isValid: false, reason: "chat.containsUnsafeContent" };
    }
  }

  // Check for control characters
  if (/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/.test(trimmed)) {
    return { isValid: false, reason: "chat.containsUnsafeContent" };
  }

  return { isValid: true };
}
