# Live Website with AI

AI‑powered website builder using Vercel AI SDK 5, multi‑provider models (OpenAI / Google), vector search over a knowledge base (pgvector), and Puck Editor.

## Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Vercel AI SDK 5** with OpenAI and Google providers
- **Puck Editor** for visual editing
- **Prisma** ORM
- **PostgreSQL** with pgvector extension (Docker)

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
npx prisma migrate dev --name init
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Seed the knowledge base (optional but recommended)

Seeds demo content and embeddings into the knowledge base (uses the current provider’s embedding model):

```bash
npm run seed:knowledge
```

If you change provider or embedding model, reseed to regenerate embeddings.

### 7. Run the development server

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

### Prisma Studio

View and edit your database:

```bash
npx prisma studio
```

### Stop database

```bash
docker-compose down
```

## Project Structure

```
├── app/                         # Next.js App Router
│   ├── [locale]/                # Localized routes (en/uk)
│   │   └── page.tsx            
│   ├── api/
│   │   └── chat/route.ts       # Chat API, streams UI messages
│   └── generated/prisma/       # Prisma generated client (edge compat)
├── components/
│   └── chat.tsx                # UI chat using @ai-sdk/react
├── constants/
│   ├── ai.ts                   # System prompts and AI config
│   ├── company.ts              # Static company info
│   ├── contacts.ts             # Contacts
│   └── index.ts                # Re‑exports
├── i18n/                       # Locale routing helpers (next-intl)
├── lib/
│   ├── ai.ts                   # AI provider configuration (chat + embeddings)
│   ├── prisma.ts               # Prisma client singleton
│   └── vector-search.ts        # KB retrieval with embeddings
├── prisma/
│   ├── migrations/             # Prisma migrations
│   └── schema.prisma           # Database schema
├── scripts/
│   └── seed-knowledge-base.ts  # Seeds KB entries + embeddings
└── docker-compose.yml          # PostgreSQL + pgvector
```

## Key Behaviors

- Streaming: API returns `toUIMessageStreamResponse()` so `useChat` updates progressively.
- Messages: Client sends UI messages (`parts`), server converts to model messages before calling `streamText`.
- Retrieval‑augmented: The server retrieves relevant context from the knowledge base and injects it into the system prompt.
- Locale: API detects locale via referer path (`/uk` or `/en`), falling back to `Accept-Language`. System prompt switches accordingly.
- Tailwind: `darkMode: "class"` (string form). If you previously used `["class"]`, update it.

## Knowledge Base (Vector Search)

- Embeddings are generated with the current provider’s embedding model:
  - OpenAI: `text-embedding-3-small` (dim 1536)
  - Google: `text-embedding-004`
- If you switch providers, reseed to avoid dimension mismatches.
- Server logs (minimal) include provider/model selection, embedding dimensions, entry counts, and result sizes. Look for `[ai]` and `[kb]` lines in your terminal.

## Troubleshooting

- “Unsupported model version v1”: upgrade to `@ai-sdk/openai@^2` and reseed embeddings.
- “Vectors must have the same length”: your DB contains embeddings from a different model/dimension. Reseed the KB.
- No KB results: check `[kb]` logs, ensure `AI_CONFIG.similarityThreshold` and `topK` are configured, and reseed.
- English replies on `/uk`: ensure locale detection (referer path) is working and that your browser doesn’t force `Accept-Language: en` on API calls.
