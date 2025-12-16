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

export interface DeepResearchQueryResult {
  query: string;
  status: 'success' | 'error';
  num_results: number;
  successful_fetches: number;
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
      author?: string;
      date?: string;
      sitename?: string;
      content_length: number;
    };
    error?: string;
  }>;
  suggestions?: string[];
}

export interface DeepResearchResponse {
  research_summary: {
    total_queries: number;
    successful_queries: number;
    failed_queries: number;
    total_results_found: number;
    total_successful_fetches: number;
    time_range_filter?: string;
    breadth_per_query: number;
  };
  queries: string[];
  query_results: DeepResearchQueryResult[];
  compiled_report: string;
  all_suggestions: string[];
}

export interface CrawlPage {
  url: string;
  status_code: number;
  depth: number;
  metadata: {
    title: string | null;
    author: string | null;
    date: string | null;
    sitename: string | null;
  };
  content: string;
  word_count: number;
  format: string;
  links?: Array<{ text?: string; url: string }>;
  images?: Array<{ src: string; alt?: string }>;
}

export interface CrawlSiteResponse {
  crawl_summary: {
    start_url: string;
    pages_crawled: number;
    max_pages_requested: number;
    max_depth: number;
    format: string;
    stealth_mode: string;
  };
  pages: CrawlPage[];
  total_words: number;
}

export interface YouTubeTranscriptLanguage {
  language_code: string;
  language: string;
  is_generated: boolean;
  is_translatable: boolean;
}

export interface YouTubeTranscriptResponse {
  success: boolean;
  video_id: string;
  video_url: string;
  format: 'text' | 'json' | 'srt';
  language: string;
  translated_to?: string;
  time_range?: {
    start: number;
    end: number;
  };
  stats: {
    segment_count: number;
    word_count: number;
    duration_seconds: number;
  };
  transcript: string;
}

export interface YouTubeTranscriptLanguagesResponse {
  video_id: string;
  available_transcripts: YouTubeTranscriptLanguage[];
}

export interface ApiError {
  error: string;
  details?: string;
}
