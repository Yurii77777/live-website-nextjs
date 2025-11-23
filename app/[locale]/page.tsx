import { Chat } from "@/components/chat";
import { pageService } from "@/services/db/page.service";
import { PuckRenderer } from "@/components/puck-renderer";

export default async function Home() {
  const homePage = await pageService.findBySlug("home");

  return (
    <div className="flex flex-col h-full">
      {/* Render Puck content if available */}
      {homePage?.content && (
        <section className="w-full max-w-[1280px] mx-auto">
          <PuckRenderer data={homePage.content as any} />
        </section>
      )}

      {/* Chat component */}
      <section className="flex-1 overflow-hidden w-full max-w-[1280px] mx-auto">
        <Chat />
      </section>
    </div>
  );
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 60;
