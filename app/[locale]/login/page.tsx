"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { SignInForm } from "@/components/forms/auth/signin-form";
import { authService } from "@/services/auth.service";
import { translateError } from "@/helpers/translate-error";
import { usePasskeyAvailability } from "@/hooks/use-passkey-availability";
import { ROUTES } from "@/constants/routes";
import { signInSchema, type SignInFormData } from "@/schemas/auth.schema";

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const tMessages = useTranslations("auth.messages");
  const tValidation = useTranslations("auth.validation");
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPath = searchParams.get("return");
  const callbackUrl = returnPath || ROUTES.ADMIN.DASHBOARD;

  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const passkeyAvailable = usePasskeyAvailability();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInMutation = useMutation({
    mutationFn: authService.signInWithEmail,
    onSuccess: (result) => {
      if (result.error) {
        toast.error(tMessages("signInFailed"));
        return;
      }

      if (result.data) {
        toast.success(tMessages("signInSuccess"));
        router.push(callbackUrl);
      }
    },
    onError: (error) => {
      console.error("Sign in error:", error);
      toast.error(tMessages("signInFailed"));
    },
  });

  const passkeySignInMutation = useMutation({
    mutationFn: authService.signInWithPasskey,
    onSuccess: (result) => {
      if (result.error) {
        toast.error(tMessages("passkeySignInFailed"));
        return;
      }

      if (result.data) {
        toast.success(tMessages("signInSuccess"));
        router.push(callbackUrl);
      }
    },
    onError: (error) => {
      console.error("Passkey sign in error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : tMessages("passkeySignInFailed");
      if (
        !errorMessage.includes("canceled") &&
        !errorMessage.includes("abort")
      ) {
        toast.error(tMessages("passkeySignInFailed"));
      }
    },
  });

  function onSubmit(data: SignInFormData) {
    signInMutation.mutate(data);
  }

  function handlePasskeySignIn() {
    passkeySignInMutation.mutate();
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <section className="w-full max-w-sm sm:max-w-md">
        <article className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 space-y-5 sm:space-y-6 bg-gray-900 border-t border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-brand-gradient-overlay before:opacity-20">
          <div className="text-center space-y-1.5 sm:space-y-2 relative z-10">
            <Heading
              variant="h1"
              className="text-white text-xl sm:text-2xl md:text-display-sm font-semibold text-center"
            >
              {t("title")}
            </Heading>
            <Paragraph
              variant="muted"
              className="text-white/80 text-sm sm:text-base"
            >
              {t("subtitle")}
            </Paragraph>
          </div>

          <div className="space-y-4 sm:space-y-6 relative z-10">
            {/* Passkey Sign In - Primary */}
            {passkeyAvailable && (
              <div className="space-y-2 sm:space-y-3">
                <Button
                  type="button"
                  variant="default"
                  className="w-full h-11 sm:h-12 text-sm sm:text-base"
                  disabled={passkeySignInMutation.isPending}
                  onClick={handlePasskeySignIn}
                >
                  {passkeySignInMutation.isPending
                    ? t("signingInWithPasskey")
                    : t("passkeyButton")}
                </Button>
                <Paragraph
                  variant="small"
                  className="text-center text-white/60 text-xs sm:text-sm"
                >
                  {t("passkeyDescription")}
                </Paragraph>
              </div>
            )}

            {/* Divider */}
            {passkeyAvailable && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-3 sm:px-4 bg-gray-900 text-white/70 bg-brand-gradient-overlay">
                    {t("orDivider")}
                  </span>
                </div>
              </div>
            )}

            {/* Email/Password Form */}
            <div className="space-y-3 sm:space-y-4">
              {!showEmailPassword && passkeyAvailable ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full h-11 sm:h-12 text-sm sm:text-base"
                  onClick={() => setShowEmailPassword(true)}
                >
                  {t("emailPasswordFallback")}
                </Button>
              ) : (
                <SignInForm
                  form={form}
                  onSubmit={onSubmit}
                  isLoading={signInMutation.isPending}
                  translations={{
                    emailLabel: t("emailLabel"),
                    emailPlaceholder: t("emailPlaceholder"),
                    passwordLabel: t("passwordLabel"),
                    passwordPlaceholder: t("passwordPlaceholder"),
                    signInButton: t("signInButton"),
                    signingIn: t("signingIn"),
                  }}
                  translateError={(error) =>
                    translateError(error, tValidation, "auth.validation.")
                  }
                  showBackToPasskey={passkeyAvailable && showEmailPassword}
                />
              )}
            </div>
          </div>

          <div className="text-center relative z-10">
            <Paragraph
              variant="small"
              className="text-white/60 text-xs sm:text-sm"
            >
              {t("noAccount")}{" "}
              <Link
                href={ROUTES.SIGNUP}
                className="text-white hover:text-white/80 underline font-medium"
              >
                {t("signUpLink")}
              </Link>
            </Paragraph>
          </div>
        </article>
      </section>
    </main>
  );
}
