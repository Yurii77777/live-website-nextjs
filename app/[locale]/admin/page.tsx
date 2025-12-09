"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { Page } from "@/models/page.model";
import { puckService } from "@/services/puck.service";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/constants/routes";
import { QUERY_KEYS } from "@/constants/query-keys";
import { PROTECTED_PAGES } from "@/constants/pages";
import { translateError } from "@/helpers/translate-error";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const t = useTranslations("admin.dashboard");
  const tMessages = useTranslations("admin.messages");
  const tAuthMessages = useTranslations("auth.messages");
  const locale = useLocale();

  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showPasskeyPrompt, setShowPasskeyPrompt] = useState(false);
  const [isAddingPasskey, setIsAddingPasskey] = useState(false);
  const [hasPasskey, setHasPasskey] = useState(false);

  const {
    data: pages = [],
    isLoading: loading,
    error,
  } = useQuery<Page[]>({
    queryKey: QUERY_KEYS.PAGES,
    queryFn: puckService.getPages,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  // Check if user has passkey registered
  useEffect(() => {
    async function checkPasskeys() {
      try {
        const passkeys = await authService.listPasskeys();
        const hasRegisteredPasskey = passkeys.length > 0;
        setHasPasskey(hasRegisteredPasskey);

        // Show prompt if user doesn't have passkey
        const passkeyPromptDismissed = localStorage.getItem(
          "passkeyPromptDismissed"
        );
        if (!hasRegisteredPasskey && !passkeyPromptDismissed) {
          setShowPasskeyPrompt(true);
        }
      } catch (error) {
        console.error("Failed to check passkeys:", error);
      }
    }
    checkPasskeys();
  }, []);

  async function handleAddPasskey() {
    setIsAddingPasskey(true);
    try {
      const result = await authService.registerPasskey(
        tAuthMessages("passkeyDefaultName")
      );

      if (result.success) {
        toast.success(tAuthMessages("passkeyAddedSuccess"));
        setHasPasskey(true);
        setShowPasskeyPrompt(false);
      } else {
        toast.error(result.error || tAuthMessages("passkeyAddFailed"));
      }
    } catch (error) {
      console.error("Failed to add passkey:", error);
      toast.error(tAuthMessages("passkeyAddFailed"));
    } finally {
      setIsAddingPasskey(false);
    }
  }

  function dismissPasskeyPrompt() {
    localStorage.setItem("passkeyPromptDismissed", "true");
    setShowPasskeyPrompt(false);
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await authService.signOut();
      toast.success(tAuthMessages("signOutSuccess"));
      router.push(ROUTES.HOME);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(tAuthMessages("signOutFailed"));
      setIsLoggingOut(false);
    }
  }

  function handleDeletePage(slug: string) {
    router.push(ROUTES.ADMIN.DELETE_PAGE(slug));
  }

  if (loading) {
    return (
      <section
        className="flex items-center justify-center h-screen"
        role="status"
      >
        <p className="text-lg">{t("loading")}</p>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="flex items-center justify-center h-screen"
        role="alert"
      >
        <p className="text-lg text-red-600">
          {translateError(error, tMessages)}
        </p>
      </section>
    );
  }

  return (
    <section className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <Heading variant="h1">{t("title")}</Heading>
        <div className="flex gap-2">
          <Link href={ROUTES.ADMIN.CREATE_PAGE}>
            <Button
              variant="default"
              size="sm"
              className="bg-brand-gradient-text bg-clip-text text-transparent"
            >
              {t("createNewPage")}
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="bg-brand-gradient-overlay text-white"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? t("loading") : t("logout")}
          </Button>
        </div>
      </div>

      {/* Passkey Prompt Banner */}
      {showPasskeyPrompt && (
        <div className="mb-6 p-4 rounded-lg bg-linear-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Heading variant="h3" className="mb-2">
                {tAuthMessages("passkeyPromptTitle")}
              </Heading>
              <Paragraph variant="small" className="text-gray-500 mb-4">
                {tAuthMessages("passkeyPromptDescription")}
              </Paragraph>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-brand-gradient-text bg-clip-text text-transparent"
                  onClick={handleAddPasskey}
                  disabled={isAddingPasskey}
                >
                  {isAddingPasskey
                    ? tAuthMessages("addingPasskey")
                    : tAuthMessages("addPasskeyButton")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-brand-gradient-text bg-clip-text text-transparent"
                  onClick={dismissPasskeyPrompt}
                >
                  {tAuthMessages("passkeyPromptLater")}
                </Button>
              </div>
            </div>
            <button
              onClick={dismissPasskeyPrompt}
              className="text-white/60 hover:text-white transition-colors"
              aria-label={tAuthMessages("passkeyPromptClose")}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {pages.length === 0 ? (
        <section className="text-center py-12">
          <Paragraph variant="muted">{t("noPages")}</Paragraph>
        </section>
      ) : (
        <ul className="grid gap-4">
          {pages.map((page) => (
            <li key={page.id}>
              <article className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50">
                <header className="flex-1">
                  <Heading variant="h3">{page.title}</Heading>
                  <Paragraph variant="small" className="text-gray-500">
                    /{page.slug} •{" "}
                    {page.published ? t("published") : t("draft")} •
                    {t("updated")}{" "}
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </Paragraph>
                </header>
                <nav className="flex gap-2" aria-label="Page actions">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(ROUTES.ADMIN.EDITOR(page.slug))}
                    className="bg-brand-gradient-text bg-clip-text text-transparent"
                  >
                    {t("edit")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `/${locale}${ROUTES.PAGE(page.slug)}`,
                        "_blank"
                      )
                    }
                    className="bg-brand-gradient-text bg-clip-text text-transparent"
                  >
                    {t("preview")}
                  </Button>
                  {!PROTECTED_PAGES.includes(page.slug as any) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePage(page.slug)}
                      className="bg-brand-gradient-text bg-clip-text text-transparent"
                    >
                      {t("delete")}
                    </Button>
                  )}
                </nav>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
