# MiyaMi WebSearch MCP

[![npm version](https://badge.fury.io/js/miyami-websearch-mcp.svg)](https://www.npmjs.com/package/miyami-websearch-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Connect your LLM to the internet! Search the web and extract content from any webpage using the Model Context Protocol.

## 🌟 Features

- 🔍 **Web Search** - Search across Google, DuckDuckGo, Bing, Brave, Wikipedia
- 🧠 **Deep Research** - Multi-query parallel research with compiled reports
- 🛡️ **FREE Stealth Mode** - Anti-bot bypass (Cloudflare, DataDome, etc.) - NEW!
- ⏰ **Time-Range Filters** - Filter results by recency (day, week, month, year)
- 📄 **Enhanced Content Extraction** - Trafilatura-powered (Firecrawl-quality) extraction
- 📝 **Markdown Output** - Get structured markdown from webpages
- 🎯 **Rich Metadata** - Automatically extract authors, dates, site names
- ⚡ **Fast & Easy** - One-line installation, zero configuration
- 🤖 **LLM Optimized** - Formatted responses perfect for AI consumption
- 🆓 **100% Free** - No API keys, no signup, no configuration needed
- 🔒 **Privacy-First** - No tracking, no data collection

## 📦 Installation

### Option 1: Use with npx (Recommended - No Installation)

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "miyami-websearch": {
      "command": "npx",
      "args": ["-y", "miyami-websearch-mcp"]
    }
  }
}
```

### Option 2: Global Installation

```bash
npm install -g miyami-websearch-mcp
```

Then configure Claude Desktop:

```json
{
  "mcpServers": {
    "miyami-websearch": {
      "command": "miyami-websearch-mcp"
    }
  }
}
```

**That's it!** Restart Claude Desktop and you're ready to search the web! 🎉

## 🚀 Quick Start

After adding to Claude Desktop config and restarting, try these prompts:

```
Search for the latest news about AI
```

```
Search for Python tutorials and summarize the top result
```

```
Fetch the content from https://example.com and summarize it
```

## 🛠️ Available Tools

### 1. `web_search`
Search the web using multiple search engines with optional time-range filtering.

**Parameters:**
- `query` (required) - Your search query
- `categories` (optional) - general, news, images, videos, science
- `language` (optional) - Language code (default: en)
- `page` (optional) - Page number (default: 1)
- `time_range` (optional) - **NEW!** Filter by recency: day, week, month, year

**Examples:**
```
Search for "quantum computing breakthroughs" in news category
```

```
Search for AI news from the past 24 hours with time_range: day
```

```
Find recent Python tutorials from the past week with time_range: week
```

### 2. `fetch_webpage`
Extract clean content from any webpage using **Trafilatura** (Firecrawl-quality extraction).

**Parameters:**
- `url` (required) - The webpage URL
- `include_links` (optional) - Include links (default: true)
- `include_images` (optional) - Include images (default: true)
- `max_content_length` (optional) - Max length in characters (default: 50000)
- `format` (optional) - Output format: text, markdown (default), html
- `extraction_mode` (optional) - Engine: trafilatura (default, best quality), readability (faster)
- `stealth_mode` (optional) - **NEW!** Anti-bot bypass: off, low, medium, high (default: off)
- `auto_bypass` (optional) - **NEW!** Auto-escalate stealth if bot protection detected (default: false)

**Enhanced Features:**
- 📝 **Markdown output** - Get structured markdown like Firecrawl
- 🎯 **Rich metadata** - Authors, dates, site names automatically extracted
- 📊 **Extraction stats** - Word count, content length, format info
- 🛡️ **Stealth mode** - Bypass Cloudflare, DataDome, Akamai, etc.

**Example:**
```
Fetch and summarize https://en.wikipedia.org/wiki/Artificial_intelligence in markdown format
```

### 3. `search_and_fetch` ⭐ **RECOMMENDED**
Search and automatically fetch full content from top results with Trafilatura-quality extraction.

**Parameters:**
- `query` (required) - Your search query
- `num_results` (optional) - How many results to fetch (1-5, default: 3)
- `categories` (optional) - Search categories
- `time_range` (optional) - Filter by recency: day, week, month, year
- `format` (optional) - Output format: text, markdown (default), html
- `stealth_mode` (optional) - **NEW!** Anti-bot bypass: off, low, medium, high (default: off)
- `auto_bypass` (optional) - **NEW!** Auto-escalate stealth if bot protection detected (default: false)

**What it does:**
- ✅ Searches for your query (with optional time filter)
- ✅ Gets top N results
- ✅ Automatically fetches full content (parallel)
- ✅ Uses **Trafilatura** for Firecrawl-quality extraction
- ✅ Returns both search snippets AND full webpage content
- ✅ FREE stealth mode for protected sites

**Examples:**
```
Research "climate change solutions" and give me detailed info from top 3 sources
```

```
Get recent AI breakthroughs from past 24 hours with full articles (time_range: day, num_results: 5)
```

```
Research recent web development tutorials from past week (time_range: week, format: markdown)
```

### 4. `deep_research` 🧠
Perform comprehensive parallel research across multiple topics at once with AI-powered reranking and compiled markdown reports.

**Parameters:**
- `queries` (required) - Comma-separated list of research queries (max 10)
- `breadth` (optional) - Results to fetch per query (1-5, default: 3)
- `time_range` (optional) - Filter by recency: day, week, month, year
- `max_content_length` (optional) - Max content per result (default: 30000)
- `stealth_mode` (optional) - **NEW!** Anti-bot bypass: off, low, medium, high (default: off)
- `auto_bypass` (optional) - **NEW!** Auto-escalate stealth if bot protection detected (default: false)

**What it does:**
- ✅ Process up to 10 queries in **parallel** for speed
- ✅ AI reranking for better relevance (always enabled)
- ✅ Auto-generates compiled **markdown report**
- ✅ Rich metadata extraction (author, date, source)
- ✅ Server-side caching (30 minutes)
- ✅ Aggregated statistics across all queries
- ✅ FREE stealth mode for protected sites

**Examples:**
```
Research "AI trends 2024,machine learning basics,ChatGPT use cases" with deep_research
```

```
Deep research on "React vs Vue,Next.js features,frontend trends" from past month
```

```
Comprehensive research: "climate solutions,renewable energy,carbon capture" with breadth: 5
```

## 💡 Usage Examples

### Research a Topic
```
Use search_and_fetch to research "artificial general intelligence latest developments" 
from the top 3 results and give me a comprehensive summary
```

### Get Recent News (Time-Range Filter)
```
Search for AI breakthroughs from the past 24 hours using time_range: day
```

### Recent Tutorials (Time-Range Filter)
```
Find Python tutorials from the past week using search with time_range: week
```

### Fetch with Markdown Output
```
Fetch this article in markdown format: https://example.com/article
```

### Research Recent Developments
```
Use search_and_fetch to research "quantum computing" from the past week 
with time_range: week and get full article content in markdown
```

### Find Specific Information
```
Search for "best restaurants in Tokyo" and show me the top 5 results
```

### Multi-step Research
```
1. Search for "Python web scraping libraries"
2. Fetch the documentation page in markdown format
3. Explain how to use it with examples
```

## 🔧 Configuration

**No configuration needed!** 🎉

This MCP server connects to a free public API automatically. Just add it to your Claude Desktop config and it works immediately.

If you're looking for advanced configuration options, there aren't any - we've kept it simple on purpose!

## 🐛 Troubleshooting

### "MCP server not appearing in Claude Desktop"

1. Check your `claude_desktop_config.json` is valid JSON
2. Restart Claude Desktop completely (Quit and reopen)
3. Check Console.app (macOS) for error messages

### "First search is slow (30-60 seconds)"

This is normal! The free tier API sleeps after inactivity. Subsequent requests are fast.

### "Connection timeout"

The backend API is on Render free tier and may be waking up. Wait 60 seconds and retry.

### "Tools not working"

1. Ensure you have Node.js 18+ installed: `node --version`
2. Try global install instead of npx
3. Check [GitHub Issues](https://github.com/ankushthakur2007/miyami-websearch-mcp/issues)

## 📡 API Backend

This MCP server connects to a free public API:
- **URL**: https://websearch.miyami.tech (hardcoded, no config needed)
- **Cost**: 100% Free - no API keys or signup required
- **Privacy**: No logging, no tracking, no data collection
- **Engines**: Google, DuckDuckGo, Bing, Brave, Wikipedia, Startpage
- **Stealth Mode**: FREE anti-bot bypass (Cloudflare, DataDome, Akamai, etc.)

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Report Issues

Found a bug? [Open an issue](https://github.com/ankushthakur2007/miyami-websearch-mcp/issues)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🌟 Star History

If this tool helps you, please star the repo! ⭐

---

**Made with ❤️ for the LLM community**

Connect your AI to the internet in seconds, not hours.
