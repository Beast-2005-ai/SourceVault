import { useEffect, useState, useRef } from "react";
import type { Source } from "./types/Source";

interface Project {
  name: string;
  description?: string;
  color?: string;
  trackingEnabled: boolean;
  keywords?: string[];
}

// No seed data required for production

// Icons
const IconBrain = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M12 5v14" />
    <path d="M12 12h6" />
    <path d="M12 12H6" />
  </svg>
);

const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const IconExternalLink = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

const IconClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="source-date-icon">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconTag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.293 8.293a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828Z" />
    <path d="M7.5 7.5h.01" />
  </svg>
);



const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconFolder = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  </svg>
);

const IconGlobe = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="source-type-icon">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

const IconGithub = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="source-type-icon">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const IconStackOverflow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="source-type-icon">
    <path d="M18 16v5H6v-5" />
    <path d="M9 18h6" />
    <path d="M9.2 14.9h6.1" />
    <path d="m9.9 11.7 5.7 2.1" />
    <path d="m11.2 8.7 5 3.5" />
    <path d="m13.4 6 4 4.5" />
  </svg>
);

const IconYoutube = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="source-type-icon">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

const IconPdf = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="source-type-icon">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M9 15h6" />
    <path d="M9 11h6" />
  </svg>
);

const IconAlert = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="empty-state-icon">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// Determine source category icon based on URL
const getSourceIcon = (url: string) => {
  const normalized = url.toLowerCase();
  if (normalized.includes("github.com")) {
    return { icon: <IconGithub />, className: "github", label: "GitHub" };
  } else if (normalized.includes("stackoverflow.com") || normalized.includes("stackexchange.com")) {
    return { icon: <IconStackOverflow />, className: "stack", label: "Stack Overflow" };
  } else if (normalized.includes("youtube.com") || normalized.includes("youtu.be")) {
    return { icon: <IconYoutube />, className: "youtube", label: "YouTube" };
  } else if (normalized.endsWith(".pdf") || normalized.includes("/pdf/") || normalized.includes("datasheet")) {
    return { icon: <IconPdf />, className: "pdf", label: "PDF Datasheet" };
  } else if (normalized.includes("docs") || normalized.includes("documentation") || normalized.includes("wikipedia.org")) {
    return { icon: <IconPdf />, className: "docs", label: "Documentation" };
  } else {
    return { icon: <IconGlobe />, className: "web", label: "Website" };
  }
};

// Format dates nicely
const timeAgo = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return "Just now";
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "Recently";
  }
};

interface LogEntry {
  id: number;
  timestamp: string;
  title: string;
  url: string;
  status: "captured" | "ignored";
  matchedProjects: string[];
}

// Relevance classification algorithm
const isPageRelevant = (project: Project, title: string, url: string): boolean => {
  const t = title.toLowerCase();
  const u = url.toLowerCase();
  
  // Tokenize workspace name, description, and keywords
  const nameTokens = project.name.toLowerCase().split(/\s+/).filter(tok => tok.length > 2);
  const descTokens = (project.description || "").toLowerCase().split(/\s+/).filter(tok => tok.length > 2);
  const keywordTokens = (project.keywords || []).map(k => k.toLowerCase().trim()).filter(k => k.length > 0);

  let score = 0;
  
  // 1. Match project name tokens
  for (const token of nameTokens) {
    if (t.includes(token) || u.includes(token)) score += 3;
  }
  
  // 2. Match project description tokens
  for (const token of descTokens) {
    if (t.includes(token) || u.includes(token)) score += 1;
  }

  // 3. Match user custom relevance keywords
  for (const keyword of keywordTokens) {
    if (t.includes(keyword) || u.includes(keyword)) score += 5;
  }

  // 4. Direct match with name
  if (t.includes(project.name.toLowerCase())) score += 5;

  return score >= 3;
};

// Simulated AI metadata extraction (Tags and Summaries)
const generateAutomatedMetadata = (title: string, url: string) => {
  const t = title.toLowerCase();
  const tags: string[] = ["Auto-Tracked"];
  
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

function App() {
  // State for Projects (initially empty)
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("projects");
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      // Backwards compatibility upgrade
      if (parsed.length > 0 && typeof parsed[0] === "string") {
        return parsed.map((name: string) => ({
          name,
          description: "Active research folder",
          color: "#9d4edd",
          trackingEnabled: true,
          keywords: []
        }));
      }
      return parsed.map((p: any) => ({
        ...p,
        trackingEnabled: p.trackingEnabled === undefined ? true : p.trackingEnabled,
        keywords: p.keywords || []
      }));
    } catch {
      return [];
    }
  });

  // Active Project (initially empty)
  const [activeProject, setActiveProject] = useState<string>(() => {
    const saved = localStorage.getItem("activeProject");
    return saved || "";
  });

  // Sources (initially empty)
  const [sources, setSources] = useState<Source[]>(() => {
    const saved = localStorage.getItem("sources");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });



  // Form states for creating a project
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectNameInput, setProjectNameInput] = useState("");
  const [projectDescInput, setProjectDescInput] = useState("");
  const [projectKeywordsInput, setProjectKeywordsInput] = useState("");

  // Simulator and Browsing Log states
  const [activityLogs, setActivityLogs] = useState<LogEntry[]>([]);
  const [simulatedTitle, setSimulatedTitle] = useState("");
  const [simulatedUrl, setSimulatedUrl] = useState("");

  // Global Search
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Edit states for modifying an existing source card inline
  const [editingSourceId, setEditingSourceId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editProject, setEditProject] = useState("");

  // Project editing states
  const [editingProjectName, setEditingProjectName] = useState<string | null>(null);
  const [editProjNameInput, setEditProjNameInput] = useState("");
  const [editProjDescInput, setEditProjDescInput] = useState("");
  const [editProjKeywordsInput, setEditProjKeywordsInput] = useState("");

  // Mobile/Popup Responsive tab toggle state
  const [mobileTab, setMobileTab] = useState<"projects" | "sources">("sources");

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("activeProject", activeProject);
  }, [activeProject]);

  useEffect(() => {
    localStorage.setItem("sources", JSON.stringify(sources));
  }, [sources]);



  // Handle Cmd/Ctrl + K shortcut for search focusing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle Project Creation
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectNameInput.trim()) return;

    // Check if project name already exists
    if (projects.some((p) => p.name.toLowerCase() === projectNameInput.trim().toLowerCase())) {
      alert("A project with this name already exists.");
      return;
    }

    // Assign a default beautiful gradient color
    const colors = ["#9d4edd", "#3a86c8", "#06d6a0", "#f77f00", "#ef4444", "#3b82f6"];
    const randomColor = colors[projects.length % colors.length];

    const kArray = projectKeywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const newProj: Project = {
      name: projectNameInput.trim(),
      description: projectDescInput.trim() || "Active research project workspace.",
      color: randomColor,
      trackingEnabled: true,
      keywords: kArray.length > 0 ? kArray : undefined
    };

    setProjects([...projects, newProj]);
    setActiveProject(newProj.name); // Auto set as active
    setProjectNameInput("");
    setProjectDescInput("");
    setProjectKeywordsInput("");
    setIsCreatingProject(false);
    
    // Switch to sources view on mobile after creating
    setMobileTab("sources");
  };

  // Handle Project Deletion
  const handleDeleteProject = (projName: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering project selection
    if (confirm(`Are you sure you want to delete project "${projName}"? This will also delete all its saved sources.`)) {
      setProjects(projects.filter((p) => p.name !== projName));
      // Delete associated sources
      setSources(sources.filter((s) => s.project !== projName));
      // If we deleted the active project, select another one or reset
      if (activeProject === projName) {
        const remaining = projects.filter((p) => p.name !== projName);
        setActiveProject(remaining.length > 0 ? remaining[0].name : "");
      }
    }
  };

  // Handle Project Editing & Save (cascade name updates to sources)
  const handleSaveProjectEdit = (oldName: string) => {
    const newName = editProjNameInput.trim();
    if (!newName) return;

    if (
      newName.toLowerCase() !== oldName.toLowerCase() &&
      projects.some((p) => p.name.toLowerCase() === newName.toLowerCase())
    ) {
      alert("A project with this name already exists.");
      return;
    }

    const kArray = editProjKeywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    setProjects(
      projects.map((p) => {
        if (p.name === oldName) {
          return {
            ...p,
            name: newName,
            description: editProjDescInput.trim() || undefined,
            keywords: kArray.length > 0 ? kArray : undefined
          };
        }
        return p;
      })
    );

    // Cascade update to sources
    setSources(
      sources.map((s) => {
        if (s.project === oldName) {
          return {
            ...s,
            project: newName,
          };
        }
        return s;
      })
    );

    // Update activeProject if it was the one edited
    if (activeProject === oldName) {
      setActiveProject(newName);
    }

    setEditingProjectName(null);
  };

  // Handle Simulated Browsing Page Visit (Classifier routes to active matching projects)
  const handleSimulateVisit = (title: string, url: string) => {
    if (!title.trim() || !url.trim()) return;

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = "https://" + formattedUrl;
    }

    const matched: string[] = [];
    const newSourcesToSave: Source[] = [];

    projects.forEach((proj) => {
      // Track page only if tracking is enabled on this project
      if (proj.trackingEnabled && isPageRelevant(proj, title, formattedUrl)) {
        matched.push(proj.name);
        
        const { tags, notes } = generateAutomatedMetadata(title, formattedUrl);
        
        const newSource: Source = {
          id: Date.now() + Math.random(),
          title: title.trim(),
          url: formattedUrl,
          project: proj.name,
          notes,
          tags,
          createdAt: new Date().toISOString()
        };
        newSourcesToSave.push(newSource);
      }
    });

    if (newSourcesToSave.length > 0) {
      setSources((prev) => [...newSourcesToSave, ...prev]);
    }

    const newLog: LogEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      title: title.trim(),
      url: formattedUrl,
      status: matched.length > 0 ? "captured" : "ignored",
      matchedProjects: matched
    };

    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Handle Source Deletion
  const handleDeleteSource = (id: number) => {
    if (confirm("Delete this saved source from your workspace?")) {
      setSources(sources.filter((s) => s.id !== id));
      if (editingSourceId === id) {
        setEditingSourceId(null);
      }
    }
  };

  // Enter Inline Edit Mode
  const startEditing = (source: Source) => {
    setEditingSourceId(source.id);
    setEditTitle(source.title);
    setEditUrl(source.url);
    setEditNotes(source.notes || "");
    setEditTags(source.tags ? source.tags.join(", ") : "");
    setEditProject(source.project);
  };

  // Save Edited Source
  const handleSaveEdit = (id: number) => {
    if (!editTitle.trim() || !editUrl.trim()) return;

    let formattedUrl = editUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = "https://" + formattedUrl;
    }

    const tagArray = editTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    setSources(
      sources.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            title: editTitle.trim(),
            url: formattedUrl,
            project: editProject,
            notes: editNotes.trim() || undefined,
            tags: tagArray.length > 0 ? tagArray : undefined,
          };
        }
        return s;
      })
    );

    setEditingSourceId(null);
  };

  // Highlight matched substrings in search results
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const escapedHighlight = highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(${escapedHighlight})`, "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? <mark key={i}>{part}</mark> : part
        )}
      </span>
    );
  };

  // Filter Logic:
  // If search is active, do a global search across ALL projects
  // If search is empty, filter sources to the active project
  const isSearching = searchQuery.trim().length > 0;
  
  const filteredSources = sources.filter((s) => {
    if (isSearching) {
      const q = searchQuery.toLowerCase();
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchUrl = s.url.toLowerCase().includes(q);
      const matchNotes = (s.notes || "").toLowerCase().includes(q);
      const matchProject = s.project.toLowerCase().includes(q);
      const matchTags = s.tags ? s.tags.some((t) => t.toLowerCase().includes(q)) : false;
      return matchTitle || matchUrl || matchNotes || matchProject || matchTags;
    } else {
      return s.project === activeProject;
    }
  });

  // Calculate current active project stats
  const activeProjDetails = projects.find((p) => p.name === activeProject);
  const activeProjSourceCount = sources.filter((s) => s.project === activeProject).length;

  return (
    <div className="app-container">
      {/* Mobile/Popup View Tabs */}
      <div className="mobile-tabs">
        <button
          className={`mobile-tab-btn ${mobileTab === "projects" ? "active" : ""}`}
          onClick={() => setMobileTab("projects")}
        >
          <IconFolder /> Projects ({projects.length})
        </button>
        <button
          className={`mobile-tab-btn ${mobileTab === "sources" ? "active" : ""}`}
          onClick={() => setMobileTab("sources")}
        >
          <IconCheck /> Sources ({filteredSources.length})
        </button>
      </div>

      {/* Sidebar Panel */}
      <aside className={`sidebar ${mobileTab === "sources" ? "hidden-mobile" : ""}`}>
        {/* Header */}
        <div className="app-header">
          <IconBrain />
          <div className="app-title-container">
            <h1 className="app-title">Research OS</h1>
            <span className="app-badge">Phase 1 Dashboard</span>
          </div>
        </div>

        {/* Active Project Card */}
        {activeProject ? (
          <div className="active-project-card">
            <div className="active-project-card-header">
              <span className="active-project-label">Current Research</span>
              <button
                className={`tracking-status-toggle ${activeProjDetails?.trackingEnabled ? "live" : "paused"}`}
                onClick={() => {
                  if (activeProjDetails) {
                    setProjects(
                      projects.map((p) => {
                        if (p.name === activeProject) {
                          return { ...p, trackingEnabled: !p.trackingEnabled };
                        }
                        return p;
                      })
                    );
                  }
                }}
                title={activeProjDetails?.trackingEnabled ? "Pause Tracking" : "Resume Tracking"}
              >
                <span className="pulse-dot"></span>
                <span>{activeProjDetails?.trackingEnabled ? "Live" : "Paused"}</span>
              </button>
            </div>
            <div className="active-project-name-row">
              <h3 className="active-project-name" title={activeProject}>
                {activeProject}
              </h3>
              <button
                className="btn-icon deselect-project-btn"
                onClick={() => setActiveProject("")}
                title="Deselect Project"
              >
                <IconX />
              </button>
            </div>
            {activeProjDetails?.keywords && activeProjDetails.keywords.length > 0 && (
              <div className="active-project-keywords-container">
                {activeProjDetails.keywords.map((k) => (
                  <span key={k} className="active-keyword-chip">
                    {k}
                  </span>
                ))}
              </div>
            )}
            <div className="active-project-stats">
              <IconFolder />
              <span>
                {activeProjSourceCount} source{activeProjSourceCount !== 1 ? "s" : ""} saved
              </span>
            </div>
          </div>
        ) : (
          <div className="active-project-card" style={{ borderStyle: "dashed", borderColor: "var(--border-color)", background: "transparent" }}>
            <span className="active-project-label">No Active Project</span>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Select a project below to begin research tracking.</p>
          </div>
        )}

        {/* Projects Section */}
        <div className="sidebar-section">
          <div className="section-title-row">
            <span className="sidebar-section-title">My Workspaces</span>
            <button
              className="btn-icon btn-icon-primary"
              onClick={() => setIsCreatingProject(!isCreatingProject)}
              title="Create New Project"
            >
              <IconPlus />
            </button>
          </div>

          {/* New Project Form inline */}
          {isCreatingProject && (
            <form onSubmit={handleCreateProject} className="create-project-form">
              <input
                type="text"
                placeholder="Workspace name..."
                className="input-glass"
                value={projectNameInput}
                onChange={(e) => setProjectNameInput(e.target.value)}
                autoFocus
                required
              />
              <input
                type="text"
                placeholder="Description (optional)..."
                className="input-glass"
                value={projectDescInput}
                onChange={(e) => setProjectDescInput(e.target.value)}
              />
              <input
                type="text"
                placeholder="Tracking keywords (e.g. LiDAR, PyTorch) (optional)..."
                className="input-glass"
                value={projectKeywordsInput}
                onChange={(e) => setProjectKeywordsInput(e.target.value)}
              />
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "4px" }}>
                <button
                  type="button"
                  className="btn-glass btn-glass-secondary"
                  style={{ padding: "6px 12px", fontSize: "12px" }}
                  onClick={() => setIsCreatingProject(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-glass"
                  style={{ padding: "6px 12px", fontSize: "12px" }}
                >
                  Create
                </button>
              </div>
            </form>
          )}

          {/* Project List */}
          {projects.length === 0 ? (
            <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>No projects created yet.</p>
          ) : (
            <div className="project-list">
              {projects.map((proj) => {
                const count = sources.filter((s) => s.project === proj.name).length;
                const isEditingProj = editingProjectName === proj.name;

                if (isEditingProj) {
                  return (
                    <form
                      key={proj.name}
                      className="edit-project-form"
                      onClick={(e) => e.stopPropagation()}
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveProjectEdit(proj.name);
                      }}
                    >
                      <input
                        type="text"
                        className="input-glass edit-project-input"
                        value={editProjNameInput}
                        onChange={(e) => setEditProjNameInput(e.target.value)}
                        required
                        autoFocus
                      />
                      <input
                        type="text"
                        className="input-glass edit-project-input"
                        value={editProjDescInput}
                        onChange={(e) => setEditProjDescInput(e.target.value)}
                        placeholder="Description"
                      />
                      <input
                        type="text"
                        className="input-glass edit-project-input"
                        value={editProjKeywordsInput}
                        onChange={(e) => setEditProjKeywordsInput(e.target.value)}
                        placeholder="Tracking keywords (comma-separated)"
                      />
                      <div className="edit-project-actions">
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => setEditingProjectName(null)}
                          title="Cancel"
                        >
                          <IconX />
                        </button>
                        <button
                          type="submit"
                          className="btn-icon"
                          title="Save Changes"
                        >
                          <IconCheck />
                        </button>
                      </div>
                    </form>
                  );
                }

                return (
                  <div
                    key={proj.name}
                    className={`project-list-item ${activeProject === proj.name ? "active" : ""}`}
                    onClick={() => {
                      if (activeProject === proj.name) {
                        setActiveProject(""); // Deselect
                      } else {
                        setActiveProject(proj.name);
                      }
                      setMobileTab("sources"); // Swap back to main sources on mobile
                    }}
                  >
                    <div className="project-item-info">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                        <span className="project-item-name">{proj.name}</span>
                        <button
                          className={`tracking-status-toggle-mini ${proj.trackingEnabled ? "live" : "paused"}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setProjects(
                              projects.map((p) => {
                                if (p.name === proj.name) {
                                  return { ...p, trackingEnabled: !p.trackingEnabled };
                                }
                                return p;
                              })
                            );
                          }}
                          title={proj.trackingEnabled ? "Pause Tracking" : "Resume Tracking"}
                        >
                          <span className="pulse-dot-mini"></span>
                          <span>{proj.trackingEnabled ? "Live" : "Paused"}</span>
                        </button>
                      </div>
                      <span className="project-item-count">{count} source{count !== 1 ? "s" : ""}</span>
                      {proj.keywords && proj.keywords.length > 0 && (
                        <div className="project-item-keywords-row">
                          {proj.keywords.map((k) => (
                            <span key={k} className="project-keyword-tag">{k}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="project-item-actions">
                      <button
                        className="btn-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProjectName(proj.name);
                          setEditProjNameInput(proj.name);
                          setEditProjDescInput(proj.description || "");
                          setEditProjKeywordsInput(proj.keywords ? proj.keywords.join(", ") : "");
                        }}
                        title="Edit Project"
                      >
                        <IconEdit />
                      </button>
                      <button
                        className="btn-icon btn-icon-danger"
                        onClick={(e) => handleDeleteProject(proj.name, e)}
                        title="Delete Project & Sources"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Footnote instruction */}
        <div style={{ marginTop: "auto", fontSize: "11px", color: "var(--text-muted)", borderTop: "1px solid var(--border-color)", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <p>💡 Tip: Switch projects to focus research, or use search above for a global library search.</p>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className={`main-content ${mobileTab === "projects" ? "hidden-mobile" : ""}`}>
        {/* Topbar Search */}
        <header className="topbar">
          <div className="search-container">
            <div className="search-input-wrapper">
              <IconSearch />
              <input
                ref={searchInputRef}
                type="text"
                className="input-glass search-input"
                placeholder="Search saved sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery ? (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                  title="Clear Search"
                >
                  <IconX />
                </button>
              ) : (
                <span className="search-shortcut">Ctrl+K</span>
              )}
            </div>
          </div>

          <div className="topbar-stats">
            <div className="stat-chip">
              <span className="stat-chip-label">Total Library</span>
              <span className="stat-chip-val">{sources.length}</span>
            </div>
            {isSearching && (
              <div className="stat-chip" style={{ borderColor: "var(--accent-purple)" }}>
                <span className="stat-chip-label" style={{ color: "var(--accent-purple)" }}>Found</span>
                <span className="stat-chip-val" style={{ background: "var(--accent-purple-glow)", color: "#fff" }}>
                  {filteredSources.length}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Workspace Body */}
        <div className="dashboard-body">
          {/* Browsing Simulator Console (Visible when not searching) */}
          {!isSearching && (
            <div className="simulator-console">
              <div className="simulator-console-header">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div className="pulse-dot"></div>
                  <h3 className="simulator-title">Automated Browsing Activity Simulator</h3>
                </div>
                <span className="simulator-badge">Prototype Console</span>
              </div>
              
              <div className="simulator-body">
                <p className="simulator-desc">
                  Simulate visiting pages in another browser tab. The classification engine will auto-extract metadata, determine relevance to your workspaces, and capture or ignore them.
                </p>

                {/* Tracking warning if no live project */}
                {!projects.some(p => p.trackingEnabled) && (
                  <div className="simulator-warning">
                    ⚠️ <strong>Notice:</strong> All workspace trackers are currently Paused. Simulated page visits will be logged but ignored. Turn a workspace tracking to <strong>Live</strong> in the sidebar to start capturing.
                  </div>
                )}

                {/* Preset Actions grid */}
                <div className="preset-grid-title">Preset Simulation Pages (Click to Visit)</div>
                <div className="preset-grid">
                  <button
                    type="button"
                    className="btn-preset-visit"
                    onClick={() => handleSimulateVisit("TF02-Pro LiDAR Datasheet Manual", "https://benewake.com/datasheet/tf02-pro")}
                    title="Simulate visiting a LiDAR datasheet"
                  >
                    📄 LiDAR Datasheet
                  </button>
                  <button
                    type="button"
                    className="btn-preset-visit"
                    onClick={() => handleSimulateVisit("Raspberry Pi 5 Serial UART Port Interface Pinouts", "https://raspberrypi.com/documentation/computers/configuration/uart")}
                    title="Simulate visiting Raspberry Pi serial docs"
                  >
                    🔌 Raspberry Pi UART Docs
                  </button>
                  <button
                    type="button"
                    className="btn-preset-visit"
                    onClick={() => handleSimulateVisit("PyTorch Autograd: Automatic Differentiation Engine Guidelines", "https://pytorch.org/docs/stable/autograd.html")}
                    title="Simulate visiting PyTorch neural network docs"
                  >
                    🧠 PyTorch Autograd Docs
                  </button>
                  <button
                    type="button"
                    className="btn-preset-visit"
                    onClick={() => handleSimulateVisit("Vite.js React Workspace Configuration Guide", "https://vite.dev/guide/")}
                    title="Simulate visiting frontend Vite bundler docs"
                  >
                    ⚡ Vite.js React Guide
                  </button>
                  <button
                    type="button"
                    className="btn-preset-visit btn-preset-entertainment"
                    onClick={() => handleSimulateVisit("Cute Cat Compilation Videos 2026 - YouTube", "https://youtube.com/watch?v=catpass")}
                    title="Simulate visiting a non-research entertainment site"
                  >
                    🐱 YouTube Fun (Should Ignore)
                  </button>
                  <button
                    type="button"
                    className="btn-preset-visit btn-preset-entertainment"
                    onClick={() => handleSimulateVisit("Play Wordle Game Online - New York Times Games", "https://nytimes.com/games/wordle")}
                    title="Simulate visiting a game page"
                  >
                    🎮 Wordle (Should Ignore)
                  </button>
                </div>

                {/* Custom page simulator form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSimulateVisit(simulatedTitle, simulatedUrl);
                    setSimulatedTitle("");
                    setSimulatedUrl("");
                  }}
                  className="custom-simulator-form"
                >
                  <div className="form-grid-2" style={{ gap: "12px", marginBottom: "8px" }}>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Simulated Page Title (e.g. LiDAR Calibration)..."
                        className="input-glass"
                        value={simulatedTitle}
                        onChange={(e) => setSimulatedTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Simulated Page URL (e.g. github.com/lidar)..."
                        className="input-glass"
                        value={simulatedUrl}
                        onChange={(e) => setSimulatedUrl(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-glass btn-glass-secondary" style={{ width: "100%", padding: "8px 12px", fontSize: "12px" }}>
                    🚀 Simulate Custom Page Visit
                  </button>
                </form>

                {/* Activity Feed Logs */}
                <div className="log-feed-section">
                  <div className="log-feed-header">
                    <span className="log-feed-title">Real-Time Browsing Activity Log ({activityLogs.length})</span>
                    {activityLogs.length > 0 && (
                      <button className="btn-clear-logs" onClick={() => setActivityLogs([])}>
                        Clear logs
                      </button>
                    )}
                  </div>
                  <div className="log-feed-list">
                    {activityLogs.length === 0 ? (
                      <div className="log-feed-empty">
                        No activity logged yet. Click a preset page above to simulate browsing.
                      </div>
                    ) : (
                      activityLogs.map((log) => (
                        <div key={log.id} className={`log-row ${log.status}`}>
                          <div className="log-row-meta">
                            <span className="log-time">{log.timestamp}</span>
                            <span className={`log-status-badge ${log.status}`}>
                              {log.status === "captured" ? "Captured" : "Ignored"}
                            </span>
                          </div>
                          <div className="log-row-details">
                            <div className="log-page-title">{log.title}</div>
                            <div className="log-page-url">{log.url}</div>
                            {log.status === "captured" && (
                              <div className="log-matches">
                                Matched workspaces: {log.matchedProjects.map(p => (
                                  <span key={p} className="log-match-badge">{p}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sources Section */}
          <div className="sources-section">
            <div className="sources-section-header">
              <h3 className="sources-section-title">
                {isSearching
                  ? `Search Results (${filteredSources.length} item${filteredSources.length !== 1 ? "s" : ""})`
                  : `${activeProject || "Global"} Research Library`}
              </h3>
              {!isSearching && activeProject && filteredSources.length > 0 && (
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Showing sources tracked under "{activeProject}"
                </span>
              )}
            </div>

            {/* Empty States */}
            {filteredSources.length === 0 ? (
              <div className="empty-state">
                <IconAlert />
                <h4 className="empty-state-title">
                  {isSearching ? "No Matching Sources Found" : "Your Research Library is Empty"}
                </h4>
                <p className="empty-state-desc">
                  {isSearching
                    ? `We couldn't find anything matching "${searchQuery}" in your titles, notes, tags, or projects.`
                    : activeProject
                    ? `No sources saved in "${activeProject}" yet. Add links using the panel above or start tracking.`
                    : "Create a project in the sidebar to start saving research material."}
                </p>
                {isSearching && (
                  <button className="btn-glass" onClick={() => setSearchQuery("")}>
                    Reset Search
                  </button>
                )}
              </div>
            ) : (
              <div className="sources-grid">
                {filteredSources.map((source) => {
                  const isEditing = editingSourceId === source.id;
                  const cardMeta = getSourceIcon(source.url);

                  return (
                    <div key={source.id} className="source-card">
                      {isEditing ? (
                        // Edit Mode Layout
                        <div className="source-edit-form">
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: "11px" }}>Title</label>
                            <input
                              type="text"
                              className="input-glass"
                              style={{ padding: "6px 10px", fontSize: "12px" }}
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                            />
                          </div>
                          
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: "11px" }}>URL</label>
                            <input
                              type="text"
                              className="input-glass"
                              style={{ padding: "6px 10px", fontSize: "12px" }}
                              value={editUrl}
                              onChange={(e) => setEditUrl(e.target.value)}
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: "11px" }}>Notes</label>
                            <textarea
                              className="input-glass"
                              style={{ padding: "6px 10px", fontSize: "12px", minHeight: "60px", resize: "vertical" }}
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                            />
                          </div>

                          <div className="form-grid-2" style={{ gap: "10px" }}>
                            <div className="form-group">
                              <label className="form-label" style={{ fontSize: "11px" }}>Tags (comma-separated)</label>
                              <input
                                type="text"
                                className="input-glass"
                                style={{ padding: "6px 10px", fontSize: "12px" }}
                                value={editTags}
                                onChange={(e) => setEditTags(e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label" style={{ fontSize: "11px" }}>Move to Project</label>
                              <select
                                className="input-glass"
                                style={{ padding: "6px 10px", fontSize: "12px", background: "#16171d" }}
                                value={editProject}
                                onChange={(e) => setEditProject(e.target.value)}
                              >
                                {projects.map((p) => (
                                  <option key={p.name} value={p.name}>
                                    {p.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="source-edit-actions">
                            <button
                              className="btn-glass btn-glass-secondary"
                              style={{ padding: "6px 12px", fontSize: "11px" }}
                              onClick={() => setEditingSourceId(null)}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn-glass"
                              style={{ padding: "6px 12px", fontSize: "11px" }}
                              onClick={() => handleSaveEdit(source.id)}
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Standard Read Mode Layout
                        <>
                          <div className="source-card-header">
                            <div className="source-type-container">
                              <div
                                className={`source-type-icon-wrapper ${cardMeta.className}`}
                                title={cardMeta.label}
                              >
                                {cardMeta.icon}
                              </div>
                              <div className="source-header-meta">
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="source-title-link"
                                  title={source.title}
                                >
                                  {renderHighlightedText(source.title, searchQuery)}
                                </a>
                                {isSearching ? (
                                  <span className="source-project-badge">
                                    📁 {renderHighlightedText(source.project, searchQuery)}
                                  </span>
                                ) : (
                                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                                    {cardMeta.label}
                                  </span>
                                )}
                              </div>
                            </div>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-icon"
                              title="Visit Source Link"
                            >
                              <IconExternalLink />
                            </a>
                          </div>

                          {/* Notes/Summary */}
                          {source.notes && (
                            <p className="source-notes">
                              {renderHighlightedText(source.notes, searchQuery)}
                            </p>
                          )}

                          {/* Tags Grid */}
                          {source.tags && source.tags.length > 0 && (
                            <div className="source-tags" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", color: "var(--text-muted)" }} title="Tags">
                                <IconTag />
                              </span>
                              {source.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="tag-chip"
                                  onClick={() => setSearchQuery(tag)}
                                  title={`Filter by tag "${tag}"`}
                                >
                                  #{renderHighlightedText(tag, searchQuery)}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Card Footer */}
                          <div className="source-footer">
                            <div className="source-date-box">
                              <IconClock />
                              <span>{timeAgo(source.createdAt)}</span>
                            </div>
                            <div className="source-card-actions">
                              <button
                                className="btn-icon"
                                onClick={() => startEditing(source)}
                                title="Edit Source"
                              >
                                <IconEdit />
                              </button>
                              <button
                                className="btn-icon btn-icon-danger"
                                onClick={() => handleDeleteSource(source.id)}
                                title="Delete Source"
                              >
                                <IconTrash />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;