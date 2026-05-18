# Solo Leveling — Codebase Overview

A Solo Leveling anime-themed personal growth gamification app. You complete real-life habits/tasks as "quests" to earn XP, level up through E-Rank → Shadow Monarch, and fight boss battles representing personal struggles.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| Styling | Tailwind CSS 3 + custom glassmorphism (index.css) |
| Animations | GSAP 3 (entrance, hover, battle sequences) |
| Auth + DB | Firebase (Google/Email Auth + Firestore) |
| AI | Gemini Pro (onboarding summary only) |
| Sounds | Web Audio API — synthesized tones, no audio files |
| Icons | lucide-react |
| Journal | react-markdown |
| Routing | react-router-dom v7 |

---

## Routes

| Path | Component | Purpose |
|---|---|---|
| `/` | `LandingPage` | Video background hero + auth modal |
| `/onboarding` | `OnboardingFlow` | 9-step System-voice wizard; collects hunter name + 5 pillar goals; Gemini generates summary |
| `/app` | `Dashboard` (App.jsx) | Main game interface |

---

## Core State (Dashboard / App.jsx)

| State | Shape | Purpose |
|---|---|---|
| `player` | `{ name, level, totalXP, title, xpMultiplier, streaks, penalties, skillPoints }` | Player stats |
| `pillars` | Object keyed by id | 5 life pillars, each with level + XP |
| `dailyQuests` | `[{ id, task, xp, pillar, completed }]` | Resets daily at midnight |
| `weeklyQuests` | same | Resets Monday midnight |
| `monthlyQuests` | same | Resets 1st of month |
| `bossBattles` | Array of boss configs | HP scales with player level |
| `achievements` | Array | 6 default achievements with progress % |
| `journal` | `[{ id, title, content, date }]` | Markdown journal entries |
| `history` | `{ "YYYY-MM-DD": { xp, completed } }` | Powers calendar heatmap |
| `rewards` | `[{ id, name, xpRequired, claimed }]` | Real-life rewards |
| `penaltyMode` | `{ active, type, startTime }` | Penalty zone state |
| `recoveryQuests` | Array | Tasks to complete to exit penalty zone |

---

## Persistence

- **Local:** `localStorage` with prefix `solo-leveling-v3-`
- **Cloud:** Firestore at `users/{uid}/gameData/current` — auto-saved with 2s debounce when user is logged in
- **Onboarding:** `users/{uid}/gameData/onboarding` (completed flag + goals) + `users/{uid}` root doc (hunterName)

---

## Level System (`src/gameState.js`)

25 levels from **Awakened Hunter** → **Shadow Monarch**:

| Level | XP Required | Rank Title |
|---|---|---|
| 1 | 0 | Awakened Hunter |
| 2–4 | 100–700 | E / D / C-Rank Hunter |
| 5–14 | 1,400–22,000 | B-Rank / A-Rank Hunter |
| 15–19 | 25,000–45,000 | S-Rank Hunter |
| 20–24 | 50,000–90,000 | National Hunter |
| 25 | 100,000 | Shadow Monarch |

**Streak XP multipliers:**
- 7-day streak → 1.2x + 50 XP bonus
- 30-day streak → 1.5x + 200 XP bonus
- 100-day streak → 2.0x + 500 XP bonus

---

## Features

### Game Systems
- **XP + Leveling** — XP multiplied by streak bonus, pillar XP tracked separately
- **5 Life Pillars** — Personal & Discipline, Spiritual Growth, Financial Freedom, Career & Skills, Education & Knowledge
- **3 Quest Types** — Daily / Weekly / Monthly with auto-reset countdown timers and inline quest editor (add/edit/delete)
- **Boss Battle** — Turn-based combat overlay (GSAP: intro → battle → victory/defeat), 4 default bosses with level-gated unlock
- **Penalty Zone** — Full-screen lockout overlay when quests are missed; 15-min timer; requires completing 3 recovery tasks to exit
- **Streak System** — Tracks daily streaks, awards XP bonuses and multiplier upgrades at milestones
- **Achievement System** — 6 achievements (First Quest, Week Warrior, Month Master, Bookworm, Shadow Slayer, Penalty Survivor)
- **Real-Life Rewards** — XP-gated rewards (e.g. Coffee treat at 500 XP); claimable when threshold reached

### UI / UX
- **System Window** — Chat UI with rule-based responses (`systemResponses.js`) for status/streak/level/quests/boss/pillars/achievements/motivation — no API cost
- **Journal Panel** — Split-pane Markdown editor with entry list sidebar
- **Calendar Heatmap** — Current month grid showing days XP was earned
- **Player Card** — Hunter's License card style with rank badge, XP progress bar, and streak display
- **XP Toasts** — Stacked GSAP-animated floating notifications for XP gains
- **Level Up Modal** — Confetti particles + 3D card flip entrance animation
- **Multiplier Display** — Tiered visual (common → rare → epic → legendary) based on multiplier value
- **Sound System** — Web Audio API synthesized tones for XP gain, quest complete, level up, boss attack, victory

### Auth
- Google Sign-In or Email/Password via Firebase Auth
- `AuthContext.jsx` wraps the app; auto-redirects logged-in users to `/app`
- Onboarding check on auth success — routes to `/onboarding` if not completed

---

## Key Files

| File | Purpose |
|---|---|
| `src/gameState.js` | All defaults, level/XP calculations, localStorage helpers, Firestore sync |
| `src/App.jsx` | Monolithic Dashboard — all game logic (XP, quests, streaks, achievements, penalties) |
| `src/context/AuthContext.jsx` | Firebase auth context provider |
| `src/services/systemResponses.js` | Rule-based System chat (keyword intent detection) |
| `src/services/gemini.js` | Gemini API calls (onboarding summary + response generation) |
| `src/hooks/useSounds.js` | Web Audio API sound synthesis hook |
| `src/hooks/useQuestTimer.js` | Countdown timers + reset detection for daily/weekly/monthly |
| `src/pages/LandingPage.jsx` | Landing page with video bg + GSAP entrance animations |
| `src/components/OnboardingFlow.jsx` | 9-step onboarding wizard with blue flame loading animation |
| `src/index.css` | Tailwind base + glassmorphism, gradient-text, quest-item, pillar card styles |

---

## Component Tree (App Route)

```
Dashboard (App.jsx)
├── FocusModeOverlay      — penalty zone lockout
├── LevelUpModal          — level/title celebration
├── SettingsModal         — export/import/reset/dark mode/logout
├── SystemWindow          — The System chat interface
├── XPToastContainer      — floating XP notifications
├── BossBattle            — combat overlay
├── DailyQuestPopup       — preloader / penalty detection on visit
├── SoundToggle           — bottom-right sound on/off
├── Header                — hunter name, level badge, System + Settings buttons
├── TabNavigation         — Overview / Daily / Weekly / Monthly / Journal / Stats
└── Tab Content (per tab)
    ├── Overview:  PlayerCard, CalendarHeatmap, PillarCard×5
    ├── Daily:     QuestResetTimer, QuestEditor | QuestItem list
    ├── Weekly:    QuestResetTimer, QuestEditor | QuestItem list
    ├── Monthly:   QuestResetTimer, QuestEditor | QuestItem list
    ├── Stats:     MultiplierDisplay, StatsPanel, RewardsTracker, AchievementsPanel, BossCard×4
    └── Journal:   JournalPanel (entry list + Markdown editor)
```

---

## Known Issues

- **Header badge hardcoded** — `Header.jsx:93–95` renders "Level 1 — Awakened Hunter" regardless of the `player` prop
- **`SystemMessage.jsx` unused** — superseded by `DailyQuestPopup`; can be deleted
- **Dev test buttons** — penalty zone and level-up test buttons are `DEV` only (gated by `import.meta.env.DEV`)
- **Footer GSAP commented out** — animation code present but disabled
