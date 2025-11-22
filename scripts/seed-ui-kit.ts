import { prisma } from "@/lib/prisma";
import * as path from "path";
import { generateUIKitContent } from "./generators/puck-content-generator";

async function seedUIKit() {
  console.log("🎨 Starting UI Kit page seeding...");

  try {
    // Path to UI components directory
    const uiDir = path.join(process.cwd(), "components", "ui");

    console.log(`📂 Scanning components from: ${uiDir}`);

    // Generate Puck content from actual UI components
    const puckData = generateUIKitContent(uiDir);

    console.log(`✅ Generated content with ${puckData.content.length} items`);

    // Check if ui-kit page already exists
    const existingPage = await prisma.page.findUnique({
      where: { slug: "ui-kit" },
    });

    if (existingPage) {
      console.log("🔄 Updating existing ui-kit page...");

      await prisma.page.update({
        where: { slug: "ui-kit" },
        data: {
          title: "UI Kit",
          content: puckData,
          published: true,
          updatedAt: new Date(),
        },
      });

      console.log("✅ UI Kit page updated successfully!");
    } else {
      console.log("📝 Creating new ui-kit page...");

      await prisma.page.create({
        data: {
          slug: "ui-kit",
          title: "UI Kit",
          content: puckData,
          published: true,
        },
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
  .finally(async () => {
    await prisma.$disconnect();
  });
