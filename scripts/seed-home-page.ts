import "dotenv/config";
import { pageService } from "@/services/page.service";
import { seedConfig } from "@/configs/knowledge-base.config";
import { PAGE_SLUGS } from "@/constants/pages";
import { createEmptyLocalizedContent } from "@/helpers/localized-content";

async function seedHomePage() {
  // Check if Home page seeding is enabled
  if (!seedConfig.pages.home) {
    console.log("⏭️  Home page seeding is disabled in config");
    return;
  }

  console.log("🏠 Starting Home page seeding...");

  try {
    const localizedContent = createEmptyLocalizedContent();

    console.log(`✅ Created empty localized page structure`);

    const existingPage = await pageService.findBySlug(PAGE_SLUGS.HOME);

    // If seedIfMissing is true and page exists, skip
    if (seedConfig.pages.seedIfMissing && existingPage) {
      console.log(
        "⏭️  Home page already exists, skipping (seedIfMissing: true)"
      );
      return;
    }

    if (existingPage) {
      console.log("🔄 Updating existing home page...");

      await pageService.upsert(PAGE_SLUGS.HOME, {
        title: "Головна",
        content: localizedContent,
        published: true,
      });

      console.log("✅ Home page updated successfully!");
    } else {
      console.log("📝 Creating new home page...");

      await pageService.create({
        slug: PAGE_SLUGS.HOME,
        title: "Головна",
        content: localizedContent,
        published: true,
      });

      console.log("✅ Home page created successfully!");
    }

    console.log(`\n🌐 View at: /p/${PAGE_SLUGS.HOME}`);
    console.log(`📝 Edit at: /admin/editor/${PAGE_SLUGS.HOME}`);
  } catch (error) {
    console.error("❌ Error seeding Home page:", error);
    throw error;
  }
}

seedHomePage()
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
