import { useEffect, useState, useRef } from "react";
import type { Source } from "./types/Source";

interface Project {
  name: string;
  description?: string;
  color?: string;
}

// Seed data matching the user's real-world example
const seedProjects: Project[] = [
  {
    name: "Drone Mapping",
    description: "LiDAR and camera-based drone terrain mapping & navigation.",
    color: "#9d4edd",
  },
  {
    name: "Smart Emergency System",
    description: "Multi-hazard emergency response and detection system.",
    color: "#3a86c8",
  },
  {
    name: "Neural Network Notes",
    description: "Deep learning concepts, neural architectures, and PyTorch guides.",
    color: "#06d6a0",
  },
];

const seedSources: Source[] = [
  {
    id: 1,
    title: "TF02-Pro LiDAR Datasheet",
    url: "https://www.benewake.com/TF02-Pro",
    project: "Drone Mapping",
    notes: "TF02-Pro single-point LiDAR sensor datasheet. 40m range, UART interface. Essential for height hold and obstacle sensing.",
    tags: ["LiDAR", "Datasheet", "UART", "Hardware"],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    title: "Raspberry Pi UART Configuration",
    url: "https://www.raspberrypi.com/documentation/computers/configuration.html#configuring-uarts",
    project: "Drone Mapping",
    notes: "Official guide on enabling and mapping PL011 and mini UART ports on Raspberry Pi 4/5. Critical for LiDAR interface wiring.",
    tags: ["UART", "Raspberry Pi", "Docs"],
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    title: "TF02-Pro Driver Repository",
    url: "https://github.com/rpi-lidar/tf02-pro-driver",
    project: "Drone Mapping",
    notes: "Python driver for tf02-pro on Pi. Features real-time distance polling and error correction logic.",
    tags: ["LiDAR", "GitHub", "Driver", "Python"],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    title: "Multi-Hazard Smart Response System",
    url: "https://example.com/emergency-system-proposal",
    project: "Smart Emergency System",
    notes: "Architecture draft for multi-hazard detection using sensor networks, Hailo AI acceleration, and local gateway alerting.",
    tags: ["Proposal", "Specs", "AI"],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    title: "PIR Sensor Logic (Motion Alert)",
    url: "https://github.com/sensors/pir-logic",
    project: "Smart Emergency System",
    notes: "Arduino logic sketch for dual PIR detection configuration. Eliminates false positives from ambient heat spikes.",
    tags: ["PIR", "GitHub", "Arduino", "Sensor"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    title: "PyTorch Neural Network Blitz Tutorial",
    url: "https://pytorch.org/tutorials/beginner/blitz/neural_networks_tutorial.html",
    project: "Neural Network Notes",
    notes: "A quick introduction to defining convolutional networks, computing gradients via Autograd, and updating weights.",
    tags: ["PyTorch", "Tutorial", "Neural Network"],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

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

const IconChevronDown = ({ isOpen }: { isOpen: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`collapsible-icon ${isOpen ? 'open' : ''}`}>
    <path d="m6 9 6 6 6-6" />
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

function App() {
  // State for Projects (seeded if empty)
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("projects");
    if (!saved) return seedProjects;
    try {
      const parsed = JSON.parse(saved);
      // Backwards compatibility upgrade
      if (parsed.length > 0 && typeof parsed[0] === "string") {
        return parsed.map((name: string) => ({
          name,
          description: "Active research folder",
          color: name === "Drone Mapping" ? "#9d4edd" : name === "Smart Emergency System" ? "#3a86c8" : "#06d6a0",
        }));
      }
      return parsed;
    } catch {
      return seedProjects;
    }
  });

  // Active Project (seeded if empty)
  const [activeProject, setActiveProject] = useState<string>(() => {
    const saved = localStorage.getItem("activeProject");
    return saved || "Drone Mapping";
  });

  // Sources (seeded if empty)
  const [sources, setSources] = useState<Source[]>(() => {
    const saved = localStorage.getItem("sources");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return seedSources;
      }
    }
    return seedSources;
  });

  // Form states for creating a project
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectNameInput, setProjectNameInput] = useState("");
  const [projectDescInput, setProjectDescInput] = useState("");

  // Form states for adding a source
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceNotes, setSourceNotes] = useState("");
  const [sourceTags, setSourceTags] = useState("");
  const [validationError, setValidationError] = useState("");

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

    const newProj: Project = {
      name: projectNameInput.trim(),
      description: projectDescInput.trim() || "Active research project workspace.",
      color: randomColor,
    };

    setProjects([...projects, newProj]);
    setActiveProject(newProj.name); // Auto set as active
    setProjectNameInput("");
    setProjectDescInput("");
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

  // Handle Source Creation
  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!activeProject) {
      setValidationError("Please select or create an active project first.");
      return;
    }

    if (!sourceTitle.trim()) {
      setValidationError("Source title is required.");
      return;
    }

    if (!sourceUrl.trim()) {
      setValidationError("Source URL is required.");
      return;
    }

    // Basic URL validation
    let formattedUrl = sourceUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = "https://" + formattedUrl;
    }

    const tagArray = sourceTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newSource: Source = {
      id: Date.now(),
      title: sourceTitle.trim(),
      url: formattedUrl,
      project: activeProject,
      notes: sourceNotes.trim() || undefined,
      tags: tagArray.length > 0 ? tagArray : undefined,
      createdAt: new Date().toISOString(),
    };

    setSources([newSource, ...sources]); // Prepend for timeline order
    setSourceTitle("");
    setSourceUrl("");
    setSourceNotes("");
    setSourceTags("");
    setIsAddSourceOpen(false);
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
              <div className="active-pulse-indicator">
                <span className="pulse-dot"></span>
                <span>Active</span>
              </div>
            </div>
            <h3 className="active-project-name" title={activeProject}>
              {activeProject}
            </h3>
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
            <span className="sidebar-section-title">My Projects</span>
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
                placeholder="Project Name"
                className="input-glass"
                value={projectNameInput}
                onChange={(e) => setProjectNameInput(e.target.value)}
                autoFocus
                required
              />
              <input
                type="text"
                placeholder="Brief description (optional)"
                className="input-glass"
                value={projectDescInput}
                onChange={(e) => setProjectDescInput(e.target.value)}
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
                return (
                  <div
                    key={proj.name}
                    className={`project-list-item ${activeProject === proj.name ? "active" : ""}`}
                    onClick={() => {
                      setActiveProject(proj.name);
                      setMobileTab("sources"); // Swap back to main sources on mobile
                    }}
                  >
                    <div className="project-item-info">
                      <span className="project-item-name">{proj.name}</span>
                      <span className="project-item-count">{count} source{count !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="project-item-actions">
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
                placeholder="Search saved sources (e.g. 'LiDAR', 'UART')..."
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
          {/* Active Project Hero Banner (Hidden if Searching) */}
          {!isSearching && activeProject && activeProjDetails && (
            <div className="project-hero">
              <div className="project-hero-content">
                <span className="project-hero-badge">Active Workspace</span>
                <h2 className="project-hero-title">{activeProject}</h2>
                <p className="project-hero-desc">
                  {activeProjDetails.description || "Organizing research documents and concepts."}
                </p>
              </div>
              <div className="project-hero-actions">
                <button
                  className="btn-glass"
                  onClick={() => setIsAddSourceOpen(!isAddSourceOpen)}
                >
                  <IconPlus /> Add Source
                </button>
              </div>
            </div>
          )}

          {/* Add Source Accordion Form */}
          {activeProject && !isSearching && (
            <div className="add-source-section">
              <div className="collapsible-card">
                <div
                  className="collapsible-header"
                  onClick={() => setIsAddSourceOpen(!isAddSourceOpen)}
                >
                  <span className="collapsible-title">
                    <IconPlus /> Add Research Source to "{activeProject}"
                  </span>
                  <IconChevronDown isOpen={isAddSourceOpen} />
                </div>

                {isAddSourceOpen && (
                  <form onSubmit={handleAddSource} className="collapsible-content">
                    {validationError && (
                      <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", padding: "10px 14px", borderRadius: "8px", fontSize: "13px" }}>
                        ⚠️ {validationError}
                      </div>
                    )}
                    
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Title *</label>
                        <input
                          type="text"
                          placeholder="e.g. TF02-Pro LiDAR Calibration Guide"
                          className="input-glass"
                          value={sourceTitle}
                          onChange={(e) => setSourceTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">URL *</label>
                        <input
                          type="text"
                          placeholder="e.g. github.com/rpi-lidar/tf02-pro-driver"
                          className="input-glass"
                          value={sourceUrl}
                          onChange={(e) => setSourceUrl(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Notes & Summary</label>
                        <input
                          type="text"
                          placeholder="What did you learn here? Calibration steps, wiring specs, pin configurations..."
                          className="input-glass"
                          value={sourceNotes}
                          onChange={(e) => setSourceNotes(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Tags (comma-separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. LiDAR, Datasheet, Raspberry Pi"
                          className="input-glass"
                          value={sourceTags}
                          onChange={(e) => setSourceTags(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-actions-row">
                      <button
                        type="button"
                        className="btn-glass btn-glass-secondary"
                        onClick={() => {
                          setIsAddSourceOpen(false);
                          setValidationError("");
                        }}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-glass">
                        Save Source
                      </button>
                    </div>
                  </form>
                )}
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