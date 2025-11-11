/**
 * Response formatting utilities for LLM consumption
 */

import type { SearchResponse, WebpageContent, SearchAndFetchResult } from './types.js';

/**
 * Format search results for LLM consumption
 */
export function formatSearchResults(response: SearchResponse): string {
  const lines: string[] = [];
  
  lines.push(`# Search Results for: "${response.query}"`);
  lines.push(`Found ${response.number_of_results} results\n`);
  
  response.results.forEach((result, index) => {
    lines.push(`## Result ${index + 1}: ${result.title}`);
    lines.push(`**URL:** ${result.url}`);
    if (result.engine) {
      lines.push(`**Source:** ${result.engine}`);
    }
    lines.push(`\n${result.content}\n`);
    lines.push('---\n');
  });
  
  return lines.join('\n');
}

/**
 * Format webpage content for LLM consumption
 */
export function formatWebpageContent(content: WebpageContent): string {
  const lines: string[] = [];
  
  if (!content.success) {
    return `# Failed to fetch webpage\n\n**URL:** ${content.url}\n**Error:** ${content.error || 'Unknown error'}`;
  }
  
  lines.push(`# ${content.title || 'Webpage Content'}`);
  lines.push(`**URL:** ${content.url}\n`);
  lines.push('## Content\n');
  lines.push(content.content);
  
  if (content.links && content.links.length > 0) {
    lines.push('\n## Links Found\n');
    content.links.slice(0, 20).forEach((link, index) => {
      lines.push(`${index + 1}. [${link.text}](${link.url})`);
    });
    if (content.links.length > 20) {
      lines.push(`\n... and ${content.links.length - 20} more links`);
    }
  }
  
  return lines.join('\n');
}

/**
 * Format search and fetch results for LLM consumption
 */
export function formatSearchAndFetch(result: SearchAndFetchResult): string {
  const lines: string[] = [];
  
  lines.push(`# Search and Fetch Results for: "${result.query}"`);
  lines.push(`Retrieved ${result.results.length} detailed results\n`);
  
  result.results.forEach((item, index) => {
    lines.push(`## Result ${index + 1}: ${item.title}`);
    lines.push(`**URL:** ${item.url}`);
    
    if (item.success) {
      lines.push(`\n### Search Snippet`);
      lines.push(item.search_snippet);
      lines.push(`\n### Full Content`);
      lines.push(item.full_content);
    } else {
      lines.push(`\n**Failed to fetch full content:** ${item.error || 'Unknown error'}`);
      lines.push(`\n### Search Snippet`);
      lines.push(item.search_snippet);
    }
    
    lines.push('\n---\n');
  });
  
  return lines.join('\n');
}

/**
 * Truncate content to a maximum length
 */
export function truncateContent(content: string, maxLength: number): string {
  if (content.length <= maxLength) {
    return content;
  }
  
  return content.substring(0, maxLength) + '\n\n[Content truncated...]';
}
