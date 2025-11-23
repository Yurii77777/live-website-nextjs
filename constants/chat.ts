import { COMPANY_INFO } from "./company";

export const CHAT_AUTHOR_NAMES = {
  ai: COMPANY_INFO.name,
} as const;

export const CHAT_VALIDATION = {
  MIN_LENGTH: 10,
  MAX_LENGTH: 500,
} as const;
