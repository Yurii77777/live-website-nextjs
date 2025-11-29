"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Puck, Data } from "@measured/puck";
import "@measured/puck/puck.css";
import "@/styles/puck-editor.css";
import { config } from "@/configs/puck.config";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { translateError } from "@/helpers/translate-error";
import type { LocalizedPuckContent } from "@/types/localized-content";
import { syncLocaleStructure } from "@/helpers/sync-locale-structure";
import { Locale, routing } from "@/i18n/routing";
import { QUERY_KEYS } from "@/constants/query-keys";
import { puckService } from "@/services/puck.service";
import { PAGE_SLUGS } from "@/constants/pages";

export default function PuckEditorPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const currentLocale = useLocale() as Locale;
  const tMessages = useTranslations("admin.messages");
  const queryClient = useQueryClient();

  const [activeLocale, setActiveLocale] = useState<Locale>(currentLocale);

  const {
    data: localizedContent,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.PAGE(slug),
    queryFn: () => puckService.getPageContent(slug),
  });

  const updatePageMutation = useMutation({
    mutationFn: (content: LocalizedPuckContent) =>
      puckService.updatePageContent(slug, content),
    onSuccess: () => {
      // Invalidate page content and pages list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGE(slug) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGES });

      // If editing site-menu, invalidate menu cache to update header
      if (slug === PAGE_SLUGS.SITE_MENU) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SITE_MENU });
      }

      showToast.success(tMessages("pageSaved"));
    },
    onError: (error: Error) => {
      showToast.error(translateError(error, tMessages));
    },
  });

  const handlePublish = (puckData: Data) => {
    if (!localizedContent) return;

    const defaultLocale = routing.defaultLocale as Locale;

    let updatedContent: LocalizedPuckContent = {
      ...localizedContent,
      [activeLocale]: puckData,
    };

    // If saving default locale version, auto-sync structure to all other locales
    if (activeLocale === defaultLocale) {
      const allLocales = routing.locales as readonly Locale[];
      allLocales.forEach((locale) => {
        if (locale !== defaultLocale) {
          updatedContent = syncLocaleStructure(
            updatedContent,
            defaultLocale,
            locale
          );
        }
      });
    }

    updatePageMutation.mutate(updatedContent);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading editor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-lg text-red-600">
          {translateError(error as Error, tMessages)}
        </div>
        <Button onClick={() => router.push("/admin")}>Back to Dashboard</Button>
      </div>
    );
  }

  if (!localizedContent) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-lg">Error loading data</div>
        <Button onClick={() => router.push("/admin")}>Back to Dashboard</Button>
      </div>
    );
  }

  const currentData = localizedContent[activeLocale];
  const puckKey = activeLocale;

  return (
    <div className="h-screen flex flex-col">
      <div className="relative bg-header-bg border-b px-4 py-3 flex items-center justify-between before:absolute before:inset-0 before:bg-brand-gradient-overlay before:opacity-20 before:pointer-events-none">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/admin")}
          className="relative z-10 text-white hover:bg-white/10 rounded-lg"
        >
          ← {tMessages("backToPages") || "Back to Pages"}
        </Button>

        {/* Locale Switcher */}
        <div className="relative z-10 flex items-center gap-2">
          <span className="text-sm text-gray-400 mr-2">Language:</span>
          <button
            onClick={() => setActiveLocale("uk")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeLocale === "uk"
                ? "bg-brand-gradient-overlay text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            🇺🇦 UK
          </button>
          <button
            onClick={() => setActiveLocale("en")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeLocale === "en"
                ? "bg-brand-gradient-overlay text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            🇬🇧 EN
          </button>
        </div>

        <span className="relative z-10 text-sm text-gray-400">
          Editing:{" "}
          <span className="text-transparent bg-clip-text bg-brand-gradient-text font-medium">
            {slug}
          </span>
        </span>
      </div>
      <div className="flex-1 overflow-hidden">
        {currentData ? (
          <Puck
            config={config}
            data={currentData}
            onPublish={handlePublish}
            key={puckKey} // Force re-render when locale changes
            overrides={{
              actionBar: ({ children }) => (
                <div className="flex items-center gap-4 px-4 py-3 bg-header-bg border-t relative before:absolute before:inset-0 before:bg-brand-gradient-overlay before:opacity-20 before:pointer-events-none">
                  <div className="relative z-10">{children}</div>
                </div>
              ),
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-lg text-red-600">
              No data for locale: {activeLocale}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
