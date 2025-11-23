import { z } from "zod";
import { PAGE_VALIDATION } from "@/constants/pages";

export const createPageSchema = z.object({
  title: z
    .string()
    .min(PAGE_VALIDATION.MIN_LENGTH, "admin.messages.fillAllFields"),
  slug: z
    .string()
    .min(PAGE_VALIDATION.MIN_LENGTH, "admin.messages.fillAllFields")
    .regex(/^[a-z0-9-]+$/, "admin.messages.invalidSlug"),
});

export type CreatePageFormData = z.infer<typeof createPageSchema>;
