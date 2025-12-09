import "dotenv/config";
import { pageService } from "@/services/page.service";
import * as path from "path";
import { generateUIKitContent } from "./generators/puck-content-generator";
import { seedConfig } from "@/configs/knowledge-base.config";
import { PAGE_SLUGS } from "@/constants/pages";
import type { LocalizedPuckContent } from "@/types/localized-content";

async function seedUIKit() {
  // Check if UI Kit seeding is enabled
  if (!seedConfig.pages.uiKit) {
    console.log("⏭️  UI Kit page seeding is disabled in config");
    return;
  }

  console.log("🎨 Starting UI Kit page seeding...");

  try {
    const uiDir = path.join(process.cwd(), "components", "ui");

    console.log(`📂 Scanning components from: ${uiDir}`);

    // Generate content for each locale
    const ukData = generateUIKitContent(uiDir, "uk");
    const enData = generateUIKitContent(uiDir, "en");

    // Create localized content
    const localizedContent: LocalizedPuckContent = {
      uk: ukData,
      en: enData,
    };

    console.log(
      `✅ Generated content with ${ukData.content.length} items (UK) and ${enData.content.length} items (EN)`
    );

    const existingPage = await pageService.findBySlug(PAGE_SLUGS.UI_KIT);

    // If seedIfMissing is true and page exists, skip
    if (seedConfig.pages.seedIfMissing && existingPage) {
      console.log(
        "⏭️  UI Kit page already exists, skipping (seedIfMissing: true)"
      );
      return;
    }

    if (existingPage) {
      console.log("🔄 Updating existing ui-kit page...");

      await pageService.upsert(PAGE_SLUGS.UI_KIT, {
        title: "UI Kit",
        content: localizedContent,
        published: true,
      });

      console.log("✅ UI Kit page updated successfully!");
    } else {
      console.log("📝 Creating new ui-kit page...");

      await pageService.create({
        slug: PAGE_SLUGS.UI_KIT,
        title: "UI Kit",
        content: localizedContent,
        published: true,
      });

      console.log("✅ UI Kit page created successfully!");
    }

    console.log(`\n🌐 View at: /p/${PAGE_SLUGS.UI_KIT}`);
    console.log(`📝 Edit at: /admin/editor/${PAGE_SLUGS.UI_KIT}`);
  } catch (error) {
    console.error("❌ Error seeding UI Kit:", error);
    throw error;
  }
}

seedUIKit()
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
