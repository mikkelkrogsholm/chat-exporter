// Platform detection and configuration
const PLATFORMS = {
  gemini: {
    domains: ['gemini.google.com'],
    extractor: 'extractors/gemini.js',
    name: 'Gemini'
  },
  claude: {
    domains: ['claude.ai'],
    extractor: 'extractors/claude.js',
    name: 'Claude'
  },
  chatgpt: {
    domains: ['chat.openai.com', 'chatgpt.com'],
    extractor: 'extractors/chatgpt.js',
    name: 'ChatGPT'
  }
};

function detectPlatform(url) {
  for (const [key, platform] of Object.entries(PLATFORMS)) {
    if (platform.domains.some(domain => url.includes(domain))) {
      return platform;
    }
  }
  return null;
}

async function extractMarkdown() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const statusDiv = document.getElementById("status");

  const platform = detectPlatform(tab.url);

  if (!platform) {
    const supportedPlatforms = Object.values(PLATFORMS).map(p => p.name).join(', ');
    statusDiv.textContent = `Unsupported site. Supported: ${supportedPlatforms}`;
    statusDiv.style.color = "#d93025";
    return null;
  }

  statusDiv.textContent = `Extracting from ${platform.name}...`;
  statusDiv.style.color = "#555";

  try {
    // Load shared utilities first, then platform-specific extractor
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['utils/markdown.js', platform.extractor]
    });

    if (results && results[results.length - 1] && results[results.length - 1].result) {
      const result = results[results.length - 1].result;

      if (result.error) {
        statusDiv.textContent = result.error;
        statusDiv.style.color = "#d93025";
        return null;
      }

      return result;
    } else {
      statusDiv.textContent = "Error: No content extracted.";
      statusDiv.style.color = "#d93025";
      return null;
    }
  } catch (err) {
    statusDiv.textContent = "Error: " + err.message;
    statusDiv.style.color = "#d93025";
    return null;
  }
}

function setLoading(isLoading, statusText, color = "#555") {
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const statusDiv = document.getElementById("status");

  copyBtn.disabled = isLoading;
  downloadBtn.disabled = isLoading;

  if (isLoading) {
    copyBtn.style.cursor = "wait";
    downloadBtn.style.cursor = "wait";
  } else {
    copyBtn.style.cursor = "pointer";
    downloadBtn.style.cursor = "pointer";
  }

  if (statusText) {
    statusDiv.textContent = statusText;
    statusDiv.style.color = color;
  }
}

document.getElementById("copyBtn").addEventListener("click", async () => {
  setLoading(true, "Extracting...");
  const result = await extractMarkdown();

  if (result) {
    try {
      await navigator.clipboard.writeText(result.markdown);
      setLoading(false, "Copied to clipboard!", "#0f9d58");
    } catch (err) {
      setLoading(false, "Error copying: " + err.message, "#d93025");
    }
  } else {
    setLoading(false); // Error message already set by extractMarkdown
  }
});

document.getElementById("downloadBtn").addEventListener("click", async () => {
  setLoading(true, "Extracting...");
  const result = await extractMarkdown();

  if (result) {
    try {
      const blob = new Blob([result.markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);

      await chrome.downloads.download({
        url: url,
        filename: result.filename,
        saveAs: true
      });

      setLoading(false, "File downloading!", "#0f9d58");

      // Clean up the URL after a short delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      setLoading(false, "Error downloading: " + err.message, "#d93025");
    }
  } else {
    setLoading(false); // Error message already set by extractMarkdown
  }
});
