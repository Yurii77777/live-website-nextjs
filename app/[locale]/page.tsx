import { useTranslations } from "next-intl";
import { Chat } from "@/components/chat";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="flex flex-col h-full">
      <section className="flex-1 overflow-hidden w-full max-w-[1280px] mx-auto">
        <Chat />
      </section>
    </div>
  );
}
