// Gemini chat extractor
// Extracts conversations from gemini.google.com

(function () {
  function extractGemini() {
    // Gemini uses <user-query> and <model-response> custom tags
    let items = Array.from(document.querySelectorAll('user-query, model-response'));

    // Fallback: Look for common container classes if custom tags aren't found
    if (items.length === 0) {
      items = Array.from(document.querySelectorAll('.query-container, .response-container, [data-message-id]'));
    }

    let markdownOutput = "# Gemini Chat Export\n\n";

    if (items.length === 0) {
      return {
        error: "No chat content found. Ensure the page is fully loaded.",
        markdown: null,
        filename: null
      };
    }

    items.forEach((item) => {
      const tagName = item.tagName.toLowerCase();

      if (tagName === 'user-query' || item.classList.contains('query-container')) {
        // Extract User text
        const textDiv = item.querySelector('.query-text') || item;
        const text = textDiv.textContent.trim();
        markdownOutput += `## User\n\n${text}\n\n---\n\n`;
      } else if (tagName === 'model-response' || item.classList.contains('response-container')) {
        // Extract Model text
        // The main text is usually in a class named 'markdown' or 'model-response-text'
        const contentDiv = item.querySelector('.markdown') || item.querySelector('.model-response-text') || item;
        if (contentDiv) {
          const mdText = htmlToMarkdown(contentDiv);
          markdownOutput += `## Gemini\n\n${mdText}\n\n---\n\n`;
        }
      }
    });

    // Get title from page title or use default
    const titleElement = document.querySelector('.conversation-title');
    const title = titleElement ? titleElement.textContent.trim() : null;
    const filename = generateFilename(title, 'gemini');

    return {
      error: null,
      markdown: markdownOutput,
      filename: filename
    };
  }

  return extractGemini();
})();
