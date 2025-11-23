import { Chat } from "@/components/chat";
import { pageService } from "@/services/db/page.service";
import { PuckRenderer } from "@/components/puck-renderer";

export default async function Home() {
  const homePage = await pageService.findBySlug("home");
  const hasContent = !!homePage && homePage.content !== null;

  return (
    <div className="flex flex-col h-full">
      <section className="flex-1 overflow-hidden w-full max-w-[1280px] mx-auto">
        <Chat
          initialContent={
            hasContent ? <PuckRenderer data={homePage.content as any} /> : undefined
          }
        />
      </section>
    </div>
  );
}

export const revalidate = 60;
