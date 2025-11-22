"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Puck, Data } from "@measured/puck";
import "@measured/puck/puck.css";
import "@/styles/puck-editor.css";
import { config } from "@/configs/puck.config";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { translateError } from "@/helpers/translate-error";

export default function PuckEditorPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const tMessages = useTranslations("admin.messages");

  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`/api/puck/${slug}`);
        if (!response.ok) {
          throw new Error("Failed to load page data");
        }
        const puckData = await response.json();
        setData(puckData);
      } catch (error) {
        console.error("Failed to load data:", error);
        setError("Failed to load page. Please try again.");
        setData({ content: [], root: {} });
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadData();
    }
  }, [slug]);

  const handlePublish = async (puckData: Data) => {
    try {
      const response = await fetch(`/api/puck/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(puckData),
      });

      if (response.ok) {
        showToast.success(tMessages("pageSaved"));
      } else {
        showToast.error(tMessages("saveFailed"));
      }
    } catch (error) {
      console.error("Failed to save:", error);
      showToast.error(translateError(error as Error, tMessages));
    }
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
        <div className="text-lg text-red-600">{error}</div>
        <Button onClick={() => router.push("/admin")}>Back to Dashboard</Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-lg">Error loading data</div>
        <Button onClick={() => router.push("/admin")}>Back to Dashboard</Button>
      </div>
    );
  }

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
          data={data}
          onPublish={handlePublish}
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
