# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- In progress

## Current Goal

- Awaiting next feature spec.

## Completed

---

- Initial Commit: CLI scaffolding with Commander.js — `packages/cli` with `linkit` command, accepts `<chatId>` and `<message>` arguments, reads `TELEGRAM_BOT_TOKEN` from environment, sends message via Telegram Bot API using inline fetch.

---

- 00 — Core Package: extracted `linkit-core` as a shared workspace package. `packages/core` with `sendTelegramMessage` operation, Zod schemas for Telegram API input/output validation. CLI refactored to import from `linkit-core` instead of using inline fetch. `linkit-core` added as workspace dependency in CLI.

---

- 01 — Local MCP: `packages/local-mcp` added as an MCP server. Exposes `sendTelegramMessage` from `linkit-core` as an MCP tool via stdio transport. `dev:local-mcp` script added to root `package.json`. `.mcp.json` configured for Claude Code integration.

---

- 02 — Remote MCP: `apps/remote-mcp` added — Hono HTTP server with MCP streamable transport. Exposes `sendTelegramMessage` as a stateless MCP tool via `/:botToken/mcp` route. `dev:remote-mcp` script added to root `package.json`.

---

- 03 — OAuth: Clerk OAuth authentication added to remote MCP server. `/:botToken/mcp` route protected with Bearer token via `@clerk/backend`. `/.well-known/oauth-protected-resource` metadata endpoint exposed for MCP client discovery. `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` added to `.env.example`.

---

- 05 — Linting & Formatting: `oxlint` and `oxfmt` added as dev tools. `.oxlintrc.json` configured with TypeScript, unicorn, and oxc plugins — correctness as error, suspicious as warn. `.oxfmtrc.json` configured to ignore `bun.lock`. Root `package.json` gains `format`, `format:check`, `lint`, `lint:fix`, and `typecheck` scripts. `tsdown` and `typescript` added as dev dependencies. All packages updated to pass lint and format checks.

---

- 06 — Bundling: all packages scoped to `@jaimeng168/` namespace. `tsdown.config.ts` and `tsconfig.build.json` added to `packages/core`, `packages/cli`, and `packages/local-mcp`. Build scripts added to each package. Root `package.json` gains `build:core`, `build:cli`, and `build:local-mcp` scripts. `unrun` added as dev dependency (required peer for `tsdown` config file loading). All workspace imports updated from `linkit-core` to `@jaimeng168/linkit-core`.

---

- 07 — Publish: all packages prepared for npm publishing. `private` removed from `core`, `cli`, and `local-mcp`. Added `files`, `main`, `module`, `types`, `exports`, `publishConfig`, `bin`, `pack:dry`, and `prepublishOnly` scripts to each package. `#!/usr/bin/env node` shebang added to CLI entry. `release:pack:core`, `release:pack:cli`, `release:pack:local-mcp` scripts added to root. `@jaimeng168/linkit-core@0.0.0` and `@jaimeng168/linkit@0.0.1` published to npm.

---

## In Progress

- None.

## Next Up

- Next feature spec when defined.

## Open Questions

- None currently.

## Architecture Decisions

- Monorepo with Bun workspaces: `packages/` for shared/internal packages, `apps/` for deployable services.
- `linkit-core` is the single source of truth for Telegram logic and Zod schemas — both CLI and MCP servers consume it.
- Remote MCP uses a stateless per-request pattern: each request creates and closes its own `McpServer` instance.
- Bot token is passed as a URL path param (`/:botToken/mcp`) so the same deployment can serve multiple bots without re-deployment.
- Clerk OAuth protects the remote MCP endpoint; local MCP relies on stdio (inherently local, no auth needed).

## Session Notes

- Package manager: Bun with workspaces.
- `.env` holds live credentials (gitignored); `.env.example` documents required keys.
- `.mcp.json` and `opencode.json` are gitignored — contain local bot token and MCP server config.
- `tsconfig.json` at root with `typeRoots` pointing at both root and `packages/cli` node_modules for `@types/node` resolution.
