# ProjectMatch — AI-Powered Team Formation Platform

> **"Find the people who complete your project."**
> Prompt Wars Hackathon 2026 Submission

ProjectMatch is a modern platform that helps students and builders form high-velocity, complementary project teams based on **skills, roles, availability, experience level, and learning goals**. It detects skill gaps in real time, generates synergistic 3–5 person squads with **Team DNA** profiling, and provides a collaborative Kanban workspace with **AI Project Health** telemetry.

---

## 🌟 Key Product Innovations & Differentiators

### 1. Transparent 5-Factor AI Compatibility Engine
Compatibility scores are mathematically grounded and transparent:
* **Technical Skill Coverage (35% Weight)**: Direct match & proficiency alignment.
* **Role Slot Alignment (20% Weight)**: Direct fulfillment of open required roles.
* **Schedule & Hours Overlap (15% Weight)**: Weekly commitment & time-block synergy.
* **Experience & Track Record (15% Weight)**: Balanced builder seniority.
* **Learning Goal Synergy (15% Weight)**: Matching builders eager to learn adjacent project stacks.
* **"How Was This Calculated?"**: Clickable breakdown modal revealing the exact weighted calculation for every match.

### 2. Real-Time Skill Gap Detection Matrix
* Visual breakdown of project requirements: `Covered (100%)`, `Partial (65%)`, and `Missing (15%)`.
* Actionable candidate recommendations for each missing/partial skill with clear justification on how the candidate plugs the gap.

### 3. AI Dream Team Generator with "Why Not The Others?" Transparency
* Multidisciplinary squad generation that optimizes for collective team synergy rather than just individual high scores.
* **"Why Not The Others?"**: Complete transparent rationale explaining why alternative community candidates were not selected for that specific combination.
* 1-Click **Batch Invite All Teammates** with instant notification triggers.

### 4. 5-Axis Team DNA Profiling
For every assembled squad or project team, ProjectMatch generates a 5-dimension **Team DNA** profile:
* **Technical Depth**
* **Creative & UX Polish**
* **Execution Velocity**
* **Leadership & Strategy**
* **Learning & Adaptability**
* Dynamic AI synthesis interpreting squad dynamics.

### 5. Smart Personalized Dashboard
* Dynamic **"Recommended for You"** project cards with match percentage, matching skills (✓), missing skills (○), recommended role, and rationale.
* Instant adaptation when switching between demo personas.
* Profile Completion Strength meter with actionable optimization tips.

### 6. Team Workspace & AI Project Health Insight
* Interactive 3-column Kanban board (`To Do`, `In Progress`, `Done`) with task creation, assignment, priority tagging, and filtering (`All`, `My Tasks`, `High Priority`, `Completed`).
* **Project Health Dashboard**: Project Health %, Team Fit %, Task Progress %, Skill Coverage %, and Deadline Risk.
* **AI Sprint Health Insight**: Proactive sprint guidance identifying single points of failure before code integration.

---

## 🚀 Live Demo & Personas

The application runs deterministically out of the box with zero required API keys:
1. **Arjun Mehta**: Frontend Lead (React, TypeScript, Next.js, WebSockets) · 18h/wk
2. **Priya Sharma**: UI/UX Designer (Figma, Design Systems, Prototyping) · 15h/wk
3. **Rahul Varma**: AI/ML Engineer (PyTorch, Gemini, Python, Computer Vision) · 20h/wk
4. **Karthik Nair**: Backend & Cloud Architect (Go, PostgreSQL, Docker, Redis) · 16h/wk
5. **Meera Iyer**: Biotechnology & Research Specialist (Bioinformatics, Python) · 12h/wk
6. **Vikram Singh**: Robotics & IoT Specialist (C++, ROS2, Embedded Systems) · 15h/wk
7. **Ananya Patel**: Product Lead & Growth (Product Management, User Research) · 14h/wk

---

## 🛠️ Architecture & Tech Stack

* **Frontend**: React 18 + TypeScript + Vite
* **Styling**: Vanilla Modern CSS Design System (Custom Glassmorphism, Dark Mode Tokens, Micro-animations)
* **Icons & Animation**: Lucide React + Canvas Confetti
* **AI Engine**: Google Gemini API + Deterministic Offline Multi-Variable Engine
* **Database & Auth**: Supabase PostgreSQL Schema with RLS Policies (`supabase_schema.sql`) + Local State Synchronization
* **Serverless Backend**: Vercel Edge Serverless Functions (`/api/match.ts`, `/api/team-recommend.ts`)

---

## 💻 Quickstart & Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Production Build
npm run build
```

---

## 🔒 Security & Hackathon Compliance
* `.env*` and secrets are strictly excluded in `.gitignore`.
* Repository size: **< 0.5 MB** (Safely below the 10 MB hackathon constraint).
* Single branch: **`main`**.
* Zero external API keys required to demonstrate complete functionality.
