"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Puck, Data } from "@measured/puck";
import "@measured/puck/puck.css";
import "@/styles/puck-editor.css";
import { config } from "@/configs/puck.config";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { translateError } from "@/helpers/translate-error";
import {
  type LocalizedPuckContent,
  createEmptyLocalizedContent,
} from "@/types/localized-content";
import { syncLocaleStructure } from "@/helpers/sync-locale-structure";
import { Locale, routing } from "@/i18n/routing";

export default function PuckEditorPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const currentLocale = useLocale() as Locale;
  const tMessages = useTranslations("admin.messages");

  const [localizedContent, setLocalizedContent] =
    useState<LocalizedPuckContent | null>(null);
  const [activeLocale, setActiveLocale] = useState<Locale>(currentLocale);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`/api/puck/${slug}`);
        if (!response.ok) {
          throw new Error("Failed to load page data");
        }
        const contentData: LocalizedPuckContent = await response.json();
        setLocalizedContent(contentData);
      } catch (error) {
        console.error("Failed to load data:", error);
        setError("Failed to load page. Please try again.");
        setLocalizedContent(createEmptyLocalizedContent());
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadData();
    }
  }, [slug]);

  const handlePublish = async (puckData: Data) => {
    if (!localizedContent) return;

    try {
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
            updatedContent = syncLocaleStructure(updatedContent, defaultLocale, locale);
          }
        });
      }

      const response = await fetch(`/api/puck/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContent),
      });

      if (response.ok) {
        setLocalizedContent(updatedContent);
        showToast.success(tMessages("pageSaved"));
      } else {
        showToast.error(tMessages("saveFailed"));
      }
    } catch (error) {
      console.error("Failed to save:", error);
      showToast.error(translateError(error as Error, tMessages));
    }
  };

  // Auto-sync structure when switching locales
  useEffect(() => {
    if (!localizedContent) return;

    const defaultLocale = routing.defaultLocale as Locale;

    // When switching to non-default locale, sync structure from default locale
    if (activeLocale !== defaultLocale) {
      const synced = syncLocaleStructure(localizedContent, defaultLocale, activeLocale);
      setLocalizedContent(synced);
    }
  }, [activeLocale]);

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
        <div className="text-lg text-red-600">{error}</div>
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

  return (
    <div className="h-screen flex flex-col">
      <div className="relative bg-gray-900 border-b px-4 py-3 flex items-center justify-between before:absolute before:inset-0 before:bg-linear-to-r before:from-blue-500 before:via-purple-500 before:to-pink-500 before:opacity-20 before:pointer-events-none">
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
                ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            🇺🇦 UK
          </button>
          <button
            onClick={() => setActiveLocale("en")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeLocale === "en"
                ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            🇬🇧 EN
          </button>
        </div>

        <span className="relative z-10 text-sm text-gray-400">
          Editing:{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 font-medium">
            {slug}
          </span>
        </span>
      </div>
      <div className="flex-1 overflow-hidden">
        <Puck
          config={config}
          data={currentData}
          onPublish={handlePublish}
          key={activeLocale} // Force re-render when locale changes
          overrides={{
            actionBar: ({ children }) => (
              <div className="flex items-center gap-4 px-4 py-3 bg-gray-900 border-t relative before:absolute before:inset-0 before:bg-linear-to-r before:from-blue-500 before:via-purple-500 before:to-pink-500 before:opacity-20 before:pointer-events-none">
                <div className="relative z-10">{children}</div>
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
}
