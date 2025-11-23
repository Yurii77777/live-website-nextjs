import { pageService } from "@/services/db/page.service";
import { seedConfig } from "@/configs/knowledge-base.config";

async function seedHomePage() {
  // Check if Home page seeding is enabled
  if (!seedConfig.pages.home) {
    console.log("⏭️  Home page seeding is disabled in config");
    return;
  }

  console.log("🏠 Starting Home page seeding...");

  try {
    const puckData = {
      content: [],
      root: {},
    };

    console.log(`✅ Created empty page structure`);

    const existingPage = await pageService.findBySlug("home");

    // If seedIfMissing is true and page exists, skip
    if (seedConfig.pages.seedIfMissing && existingPage) {
      console.log("⏭️  Home page already exists, skipping (seedIfMissing: true)");
      return;
    }

    if (existingPage) {
      console.log("🔄 Updating existing home page...");

      await pageService.upsert("home", {
        title: "Головна",
        content: puckData,
        published: true,
      });

      console.log("✅ Home page updated successfully!");
    } else {
      console.log("📝 Creating new home page...");

      await pageService.create({
        slug: "home",
        title: "Головна",
        content: puckData,
        published: true,
      });

      console.log("✅ Home page created successfully!");
    }

    console.log(`\n🌐 View at: /p/home`);
    console.log(`📝 Edit at: /admin/editor/home`);
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
