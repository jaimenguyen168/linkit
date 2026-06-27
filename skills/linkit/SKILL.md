---
name: linkit
description: Send Telegram messages from an agent through the LinkIt MCP `telegram` tool, with the LinkIt CLI (`@jaimeng168/linkit`) as a fallback. Use when a user asks to send a Telegram message, mentions LinkIt, wants to interact with the LinkIt toolset, asks to verify LinkIt manually, or needs to choose between the LinkIt MCP and CLI workflows.
---

# LinkIt

LinkIt sends Telegram messages. It exposes the same operation two ways, both backed by `@jaimeng168/linkit-core`:

- **MCP tool** (`linkit` server → `telegram` tool) — preferred for agents.
- **CLI** (`@jaimeng168/linkit`, binary `linkit`) — fallback when MCP is unavailable or for manual verification.

Both take a `chatId` and a `message`, call the Telegram Bot API, and return `{ ok: true, chatId, messageId }`.

## Choosing MCP vs CLI

Prefer the **MCP tool** whenever the `linkit` MCP server is connected — it needs no shell and the bot token is supplied by the MCP client environment.

Use the **CLI** when:
- The MCP server is not connected in this session.
- Verifying behavior manually or from a script / terminal.
- A local bot token (not the MCP env token) should be used.

## MCP workflow (preferred)

Call the `telegram` tool on the `linkit` MCP server with:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `chatId` | string | yes | Telegram chat ID (non-empty) |
| `message` | string | yes | Message text (non-empty) |

The bot token is read from `TELEGRAM_BOT_TOKEN` in the MCP server environment (see `.mcp.json`) — do not pass it in the tool input. On success the tool returns `{ ok: true, chatId, messageId }`.

## CLI workflow (fallback)

Check if the correct CLI is installed:

```bash
npm list -g @jaimeng168/linkit --depth=0 2>/dev/null | grep @jaimeng168/linkit
```

If the output is empty, install it:

```bash
npm install -g @jaimeng168/linkit
```

First-time setup writes a token to `~/.config/linkit/config.json` (mode `0600`):

```bash
linkit init --telegram-bot-token <botToken>
```

Send a message:

```bash
linkit telegram <chatId> <message>
```

On success it prints the JSON result, e.g. `{"ok":true,"chatId":"123","messageId":42}`. If no token is configured it errors with `Telegram bot token is required. Run \`linkit init\`.`

Run the CLI without a global install via `npx @jaimeng168/linkit telegram <chatId> <message>`.

## Verifying manually

To confirm LinkIt works end to end, send a test message to a known chat ID and check the response includes `ok: true` and a numeric `messageId`. Use the CLI for this so the result JSON is visible in the terminal:

```bash
linkit telegram <yourChatId> "LinkIt test message"
```

A non-`ok` response or a thrown error surfaces the Telegram API `description` (e.g. invalid token, unknown chat ID).
