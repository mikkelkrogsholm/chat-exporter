// Claude chat extractor
// Extracts conversations from claude.ai

(function () {
  function extractClaude() {
    // Claude uses data-test-render-count for message containers
    const messageContainers = document.querySelectorAll('[data-test-render-count]');

    if (messageContainers.length === 0) {
      return {
        error: "No chat content found. Ensure the page is fully loaded.",
        markdown: null,
        filename: null
      };
    }

    let markdownOutput = "# Claude Chat Export\n\n";
    let conversationTitle = null;

    // Try to find conversation title from the page
    const titleElement = document.querySelector('title, [data-testid="chat-title"], h1');
    if (titleElement) {
      conversationTitle = titleElement.textContent.trim();
    }

    messageContainers.forEach((container) => {
      // Check if this is a user message
      const userMessage = container.querySelector('[data-testid="user-message"]');
      if (userMessage) {
        const userContent = userMessage.querySelector('p.whitespace-pre-wrap, p') || userMessage;
        if (userContent && userContent.textContent.trim()) {
          const text = userContent.textContent.trim();
          markdownOutput += `## User\n\n${text}\n\n---\n\n`;
        }
      }

      // Check if this is a Claude response
      // Only get content from .standard-markdown containers (this excludes thinking sections)
      // Fallback to generic content containers if specific class not found
      const claudeResponse = container.querySelector('.font-claude-response') || container.querySelector('[data-testid="model-response"]');
      if (claudeResponse) {
        // Look specifically for .standard-markdown containers which contain visible output
        let visibleContent = claudeResponse.querySelectorAll('.standard-markdown');

        // Fallback if standard-markdown is not found
        if (visibleContent.length === 0) {
          visibleContent = claudeResponse.querySelectorAll('.grid-cols-1 > div');
        }

        if (visibleContent.length > 0) {
          let responseText = '';

          visibleContent.forEach(markdownContainer => {
            // Get all paragraphs within this visible content container
            const paragraphs = markdownContainer.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, pre, table, blockquote');

            paragraphs.forEach(p => {
              if (p.textContent.trim()) {
                responseText += htmlToMarkdown(p) + '\n\n';
              }
            });
          });

          if (responseText.trim()) {
            markdownOutput += `## Claude\n\n${responseText}---\n\n`;
          }
        }
      }
    });

    const filename = generateFilename(conversationTitle, 'claude');

    return {
      error: null,
      markdown: markdownOutput,
      filename: filename
    };
  }

  return extractClaude();
})();
