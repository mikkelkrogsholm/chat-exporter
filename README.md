# AI Chat Exporter 🚀

> Ever had a long, insightful conversation with an AI and wished you could save it for later? Export your chats from Gemini, Claude, and ChatGPT to clean, readable Markdown files with one click.

## Why This Extension?

You've just had an amazing brainstorming session with ChatGPT. Or Claude helped you debug a tricky problem. Or Gemini wrote you a comprehensive technical guide. **But how do you save it?**

Copy-pasting loses formatting. Screenshots are clunky. The chat might disappear if the service has issues.

**AI Chat Exporter** solves this by extracting your entire conversation into a properly formatted Markdown file that preserves:

- ✅ **Tables** - Complex data comparisons stay intact
- ✅ **Code blocks** - Syntax highlighting preserved
- ✅ **Blockquotes** - Important quotes formatted correctly
- ✅ **Lists** - Both ordered and unordered
- ✅ **Images** - Markdown image syntax maintained
- ✅ **Headers** - Document structure preserved

## Features

- **One-Click Export**: Copy to clipboard or download as `.md` file
- **Multi-Platform Support**: Works with Gemini, Claude, and ChatGPT
- **Clean Formatting**: Properly structured Markdown output
- **Privacy-First**: All processing happens locally in your browser
- **No Account Required**: No sign-ups, no tracking, no data collection

## Supported Platforms

| Platform | Status | URL |
|----------|--------|-----|
| **Google Gemini** | ✅ Supported | `gemini.google.com` |
| **Anthropic Claude** | ✅ Supported | `claude.ai` |
| **OpenAI ChatGPT** | ✅ Supported | `chat.openai.com`, `chatgpt.com` |

## Installation

### From Source (Developer Mode)

1. **Clone or download** this repository:
   ```bash
   git clone git@github.com:mikkelkrogsholm/chat-exporter.git
   ```

2. **Open Chrome** and navigate to:
   ```
   chrome://extensions/
   ```

3. **Enable Developer Mode** (toggle in the top-right corner)

4. **Click "Load unpacked"** and select the `ai-chat-exporter` folder

5. **Pin the extension** for easy access (click the puzzle icon in Chrome toolbar)

### From Chrome Web Store

*Coming soon!* 🎉

## Usage

### Basic Export

1. Open a chat on **Gemini**, **Claude**, or **ChatGPT**
2. Click the **AI Chat Exporter** extension icon in your toolbar
3. Choose your export option:
   - **Copy to Clipboard** - Paste the markdown anywhere
   - **Download as File** - Save as a `.md` file with a timestamped name

### Example Workflow

```
1. Have a conversation with Claude about web design
2. Click the extension icon
3. Click "Download as File"
4. The conversation saves as: Web_Design_Discussion_2024-11-20.md
5. Open in your favorite markdown editor (Obsidian, Notion, VS Code, etc.)
```

## Output Example

```markdown
# ChatGPT Chat Export

## User

How do I center a div in CSS?

---

## ChatGPT

Here's a modern solution using Flexbox:

\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
\`\`\`

This centers both horizontally and vertically!

---
```

## Technical Details

### How It Works

1. **Platform Detection**: Identifies which AI platform you're using based on the URL
2. **Content Extraction**: Uses platform-specific selectors to find chat messages
3. **HTML to Markdown Conversion**: Converts rich HTML content to clean Markdown
4. **Export**: Delivers via clipboard or file download

### Architecture

```
popup.js          → Main UI logic and platform detection
extractors/       → Platform-specific extraction scripts
  ├── gemini.js   → Google Gemini extractor
  ├── claude.js   → Anthropic Claude extractor
  └── chatgpt.js  → OpenAI ChatGPT extractor
utils/
  └── markdown.js → HTML to Markdown converter
```

### Permissions

This extension requests the following permissions:

- **`activeTab`**: Access the current tab to read chat content
- **`scripting`**: Inject extraction scripts into the page
- **`downloads`**: Save exported files to your computer

**Privacy Note**: All data processing happens locally in your browser. No information is sent to external servers.

## Development

### Prerequisites

- Google Chrome (or Chromium-based browser)
- Basic knowledge of JavaScript

### Local Development

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

### Adding a New Platform

To add support for a new AI chat platform:

1. Create a new extractor in `extractors/your-platform.js`
2. Add the platform configuration to `popup.js`:
   ```javascript
   newplatform: {
     domains: ['example.com'],
     extractor: 'extractors/your-platform.js',
     name: 'PlatformName'
   }
   ```
3. Implement the extraction logic following the existing patterns

## Troubleshooting

### "No chat content found"
- **Cause**: The page hasn't fully loaded yet
- **Fix**: Wait for the chat to fully load, then try again

### "Unsupported site"
- **Cause**: You're not on a supported platform
- **Fix**: Navigate to Gemini, Claude, or ChatGPT first

### Missing formatting in export
- **Cause**: The platform's HTML structure may have changed
- **Fix**: Please [open an issue](https://github.com/YOUR_USERNAME/ai-chat-exporter/issues) with details

## Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs**: Open an issue describing the problem
2. **Suggest Features**: Share your ideas for improvements
3. **Submit Pull Requests**: Fix bugs or add new features

### Contribution Guidelines

- Keep code clean and well-commented
- Test on all supported platforms before submitting
- Update the README if you add new features

## Roadmap

- [ ] Support for more AI platforms (Perplexity, Poe, etc.)
- [ ] Export to additional formats (PDF, HTML, JSON)
- [ ] Batch export multiple conversations
- [ ] Custom formatting templates
- [ ] Firefox extension support

## License

MIT License - feel free to use, modify, and distribute as needed.

## Credits

Built with ❤️ by developers who love saving great conversations.

---

**Questions? Issues?** Open a [GitHub issue](https://github.com/YOUR_USERNAME/ai-chat-exporter/issues) or contribute to the project!
