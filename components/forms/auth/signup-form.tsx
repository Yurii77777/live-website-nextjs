"use client";

import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignUpFormData } from "@/schemas/auth.schema";

interface SignUpFormProps {
  form: UseFormReturn<SignUpFormData>;
  onSubmit: (data: SignUpFormData) => Promise<void>;
  isLoading: boolean;
  translations: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    createButton: string;
    creatingAccount: string;
  };
  translateError: (error: string | undefined) => string;
}

export function SignUpForm({
  form,
  onSubmit,
  isLoading,
  translations,
  translateError,
}: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3.5 sm:space-y-4 relative z-10"
    >
      <div className="space-y-1.5 sm:space-y-2">
        <label
          htmlFor="name"
          className="text-xs sm:text-sm font-medium text-white/90"
        >
          {translations.nameLabel}
        </label>
        <Input
          id="name"
          type="text"
          placeholder={translations.namePlaceholder}
          {...register("name")}
          disabled={isLoading}
          className="h-11 sm:h-12 text-sm sm:text-base"
        />
        {errors.name && (
          <p className="text-xs text-red-400 mt-1">
            {translateError(errors.name.message)}
          </p>
        )}
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <label
          htmlFor="email"
          className="text-xs sm:text-sm font-medium text-white/90"
        >
          {translations.emailLabel}
        </label>
        <Input
          id="email"
          type="email"
          placeholder={translations.emailPlaceholder}
          {...register("email")}
          disabled={isLoading}
          className="h-11 sm:h-12 text-sm sm:text-base"
        />
        {errors.email && (
          <p className="text-xs text-red-400 mt-1">
            {translateError(errors.email.message)}
          </p>
        )}
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <label
          htmlFor="password"
          className="text-xs sm:text-sm font-medium text-white/90"
        >
          {translations.passwordLabel}
        </label>
        <Input
          id="password"
          type="password"
          placeholder={translations.passwordPlaceholder}
          {...register("password")}
          disabled={isLoading}
          className="h-11 sm:h-12 text-sm sm:text-base"
        />
        {errors.password && (
          <p className="text-xs text-red-400 mt-1">
            {translateError(errors.password.message)}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="default"
        className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium mt-2"
        disabled={isLoading}
      >
        {isLoading ? translations.creatingAccount : translations.createButton}
      </Button>
    </form>
  );
}
