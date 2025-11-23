import { Chat } from "@/components/chat";
import { pageService } from "@/services/db/page.service";
import { PuckRenderer } from "@/components/puck-renderer";

export default async function Home() {
  const homePage = await pageService.findBySlug("home");
  const hasContent = !!homePage && homePage.content !== null;

  return (
    <div className="flex flex-col h-full">
      {hasContent && (
        <section className="w-full max-w-[1280px] mx-auto">
          <PuckRenderer data={homePage.content as any} />
        </section>
      )}

      <section className="flex-1 overflow-hidden w-full max-w-[1280px] mx-auto">
        <Chat />
      </section>
    </div>
  );
}

export const revalidate = 60;
