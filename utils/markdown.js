// Shared utilities for converting HTML to Markdown
// Used by all platform extractors

function htmlToMarkdown(element) {
  let md = "";

  // Process child nodes
  element.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      md += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();

      // Handle specific tags found in chat responses
      if (tagName === 'p') {
        md += htmlToMarkdown(node) + "\n\n";
      } else if (tagName === 'strong' || tagName === 'b') {
        md += "**" + htmlToMarkdown(node) + "**";
      } else if (tagName === 'em' || tagName === 'i') {
        md += "*" + htmlToMarkdown(node) + "*";
      } else if (tagName === 'code') {
        // Inline code vs Code blocks
        if (node.parentElement.tagName.toLowerCase() === 'pre') {
          // It's usually handled by the pre tag logic or code-block logic below
          md += htmlToMarkdown(node);
        } else {
          md += "`" + node.textContent + "`";
        }
      } else if (tagName === 'pre') {
        // Code blocks
        const codeContent = node.querySelector('code')?.textContent || node.textContent;
        // Try to find language class if available
        const langClass = node.querySelector('div.code-block-decoration span')?.textContent || "";
        md += "\n```" + langClass.toLowerCase() + "\n" + codeContent + "\n```\n\n";
      } else if (tagName === 'ul') {
        Array.from(node.children).forEach(li => {
          md += "- " + htmlToMarkdown(li) + "\n";
        });
        md += "\n";
      } else if (tagName === 'ol') {
        Array.from(node.children).forEach((li, index) => {
          md += (index + 1) + ". " + htmlToMarkdown(li) + "\n";
        });
        md += "\n";
      } else if (tagName === 'li') {
        md += htmlToMarkdown(node);
      } else if (tagName === 'a') {
        md += `[${node.textContent}](${node.href})`;
      } else if (tagName.includes('h') && tagName.length === 2) {
        // Headers h1-h6
        const level = parseInt(tagName[1]);
        md += "#".repeat(level) + " " + htmlToMarkdown(node) + "\n\n";
      } else if (node.classList.contains('code-block')) {
        // Platform-specific custom classes for code blocks
        const lang = node.querySelector('.code-block-decoration')?.textContent || '';
        const code = node.querySelector('code')?.textContent || '';
        md += "\n```" + lang + "\n" + code + "\n```\n\n";
      } else if (tagName === 'table') {
        // Tables
        const rows = Array.from(node.querySelectorAll('tr'));
        let tableMd = "";

        rows.forEach((row, rowIndex) => {
          const cells = Array.from(row.querySelectorAll('th, td'));
          const rowContent = cells.map(cell => {
            return htmlToMarkdown(cell).trim().replace(/\|/g, '\\|'); // Escape pipes
          }).join(' | ');

          tableMd += `| ${rowContent} |\n`;

          // Add separator row after headers (usually first row if th exists)
          if (rowIndex === 0 && row.querySelector('th')) {
            const separator = cells.map(() => '---').join(' | ');
            tableMd += `| ${separator} |\n`;
          }
        });
        md += "\n" + tableMd + "\n";
      } else if (tagName === 'blockquote') {
        md += "> " + htmlToMarkdown(node).replace(/\n/g, "\n> ") + "\n\n";
      } else if (tagName === 'hr') {
        md += "\n---\n\n";
      } else if (tagName === 'img') {
        const alt = node.getAttribute('alt') || 'Image';
        const src = node.getAttribute('src') || '';
        md += `![${alt}](${src})`;
      } else {
        // Recursively process other elements
        md += htmlToMarkdown(node);
      }
    }
  });
  return md;
}

// Generate a filename with date
function generateFilename(title, platform) {
  const sanitizedTitle = (title || `${platform}_chat`).trim().replace(/[^a-z0-9]/gi, '_');
  const date = new Date().toISOString().slice(0, 10);
  return `${sanitizedTitle}_${date}.md`;
}
