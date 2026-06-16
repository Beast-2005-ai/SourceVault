# SourceVault - Automated Context-Aware Research Tracker

SourceVault is a browser extension dashboard designed to be a "second memory" for learning, writing, and research. It automatically tracks the sites you visit, filters out unrelated tabs, routes relevant content to their respective workspaces based on custom keywords, and generates summaries and tags.

---

## 🚀 How to Run and Test Locally

### 1. Install Dependencies
Run this command in the project directory to install all packages:
```bash
npm install
```

### 2. Start the Local Development Server
Launch the local dev server using:
```bash
npm run dev
```
Once started, the server runs at: **`http://localhost:5173/`**
Open this URL in your web browser to test the prototype.

### 3. Build for Production
To compile the TypeScript project and generate the static build files (located in the `/dist` directory):
```bash
npm run build
```

---

## 💡 What SourceVault Does & How It Works

This prototype features an **Automated Browsing Activity Simulator** to demonstrate the core features of the Chrome extension without needing to compile and install a browser bundle first.

### 1. Multi-Workspace Concurrent Tracking
* In the sidebar, you can create and manage multiple workspaces (projects).
* Each workspace has an independent **Live / Paused** toggle button.
* **Live (Green Pulse)**: The workspace is actively listening for matching browsing activity.
* **Paused (Muted Gray)**: The workspace is inactive and ignores all incoming page visits.

### 2. Relevance Classification Engine
When you simulate visiting a webpage, the classification engine automatically parses the page title and URL against the active workspaces:
* **Token Matching**: It splits workspace names, descriptions, and user custom **Tracking Keywords** into unique matching tokens.
* **Scoring Algorithm**: It assigns weighted matching scores (e.g. matching custom keywords has a high weight, name matches have a high weight, description has a lower weight). If the score satisfies the threshold, it is captured.
* **Context Protection**: If you open a page unrelated to any active research (like YouTube entertainment or Wordle), it is automatically classified as unrelated and **ignored**, keeping your research database noise-free.

### 3. Automated Metadata Extraction
When a page is captured under a workspace, the system uses NLP heuristic matching (simulating AI extraction) to:
* **Generate Tags**: Extract and attach custom keyword categories based on the domains and concepts found (e.g., `#Auto-Tracked`, `#GitHub`, `#Datasheet`, `#LiDAR`, `#AI`).
* **Extract Notes & Summaries**: Automatically compile a natural-language summary explaining why the resource is relevant to the matched workspace.

### 4. Real-Time Browsing Activity Log
* The console displays a scrolling real-time list of all simulated tab activities.
* Green rows denote **Captured** pages, indicating which workspace(s) matched the URL.
* Muted/gray rows denote **Ignored** pages, detailing the reason they were filtered out.

---

## 🛠️ Step-by-Step Test Guide

1. Open **`http://localhost:5173/`** in your browser.
2. In the sidebar, click the **`+`** icon next to **My Workspaces** to create two research projects:
   * **Workspace 1**: Name it `Drone Mapping`, set description to `telemetry and mapping`, and add keywords `LiDAR, UART, drone`.
   * **Workspace 2**: Name it `Neural Network Notes`, set description to `deep learning notes`, and add keywords `PyTorch, neural`.
3. In the sidebar, ensure both workspaces have the green pulse status reading **Live**.
4. In the **Browsing Activity Simulator Console** in the main panel, click the preset **`📄 LiDAR Datasheet`** button.
   * **Result**: An activity log row is created showing **Captured**, and it routes a timeline card under the `Drone Mapping` workspace.
5. Click the preset **`🐱 YouTube Fun (Should Ignore)`** button.
   * **Result**: An activity log row is created showing **Ignored** because it does not match any active project contexts.
6. In the sidebar, toggle `Drone Mapping` to **Paused**.
7. Click the preset **`📄 LiDAR Datasheet`** button again.
   * **Result**: The activity log row is created showing **Ignored** (since the matching workspace tracker was paused).
