# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with Turbopack (http://localhost:3000)
npm run build     # Production build
npm run lint      # ESLint
npm test          # Vitest (run all tests)
npm run setup     # First-time setup: install deps + Prisma generate + migrate
npm run db:reset  # Reset SQLite database
```

The dev server requires `NODE_OPTIONS='--require ./node-compat.cjs'` — this is already baked into the npm scripts.

Set `ANTHROPIC_API_KEY` in `.env` to use real Claude. If unset, the app uses a mock provider that generates static demo components.

## Architecture

UIGen is a Next.js 15 (App Router) AI-powered React component generator. Users describe components in a chat interface; Claude generates/edits code via tool calls; results render live in an iframe preview.

### AI Generation Pipeline

1. User sends message → `POST /api/chat` (`src/app/api/chat/route.ts`)
2. Backend serializes the virtual file system and passes it to Claude with a system prompt (`src/lib/prompts/generation.tsx`)
3. Claude calls two tools to manipulate files:
   - `str_replace_editor` (`src/lib/tools/str-replace.ts`) — create/view/edit files with string replacement
   - `file_manager` (`src/lib/tools/file-manager.ts`) — rename/delete files
4. Tool results stream back to the client via Vercel AI SDK
5. `ChatContext` (`src/lib/contexts/chat-context.tsx`) processes tool calls and updates the virtual file system
6. `PreviewFrame` (`src/components/preview/PreviewFrame.tsx`) re-renders by running Babel Standalone on the updated files in an iframe

### Virtual File System

All files are in-memory only — no disk writes. `src/lib/file-system.ts` implements a `Map`-based filesystem. `FileSystemContext` (`src/lib/contexts/file-system-context.tsx`) is the React context that owns this state and is the source of truth for both the editor and preview.

### Authentication & Projects

- JWT sessions stored in HttpOnly cookies (7-day expiry), managed in `src/lib/auth.ts` using `jose`
- Server Actions in `src/actions/` handle sign-up, sign-in, sign-out, and project CRUD
- Middleware (`src/middleware.ts`) protects `/[projectId]` routes
- Authenticated users get projects persisted to SQLite via Prisma (`prisma/schema.prisma`): the `Project` model stores chat messages and file system state as serialized JSON strings
- Anonymous users get full functionality with no persistence

### Provider Selection (`src/lib/provider.ts`)

- `ANTHROPIC_API_KEY` set → Claude Haiku 4.5 via `@ai-sdk/anthropic`
- Not set → `MockLanguageModel` returns static demo output

### Key State Contexts

Both contexts are provided at the root layout and consumed throughout:
- `FileSystemContext` — virtual files, selected file, file operations
- `ChatContext` — message history, streaming state, tool call handling (integrates with file system context)

### Tech Stack

- **Framework:** Next.js 15 App Router, React 19
- **Styling:** Tailwind CSS v4 + shadcn/ui (Radix primitives) in `src/components/ui/`
- **Editor:** Monaco Editor (`src/components/editor/CodeEditor.tsx`)
- **Preview:** Babel Standalone for runtime JSX transform in iframe
- **Database:** SQLite + Prisma 6
- **AI:** Vercel AI SDK (`ai`) + Anthropic SDK (`@ai-sdk/anthropic`)
- **Testing:** Vitest with jsdom; test files live in `__tests__/` subdirectories
