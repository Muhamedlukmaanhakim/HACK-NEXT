# CollabMatrix — Student-to-Student Collaboration Platform

> **Find the right people. Build the right team.**  
> A premium dark-first campus collaboration platform connecting college students across technical, creative, communication, and business disciplines for hackathons, research projects, events, and startup ventures.

---

## 🚀 Quick Start & Run Instructions

### Prerequisites
- **Node.js**: v18.0.0 or later (Tested on Node v24.20.0, npm 11.19.0)
- Operating System: Windows, macOS, or Linux

### Installation & Launch
1. **Clone or navigate into the workspace**:
   ```bash
   cd "HACKNEXT"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Production build & verification**:
   ```bash
   npm run build
   npm run preview
   ```

---

## 🎯 The Demo Story Walkthrough (§6)

CollabMatrix comes pre-seeded with deterministic data specifically tailored for hackathon judges and evaluations:

1. **Landing Page (`/`)**:
   - Explore the animated student collaboration network, problem friction breakdown, 4-step workflow, and cross-disciplinary skill ecosystem.
   - Click **"Get Started"** to navigate to registration, or **"Sign In"** to test login.

2. **Login Shortcut (`/login`)**:
   - Use the **"Demo Login"** banner at the top to sign in instantly as **Lukmaan Hakim** (CSE, 2nd Year, AI/ML Researcher).
   - Alternatively, use test registration (`/register`) to experience the **5-Step Onboarding Wizard** (`/onboarding`).

3. **Dashboard (`/dashboard`)**:
   - Features dynamic time-based greetings (*"Good morning/afternoon/evening, Lukmaan 👋"*), 85% computed profile completion, metric stat cards, and active collaboration hub for **AI Healthcare Assistant**.

4. **Create Opportunity with AI Extraction (`/opportunities/create`)**:
   - In the project description field, type or test:  
     `"I need someone who can design the interface and confidently present our project."`
   - Click **"✨ Analyze Requirements with AI"**.
   - Watch the simulated NLP engine detect: `UI/UX`, `Presentation`, and `Public Speaking`.
   - Click **"Apply to Required Skills"** and post the opportunity.

5. **Match Results (`/matches`)**:
   - Instantly ranks students based on the multi-factor weighted compatibility formula (50% skills, 20% interests, 15% availability, 15% experience):
     1. **Sarah Rahman** — **94% Match** (UI/UX, Presentation, Storytelling)
     2. **Rahul Kumar** — **91% Match** (Backend, APIs, Databases, Cloud)
     3. **Aisha Khan** — **89% Match** (Marketing, Social Media, Branding)
     4. **Arjun Verma** — **84% Match** (React, Frontend Development)
   - Click **"Connect"** on Sarah Rahman → updates dynamically to **"Request Sent"** with a toast.

6. **Requests Workflow (`/requests`)**:
   - Under **Incoming Requests**, inspect Sarah Rahman's pending application:  
     *“I'd love to contribute UI/UX and presentation skills to your project.”*
   - Click **"Accept into Team"** → notification triggers, request status changes to Accepted, and Sarah is automatically added to the **AI Healthcare Assistant** squad.

7. **My Team Hub (`/team`)**:
   - Observe team count progression from **2/4** (Lukmaan, Rahul) to **3/4** (now including Sarah Rahman).
   - Dynamic category skill coverage meters update automatically.

8. **Team Gap Analysis (`/team/gap-analysis`)**:
   - Compares project requirements (`Python`, `AI/ML`, `Backend`, `UI/UX`, `Public Speaking`, `Marketing`) against team competency.
   - Dynamic coverage computed at **67%** (4 of 6 covered).
   - Identifies remaining missing competencies: `Public Speaking` and `Marketing`.
   - Recommends **Meera Nair** (National speaker, 88% match) and **Aisha Khan** (Growth marketer, 89% match).
   - Click **"+ Add Now"** to recruit missing members and achieve **100% full skill coverage**.

9. **Reset Demo Data**:
   - Click **"Reset Demo"** in the sidebar footer or via **Settings (`/settings`)** to restore all localStorage state to clean initial values at any time.

---

## 📁 Clean Architecture & Folder Map

```text
HACKNEXT/
├── index.html                   # HTML entry point with meta & dark mode
├── package.json                 # React 18, Vite 5, Tailwind 3.4, React Router 6, Lucide
├── tailwind.config.js           # Design tokens: palette, gradients, glass effects, borders
├── postcss.config.js            # Tailwind PostCSS runner
├── README.md                    # Setup documentation and Supabase swap instructions
└── src/
    ├── main.jsx                 # StrictMode application mount
    ├── App.jsx                  # Providers + Router entrypoint (kept tiny)
    ├── index.css                # Inter typography, CSS variables, dark glass styles
    ├── routes/
    │   ├── index.jsx            # 15 application routes + 404 handler
    │   └── ProtectedRoute.jsx   # Auth guard & onboarding gatekeeper
    ├── layouts/
    │   ├── PublicLayout.jsx     # Header navbar + content + footer
    │   ├── AuthLayout.jsx       # Split form & platform visual showcase
    │   └── AppLayout.jsx        # Sidebar + top mobile nav + bottom tab bar
    ├── pages/
    │   ├── Landing.jsx          # Public hero, network visualization, ecosystem
    │   ├── Login.jsx            # Form validation, demo shortcut, Google simulation
    │   ├── Register.jsx         # Account registration with password validation
    │   ├── Onboarding.jsx       # 5-step wizard with category pills and state retention
    │   ├── Dashboard.jsx        # Personalized hub, stats, recommendations
    │   ├── DiscoverStudents.jsx # Debounced search, multi-facet drawer, student cards
    │   ├── DiscoverOpportunities.jsx # Filterable campus project feed
    │   ├── CreateOpportunity.jsx# Form, sticky preview, ✨ AI requirement analysis
    │   ├── OpportunityDetails.jsx# Roster progress, skill checklist, join request
    │   ├── MatchResults.jsx     # Multi-factor ranked match cards & score gauge
    │   ├── Requests.jsx         # Incoming/Sent tabs, Accept/Decline workflows
    │   ├── MyTeam.jsx           # Team roster, owner protection, coverage meters
    │   ├── TeamGapAnalysis.jsx  # Computed coverage radar & missing skill invites
    │   ├── Profile.jsx          # Student portfolio, project accolades, edit modal
    │   ├── Settings.jsx         # Account settings, notifications, demo reset
    │   └── NotFound.jsx         # Friendly 404 recovery route
    ├── components/
    │   ├── layout/              # Navbar, Sidebar, MobileNavigation
    │   ├── ui/                  # Button, Input, Textarea, Select, Badge, Modal,
    │   │                        # ProgressBar, Toast, Tabs, Toggle, Avatar,
    │   │                        # EmptyState, LoadingState, Skeleton, ErrorState
    │   ├── skills/              # SkillBadge, SkillSelector, SkillCoverage
    │   ├── cards/               # StudentCard, OpportunityCard, MatchCard, ProfileCard,
    │   │                        # TeamMemberCard, RequestCard, StatCard
    │   └── features/            # SearchBar, FilterPanel, MatchScore, GapAnalysis,
    │                            # AIAnalysisCard
    ├── data/                    # Pure mock seed data (NEVER imported by pages)
    │   ├── students.js          # 16 detailed students (Lukmaan, Sarah, Rahul, Aisha...)
    │   ├── opportunities.js     # 10 opportunities across Hackathon, Project, Research...
    │   ├── teams.js             # 5 teams (including AI Healthcare Assistant)
    │   ├── skills.js            # Taxonomy categories and AI keyword heuristics
    │   ├── requests.js          # 10 incoming and sent collaboration requests
    │   └── index.js             # Consolidated data exports
    ├── services/                # ASYNC SERVICE LAYER (The ONLY layer pages call)
    │   ├── studentService.js    # maps to `public.students`
    │   ├── opportunityService.js# maps to `public.opportunities`
    │   ├── teamService.js       # maps to `public.teams` & `public.team_members`
    │   ├── requestService.js    # maps to `public.collaboration_requests`
    │   ├── authService.js       # maps to `supabase.auth`
    │   ├── aiService.js         # maps to Supabase Edge Function `analyze-requirements`
    │   ├── matchService.js      # maps to PostgreSQL RPC / pgvector `match_students`
    │   └── taxonomyService.js   # maps to `public.departments` and reference tables
    ├── context/
    │   ├── AuthContext.jsx      # Session state and login shortcuts
    │   ├── AppDataContext.jsx   # Synced CRUD state, roster mutations, demo reset
    │   └── ToastContext.jsx     # Accessible stackable notifications
    ├── hooks/
    │   ├── useDebounce.js       # Input throttling for responsive search
    │   ├── useAsync.js          # Async execution state helper
    │   ├── useLocalStorage.js   # Safe browser persistence
    │   └── useToast.js          # Notification dispatcher
    └── utils/
        ├── matching.js          # 50/20/15/15 scoring formula & stable §6 overrides
        ├── gapAnalysis.js       # Dynamic team skill coverage & candidate ranking
        ├── format.js            # Deterministic avatar initials and gradient hashes
        └── greeting.js          # Time-sensitive greetings (morning/afternoon/evening)
```

---

## 🔄 How to Swap Mock Data for Supabase

The architecture strictly adheres to the **Service Layer abstraction**. Pages and UI components never import from `data/` directly; they only interact with asynchronous functions in `src/services/*`.

To connect Supabase without rewriting a single UI page or component:

### Step 1: Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### Step 2: Initialize Supabase Client (`src/services/supabaseClient.js`)
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Step 3: Replace Service Implementations
Each service function is already documented with JSDoc specifying the destination table or RPC endpoint:

- **`authService.js`**:
  ```javascript
  // Replace mock login:
  export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  }
  ```

- **`studentService.js`**:
  ```javascript
  // Replace mock student query:
  export async function getStudents(filters = {}) {
    let query = supabase.from('students').select('*');
    if (filters.department) query = query.eq('department', filters.department);
    if (filters.year) query = query.eq('year', filters.year);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
  ```

- **`aiService.js`**:
  ```javascript
  // Call Supabase Edge Function running an LLM prompt:
  export async function analyzeRequirements(text) {
    const { data, error } = await supabase.functions.invoke('analyze-requirements', {
      body: { text },
    });
    if (error) throw error;
    return data;
  }
  ```

- **`matchService.js`**:
  ```javascript
  // Call PostgreSQL pgvector similarity or SQL RPC function:
  export async function getMatches(opportunityId, sortBy) {
    const { data, error } = await supabase.rpc('calculate_opportunity_matches', {
      target_opportunity_id: opportunityId,
      sort_dimension: sortBy
    });
    if (error) throw error;
    return data;
  }
  ```

Because all pages consume standardized Promises with consistent object contracts, zero UI adjustments are needed when swapping to live cloud persistence.

---

## ♿ Accessibility & Design System Standards
- **WCAG AA Compliance**: High-contrast typography on dark surfaces (`#F3F4F8` text on `#0B0D14` and `#12151F`).
- **Deterministic Avatars**: Deterministic initials generated via string hash (no external asset dependencies or broken CDN links).
- **Accessible Landmarks & Focus**: Standard `<header>`, `<nav>`, `<main>`, `<aside>`, and `<button>` elements with `:focus-visible` rings and `aria-live` notification announcements.
- **Honesty Labels**: Clearly surfaces prototype disclosures (*"Prototype: results are simulated from mock data"*) on AI and matching screens.
