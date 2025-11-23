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

### Changed
- Refactored chat components into dedicated `components/chat/` directory
- Refactored create page form components into `components/forms/create-page/` directory
- Improved chat form validation with better UX (hidden validation messages for empty/short messages)
- Enhanced chat input validation to require minimum 10 characters for meaningful business queries
- Extracted magic numbers to constants for better maintainability

### Fixed
- Chat form now properly handles validation errors without showing redundant messages
- Button disabled state now correctly checks minimum message length

### Removed
- Removed redundant validation error messages for empty and too short messages (replaced with visual indicators)

### BREAKING CHANGES

### Docs
