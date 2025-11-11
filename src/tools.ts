/**
 * MCP Tool definitions and handlers
 */

import { z } from 'zod';
import { apiClient } from './api-client.js';
import { formatSearchResults, formatWebpageContent, formatSearchAndFetch, truncateContent } from './formatters.js';

/**
 * Tool: web_search
 * Search the web using multiple search engines
 */
export const webSearchTool = {
  name: 'web_search',
  description: 'Search the web across multiple search engines (Google, DuckDuckGo, Bing, Brave, Wikipedia). Returns ranked results with titles, URLs, and content snippets.',
  inputSchema: z.object({
    query: z.string().describe('The search query'),
    categories: z.string().optional().describe('Search categories (comma-separated): general, news, images, videos, science. Default: general'),
    language: z.string().optional().describe('Language code (e.g., en, es, fr). Default: en'),
    page: z.number().optional().describe('Page number for pagination. Default: 1'),
  }),
};

export async function handleWebSearch(args: z.infer<typeof webSearchTool.inputSchema>): Promise<string> {
  const response = await apiClient.search({
    q: args.query,
    categories: args.categories,
    language: args.language,
    page: args.page,
  });
  
  return formatSearchResults(response);
}

/**
 * Tool: fetch_webpage
 * Extract clean, readable content from any webpage
 */
export const fetchWebpageTool = {
  name: 'fetch_webpage',
  description: 'Fetch and extract clean, readable content from any webpage. Removes ads, navigation, and other clutter to provide just the main content.',
  inputSchema: z.object({
    url: z.string().describe('The URL of the webpage to fetch'),
    include_links: z.boolean().optional().describe('Include links found in the content. Default: true'),
    max_content_length: z.number().optional().describe('Maximum content length in characters. Default: 50000'),
  }),
};

export async function handleFetchWebpage(args: z.infer<typeof fetchWebpageTool.inputSchema>): Promise<string> {
  const content = await apiClient.fetchWebpage({
    url: args.url,
    include_links: args.include_links ?? true,
    max_content_length: args.max_content_length ?? 50000,
  });
  
  const formatted = formatWebpageContent(content);
  
  // Truncate if needed
  const maxLength = args.max_content_length ?? 50000;
  return truncateContent(formatted, maxLength);
}

/**
 * Tool: search_and_fetch
 * Search the web and automatically fetch full content from top results
 */
export const searchAndFetchTool = {
  name: 'search_and_fetch',
  description: 'Perform a web search and automatically fetch full content from the top results. Combines search and content extraction in one step for comprehensive research.',
  inputSchema: z.object({
    query: z.string().describe('The search query'),
    num_results: z.number().optional().describe('Number of top results to fetch full content for (1-5). Default: 3'),
    categories: z.string().optional().describe('Search categories (comma-separated): general, news, images, videos, science. Default: general'),
    language: z.string().optional().describe('Language code (e.g., en, es, fr). Default: en'),
  }),
};

export async function handleSearchAndFetch(args: z.infer<typeof searchAndFetchTool.inputSchema>): Promise<string> {
  // Use the dedicated API endpoint for search-and-fetch
  const response = await apiClient.searchAndFetch({
    query: args.query,
    num_results: args.num_results ?? 3,
    categories: args.categories,
    language: args.language,
    max_content_length: 50000,
  });
  
  return formatSearchAndFetch(response);
}

/**
 * Export all tools
 */
export const tools = [webSearchTool, fetchWebpageTool, searchAndFetchTool];
