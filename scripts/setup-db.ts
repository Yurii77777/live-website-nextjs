import "dotenv/config";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const cleanConnectionString = connectionString.split("?")[0];
const client = postgres(cleanConnectionString, { prepare: false });

async function setupDatabase() {
  console.log("🔧 Setting up database...");

  try {
    // Enable pgvector extension
    await client`CREATE EXTENSION IF NOT EXISTS vector`;
    console.log("✅ pgvector extension enabled");

    console.log("✅ Database setup completed successfully!");
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    throw error;
  } finally {
    await client.end();
  }
}

setupDatabase()
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
