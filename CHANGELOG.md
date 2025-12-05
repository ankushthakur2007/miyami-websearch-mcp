# Changelog

## [1.4.0] - 2025-12-05

### Added
- **FREE Stealth Mode**: Anti-bot bypass for protected websites
  - `stealth_mode` parameter: off, low, medium, high
  - `auto_bypass` parameter: automatically escalate stealth levels if bot protection detected
  - Available on `fetch_webpage`, `search_and_fetch`, and `deep_research` tools
  - Detects Cloudflare, reCAPTCHA, hCaptcha, DataDome, Akamai, PerimeterX, Imperva, Kasada

### Changed
- **New API URL**: Migrated from `miyami-websearch-tool.onrender.com` to `websearch.miyami.tech`
- Removed `include_suggestions` parameter from `deep_research` (suggestions still included in response)

### Removed
- **JS Rendering removed from backend**: Paid services (ScrapingBee, Browserless) removed to keep tool 100% FREE
  - Stealth mode provides equivalent anti-bot bypass functionality for free

## [1.3.0] - 2025-12-04

### Changed
- **BREAKING: Deep Research Tool Redesigned**: Complete overhaul of `deep_research` tool
  - **Parameter changes:**
    - `query` → `queries`: Now accepts comma-separated list of queries (max 10)
    - `depth` parameter **REMOVED**: No longer uses recursive depth
    - New `include_suggestions` parameter to toggle search suggestions
  - **New features:**
    - Process multiple queries in parallel for faster research
    - AI reranking always enabled for better relevance
    - Auto-generated markdown report (`compiled_report` field)
    - 30-minute server-side caching for repeated queries
    - Rich metadata extraction (author, date, sitename)
    - Aggregated statistics across all queries
  - **Response structure:**
    - New `research_summary` with aggregated stats
    - New `compiled_report` with formatted markdown
    - New `all_suggestions` with deduplicated suggestions
    - `query_results` array with per-query results

### Fixed
- Updated TypeScript types for new DeepResearchResponse structure

## [1.2.0] - 2025-11-22

### Added
- **Semantic Reranking**: AI-powered reranking for better search relevance using FlashRank
  - Added `rerank` parameter to `web_search` tool
  - Added `rerank` parameter to `search_and_fetch` tool
- **Deep Research Tool**: New `deep_research` tool for recursive research agent
  - Searches, reads, extracts links, and recursively searches deeper
  - Configurable depth (1-2) and breadth (2-5) parameters
  - Supports time-range filtering
- **Enhanced Type Definitions**: Updated TypeScript types to support new features

### Changed
- Updated API client to support `rerank` parameter
- Updated tool handlers to pass `rerank` parameter to API
- Improved error handling for new endpoints

## [1.1.0] - 2024-11-16

### Added
- **Time-Range Filtering**: Filter search results by recency (day, week, month, year)
- **Enhanced Content Extraction**: Trafilatura-powered extraction (Firecrawl-quality)
- **Markdown Output Support**: Get structured markdown from webpages
- **Rich Metadata**: Automatically extract authors, dates, site names, descriptions
- **Extraction Stats**: Word count, content length, format info
- **Format Options**: Choose between text, markdown, or HTML output
- **Extraction Modes**: Select between trafilatura (best quality) or readability (faster)
- **Image Support**: Include images in webpage extraction
- **Suggestions**: Search suggestions from search engines
- **Infoboxes**: Knowledge graph data from search results
- **Enhanced Formatting**: Better display of metadata, stats, and content

### Changed
- Default format for fetch_webpage changed to markdown (was text)
- Default extraction_mode set to trafilatura for best quality
- Improved error messages and user feedback
- Enhanced formatter functions to display new metadata fields

## [1.0.0] - 2024-11-11

### Added
- Initial release
- web_search tool for searching across multiple search engines
- fetch_webpage tool for content extraction
- search_and_fetch tool for combined search and content retrieval
- Support for multiple search engines (Google, DuckDuckGo, Bing, Brave, Wikipedia)
- Clean content extraction from web pages
- Zero-configuration setup with hardcoded API URL
- Retry logic for handling cold starts on free tier hosting
