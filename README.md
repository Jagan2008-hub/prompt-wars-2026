# ProjectMatch — AI-Powered Team Formation Platform

ProjectMatch is a platform that helps students and developers form high-synergy project teams for hackathons, competitions, research, and startups. It combines skill profiles, availability schedules, learning goals, and Google Gemini AI to analyze team dynamics, detect skill gaps, and recommend complete dream teams.

---

## 🎯 Purpose
Finding the right collaborators with complementary abilities, aligned availability, and shared goals is one of the hardest parts of any project. ProjectMatch solves this by:
1. **Intelligent Match Scoring**: Evaluating candidates based on skills, roles, schedule overlap, and learning goals.
2. **Skill Gap Detection**: Highlighting what skills an existing team is missing and automatically discovering candidates who fill those gaps.
3. **AI Dream Team Formation**: Recommending balanced multi-role teams with collective synergy analysis.

---

## 🛠️ Technology Stack
- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Modern CSS Design System (Dark mode, glassmorphism, responsive utilities)
- **Icons**: Lucide React
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security)
- **AI Matching**: Google Gemini API (`gemini-1.5-flash` / `gemini-2.0-flash`)
- **Deployment**: Vercel

---

## 🚀 Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/Jagan2008-hub/prompt-wars-2026.git
cd prompt-wars-2026
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```
*(Note: ProjectMatch includes built-in fallback modes so you can preview the platform even before entering API keys).*

---

## 💻 Commands

### Start Development Server
```bash
npm run dev
```

### Build Production Bundle
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```
