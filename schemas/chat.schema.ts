import { z } from "zod";
import {
  sanitizeChatInput,
  validateChatInput,
} from "@/helpers/sanitize-chat-input";
import { CHAT_VALIDATION } from "@/constants/chat";

export const chatMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(CHAT_VALIDATION.MIN_LENGTH, "chat.messageTooShort")
    .max(CHAT_VALIDATION.MAX_LENGTH, "chat.messageTooLong")
    .transform((val) => sanitizeChatInput(val))
    .superRefine((val, ctx) => {
      // Check if message is empty after sanitization
      const trimmed = val.trim();
      if (!trimmed || trimmed.length < CHAT_VALIDATION.MIN_LENGTH) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "chat.messageTooShort",
        });
        return;
      }

      // Validate for dangerous content
      const validation = validateChatInput(trimmed);
      if (!validation.isValid && validation.reason) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: validation.reason,
        });
      }
    }),
});

export type ChatMessageFormData = z.infer<typeof chatMessageSchema>;
