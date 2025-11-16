# Changelog

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
