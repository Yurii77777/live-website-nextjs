import { pageService } from "@/services/db/page.service";
import { seedConfig } from "@/configs/knowledge-base.config";
import { createLocalizedContent } from "@/helpers/localized-content";
import { PAGE_SLUGS } from "@/constants/pages";

async function seedSiteMenu() {
  // Check if site-menu page seeding is enabled
  if (!seedConfig.pages.siteMenu) {
    console.log("⏭️  Site menu seeding is disabled in config");
    return;
  }

  console.log("🍔 Starting Site Menu seeding...");

  try {
    const existingPage = await pageService.findBySlug(PAGE_SLUGS.SITE_MENU);

    // If seedIfMissing is true and page exists, skip
    if (seedConfig.pages.seedIfMissing && existingPage) {
      console.log("⏭️  Site menu already exists, skipping (seedIfMissing: true)");
      return;
    }

    // Create default menu structure with Ukrainian and English versions
    const defaultMenuContent = createLocalizedContent({
      uk: {
        content: [
          {
            type: "Navigation",
            props: {
              id: "navigation-1",
              items: [
                {
                  type: "MenuItem",
                  props: {
                    id: "menu-admin",
                    label: "Адмін-панель",
                    href: "/admin",
                    icon: "",
                    className: "",
                  },
                },
              ],
              className: "",
            },
          },
        ],
        root: { props: {} },
        zones: {},
      },
      en: {
        content: [
          {
            type: "Navigation",
            props: {
              id: "navigation-1",
              items: [
                {
                  type: "MenuItem",
                  props: {
                    id: "menu-admin",
                    label: "Admin Panel",
                    href: "/admin",
                    icon: "",
                    className: "",
                  },
                },
              ],
              className: "",
            },
          },
        ],
        root: { props: {} },
        zones: {},
      },
    });

    if (existingPage) {
      console.log("🔄 Updating existing site menu...");

      await pageService.upsert(PAGE_SLUGS.SITE_MENU, {
        title: "Site Menu",
        content: defaultMenuContent,
        published: true,
      });

      console.log("✅ Site menu updated successfully!");
    } else {
      console.log("📝 Creating new site menu...");

      await pageService.create({
        slug: PAGE_SLUGS.SITE_MENU,
        title: "Site Menu",
        content: defaultMenuContent,
        published: true,
      });

      console.log("✅ Site menu created successfully!");
    }

    console.log(`\n📝 Edit at: /admin/editor/${PAGE_SLUGS.SITE_MENU}`);
  } catch (error) {
    console.error("❌ Error seeding Site Menu:", error);
    throw error;
  }
}

seedSiteMenu()
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
