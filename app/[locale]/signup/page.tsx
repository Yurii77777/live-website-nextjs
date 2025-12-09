"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { SignUpForm } from "@/components/forms/auth/signup-form";
import { authService } from "@/services/auth.service";
import { translateError } from "@/helpers/translate-error";
import { ROUTES } from "@/constants/routes";
import { QUERY_KEYS } from "@/constants/query-keys";
import { signUpSchema, type SignUpFormData } from "@/schemas/auth.schema";
import { SESSION_CONFIG } from "@/constants/auth";

export default function SignUpPage() {
  const t = useTranslations("auth.signup");
  const tMessages = useTranslations("auth.messages");
  const tValidation = useTranslations("auth.validation");
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const returnPath = searchParams.get("return");
  const callbackUrl = returnPath || ROUTES.ADMIN.DASHBOARD;

  const { data: hasUsersData } = useQuery({
    queryKey: QUERY_KEYS.AUTH.HAS_USERS,
    queryFn: authService.hasUsers,
    staleTime: SESSION_CONFIG.HAS_USERS_STALE_TIME,
  });

  const hasUsers = hasUsersData?.hasUsers ?? true;
  const isFirstAdmin = !hasUsers;

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const signUpMutation = useMutation({
    mutationFn: authService.signUpWithEmail,
    onSuccess: (result) => {
      if (result.error) {
        toast.error(tMessages("signUpFailed"));
        return;
      }

      if (result.data) {
        toast.success(tMessages("signUpSuccess"));
        // Invalidate has_users query since we just created a user
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.HAS_USERS });
        router.push(callbackUrl);
      }
    },
    onError: (error) => {
      console.error("Sign up error:", error);
      toast.error(tMessages("signUpFailed"));
    },
  });

  async function onSubmit(data: SignUpFormData) {
    signUpMutation.mutate(data);
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
              {isFirstAdmin ? t("firstAdminTitle") : t("title")}
            </Heading>
            <Paragraph
              variant="muted"
              className="text-white/80 text-sm sm:text-base"
            >
              {isFirstAdmin ? t("firstAdminSubtitle") : t("subtitle")}
            </Paragraph>
          </div>

          <SignUpForm
            form={form}
            onSubmit={onSubmit}
            isLoading={signUpMutation.isPending}
            translations={{
              nameLabel: t("nameLabel"),
              namePlaceholder: t("namePlaceholder"),
              emailLabel: t("emailLabel"),
              emailPlaceholder: t("emailPlaceholder"),
              passwordLabel: t("passwordLabel"),
              passwordPlaceholder: t("passwordPlaceholder"),
              createButton: t("createButton"),
              creatingAccount: t("creatingAccount"),
            }}
            translateError={(error) =>
              translateError(error, tValidation, "auth.validation.")
            }
          />

          {!isFirstAdmin && (
            <div className="text-center relative z-10">
              <Paragraph
                variant="small"
                className="text-white/60 text-xs sm:text-sm"
              >
                {t("alreadyHaveAccount")}{" "}
                <Link
                  href={ROUTES.LOGIN}
                  className="text-white hover:text-white/80 underline font-medium"
                >
                  {t("signInLink")}
                </Link>
              </Paragraph>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
