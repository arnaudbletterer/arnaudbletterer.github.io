---
name: blog-article-writer
description: >-
  Use this skill when drafting, structuring, writing, or editing blog articles for Arnaud Bletterer's personal website and portfolio (in `_posts/`).
---

# Blog Article Writer for Arnaud Bletterer

This skill guides the creation and editing of blog posts for Arnaud Bletterer's personal site and portfolio. It encodes the exact authorial voice, structural architecture, frontmatter conventions, and design patterns established across previous articles.

---

## 1. Author Persona & Voice

All articles are written in the first person (`I`, `we`), reflecting Arnaud Bletterer's profile and philosophical convictions:

* **Identity:** Research Scientist and Research Team Leader with over a decade of experience bridging the gap between mathematical exploration and industrial software deliverables (Computer Graphics, Image/Geometry Processing, C++, Python, ML pipelines).
* **Core Philosophy (Occam's Razor):** The simplest, most direct solution that solves the real production need is always superior to speculative complexity or academic over-engineering.
* **Respect for Fundamentals ("Shoulders of Giants"):** Grounded in classical mathematics, signal processing, data structures, and hardware physics rather than short-lived framework hype.
* **The "Reality Check" Lens:** Contrast the illusion of academic toy datasets / prototype notebooks with the harsh physics of production software (I/O saturation, memory constraints, silent regressions, edge cases, cross-functional team alignment).
* **Tone & Style:** Pragmatic, authoritative yet humble, clear, structured, and focused on **shipped, usable product value**.
* **Punctuation Constraint (No Em Dashes):** **Never use em dashes (`—`)**. Use commas, colons, parentheses, or separate sentences instead to maintain a natural, human cadence and avoid stereotypical AI writing markers.

---

## 2. File Location & Naming Conventions

* **Directory:** `_posts/`
* **Filename format:** `YYYY-MM-DD-<slug>.md`
  * Example: `_posts/2026-08-16-orchestrator-processor-workflows-at-scale.md`
  * Use lowercase alphanumeric characters and hyphens for `<slug>`.

---

## 3. Frontmatter Specification

Every article **must** start with the following YAML frontmatter:

```yaml
---
layout: page
title: "Article Title Here"
subtitle: "A punchy, clear one-sentence subtitle."
description: "A concise 1-2 sentence description summarizing the core engineering insight for SEO and article search cards."
date: YYYY-MM-DD
highlights:
  - "🏗️ Architecture"
  - "🛠️ Engineering"
---
```

### Highlights / Tags Taxonomy
Use 1 or 2 tags with the established emoji prefix. Recognized categories in `articles.html`:
- `"📋 Methodology"` — R&D processes, testing gates, POC to production workflows.
- `"🧠 Philosophy"` — Engineering mindsets, Occam's razor, foundations.
- `"🛠️ Engineering"` — Low-level implementation, native ports, memory layout, C++/Python.
- `"👥 Leadership"` — Team mentoring, R&D management, aligning researchers with product.
- `"🚀 Strategy"` — Business alignment, traction, exploratory vs. structural debt.
- `"🏗️ Architecture"` — System design, pipeline blueprints, distributed workflows.

---

## 4. Article Anatomy & Formatting Patterns

Follow this structural progression for every post:

### 1. Hook & Reality Check (Opening 2–4 paragraphs)
- Open with a relatable scenario: how a problem is handled naively in a laboratory/notebook or initial prototype.
- Introduce the "production reality check": what happens when scale, clients, real-world data errors, or team dynamics enter the picture.
- Conclude the introduction with a brief thesis statement introducing the principles or blueprint covered in the article.
- Add a horizontal rule `---` before Section 1.

### 2. Thematic Sections (Numbered `## 1.`, `## 2.`, `## 3.`, etc.)
Organize the body into 3 to 5 clear, numbered thematic sections.

### 3. Signature Callout Blocks
Use bold blockquotes at the beginning or within sections to establish core axioms:
```markdown
> **The Problem:** R&D teams often spend months micro-optimizing an isolated component before verifying how it interacts with the rest of the system.
```
```markdown
> **The Architectural Rule:** Keep your orchestrator hyper-aware of state transitions but completely oblivious to pixel payloads.
```
```markdown
> **The Insight:** At scale, metadata operations bottleneck compute long before workers reach full capacity.
```

### 4. Visuals & Mermaid Diagrams
When explaining dataflows, state machines, or system architectures, embed clean Mermaid diagrams:
```markdown
```mermaid
flowchart LR
    O["<b>Orchestrator</b><br/><small>State Machine</small>"]
    P["<b>Processor Pool</b><br/><small>Stateless Nodes</small>"]
    O -->|"Task Token"| P
```
```

### 5. Concrete Comparisons (✕ Naive vs. ✓ Industrial)
Use structured contrast lists to clearly differentiate bad vs. good engineering practices:
```markdown
* **✕ The Naive Trap (Memory Thrashing):** Loading full image arrays into memory buffers across shared queues...
* **✓ The Industrial Pattern (Decoupled Staging):** Passing cryptographic task tokens and streaming directly to local scratch NVMe...
```

### 6. Low-Budget / Practical Callouts (`💡`)
Where applicable, show that these principles do not require billion-dollar cloud infrastructure and can be applied effectively on single machines:
```markdown
> **💡 Low-Budget / Single-Machine Setup:**
> You do not need a Kubernetes cluster to implement this. A single Python script using `sqlite3` as a task queue and spawning standard `multiprocessing` workers achieves the exact same architectural isolation.
```

### 7. Memorable Takeaway & Closing
- Conclude with a strong, grounded philosophical takeaway.
- **Clean Citation & Takeaway Standard:** Render closing takeaways or citations in an italicized blockquote without inner quotation marks (`> *Clean takeaway sentence.*` rather than `> *“Quote.”*` or `> **"Quote."**`). The layout automatically provides a centered pull-quote with a styled `“` quotation icon. For external quotes, add a source attribution on a newline (`> <cite>— Author (Work, Year)</cite>`). In running text, avoid combining bold with quotation marks (`**""**`).
- Emphasize the human and product impact: how rigorous engineering empowers people, delights clients, and brings true satisfaction to researchers.

---

## 5. Workflow for Writing a New Article

### Step 1: Interactive Topic Ideation & Interview
When starting a new article or when the user invokes `/blog-article-writer`:
1. **Analyze the Existing Catalog & Context:**
   - Scan `_posts/` to map existing themes, continuity arcs, and covered topics (e.g., Occam's razor, tracer bullets, translation problem, leadership, traction, debt management, agentic workflows).
   - Consider **Arnaud's Core Expertise:** Computer Graphics, Geometry Processing, Computer Vision, C++/Python native bridging, R&D leadership, architecture, and practical engineering trade-offs.
   - Consider **Current Domain News & Shifts:** Emerging industry shifts (e.g., Gaussian splatting, spatial computing, AI coding agents, WebAssembly/native edge deployment, telemetry/evals).
2. **Conduct the Topic Discovery Interview (One Question at a Time):**
   - **Crucial Rule:** Always ask **one question at a time**, accompanied by **concrete, pre-made suggestions/options** (using `ask_question` or formatted selectable choices) so the author can easily choose or adjust.
   - Follow this sequential interview progression:
     - **Question 1 (Broad Focus / Problem Area):** Present 3–4 specific candidate engineering domains or themes missing from the catalog.
     - **Question 2 (Technical Conflict / Friction):** Ask about the specific pitfall, trade-off, or industry misconception in that chosen domain, offering pre-made examples.
     - **Question 3 (Core Takeaway / Axiom):** Ask about the central mental model or actionable rule to impart to the reader, offering clear pre-made takeaways.
3. **Synthesize & Propose 2–3 Refined Topic Pitches:**
   - Based on the user's interview responses, present 2–3 structured candidate pitches:
     - **Proposed Title & Subtitle**
     - **The Reality Check:** The naive trap vs. the production reality.
     - **Continuity & Relevance:** How it builds upon previous articles and fits current industry conversations.
     - **Proposed Tags/Highlights**
4. **Select & Lock Direction:** The user selects the winning pitch.

### Step 2: Outline & Structure Interview (One Question at a Time)
Once the topic is chosen:
1. Conduct a brief, one-question-at-a-time interview with concrete options for:
   - Specific architectural patterns or mental models to illustrate (e.g., Mermaid diagram flow, state machine, worker pool).
   - Concrete ✕ Naive vs. ✓ Industrial comparison points.
2. Draft the structured 3–5 numbered section outline for user approval.

### Step 3: Determine Metadata
- Finalize title and punchy subtitle.
- Select 1–2 matching highlight tags with emojis (`"🏗️ Architecture"`, `"🛠️ Engineering"`, etc.).
- Set the publication date (`YYYY-MM-DD`).

### Step 4: Draft the Markdown File
Write the complete post directly to `_posts/YYYY-MM-DD-<slug>.md` respecting all formatting rules above.

### Step 5: Verification Checklist
- [ ] File is in `_posts/` with correct date prefix.
- [ ] Frontmatter has `layout: page`, `title`, `subtitle`, `description`, `date`, `highlights`.
- [ ] Uses 3–5 numbered `##` sections.
- [ ] Includes problem/axiom callouts (`> **The Problem:**`, etc.).
- [ ] Uses diagrams (Mermaid) or contrast lists (`✕` vs `✓`) where appropriate.
- [ ] **Zero em dashes (`—`)**: Punctuation is natural with commas, parentheses, colons, or split sentences.
- [ ] Voice and tone match Arnaud's pragmatic, Occam's razor philosophy.
