/**
 * Response formatting utilities for LLM consumption
 */

import type { SearchResponse, FetchResponse, SearchAndFetchResponse, CrawlSiteResponse, YouTubeTranscriptResponse, YouTubeTranscriptLanguagesResponse } from './types.js';

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
 * Format crawl-site results for LLM consumption
 */
export function formatCrawlSite(response: CrawlSiteResponse): string {
  const lines: string[] = [];

  lines.push(`# Crawl Results`);
  lines.push(`**Start URL:** ${response.crawl_summary.start_url}`);
  lines.push(`**Pages Crawled:** ${response.crawl_summary.pages_crawled}/${response.crawl_summary.max_pages_requested}`);
  lines.push(`**Max Depth:** ${response.crawl_summary.max_depth}`);
  lines.push(`**Format:** ${response.crawl_summary.format}`);
  lines.push(`**Stealth Mode:** ${response.crawl_summary.stealth_mode}`);
  lines.push(`**Total Words:** ${response.total_words}\n`);

  response.pages.forEach((page, index) => {
    lines.push(`## Page ${index + 1}: ${page.metadata.title || page.url}`);
    lines.push(`**URL:** ${page.url}`);
    lines.push(`**Status:** ${page.status_code} | **Depth:** ${page.depth} | **Words:** ${page.word_count}`);
    if (page.metadata.sitename || page.metadata.author || page.metadata.date) {
      const meta: string[] = [];
      if (page.metadata.sitename) meta.push(`Site: ${page.metadata.sitename}`);
      if (page.metadata.author) meta.push(`Author: ${page.metadata.author}`);
      if (page.metadata.date) meta.push(`Date: ${page.metadata.date}`);
      if (meta.length) lines.push(`**Metadata:** ${meta.join(' | ')}`);
    }

    const content = truncateContent(page.content, 2000);
    lines.push(`\n${content}\n`);

    if (page.links && page.links.length > 0) {
      lines.push(`**Links (showing up to 10):**`);
      page.links.slice(0, 10).forEach((link, i) => {
        lines.push(`- ${i + 1}. ${link.url}`);
      });
      if (page.links.length > 10) {
        lines.push(`...and ${page.links.length - 10} more links`);
      }
    }

    if (page.images && page.images.length > 0) {
      lines.push(`**Images (showing up to 5):**`);
      page.images.slice(0, 5).forEach((img, i) => {
        lines.push(`- ${i + 1}. ${img.src}`);
      });
      if (page.images.length > 5) {
        lines.push(`...and ${page.images.length - 5} more images`);
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

/**
 * Format YouTube transcript for LLM consumption
 */
export function formatYouTubeTranscript(response: YouTubeTranscriptResponse): string {
  const lines: string[] = [];

  lines.push(`# YouTube Transcript`);
  lines.push(`**Video ID:** ${response.video_id}`);
  lines.push(`**URL:** ${response.video_url}`);
  lines.push(`**Format:** ${response.format}`);
  lines.push(`**Language:** ${response.language}`);
  
  if (response.translated_to) {
    lines.push(`**Translated To:** ${response.translated_to}`);
  }
  
  if (response.time_range) {
    lines.push(`**Time Range:** ${response.time_range.start}s - ${response.time_range.end}s`);
  }

  lines.push(`\n**Stats:**`);
  lines.push(`- Segments: ${response.stats.segment_count}`);
  lines.push(`- Words: ${response.stats.word_count}`);
  lines.push(`- Duration: ${response.stats.duration_seconds.toFixed(1)}s`);

  lines.push(`\n## Transcript\n`);
  lines.push(response.transcript);

  return lines.join('\n');
}

/**
 * Format YouTube available languages for LLM consumption
 */
export function formatYouTubeLanguages(response: YouTubeTranscriptLanguagesResponse): string {
  const lines: string[] = [];

  lines.push(`# Available Transcripts`);
  lines.push(`**Video ID:** ${response.video_id}\n`);

  lines.push(`## Languages (${response.available_transcripts.length} available)\n`);

  response.available_transcripts.forEach((lang, index) => {
    const generated = lang.is_generated ? ' (auto-generated)' : ' (manual)';
    const translatable = lang.is_translatable ? ' ✓ translatable' : '';
    lines.push(`${index + 1}. **${lang.language}** (\`${lang.language_code}\`)${generated}${translatable}`);
  });

  return lines.join('\n');
}
