#!/usr/bin/env node

/**
 * MiyaMi WebSearch MCP Server
 * Provides web search and content extraction tools for LLMs
 * 
 * Usage: npx miyami-websearch-mcp
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { tools, handleWebSearch, handleFetchWebpage, handleSearchAndFetch, handleDeepResearch } from './tools.js';

/**
 * Create and configure MCP server
 */
const server = new Server(
  {
    name: 'miyami-websearch-mcp',
    version: '1.4.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Handler for listing available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: {
        type: 'object',
        properties: Object.fromEntries(
          Object.entries(tool.inputSchema.shape).map(([key, value]) => [
            key,
            {
              type: typeof value === 'object' && 'description' in value ?
                (value as any)._def.innerType?._def.typeName === 'ZodNumber' ? 'number' :
                  (value as any)._def.innerType?._def.typeName === 'ZodBoolean' ? 'boolean' : 'string'
                : (value as any)._def.typeName === 'ZodNumber' ? 'number' :
                  (value as any)._def.typeName === 'ZodBoolean' ? 'boolean' : 'string',
              description: (value as any).description,
            },
          ])
        ),
        required: Object.entries(tool.inputSchema.shape)
          .filter(([_, value]) => !(value as any).isOptional())
          .map(([key]) => key),
      },
    })),
  };
});

/**
 * Handler for tool execution
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: string;

    switch (name) {
      case 'web_search':
        result = await handleWebSearch(args as any);
        break;

      case 'fetch_webpage':
        result = await handleFetchWebpage(args as any);
        break;

      case 'search_and_fetch':
        result = await handleSearchAndFetch(args as any);
        break;

      case 'deep_research':
        result = await handleDeepResearch(args as any);
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: result,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log to stderr so it doesn't interfere with MCP protocol on stdout
  console.error('MiyaMi WebSearch MCP Server running on stdio');
  console.error('Version: 1.4.0');
  console.error('API: https://websearch.miyami.tech');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
