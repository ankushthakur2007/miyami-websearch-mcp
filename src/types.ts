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
  suggestions?: string[];
  infoboxes?: Array<{
    infobox: string;
    content: string;
    engine: string;
    urls?: Array<{ title: string; url: string }>;
  }>;
}

export interface FetchMetadata {
  title: string;
  url: string;
  status_code: number;
  author?: string;
  date?: string;
  sitename?: string;
  description?: string;
  language?: string;
}

export interface FetchResponse {
  success: boolean;
  url: string;
  status_code: number;
  metadata: FetchMetadata;
  content: string;
  stats?: {
    content_length: number;
    word_count: number;
    extraction_mode: string;
    format: string;
  };
  headings?: Array<{ level: string; text: string }>;
  links?: Array<{ text: string; url: string }>;
  images?: Array<{ src: string; alt: string }>;
}

export interface WebpageContent {
  url: string;
  title: string;
  content: string;
  links?: Array<{ text: string; url: string }>;
  success: boolean;
  error?: string;
}

export interface SearchAndFetchResponse {
  query: string;
  num_results_requested: number;
  num_results_found: number;
  successful_fetches: number;
  failed_fetches: number;
  results: Array<{
    search_result: {
      title: string;
      url: string;
      snippet: string;
      engine?: string;
      score?: number;
    };
    fetch_status: 'success' | 'failed';
    fetched_content?: {
      title: string;
      content: string;
      headings?: Array<{ level: string; text: string }>;
      content_length: number;
    };
    error?: string;
  }>;
  suggestions?: string[];
}

export interface ApiError {
  error: string;
  details?: string;
}
