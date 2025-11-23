import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema";

async function clearPages() {
  try {
    console.log("🗑️  Clearing all pages from database...");

    const result = await db.delete(pages);

    console.log("✅ All pages cleared successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to clear pages:", error);
    process.exit(1);
  }
}

clearPages();
