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
  description: 'Search the web across multiple search engines (Google, DuckDuckGo, Bing, Brave, Wikipedia). Returns ranked results with titles, URLs, and content snippets. Supports time-range filtering for recent results.',
  inputSchema: z.object({
    query: z.string().describe('The search query'),
    categories: z.string().optional().describe('Search categories (comma-separated): general, news, images, videos, science. Default: general'),
    language: z.string().optional().describe('Language code (e.g., en, es, fr). Default: en'),
    page: z.number().optional().describe('Page number for pagination. Default: 1'),
    time_range: z.enum(['day', 'week', 'month', 'year']).optional().describe('Filter results by recency: day (past 24h), week (past week), month (past month), year (past year)'),
    rerank: z.boolean().optional().describe('Enable AI semantic reranking for better search relevance. Default: false'),
  }),
};

export async function handleWebSearch(args: z.infer<typeof webSearchTool.inputSchema>): Promise<string> {
  const response = await apiClient.search({
    q: args.query,
    categories: args.categories,
    language: args.language,
    page: args.page,
    time_range: args.time_range,
    rerank: args.rerank,
  });

  return formatSearchResults(response);
}

/**
 * Tool: fetch_webpage
 * Extract clean, readable content from any webpage
 */
export const fetchWebpageTool = {
  name: 'fetch_webpage',
  description: 'Fetch and extract clean, readable content from any webpage using Trafilatura (Firecrawl-quality extraction). Supports markdown, text, or HTML output. Removes ads, navigation, and clutter. Includes FREE stealth mode for anti-bot bypass.',
  inputSchema: z.object({
    url: z.string().describe('The URL of the webpage to fetch'),
    include_links: z.boolean().optional().describe('Include links found in the content. Default: true'),
    include_images: z.boolean().optional().describe('Include images found in the content. Default: true'),
    max_content_length: z.number().optional().describe('Maximum content length in characters. Default: 50000'),
    format: z.enum(['text', 'markdown', 'html']).optional().describe('Output format: text (clean text), markdown (structured markdown), html (raw HTML). Default: markdown'),
    extraction_mode: z.enum(['trafilatura', 'readability']).optional().describe('Extraction engine: trafilatura (best quality), readability (faster). Default: trafilatura'),
    stealth_mode: z.enum(['off', 'low', 'medium', 'high']).optional().describe('Anti-bot bypass level: off (standard), low (User-Agent rotation), medium (+ header randomization), high (+ TLS fingerprinting). Default: off'),
    auto_bypass: z.boolean().optional().describe('Automatically escalate stealth levels if bot protection detected. Default: false'),
  }),
};

export async function handleFetchWebpage(args: z.infer<typeof fetchWebpageTool.inputSchema>): Promise<string> {
  const content = await apiClient.fetchWebpage({
    url: args.url,
    include_links: args.include_links ?? true,
    include_images: args.include_images ?? true,
    max_content_length: args.max_content_length ?? 50000,
    format: args.format ?? 'markdown',
    extraction_mode: args.extraction_mode ?? 'trafilatura',
    stealth_mode: args.stealth_mode,
    auto_bypass: args.auto_bypass,
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
  description: 'Search the web and automatically fetch full content from top results using Trafilatura (Firecrawl-quality). Perfect for research - combines search + content extraction with time-range filtering, markdown output, and FREE stealth mode for anti-bot bypass.',
  inputSchema: z.object({
    query: z.string().describe('The search query'),
    num_results: z.number().optional().describe('Number of top results to fetch full content for (1-5). Default: 3'),
    categories: z.string().optional().describe('Search categories (comma-separated): general, news, images, videos, science. Default: general'),
    language: z.string().optional().describe('Language code (e.g., en, es, fr). Default: en'),
    time_range: z.enum(['day', 'week', 'month', 'year']).optional().describe('Filter results by recency: day (past 24h), week (past week), month (past month), year (past year)'),
    rerank: z.boolean().optional().describe('Enable AI semantic reranking for better search relevance. Default: false'),
    format: z.enum(['text', 'markdown', 'html']).optional().describe('Output format: text, markdown (default), or html'),
    stealth_mode: z.enum(['off', 'low', 'medium', 'high']).optional().describe('Anti-bot bypass level: off (standard), low (User-Agent rotation), medium (+ header randomization), high (+ TLS fingerprinting). Default: off'),
    auto_bypass: z.boolean().optional().describe('Automatically escalate stealth levels if bot protection detected. Default: false'),
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
    time_range: args.time_range,
    rerank: args.rerank,
    format: args.format ?? 'markdown',
    stealth_mode: args.stealth_mode,
    auto_bypass: args.auto_bypass,
  });

  return formatSearchAndFetch(response);
}

/**
 * Export all tools
 */
/**
 * Tool: deep_research
 * Multi-query parallel research agent with compiled reports
 */
export const deepResearchTool = {
  name: 'deep_research',
  description: 'Perform deep parallel research on multiple topics at once. Processes up to 10 comma-separated queries in parallel, fetches and reranks content with AI, and generates a compiled markdown report. Includes FREE stealth mode for anti-bot bypass. Perfect for comprehensive research across multiple related topics.',
  inputSchema: z.object({
    queries: z.string().describe('Comma-separated list of research queries (max 10). Example: "AI trends 2024,machine learning basics,ChatGPT use cases"'),
    breadth: z.number().optional().describe('Number of results to fetch per query (1-5). Default: 3'),
    time_range: z.enum(['day', 'week', 'month', 'year']).optional().describe('Filter results by recency: day, week, month, year'),
    max_content_length: z.number().optional().describe('Max content length per result. Default: 30000'),
    stealth_mode: z.enum(['off', 'low', 'medium', 'high']).optional().describe('Anti-bot bypass level: off (standard), low (User-Agent rotation), medium (+ header randomization), high (+ TLS fingerprinting). Default: off'),
    auto_bypass: z.boolean().optional().describe('Automatically escalate stealth levels if bot protection detected. Default: false'),
  }),
};

export async function handleDeepResearch(args: z.infer<typeof deepResearchTool.inputSchema>): Promise<string> {
  const response = await apiClient.deepResearch({
    queries: args.queries,
    breadth: args.breadth,
    time_range: args.time_range,
    max_content_length: args.max_content_length,
    stealth_mode: args.stealth_mode,
    auto_bypass: args.auto_bypass,
  });

  // Return the compiled report if available, otherwise JSON
  if (response.compiled_report) {
    return response.compiled_report;
  }
  return JSON.stringify(response, null, 2);
}

/**
 * Export all tools
 */
export const tools = [webSearchTool, fetchWebpageTool, searchAndFetchTool, deepResearchTool];
