# Knowledge Base Seeding System

A modular and configurable system for seeding the knowledge base with different categories of content.

## Structure

```
scripts/knowledge-base/
├── README.md              # This file
├── types.ts               # TypeScript types
├── index.ts               # Main exports and utilities
├── company-info.ts        # Company information and technologies
├── services.ts            # Services offered
├── business-domains.ts    # Business domains (healthcare, beauty, etc.)
├── ui-components.ts       # UI components and icons documentation
└── process.ts             # Process, warranty, and pricing info
```

## Configuration

Edit `configs/knowledge-base.config.ts` to configure both knowledge base and pages:

```typescript
export const seedConfig = {
  // Knowledge base categories to seed
  knowledgeBase: {
    enabled: {
      companyInfo: true,      // Enable/disable company info
      services: true,         // Enable/disable services
      businessDomains: true,  // Enable/disable business domains
      uiComponents: true,     // Enable/disable UI components
      process: true,          // Enable/disable process info
    },
    clearBefore: true,        // Clear KB before seeding
  },

  // Pages to seed
  pages: {
    uiKit: true,              // Seed UI Kit page
    home: true,               // Seed home page
    seedIfMissing: true,      // Only seed if page doesn't exist (recommended)
  },
  // ... other settings
}
```

### seedIfMissing Option

When `pages.seedIfMissing` is `true` (recommended):
- Pages are created only if they don't exist in the database
- Existing pages are NOT overwritten during `yarn dev`
- Prevents losing manual changes made in the admin panel

When `pages.seedIfMissing` is `false`:
- Pages are always updated, even if they exist
- Use this when you want to reset pages to their seed state

## Usage

### Seed all enabled categories (from config)
```bash
npm run seed:kb
```

### Seed specific categories only
```bash
npm run seed:kb -- --only companyInfo,services
npm run seed:kb -- --only uiComponents
```

### Skip specific categories
```bash
npm run seed:kb -- --skip businessDomains
npm run seed:kb -- --skip businessDomains,process
```

### Don't clear existing data
```bash
npm run seed:kb -- --no-clear
```

### Show help
```bash
npm run seed:kb -- --help
```

## Categories

### companyInfo
- Company general information
- Technologies used
- Contact information

### services
- Landing pages
- E-commerce
- AI implementation
- Chatbots
- Website modernization
- CRM systems
- Support and maintenance
- Mobile/desktop apps

### businessDomains
- Healthcare & Pharma
- Beauty & Cosmetics
- SaaS
- E-commerce
- CRM integrations

### uiComponents
- UI component documentation (Button, Link, Heading, etc.)
- Icon documentation (Lucide React icons)

### process
- Order and collaboration process
- Warranty and support
- Pricing information

## Adding New Content

1. Edit the appropriate category file (e.g., `services.ts`)
2. Add new items to the exported array:

```typescript
export const servicesContent: KnowledgeBaseItem[] = [
  {
    title: "Your Service Title",
    content: `Service description...`,
    metadata: { type: "service", service: "service-key", lang: "uk" },
  },
  // ... existing items
];
```

## Adding New Categories

1. Create a new file in `scripts/knowledge-base/` (e.g., `new-category.ts`)
2. Export content array following the pattern
3. Add to `scripts/knowledge-base/index.ts`:
   - Import the content
   - Add to `categories` object
4. Add to `knowledge-base.config.ts`:
   - Add to `enabled` object
5. Update this README with the new category info

## Type Safety

All content is type-checked using `KnowledgeBaseItem` interface:

```typescript
interface KnowledgeBaseItem {
  title: string;
  content: string;
  metadata: Record<string, unknown>;
}
```
