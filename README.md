# Live Website with AI

AI‑powered website builder using Vercel AI SDK 5, multi‑provider models (OpenAI / Google), vector search over a knowledge base (pgvector), and Puck Editor.

## Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Vercel AI SDK 5** with OpenAI and Google providers
- **Puck Editor** for visual editing
- **React Query** (@tanstack/react-query) for data fetching and mutations
- **React Hook Form** + **Zod** for form validation
- **Drizzle ORM** for database management
- **PostgreSQL** with pgvector extension (Docker)
- **next-intl** for internationalization

## Getting Started

### Quick Access

After setup, you'll have access to:

- **App**: [http://localhost:3000](http://localhost:3000)
- **Admin Panel**: [http://localhost:3000/uk/admin](http://localhost:3000/uk/admin)
- **Database UI (Adminer)**: [http://localhost:8080](http://localhost:8080) (postgres/postgres)
- **UI Kit**: [http://localhost:3000/uk/p/ui-kit](http://localhost:3000/uk/p/ui-kit)

### 1. Install dependencies

```bash
npm install
```

### 2. Setup environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Required variables (multi‑provider):

```
# AI provider and models
AI_PROVIDER="openai"            # or "google"
AI_MODEL="gpt-4o-mini"         # e.g. OpenAI chat model or Google Gemini model id
AI_API_KEY="..."               # OpenAI API key or Google API key

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/live-website-nextjs?schema=public"
```

- OpenAI: set `AI_PROVIDER=openai`, `AI_MODEL` to a valid chat model (e.g. `gpt-4o-mini`), and `AI_API_KEY` to your OpenAI API key.
- Google: set `AI_PROVIDER=google`, `AI_MODEL` to a valid Gemini model (e.g. `gemini-2.0-flash-exp`), and `AI_API_KEY` to your Google API key (get one at `https://aistudio.google.com/app/apikey`).

### 3. Start PostgreSQL database

```bash
docker-compose up -d
```

### 4. Run database migrations

```bash
npm run db:migrate
```

Or push schema directly (for development):

```bash
npm run db:push
```

### 5. Seed the knowledge base (optional but recommended)

Seeds demo content and embeddings into the knowledge base (uses the current provider’s embedding model):

```bash
npm run seed:knowledge
```

If you change provider or embedding model, reseed to regenerate embeddings.

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Admin Panel & Database Access

### Admin Dashboard

Access the admin panel to manage pages:

- **URL**: [http://localhost:3000/uk/admin](http://localhost:3000/uk/admin) or [http://localhost:3000/en/admin](http://localhost:3000/en/admin)
- Create, edit, delete pages using Puck Editor
- Preview pages before publishing

### Puck Editor

Edit pages visually with drag-and-drop UI components:

- **URL**: `http://localhost:3000/uk/admin/editor/{slug}`
- Example: [http://localhost:3000/uk/admin/editor/ui-kit](http://localhost:3000/uk/admin/editor/ui-kit)

### UI Kit Demo Page

Auto-generated page showcasing all UI components:

- **View**: [http://localhost:3000/uk/p/ui-kit](http://localhost:3000/uk/p/ui-kit)
- **Edit**: [http://localhost:3000/uk/admin/editor/ui-kit](http://localhost:3000/uk/admin/editor/ui-kit)
- Regenerate: `npm run seed:ui-kit`

### Database Web Interface (Adminer)

Access PostgreSQL database via web browser:

- **URL**: [http://localhost:8080](http://localhost:8080)
- **System**: PostgreSQL
- **Server**: `postgres`
- **Username**: `postgres`
- **Password**: `postgres`
- **Database**: `live_website`

Adminer starts automatically with `docker-compose up -d`.

## Database Management

### Seed Scripts

```bash
# Seed all (knowledge base + UI kit)
npm run seed:all

# Seed knowledge base only
npm run seed:knowledge

# Seed UI kit page only
npm run seed:ui-kit
```

**Note**: `npm run dev` automatically runs all seeds on startup.

### Drizzle Studio

View and edit your database:

```bash
npm run db:studio
```

### Stop database

```bash
docker-compose down
```

## Project Structure

```
├── app/                         # Next.js App Router
│   ├── [locale]/                # Localized routes (en/uk)
│   │   ├── page.tsx            # Home page with chat
│   │   └── admin/              # Admin dashboard and editor
│   ├── api/
│   │   ├── chat/route.ts       # Chat API, streams UI messages
│   │   └── puck/               # Puck Editor API routes
│   └── generated/              # Generated files (if any)
├── components/
│   ├── chat/                   # Chat components
│   │   ├── chat.tsx            # Main chat component
│   │   ├── chat-message.tsx    # Individual message component
│   │   └── index.ts            # Exports
│   ├── forms/                  # Form components
│   │   ├── chat-form.tsx       # Chat input form with validation
│   │   └── create-page/        # Create page form components
│   ├── modals/                 # Modal components
│   ├── ui/                     # Reusable UI components
│   └── ai-message-renderer.tsx # AI message renderer with rich content
├── constants/
│   ├── ai.ts                   # System prompts and AI config
│   ├── chat.ts                 # Chat validation constants
│   ├── company.ts              # Static company info
│   ├── pages.ts                # Page validation constants
│   └── index.ts                # Re‑exports
├── helpers/
│   ├── sanitize-chat-input.ts  # Input sanitization and security validation
│   └── translate-error.ts      # Error message translation helper
├── schemas/
│   ├── chat.schema.ts          # Chat message validation schema (Zod)
│   └── page.schema.ts          # Page creation validation schema (Zod)
├── i18n/                       # Locale routing helpers (next-intl)
├── lib/
│   ├── ai.ts                   # AI provider configuration (chat + embeddings)
│   ├── db/                     # Database configuration
│   │   ├── index.ts            # Drizzle client singleton
│   │   └── schema.ts           # Database schema (Drizzle)
│   └── vector-search.ts        # KB retrieval with embeddings
├── drizzle/                    # Drizzle migrations
│   └── meta/                   # Migration metadata
├── providers/
│   ├── query-provider.tsx      # React Query provider
│   └── toast-provider.tsx      # Toast notifications provider
├── scripts/
│   └── knowledge-base/         # Knowledge base seeding scripts
└── docker-compose.yml          # PostgreSQL + pgvector
```

## Key Behaviors

- **Streaming**: API returns `toUIMessageStreamResponse()` so `useChat` updates progressively with auto-scroll.
- **Messages**: Client sends UI messages (`parts`), server converts to model messages before calling `streamText`.
- **Retrieval‑augmented**: The server retrieves relevant context from the knowledge base and injects it into the system prompt.
- **Locale**: API detects locale via referer path (`/uk` or `/en`), falling back to `Accept-Language`. System prompt switches accordingly.
- **Input Validation**: Chat messages are validated with Zod schema (min 10, max 500 characters) and sanitized for security.
- **Security**: Input sanitization prevents SQL injection, XSS, JSON injection, and prompt injection attacks.
- **Form Management**: React Hook Form + Zod for type-safe form validation across the application.
- **State Management**: React Query for server state management with optimistic updates and error handling.

## Knowledge Base (Vector Search)

- Embeddings are generated with the current provider’s embedding model:
  - OpenAI: `text-embedding-3-small` (dim 1536)
  - Google: `text-embedding-004`
- If you switch providers, reseed to avoid dimension mismatches.
- Server logs (minimal) include provider/model selection, embedding dimensions, entry counts, and result sizes. Look for `[ai]` and `[kb]` lines in your terminal.

## Troubleshooting

- "Unsupported model version v1": upgrade to `@ai-sdk/openai@^2` and reseed embeddings.
- "Vectors must have the same length": your DB contains embeddings from a different model/dimension. Reseed the KB.
- No KB results: check `[kb]` logs, ensure `AI_CONFIG.similarityThreshold` and `topK` are configured, and reseed.
- English replies on `/uk`: ensure locale detection (referer path) is working and that your browser doesn't force `Accept-Language: en` on API calls.

## License

This project is licensed under the MIT License with Attribution Requirement.

**You are free to use this software for private or commercial purposes, provided that you include public attribution to the original author.**

### Required Attribution

Any use of this software must include visible attribution to:

- **Author**: Magic WebLab
- **Website**: [https://magic-weblab.com.ua](https://magic-weblab.com.ua)
- **Telegram**: [@Yurets7777](https://t.me/Yurets7777)

The attribution must be placed in a location visible to end users, such as:
- Application footer, about page, or credits section
- Project documentation or README
- Any other end-user visible location

See the [LICENSE](LICENSE) file for full details.

## Author

Created with love by **Magic WebLab**

- Website: [https://magic-weblab.com.ua](https://magic-weblab.com.ua)
- Telegram: [@Yurets7777](https://t.me/Yurets7777)
- GitHub: [@Yurii77777](https://github.com/Yurii77777)
