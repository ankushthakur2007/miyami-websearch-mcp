/**
 * Response formatting utilities for LLM consumption
 */

import type { SearchResponse, FetchResponse, SearchAndFetchResponse } from './types.js';

/**
 * Format search results for LLM consumption
 */
export function formatSearchResults(response: SearchResponse): string {
  const lines: string[] = [];
  
  lines.push(`# Search Results for: "${response.query}"`);
  lines.push(`Found ${response.number_of_results} results\n`);
  
  if (response.suggestions && response.suggestions.length > 0) {
    lines.push(`**Suggestions:** ${response.suggestions.join(', ')}\n`);
  }
  
  response.results.forEach((result, index) => {
    lines.push(`## Result ${index + 1}: ${result.title}`);
    lines.push(`**URL:** ${result.url}`);
    if (result.engine) {
      lines.push(`**Source:** ${result.engine}`);
    }
    if (result.score) {
      lines.push(`**Score:** ${result.score}`);
    }
    lines.push(`\n${result.content}\n`);
    lines.push('---\n');
  });
  
  if (response.infoboxes && response.infoboxes.length > 0) {
    lines.push('\n## Infoboxes\n');
    response.infoboxes.forEach((infobox, index) => {
      lines.push(`### ${index + 1}. ${infobox.infobox}`);
      lines.push(infobox.content);
      if (infobox.urls && infobox.urls.length > 0) {
        lines.push('\n**Related URLs:**');
        infobox.urls.forEach(url => {
          lines.push(`- [${url.title}](${url.url})`);
        });
      }
      lines.push('');
    });
  }
  
  return lines.join('\n');
}

/**
 * Format webpage content for LLM consumption
 */
export function formatWebpageContent(content: FetchResponse): string {
  const lines: string[] = [];
  
  lines.push(`# ${content.metadata.title || 'Webpage Content'}`);
  lines.push(`**URL:** ${content.url || content.metadata.url}`);
  lines.push(`**Status:** ${content.status_code || content.metadata.status_code}`);
  
  // Enhanced metadata
  if (content.metadata.author) {
    lines.push(`**Author:** ${content.metadata.author}`);
  }
  if (content.metadata.date) {
    lines.push(`**Date:** ${content.metadata.date}`);
  }
  if (content.metadata.sitename) {
    lines.push(`**Site:** ${content.metadata.sitename}`);
  }
  if (content.metadata.description) {
    lines.push(`**Description:** ${content.metadata.description}`);
  }
  
  // Stats
  if (content.stats) {
    lines.push(`\n**Extraction Stats:**`);
    lines.push(`- Format: ${content.stats.format}`);
    lines.push(`- Extraction Mode: ${content.stats.extraction_mode}`);
    lines.push(`- Content Length: ${content.stats.content_length} characters`);
    lines.push(`- Word Count: ${content.stats.word_count} words`);
  }
  
  lines.push('\n## Content\n');
  lines.push(content.content);
  
  if (content.headings && content.headings.length > 0) {
    lines.push('\n## Headings Found\n');
    content.headings.slice(0, 10).forEach((heading, index) => {
      lines.push(`${index + 1}. ${heading.level.toUpperCase()}: ${heading.text}`);
    });
    if (content.headings.length > 10) {
      lines.push(`\n... and ${content.headings.length - 10} more headings`);
    }
  }
  
  if (content.links && content.links.length > 0) {
    lines.push('\n## Links Found\n');
    content.links.slice(0, 20).forEach((link, index) => {
      lines.push(`${index + 1}. [${link.text}](${link.url})`);
    });
    if (content.links.length > 20) {
      lines.push(`\n... and ${content.links.length - 20} more links`);
    }
  }
  
  if (content.images && content.images.length > 0) {
    lines.push('\n## Images Found\n');
    content.images.slice(0, 10).forEach((img, index) => {
      lines.push(`${index + 1}. ![${img.alt}](${img.src})`);
    });
    if (content.images.length > 10) {
      lines.push(`\n... and ${content.images.length - 10} more images`);
    }
  }
  
  return lines.join('\n');
}

/**
 * Format search and fetch results for LLM consumption
 */
export function formatSearchAndFetch(result: SearchAndFetchResponse): string {
  const lines: string[] = [];
  
  lines.push(`# Search and Fetch Results for: "${result.query}"`);
  lines.push(`**Requested:** ${result.num_results_requested} results`);
  lines.push(`**Found:** ${result.num_results_found} results`);
  lines.push(`**Successful Fetches:** ${result.successful_fetches}`);
  lines.push(`**Failed Fetches:** ${result.failed_fetches}\n`);
  
  if (result.suggestions && result.suggestions.length > 0) {
    lines.push(`**Suggestions:** ${result.suggestions.join(', ')}\n`);
  }
  
  result.results.forEach((item, index) => {
    lines.push(`## Result ${index + 1}: ${item.search_result.title}`);
    lines.push(`**URL:** ${item.search_result.url}`);
    
    if (item.search_result.engine) {
      lines.push(`**Source:** ${item.search_result.engine}`);
    }
    
    lines.push(`\n### Search Snippet`);
    lines.push(item.search_result.snippet);
    
    if (item.fetch_status === 'success' && item.fetched_content) {
      lines.push(`\n### Full Content (${item.fetched_content.content_length} characters)`);
      lines.push(item.fetched_content.content);
      
      if (item.fetched_content.headings && item.fetched_content.headings.length > 0) {
        lines.push(`\n#### Key Sections:`);
        item.fetched_content.headings.slice(0, 5).forEach((h) => {
          lines.push(`- ${h.level.toUpperCase()}: ${h.text}`);
        });
      }
    } else {
      lines.push(`\n**⚠️ Failed to fetch full content**`);
      if (item.error) {
        lines.push(`Error: ${item.error}`);
      }
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
