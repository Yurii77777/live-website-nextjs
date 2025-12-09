import { z } from "zod";
import { AUTH_CONFIG } from "@/constants/auth";
import { sanitizeNameInput, sanitizeEmailInput } from "@/helpers/sanitize-auth-input";

// Sign Up Schema
export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "auth.validation.nameRequired")
    .transform((val) => sanitizeNameInput(val))
    .refine((val) => val.length >= AUTH_CONFIG.NAME_MIN_LENGTH, {
      message: "auth.validation.nameTooShort",
    })
    .refine((val) => val.length <= AUTH_CONFIG.NAME_MAX_LENGTH, {
      message: "auth.validation.nameTooLong",
    }),
  email: z
    .string()
    .trim()
    .min(1, "auth.validation.emailRequired")
    .email("auth.validation.emailInvalid")
    .max(255, "auth.validation.emailTooLong")
    .transform((val) => sanitizeEmailInput(val)),
  password: z
    .string()
    .min(AUTH_CONFIG.PASSWORD_MIN_LENGTH, "auth.validation.passwordTooShort")
    .max(AUTH_CONFIG.PASSWORD_MAX_LENGTH, "auth.validation.passwordTooLong")
    .refine((val) => /[a-z]/.test(val), "auth.validation.passwordNeedLowercase")
    .refine((val) => /[A-Z]/.test(val), "auth.validation.passwordNeedUppercase")
    .refine((val) => /[0-9]/.test(val), "auth.validation.passwordNeedNumber"),
});

// Sign In Schema
export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "auth.validation.emailRequired")
    .email("auth.validation.emailInvalid")
    .max(255, "auth.validation.emailTooLong")
    .transform((val) => sanitizeEmailInput(val)),
  password: z
    .string()
    .min(AUTH_CONFIG.PASSWORD_MIN_LENGTH, "auth.validation.passwordTooShort")
    .max(AUTH_CONFIG.PASSWORD_MAX_LENGTH, "auth.validation.passwordTooLong"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
