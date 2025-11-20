// ChatGPT chat extractor
// Extracts conversations from chat.openai.com and chatgpt.com

(function () {
  function extractChatGPT() {
    // ChatGPT uses data-message-author-role attributes
    const messages = document.querySelectorAll('[data-message-author-role]');

    if (messages.length === 0) {
      return {
        error: "No chat content found. Ensure the page is fully loaded.",
        markdown: null,
        filename: null
      };
    }

    let markdownOutput = "# ChatGPT Chat Export\n\n";
    let conversationTitle = null;

    // Try to find conversation title - often in the page title or h1
    const titleElement = document.querySelector('title');
    if (titleElement) {
      conversationTitle = titleElement.textContent.replace(' - ChatGPT', '').trim();
    }

    messages.forEach((message) => {
      const role = message.getAttribute('data-message-author-role');

      if (!role || (role !== 'user' && role !== 'assistant')) {
        return; // Skip system messages or unrecognized roles
      }

      let contentDiv = null;
      let content = '';

      if (role === 'user') {
        // User messages are in .whitespace-pre-wrap inside .user-message-bubble-color
        contentDiv = message.querySelector('.whitespace-pre-wrap') || message.querySelector('[data-message-author-role="user"] > div');
        if (contentDiv && contentDiv.textContent.trim()) {
          content = contentDiv.textContent.trim();
        }
      } else if (role === 'assistant') {
        // Assistant messages are in .markdown.prose
        contentDiv = message.querySelector('.markdown.prose, [class*="markdown"]') || message.querySelector('.text-message-content');
        if (contentDiv && contentDiv.textContent.trim()) {
          content = htmlToMarkdown(contentDiv);
        }
      }

      if (content) {
        const displayRole = role === 'user' ? "User" : "ChatGPT";
        markdownOutput += `## ${displayRole}\n\n${content}\n\n---\n\n`;
      }
    });

    const filename = generateFilename(conversationTitle, 'chatgpt');

    return {
      error: null,
      markdown: markdownOutput,
      filename: filename
    };
  }

  return extractChatGPT();
})();
