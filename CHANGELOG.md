# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Sections list

### Added

### Changed

### Fixed

### Removed

### BREAKING CHANGES

### Docs

## [Unreleased]

### Added
- AI-powered website builder with streaming chat interface supporting multi-provider models (OpenAI, Google)
- Visual page editor using Puck Editor with drag-and-drop UI components
- Admin dashboard for page management (create, edit, delete, preview pages)
- Multi-language support (Ukrainian, English) with locale-aware routing and AI responses
- Vector search knowledge base with pgvector for retrieval-augmented generation (RAG)
- Page management system with CRUD operations, publish/draft status, and protected pages
- Knowledge base seeding system with configurable categories (company info, services, business domains, UI components, process documentation)
- UI Kit demo page showcasing all available components
- Home page seeding with initial content
- Database schema with pages and knowledge base tables using Drizzle ORM
- Automatic locale detection from referer path with Accept-Language fallback
- Streaming chat API with context retrieval from knowledge base
- Seed scripts for knowledge base, UI kit, and home page initialization
- React Query integration for chat message sending with error handling
- Chat input validation schema with zod (minimum 10 characters, maximum 500 characters)
- Input sanitization and security validation to prevent SQL injection, XSS, JSON injection, and prompt injection attacks
- Auto-scroll functionality for chat messages during AI streaming
- Chat form component with react-hook-form integration
- Chat message component for better code organization
- Validation constants for chat and page schemas (CHAT_VALIDATION, PAGE_VALIDATION)
- Localized author names for chat messages (user and AI)
- Error handling with toast notifications for chat failures
- **HeroTwoColumn component** - responsive two-column Hero section with PuckEditor Slots API support
  - Equal (1:1), Left Wider (2:1), and Right Wider (1:2) column ratios
  - Configurable spacing, padding, and Tailwind class customization
  - Automatic mobile responsiveness (columns stack vertically)
  - Integrated into UI Kit auto-generation system
- **HeroFlexibleGrid component** - advanced Hero section with flexible row layout
  - 4 independent zones (leftColumnTop, leftColumnBottom, rightColumnTop, rightColumnBottom)
  - Each column can have 1 or 2 rows independently
  - Separate row spacing and column spacing controls
  - Full Tailwind customization support
  - Integrated into UI Kit auto-generation system
- Initial content support in Chat component via `initialContent` prop
- **Multilingual Puck Editor System** - comprehensive localization support for page content
  - LocalizedPuckContent type system for storing content in multiple locales
  - Locale switcher in Puck Editor with UK/EN flag buttons for easy language switching
  - Auto-sync structure between locales when switching languages in editor
  - Auto-sync structure propagation when saving default locale (syncs to all other locales)
  - Structure synchronization helper that preserves existing translations while updating component layout
  - Localized UI Kit generator with separate translations for Ukrainian and English
  - **Delete confirmation modal** - replaced browser `confirm()` with styled modal dialog
  - Consistent design with CreatePageModal using BaseModal component
  - Displays page title in confirmation message
  - Localized buttons (Cancel/Delete) with loading states
  - Intercepting route pattern: `@modal/(.)admin/delete-page/[slug]`
  - Added ROUTES.ADMIN.DELETE_PAGE route constant
  - Added "deleting" translation key for both UK and EN locales
- **Parallel Routes default.tsx files** for proper modal navigation
  - `@modal/admin/default.tsx`
  - `@modal/admin/editor/default.tsx`
  - `@modal/admin/editor/[slug]/default.tsx`
  - `@modal/admin/delete-page/default.tsx`
  - `@modal/admin/delete-page/[slug]/default.tsx`
- **Helper functions module** - `helpers/localized-content.ts`
  - `getLocalizedContent()` - retrieve content for specific locale
  - `createEmptyLocalizedContent()` - create empty content for all locales
  - `createLocalizedContent()` - wrapper for creating localized content
  - **Authentication System** - integrated better-auth with passkey support
  - Login and signup pages with React Hook Form and Zod validation
  - Email/password authentication with bcrypt hashing
  - Passkey (WebAuthn) authentication for passwordless login
  - Protected routes middleware with session cookie verification
  - First admin auto-role assignment for initial user
  - User redirection middleware (login → signup if no users exist)
  - Security settings page for passkey management
- **Auth Components** - reusable form components
  - SignUpForm component with validation error handling
  - SignInForm component with optional passkey fallback
  - Auth error translation helper (`translateError`)
  - Passkey availability hook (`usePasskeyAvailability`)
- **React Query Integration** - state management for auth operations
  - Sign up mutation with success/error handling
  - Sign in mutation (email/password and passkey)
  - `hasUsers` query with middleware integration
  - Global retry configuration in QueryClient
- **Auth Services** - centralized authentication logic
  - `authService.signUpWithEmail()` - user registration with role assignment
  - `authService.signInWithEmail()` - email/password login
  - `authService.signInWithPasskey()` - WebAuthn authentication
  - `authService.hasUsers()` - check system initialization state
  - Passkey CRUD operations (register, list, delete)

### Changed
- Refactored chat components into dedicated `components/chat/` directory
- Refactored create page form components into `components/forms/create-page/` directory
- Improved chat form validation with better UX (hidden validation messages for empty/short messages)
- Enhanced chat input validation to require minimum 10 characters for meaningful business queries
- Extracted magic numbers to constants for better maintainability
- **Improved chat scroll behavior** - PuckRenderer components now render inside Chat's scrollable area
  - Components from PuckEditor now scroll with chat messages
  - Better UX: content doesn't occupy static space outside chat
- Chat component refactored to accept `initialContent` prop for rendering page content
- Home page restructured to pass PuckRenderer content into Chat component
- Puck content generator updated with special handling for Hero components
- **Puck Editor page** - enhanced with multilingual capabilities
  - Uses dynamic `routing.defaultLocale` instead of hardcoded locale values
  - Implements automatic structure synchronization on locale switch via useEffect
  - Saves all locales in hybrid structure: `{ uk: { content: [], root: {} }, en: { content: [], root: {} } }`
- **PuckRenderer component** - updated to automatically detect and use current locale
  - Uses useLocale() hook for automatic locale selection
  - Renders appropriate locale content based on user's current language
- **UI Kit generator** - refactored with full localization support
  - Added translation dictionaries for UK and EN
  - Generates separate content for each locale with proper translations
  - Maintains consistent component structure across all locales
- **Page service** - improved timestamp handling
  - Explicitly sets createdAt and updatedAt timestamps to fix PostgreSQL constraint issues
- **Database seeding** - updated to generate localized content
  - UI Kit seeding creates content for both UK and EN locales
  - All seed scripts now support LocalizedPuckContent structure
  - **Locale synchronization strategy** - now copies text from source locale instead of clearing
  - Renamed `clearTextProps()` to `copyTextProps()` in sync-locale-structure.ts
  - Users see default locale text as starting point for translation (e.g., "Контакти" → "Contacts")
  - Improves UX: no more empty components when switching locales
  - Faster translation workflow: edit existing text instead of typing from scratch
- **Page update mechanism** - improved conditional field updates
  - Title and published status only update when explicitly provided
  - Created `PageUpdateData` interface to replace `any` type
  - Used TypeScript `SQL` type for proper Drizzle ORM typing
- **Admin dashboard** - removed browser confirm dialog
  - Page deletion now opens styled modal instead of alert
  - Better UX with consistent design system
- **Editor publish workflow** - enhanced data freshness
  - Added server data reload after successful publish
  - Ensures all locales are synchronized from database
  - Fixed stale data issues when switching between locales
- **Admin page list** - automatic data refresh configuration
  - Added `refetchOnMount: "always"` to React Query
  - Added `refetchOnWindowFocus: true` for returning to dashboard
  - Users always see up-to-date page status and timestamps

### Fixed
- Chat form now properly handles validation errors without showing redundant messages
- Button disabled state now correctly checks minimum message length
- **Link component type definitions** - corrected buttonVariant and buttonSize types
  - buttonVariant: now correctly supports "default" | "primary" | "ghost" (was "destructive" | "outline")
  - buttonSize: now correctly supports "sm" | "md" | "lg" | "icon" (was "default")
- Chat scroll issue where PuckEditor components were static and didn't scroll with messages
- PostgreSQL constraint error "null value in column 'updatedAt'" when creating pages
- Seed scripts not generating localized content for UI components
- Editor not showing same component structure when switching between languages
- Hardcoded locale references replaced with dynamic configuration from i18n/routing
- **Page publishing bug** - published status wasn't updating in database
  - Fixed `onConflictDoUpdate` in page.service.ts to update `published` field
  - Added `title` field update on conflict for consistency
- **Modal closing issue** - create page modal stayed open after success
  - Changed `router.replace()` to `router.push()` in CreatePageModal
  - Added proper default.tsx routes for modal parallel routes
  - Modal now automatically closes and navigates to editor
- **Page title overwriting** - "configuration" suffix was being added
  - Removed hardcoded `title: \`${slug} configuration\`` from PUT /api/puck/[slug]
  - Title only updates when explicitly provided in PageUpsertData
  - Original page titles now preserved during publish operations

### Removed
- Removed redundant validation error messages for empty and too short messages (replaced with visual indicators)
- **Complete Prisma ORM cleanup** - removed all remaining Prisma artifacts after migration to Drizzle
  - Deleted `app/generated/prisma/` directory with generated Prisma Client
  - Deleted `lib/prisma.ts` client wrapper
  - Deleted `prisma.config.ts` configuration file
  - Cleaned up `.gitignore` Prisma-related entries

### BREAKING CHANGES

### Docs
