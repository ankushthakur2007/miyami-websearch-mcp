/**
 * Type definitions for MiyaMi WebSearch MCP
 */

export interface SearchResult {
  title: string;
  url: string;
  content: string;
  engine?: string;
  score?: number;
}

export interface SearchResponse {
  query: string;
  number_of_results: number;
  results: SearchResult[];
}

export interface WebpageContent {
  url: string;
  title: string;
  content: string;
  links?: Array<{ text: string; url: string }>;
  success: boolean;
  error?: string;
}

export interface SearchAndFetchResult {
  query: string;
  results: Array<{
    url: string;
    title: string;
    search_snippet: string;
    full_content: string;
    success: boolean;
    error?: string;
  }>;
}

export interface ApiError {
  error: string;
  details?: string;
}
