/**
 * HTTP client for MiyaMi WebSearch API
 * Hardcoded to use the free public API at Render.com
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type { SearchResponse, FetchResponse, SearchAndFetchResponse, DeepResearchResponse, ApiError } from './types.js';

// Hardcoded API URL - this is a free service, no configuration needed
const API_BASE_URL = 'https://miyami-websearch-tool.onrender.com';

export class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 60000, // 60 seconds to handle cold starts
      headers: {
        'User-Agent': 'MiyaMi-WebSearch-MCP/1.1.0',
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Perform a web search
   */
  async search(params: {
    q: string;
    categories?: string;
    language?: string;
    page?: number;
    time_range?: 'day' | 'week' | 'month' | 'year';
    rerank?: boolean;
  }): Promise<SearchResponse> {
    try {
      // Convert 'q' to 'query' for the API
      const apiParams: Record<string, any> = {
        query: params.q,
        categories: params.categories,
        language: params.language,
        page: params.page,
      };

      if (params.time_range) {
        apiParams.time_range = params.time_range;
      }

      if (params.rerank) {
        apiParams.rerank = params.rerank;
      }

      const response = await this.client.get<SearchResponse>('/search-api', {
        params: apiParams,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'search');
    }
  }

  /**
   * Fetch webpage content
   */
  async fetchWebpage(params: {
    url: string;
    include_links?: boolean;
    include_images?: boolean;
    max_content_length?: number;
    format?: 'text' | 'markdown' | 'html';
    extraction_mode?: 'trafilatura' | 'readability';
  }): Promise<FetchResponse> {
    try {
      const response = await this.client.get<FetchResponse>('/fetch', {
        params,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'fetch');
    }
  }

  /**
   * Search and fetch - Uses the dedicated API endpoint
   */
  async searchAndFetch(params: {
    query: string;
    num_results?: number;
    categories?: string;
    language?: string;
    max_content_length?: number;
    time_range?: 'day' | 'week' | 'month' | 'year';
    rerank?: boolean;
    format?: 'text' | 'markdown' | 'html';
  }): Promise<SearchAndFetchResponse> {
    try {
      const response = await this.client.get<SearchAndFetchResponse>('/search-and-fetch', {
        params: {
          ...params,
          rerank: params.rerank,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'search-and-fetch');
    }
  }

  /**
   * Deep Research - Multi-query parallel research agent
   */
  async deepResearch(params: {
    queries: string;
    breadth?: number;
    time_range?: 'day' | 'week' | 'month' | 'year';
    max_content_length?: number;
    include_suggestions?: boolean;
  }): Promise<DeepResearchResponse> {
    try {
      const response = await this.client.get<DeepResearchResponse>('/deep-research', {
        params,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'deep-research');
    }
  }

  /**
   * Handle API errors with user-friendly messages
   */
  private handleError(error: unknown, operation: string): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;

      if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
        return new Error(
          `Request timeout during ${operation}. The API may be waking up from sleep (Render free tier). ` +
          `This can take 30-60 seconds on the first request. Please try again in a moment.`
        );
      }

      if (axiosError.response) {
        const status = axiosError.response.status;
        const data = axiosError.response.data;

        if (status >= 500) {
          return new Error(
            `API server error during ${operation}. The service may be restarting. ` +
            `Please wait 30 seconds and try again. ` +
            `Error: ${data?.error || axiosError.message}`
          );
        }

        if (status === 404) {
          return new Error(`Resource not found during ${operation}`);
        }

        if (status === 400) {
          return new Error(`Invalid request: ${data?.error || axiosError.message}`);
        }

        return new Error(data?.error || axiosError.message);
      }

      if (axiosError.request) {
        return new Error(
          `Unable to connect to MiyaMi WebSearch API. The service may be starting up (Render free tier cold start). ` +
          `Please wait 30-60 seconds and try again. ` +
          `If this persists, visit: https://github.com/ankushthakur2007/miyami-websearch-mcp/issues`
        );
      }
    }

    return new Error(`Unexpected error during ${operation}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
