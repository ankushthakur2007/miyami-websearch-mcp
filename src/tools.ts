/**
 * MCP Tool definitions and handlers
 */

import { z } from 'zod';
import { apiClient } from './api-client.js';
import { formatSearchResults, formatWebpageContent, formatSearchAndFetch, truncateContent } from './formatters.js';
import type { SearchAndFetchResult } from './types.js';

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
  // First, perform the search
  const searchResponse = await apiClient.search({
    q: args.query,
    categories: args.categories,
    language: args.language,
    page: 1,
  });
  
  // Limit the number of results to fetch
  const numToFetch = Math.min(args.num_results ?? 3, 5);
  const topResults = searchResponse.results.slice(0, numToFetch);
  
  // Fetch full content for each result
  const fetchedResults = await Promise.all(
    topResults.map(async (result) => {
      try {
        const content = await apiClient.fetchWebpage({
          url: result.url,
          include_links: false,
          max_content_length: 10000, // Limit per-page content
        });
        
        return {
          url: result.url,
          title: result.title,
          search_snippet: result.content,
          full_content: content.success ? content.content : '',
          success: content.success,
          error: content.error,
        };
      } catch (error) {
        return {
          url: result.url,
          title: result.title,
          search_snippet: result.content,
          full_content: '',
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch content',
        };
      }
    })
  );
  
  const result: SearchAndFetchResult = {
    query: args.query,
    results: fetchedResults,
  };
  
  return formatSearchAndFetch(result);
}

/**
 * Export all tools
 */
export const tools = [webSearchTool, fetchWebpageTool, searchAndFetchTool];
