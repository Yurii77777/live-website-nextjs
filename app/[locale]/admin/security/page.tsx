"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { authService } from "@/services/auth.service";
import { authClient } from "@/lib/auth-client";
import { ROUTES } from "@/constants/routes";
import { toast } from "react-toastify";

interface PasskeyItem {
  id: string;
  name: string | null;
  createdAt: Date;
  deviceType: string;
}

export default function SecurityPage() {
  const t = useTranslations("auth.security");
  const tMessages = useTranslations("auth.messages");
  const tDashboard = useTranslations("admin.dashboard");
  const router = useRouter();

  const [passkeys, setPasskeys] = useState<PasskeyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingPasskey, setIsAddingPasskey] = useState(false);
  const [deletingPasskeyId, setDeletingPasskeyId] = useState<string | null>(null);

  useEffect(() => {
    loadPasskeys();
  }, []);

  async function loadPasskeys() {
    setIsLoading(true);
    try {
      const passkeyList = await authService.listPasskeys();
      setPasskeys(passkeyList as unknown as PasskeyItem[]);
    } catch (error) {
      console.error("Error loading passkeys:", error);
      toast.error(tMessages("passkeyListFailed"));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddPasskey() {
    setIsAddingPasskey(true);

    try {
      const deviceName = prompt(t("deviceName"));
      if (!deviceName) {
        setIsAddingPasskey(false);
        return;
      }

      const result = await authService.registerPasskey(deviceName);

      if (result.success) {
        toast.success(tMessages("passkeyRegistered"));
        await loadPasskeys();
      } else {
        toast.error(result.error || tMessages("passkeyRegisterFailed"));
      }
    } catch (error) {
      console.error("Error adding passkey:", error);
      toast.error(tMessages("passkeyRegisterFailed"));
    } finally {
      setIsAddingPasskey(false);
    }
  }

  async function handleDeletePasskey(passkeyId: string) {
    if (!confirm(t("deleteConfirm"))) {
      return;
    }

    setDeletingPasskeyId(passkeyId);

    try {
      await authService.deletePasskey(passkeyId);
      toast.success(tMessages("passkeyDeleted"));
      await loadPasskeys();
    } catch (error) {
      console.error("Error deleting passkey:", error);
      toast.error(tMessages("passkeyDeleteFailed"));
    } finally {
      setDeletingPasskeyId(null);
    }
  }

  async function handleSignOut() {
    try {
      await authService.signOut();
      toast.success(tMessages("signOutSuccess"));
      router.push(ROUTES.LOGIN);
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error(tMessages("signOutFailed"));
    }
  }

  function formatDate(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <Heading variant="h1">{t("title")}</Heading>
            <Paragraph variant="muted" className="mt-2">
              {t("subtitle")}
            </Paragraph>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => router.push(ROUTES.ADMIN.DASHBOARD)}
            >
              {tDashboard("title")}
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              {tDashboard("logout")}
            </Button>
          </div>
        </header>

        {/* Passkeys Section */}
        <section className={[
          "relative rounded-3xl p-6",
          "bg-gray-900",
          "border-t border-white/10",
          "shadow-[0_8px_30px_rgba(0,0,0,0.5)]",
          "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]",
          "before:bg-brand-gradient-overlay before:opacity-20",
        ].join(" ")}>
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <Heading variant="h2">{t("passkeysSection")}</Heading>
              <Button
                variant="default"
                onClick={handleAddPasskey}
                disabled={isAddingPasskey}
              >
                {isAddingPasskey ? t("addingPasskey") : t("addPasskey")}
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
            ) : passkeys.length === 0 ? (
              <div className="text-center py-12">
                <Paragraph variant="muted">{t("noPasskeys")}</Paragraph>
              </div>
            ) : (
              <div className="space-y-4">
                {passkeys.map((passkey) => (
                  <div
                    key={passkey.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-white">
                        {passkey.name || "Unnamed Device"}
                      </div>
                      <div className="text-sm text-white/60">
                        {t("deviceType")}: {passkey.deviceType}
                      </div>
                      <div className="text-sm text-white/60">
                        {t("createdAt")}: {formatDate(passkey.createdAt)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => handleDeletePasskey(passkey.id)}
                      disabled={deletingPasskeyId === passkey.id}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      {deletingPasskeyId === passkey.id
                        ? t("deletingPasskey")
                        : t("deletePasskey")}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Additional Security Info */}
        <section className={[
          "relative rounded-3xl p-6",
          "bg-gray-900",
          "border-t border-white/10",
          "shadow-[0_8px_30px_rgba(0,0,0,0.5)]",
          "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]",
          "before:bg-brand-gradient-overlay before:opacity-20",
        ].join(" ")}>
          <div className="space-y-4 relative z-10">
            <Heading variant="h3">Security Tips</Heading>
            <ul className="space-y-2 text-white/70">
              <li>• Register passkeys on all your devices for seamless access</li>
              <li>• Keep your backup password secure</li>
              <li>• Remove passkeys from devices you no longer use</li>
              <li>• Your biometric data never leaves your device</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
