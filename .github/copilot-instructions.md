# MiyaMi WebSearch MCP - Copilot Instructions

## Project Overview

This is a **Model Context Protocol (MCP) server** providing web search and content extraction tools for LLMs. Connects to free public API at `https://websearch.miyami.tech`.

## Architecture

```
src/
├── index.ts       # MCP server setup, stdio transport, tool routing (switch statement)
├── tools.ts       # Tool definitions (Zod schemas) + handler functions
├── api-client.ts  # Axios HTTP client (singleton) for backend API
├── formatters.ts  # Response formatting → Markdown for LLM consumption
└── types.ts       # TypeScript interfaces for API responses
```

**Data flow:** MCP Request → `index.ts` (router) → `tools.ts` (handler) → `api-client.ts` (HTTP) → `formatters.ts` (format) → MCP Response

## Available Tools

| Tool | Endpoint | Purpose |
|------|----------|---------|
| `web_search` | `/search-api` | Multi-engine search with time filtering |
| `fetch_webpage` | `/fetch` | Extract content from URLs (Trafilatura) + stealth mode |
| `search_and_fetch` | `/search-and-fetch` | Search + auto-fetch top results + stealth mode |
| `deep_research` | `/deep-research` | Multi-query parallel research with compiled reports + stealth mode |
| `crawl_site` | `/crawl-site` | Depth-limited site crawl with Trafilatura + stealth mode |

## FREE Stealth Mode (Anti-Bot Bypass)

All fetch tools support FREE stealth mode parameters:
- `stealth_mode`: off | low | medium | high
- `auto_bypass`: boolean - auto-escalate if bot protection detected

Detects: Cloudflare, reCAPTCHA, hCaptcha, DataDome, Akamai, PerimeterX, Imperva, Kasada

## Key Patterns

### Tool Definition Pattern (`tools.ts`)
```typescript
export const myTool = {
  name: 'my_tool',
  description: 'Description for LLM',
  inputSchema: z.object({ param: z.string().describe('Param description') }),
};

export async function handleMyTool(args: z.infer<typeof myTool.inputSchema>): Promise<string> {
  const response = await apiClient.myEndpoint(args);
  return formatMyResponse(response);  // Return string, not object
}
// Don't forget: add to `tools` array export and switch statement in index.ts
```

### API Client Pattern (`api-client.ts`)
- Singleton `apiClient` instance with 60-second timeout
- All API calls use **GET requests** with query parameters
- Error handler wraps axios errors with user-friendly messages

### Response Formatting (`formatters.ts`)
- Return **Markdown strings** optimized for LLM consumption
- Use `#` headers, `**bold**` for metadata, `truncateContent()` for length limits
- Some tools (like `deep_research` and `crawl_site`) return compiled markdown from formatter or API

## Development Commands

```bash
npm run dev      # Run with tsx (hot reload)
npm run watch    # Watch mode development  
npm run build    # Compile TypeScript → dist/ (includes chmod +x)
```

## Critical Conventions

1. **stdout = MCP protocol only** → All logging goes to `console.error()` (stderr)
2. **ESM modules** → Imports require `.js` extension: `import { x } from './file.js'`
3. **Zod `.describe()`** → Every schema field needs description for LLM documentation
4. **Handlers return strings** → Never return raw objects; format or JSON.stringify
5. **Zero-config design** → API URL hardcoded; no env vars or config files
6. **100% FREE** → No paid API keys required; stealth mode replaces JS rendering

## Adding a New Tool

1. **`types.ts`** - Define request/response interfaces
2. **`api-client.ts`** - Add async method to `ApiClient` class
3. **`formatters.ts`** - Create formatter function (if needed)
4. **`tools.ts`** - Define `myTool` object + `handleMyTool` function + add to `tools` array
5. **`index.ts`** - Add case to switch statement in `CallToolRequestSchema` handler

## External Dependencies

- `@modelcontextprotocol/sdk` - MCP server/transport primitives
- `axios` - HTTP client for backend API
- `zod` - Schema validation for tool inputs
