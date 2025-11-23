import { pageService } from "@/services/db/page.service";
import * as path from "path";
import { generateUIKitContent } from "./generators/puck-content-generator";
import { seedConfig } from "@/configs/knowledge-base.config";

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

    const puckData = generateUIKitContent(uiDir);

    console.log(`✅ Generated content with ${puckData.content.length} items`);

    const existingPage = await pageService.findBySlug("ui-kit");

    // If seedIfMissing is true and page exists, skip
    if (seedConfig.pages.seedIfMissing && existingPage) {
      console.log("⏭️  UI Kit page already exists, skipping (seedIfMissing: true)");
      return;
    }

    if (existingPage) {
      console.log("🔄 Updating existing ui-kit page...");

      await pageService.upsert("ui-kit", {
        title: "UI Kit",
        content: puckData,
        published: true,
      });

      console.log("✅ UI Kit page updated successfully!");
    } else {
      console.log("📝 Creating new ui-kit page...");

      await pageService.create({
        slug: "ui-kit",
        title: "UI Kit",
        content: puckData,
        published: true,
      });

      console.log("✅ UI Kit page created successfully!");
    }

    console.log(`\n🌐 View at: /p/ui-kit`);
    console.log(`📝 Edit at: /admin/editor/ui-kit`);
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
