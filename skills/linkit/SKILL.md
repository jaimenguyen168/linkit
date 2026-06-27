---
name: linkit
description: >
  Use LinkIt to send Telegram messages from agents through the LinkIt MCP tool or CLI fallback.
  Use when a user asks to send a Telegram message, use LinkIt, interact with the LinkIt toolset,
  verify LinkIt manually, or choose between LinkIt MCP and CLI workflows.
---

# LinkIt

LinkIt sends Telegram messages from Claude agents. It is available as an MCP tool (preferred) or
as a CLI fallback.

## MCP tool (preferred)

Use whichever LinkIt MCP tool is connected in the current session:

- `mcp__linkit__telegram` — local MCP integration
- `mcp__claude_ai_LinkIt_Prod__telegram` — remote MCP integration

Both take the same inputs:

```
chatId   – Telegram chat ID (e.g. "123456789")
message  – Text to send
```

Call the tool directly. If it succeeds, confirm with the returned `messageId`. If it fails, fall
back to the CLI.

## CLI fallback

Use the CLI when no MCP tool is available or when the user asks to verify LinkIt manually.

```bash
# One-time setup
linkit init --telegram-bot-token <token>

# Send a message
linkit telegram <chatId> "<message>"
```

If `linkit init` has not been run yet, prompt the user to do so before sending.

## Choosing between MCP and CLI

| Situation | Use |
|-----------|-----|
| MCP tool is available in the session | MCP tool |
| User says "verify LinkIt" or "test the CLI" | CLI |
| MCP tool call fails | CLI fallback |
| No MCP configured | CLI |

## Sending notifications at task completion

A common pattern is notifying the user when a long task finishes:

```
<do the work>
mcp__linkit__telegram(chatId="<id>", message="Build complete — 3 tests failed, see output above.")
```

Keep messages short and actionable. Include the outcome and any next step the user needs to take.
