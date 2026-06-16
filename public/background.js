const DOMAIN_GLOSSARIES = {
  drone: ["drone", "uav", "quadcopter", "multirotor", "flight", "autopilot", "lidar", "uart", "telemetry", "calibration", "benewake", "hardware", "sensor", "gps", "px4", "ardupilot"],
  neural: ["pytorch", "neural", "deep learning", "ai", "machine learning", "tensorflow", "autograd", "weights", "training", "tensor", "model", "epoch", "loss", "cnn", "rnn", "transformers"],
  ai: ["pytorch", "neural", "deep learning", "ai", "machine learning", "tensorflow", "autograd", "weights", "training", "tensor", "model", "epoch", "loss", "cnn", "rnn", "transformers"],
  web: ["vite", "react", "js", "ts", "css", "html", "bundler", "frontend", "developer", "chrome", "extension", "stackoverflow", "npm", "node", "webpack", "api", "url", "http"],
  dev: ["vite", "react", "js", "ts", "css", "html", "bundler", "frontend", "developer", "chrome", "extension", "stackoverflow", "npm", "node", "webpack", "api", "url", "http"]
};

// Relevance classification algorithm
const isPageRelevant = (project, title, url) => {
  const t = title.toLowerCase();
  const u = url.toLowerCase();
  const projNameLower = project.name.toLowerCase();

  // Get matching glossary terms based on project name matching domain keys
  let expandedKeywords = [];
  Object.keys(DOMAIN_GLOSSARIES).forEach((key) => {
    if (projNameLower.includes(key)) {
      expandedKeywords = [...expandedKeywords, ...DOMAIN_GLOSSARIES[key]];
    }
  });

  // Combine project keywords and domain glossary terms
  const allKeywords = [
    ...(project.keywords || []),
    ...expandedKeywords
  ].map(k => k.toLowerCase().trim()).filter(k => k.length > 0);

  // Tokenize workspace name and description
  const nameTokens = project.name.toLowerCase().split(/\s+/).filter(tok => tok.length > 2);
  const descTokens = (project.description || "").toLowerCase().split(/\s+/).filter(tok => tok.length > 2);

  let score = 0;
  
  // 1. Match project name tokens
  for (const token of nameTokens) {
    if (t.includes(token) || u.includes(token)) score += 3;
  }
  
  // 2. Match project description tokens
  for (const token of descTokens) {
    if (t.includes(token) || u.includes(token)) score += 1;
  }

  // 3. Match expanded keywords (glossary + auto-learned keywords)
  for (const keyword of allKeywords) {
    if (t.includes(keyword) || u.includes(keyword)) score += 5;
  }

  // 4. Direct match with name
  if (t.includes(projNameLower)) score += 5;

  return score >= 3;
};

// Simulated AI metadata extraction (Tags and Summaries)
const generateAutomatedMetadata = (title, url) => {
  const t = title.toLowerCase();
  const tags = ["Auto-Tracked"];
  
  if (url.includes("github.com")) tags.push("GitHub", "Code");
  else if (url.includes("youtube.com") || url.includes("youtu.be")) tags.push("Video", "Media");
  else if (url.endsWith(".pdf") || url.includes("datasheet") || url.includes("pdf")) tags.push("PDF", "Spec");
  else if (url.includes("stackoverflow.com")) tags.push("Stack Overflow", "Q&A");
  else tags.push("Web Docs");

  if (t.includes("lidar")) tags.push("LiDAR", "Hardware");
  if (t.includes("uart")) tags.push("UART", "Serial");
  if (t.includes("pytorch") || t.includes("neural") || t.includes("ai")) tags.push("AI", "Deep Learning");
  if (t.includes("react") || t.includes("vite") || t.includes("js") || t.includes("css")) tags.push("Frontend", "Web Dev");

  let notes = `Automatically captured source from your browsing activity.`;
  if (t.includes("lidar")) {
    notes = `Technical specifications for single-point or multi-point LiDAR sensors. Critical for obstacle detection, height telemetry, and ranging.`;
  } else if (t.includes("uart")) {
    notes = `Hardware configuration reference for serial communication over UART interfaces, wiring pinouts, and register settings.`;
  } else if (t.includes("pytorch") || t.includes("neural") || t.includes("ai")) {
    notes = `Deep learning conceptual docs covering Autograd, neural layer structures, PyTorch tensors, and model checkpointing guidelines.`;
  } else if (t.includes("vite") || t.includes("react") || t.includes("frontend")) {
    notes = `Frontend web engineering documentation for modern development frameworks, fast dev servers, and build tools.`;
  } else if (url.includes("github.com")) {
    notes = `Open-source code repository containing driver software, utility APIs, and package documentation for integration.`;
  } else if (url.includes("youtube.com")) {
    notes = `Video explanation demonstrating setup, testing walkthroughs, or architectural highlights for this topic.`;
  }

  return { tags, notes };
};

// Helper to extract keywords from title (words starting with capitals, excluding stop-words)
const extractKeywordsFromTitle = (t) => {
  const stopWords = new Set(["the", "and", "for", "with", "from", "your", "that", "this", "some", "here", "guide", "manual", "setup", "tutorial", "docs", "document", "documentation", "page", "website", "online"]);
  return t
    .split(/[^a-zA-Z0-9#+-]+/)
    .map(w => w.trim())
    .filter(w => w.length > 2 && !stopWords.has(w.toLowerCase()))
    .filter(w => /^[A-Z0-9#+-]/.test(w) || w.toLowerCase() === "drone" || w.toLowerCase() === "lidar" || w.toLowerCase() === "uart");
};

// Helper to check if a source already exists in this project
const sourceExists = (sources, url, projectName) => {
  return sources.some(s => s.url.toLowerCase() === url.toLowerCase() && s.project === projectName);
};

// Main navigation updated handler
const handleTabUpdated = async (title, url) => {
  // Ignore chrome internal interfaces or settings pages
  if (!url || url.startsWith("chrome://") || url.startsWith("chrome-extension://") || url.startsWith("about:") || url.startsWith("view-source:")) {
    return;
  }

  chrome.storage.local.get(["projects", "sources"], (result) => {
    let projects = result.projects || [];
    let sources = result.sources || [];
    let stateChanged = false;
    let sourceCaptured = false;

    const updatedProjects = [...projects];

    projects.forEach((proj, idx) => {
      // Capture page only if tracking is enabled on this project
      if (proj.trackingEnabled && isPageRelevant(proj, title, url)) {
        if (!sourceExists(sources, url, proj.name)) {
          const { tags, notes } = generateAutomatedMetadata(title, url);
          const newSource = {
            id: Date.now() + Math.random(),
            title: title.trim(),
            url: url.trim(),
            project: proj.name,
            notes,
            tags,
            createdAt: new Date().toISOString()
          };
          sources = [newSource, ...sources];
          sourceCaptured = true;

          // Auto-detect and learn new keywords from this captured page
          const newDetectedKeywords = extractKeywordsFromTitle(title);
          const existingKeywords = proj.keywords || [];
          const mergedKeywords = Array.from(
            new Set([...existingKeywords, ...newDetectedKeywords])
          );
          updatedProjects[idx] = {
            ...proj,
            keywords: mergedKeywords.length > 0 ? mergedKeywords : undefined
          };
          stateChanged = true;
        }
      }
    });

    if (sourceCaptured || stateChanged) {
      chrome.storage.local.set({ sources, projects: updatedProjects }, () => {
        // Send notification to the UI popup if it is open
        chrome.runtime.sendMessage({ action: "sourceCaptured" }).catch((err) => {
          // This is expected if the popup is closed, fail silently
        });
      });
    }
  });
};

// Listen for tab navigation completion
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.title) {
    handleTabUpdated(tab.title, tab.url);
  }
});
