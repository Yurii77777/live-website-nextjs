import { z } from "zod";

export const createPageSchema = z.object({
  title: z.string().min(1, "admin.messages.fillAllFields"),
  slug: z
    .string()
    .min(1, "admin.messages.fillAllFields")
    .regex(/^[a-z0-9-]+$/, "admin.messages.invalidSlug"),
});

export type CreatePageFormData = z.infer<typeof createPageSchema>;
