import "dotenv/config";
import { knowledgeBaseService } from "@/services/knowledge-base.service";
import { embed } from "ai";
import { embeddingModel } from "@/lib/ai";
import { knowledgeBaseConfig } from "@/configs/knowledge-base.config";
import {
  getEnabledContent,
  getCategoriesContent,
  getAllContent,
  type CategoryKey,
} from "./knowledge-base";

// Parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    only: [] as CategoryKey[],
    skip: [] as CategoryKey[],
    clearBefore: knowledgeBaseConfig.vectorSearch.clearBefore as boolean,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--only") {
      const categories = args[++i]?.split(",") as CategoryKey[];
      options.only = categories || [];
    } else if (arg === "--skip") {
      const categories = args[++i]?.split(",") as CategoryKey[];
      options.skip = categories || [];
    } else if (arg === "--no-clear") {
      options.clearBefore = false;
    } else if (arg === "--clear") {
      options.clearBefore = true;
    }
  }

  return options;
}

function showHelp() {
  console.log(`
Knowledge Base Seeding Tool

Usage: npm run seed:kb [options]

Options:
  --only <categories>    Seed only specified categories (comma-separated)
                         Example: --only companyInfo,services

  --skip <categories>    Skip specified categories (comma-separated)
                         Example: --skip businessDomains,process

  --clear                Clear existing knowledge base before seeding (default)
  --no-clear             Don't clear existing knowledge base

  -h, --help             Show this help message

Available Categories:
  - companyInfo          Company information and technologies
  - services             All services offered
  - businessDomains      Business domains (healthcare, beauty, SaaS, etc.)
  - uiComponents         UI components and icons documentation
  - process              Process, warranty, and pricing information

Examples:
  npm run seed:kb                                    # Seed all enabled categories
  npm run seed:kb -- --only services,uiComponents    # Seed only services and UI components
  npm run seed:kb -- --skip businessDomains          # Seed all except business domains
  npm run seed:kb -- --no-clear                      # Add to existing data without clearing
`);
}

async function seedKnowledgeBase() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  console.log("🌱 Starting knowledge base seeding...");

  // Determine which content to seed
  let content;
  let categoryInfo = "";

  if (options.only.length > 0) {
    content = getCategoriesContent(options.only);
    categoryInfo = `Categories: ${options.only.join(", ")}`;
  } else if (options.skip.length > 0) {
    const enabledCategories = { ...knowledgeBaseConfig.enabled } as Record<
      CategoryKey,
      boolean
    >;
    options.skip.forEach((cat) => {
      enabledCategories[cat] = false;
    });
    content = getEnabledContent(enabledCategories);
    categoryInfo = `Skipping: ${options.skip.join(", ")}`;
  } else {
    content = getEnabledContent(knowledgeBaseConfig.enabled);
    categoryInfo = "All enabled categories";
  }

  console.log(`📦 ${categoryInfo}`);
  console.log(`📊 Total items to seed: ${content.length}`);

  // Clear existing data if requested
  if (options.clearBefore) {
    await knowledgeBaseService.deleteAll();
    console.log("🗑️  Cleared existing knowledge base");
  }

  // Seed each item
  let successCount = 0;
  let errorCount = 0;

  for (const item of content) {
    try {
      console.log(`📝 Processing: ${item.title}`);

      const { embedding } = await embed({
        model: embeddingModel,
        value: `${item.title}\n\n${item.content}`,
      });

      await knowledgeBaseService.create({
        content: `${item.title}\n\n${item.content}`,
        embedding: embedding,
        metadata: item.metadata,
      });

      console.log(`✅ Saved: ${item.title}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error processing ${item.title}:`, error);
      errorCount++;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("🎉 Knowledge base seeding completed!");
  console.log(`✅ Successfully seeded: ${successCount} items`);
  if (errorCount > 0) {
    console.log(`❌ Failed: ${errorCount} items`);
  }
  console.log("=".repeat(50));
}

seedKnowledgeBase()
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
