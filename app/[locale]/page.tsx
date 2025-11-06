import { useTranslations } from "next-intl";
import { Chat } from "@/components/chat";

export default function Home() {
  const t = useTranslations("home");

  return (
    <main className="flex flex-col h-screen">
      <header className="px-8 py-6 border-b">
        <h1 className="text-4xl font-bold">{t("heading")}</h1>
        <p className="mt-2 text-gray-600">{t("subtitle")}</p>
      </header>

      <section className="flex-1 overflow-hidden w-full max-w-[1280px] mx-auto">
        <Chat />
      </section>
    </main>
  );
}
