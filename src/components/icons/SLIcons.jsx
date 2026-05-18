/**
 * Custom Solo Leveling icon set.
 * All icons share a 24×24 viewBox and accept { size, className, style }.
 * Stroke-based with square linecaps/miter joins — angular game-HUD aesthetic.
 */

const base = (size, className, style, extra = {}) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.5',
  strokeLinecap: 'square',
  strokeLinejoin: 'miter',
  className,
  style,
  ...extra,
});

/* ─── The System Eye ────────────────────────────────────────────────────────
   Used in: SystemButton, SystemWindow header
   Angular almond eye with iris ring, filled pupil, flanking scan ticks ── */
export const SLSystemEye = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Outer angular eye */}
    <path d="M2 12 L7 6 L17 6 L22 12 L17 18 L7 18 Z" />
    {/* Iris */}
    <circle cx="12" cy="12" r="3.5" />
    {/* Pupil — filled */}
    <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    {/* Scan tick left */}
    <line x1="2" y1="12" x2="8.5" y2="12" strokeOpacity="0.45" />
    {/* Scan tick right */}
    <line x1="15.5" y1="12" x2="22" y2="12" strokeOpacity="0.45" />
    {/* Top corner marks */}
    <line x1="7"  y1="6"  x2="8"  y2="5"  strokeWidth="1" strokeOpacity="0.5" />
    <line x1="17" y1="6"  x2="16" y2="5"  strokeWidth="1" strokeOpacity="0.5" />
  </svg>
);

/* ─── XP Lightning Bolt ─────────────────────────────────────────────────────
   Used in: XPToast, BossCard XP reward, StatsPanel, LevelUpModal ── */
export const SLZap = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Main bolt */}
    <path d="M13 2 L5 13 L11 13 L10 22 L19 10 L13 10 Z" />
    {/* Energy level ticks left of bolt */}
    <line x1="2" y1="8"  x2="4" y2="8"  strokeWidth="1" strokeOpacity="0.55" />
    <line x1="1" y1="12" x2="3" y2="12" strokeWidth="1" strokeOpacity="0.55" />
    <line x1="2" y1="16" x2="4" y2="16" strokeWidth="1" strokeOpacity="0.55" />
  </svg>
);

/* ─── Shadow Skull ──────────────────────────────────────────────────────────
   Used in: BossBattle overlay, BossCard ── */
export const SLSkull = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Cranium — angular pentagon */}
    <path d="M12 2 L19 6 L20 12 L18 16 L16 16 L16 19 L8 19 L8 16 L6 16 L4 12 L5 6 Z" />
    {/* Left eye socket — square */}
    <rect x="7"  y="9.5" width="3.5" height="3.5" />
    {/* Right eye socket — square */}
    <rect x="13.5" y="9.5" width="3.5" height="3.5" />
    {/* Nasal void */}
    <line x1="12" y1="13.5" x2="12" y2="15" strokeWidth="1" />
    {/* Teeth */}
    <line x1="9.5"  y1="19" x2="9.5"  y2="22" strokeWidth="1.2" />
    <line x1="12"   y1="19" x2="12"   y2="22" strokeWidth="1.2" />
    <line x1="14.5" y1="19" x2="14.5" y2="22" strokeWidth="1.2" />
    {/* Crack */}
    <path d="M12 2 L11 7 L13 9" strokeWidth="1" strokeOpacity="0.6" />
  </svg>
);

/* ─── Crossed Shadow Swords ─────────────────────────────────────────────────
   Used in: BossBattle, BossCard challenge button ── */
export const SLSwords = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Blade 1: top-right to bottom-left */}
    <line x1="20" y1="3" x2="7"  y2="17" strokeWidth="1.8" />
    {/* Tip 1 */}
    <path d="M20 3 L22 2 L21 5 Z" fill="currentColor" stroke="none" />
    {/* Guard 1 — perpendicular at ~1/3 */}
    <line x1="17" y1="6"  x2="14" y2="3"  strokeWidth="1.2" />
    {/* Handle 1 */}
    <line x1="7" y1="17" x2="4"  y2="20" strokeWidth="2.2" />
    <line x1="4" y1="20" x2="2"  y2="22" strokeWidth="1" strokeOpacity="0.5" />

    {/* Blade 2: top-left to bottom-right */}
    <line x1="4"  y1="3" x2="17" y2="17" strokeWidth="1.8" />
    {/* Tip 2 */}
    <path d="M4 3 L2 2 L3 5 Z" fill="currentColor" stroke="none" />
    {/* Guard 2 */}
    <line x1="7"  y1="6"  x2="10" y2="3"  strokeWidth="1.2" />
    {/* Handle 2 */}
    <line x1="17" y1="17" x2="20" y2="20" strokeWidth="2.2" />
    <line x1="20" y1="20" x2="22" y2="22" strokeWidth="1" strokeOpacity="0.5" />

    {/* Crossing diamond */}
    <path d="M11 10 L12 9 L13 10 L12 11 Z" fill="currentColor" stroke="none" />
  </svg>
);

/* ─── Quest Box — Empty ─────────────────────────────────────────────────────
   Used in: QuestItem (incomplete state). Cut-corner square — game checkbox ── */
export const SLQuestBox = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Cut-corner octagon shape */}
    <path d="M5 3 L19 3 L21 5 L21 19 L19 21 L5 21 L3 19 L3 5 Z" />
    {/* Corner inner ticks — give depth */}
    <line x1="5"  y1="3"  x2="6"  y2="4"  strokeWidth="1" strokeOpacity="0.4" />
    <line x1="19" y1="3"  x2="18" y2="4"  strokeWidth="1" strokeOpacity="0.4" />
    <line x1="5"  y1="21" x2="6"  y2="20" strokeWidth="1" strokeOpacity="0.4" />
    <line x1="19" y1="21" x2="18" y2="20" strokeWidth="1" strokeOpacity="0.4" />
  </svg>
);

/* ─── Quest Box — Checked ────────────────────────────────────────────────────
   Used in: QuestItem (complete state). Angular checkmark inside the box ── */
export const SLQuestDone = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Same octagon */}
    <path d="M5 3 L19 3 L21 5 L21 19 L19 21 L5 21 L3 19 L3 5 Z" />
    {/* Angular check — two-segment tick */}
    <polyline points="7,12 10,16 17,8" strokeWidth="2" strokeLinecap="square" />
    {/* Top-left fill accent */}
    <line x1="3" y1="3" x2="6" y2="6" strokeWidth="1" strokeOpacity="0.35" />
  </svg>
);

/* ─── Geometric Flame (Personal pillar / Streaks) ───────────────────────────
   Replaces Lucide Flame ── */
export const SLFlame = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Outer flame body */}
    <path d="M12 2 L15 7 L17 5 L16 11 L19 9 L17 15 L15 18 L12 20 L9 18 L7 15 L5 9 L8 11 L7 5 L9 7 Z" />
    {/* Inner core */}
    <path d="M12 10 L14 13 L12 17 L10 13 Z" fill="currentColor" stroke="none" strokeOpacity="0.7" />
  </svg>
);

/* ─── Mana Crystal (Spiritual pillar / Star-type rewards) ──────────────────
   Replaces Lucide Star ── */
export const SLCrystal = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Outer hexagonal crystal */}
    <path d="M12 2 L17 5.5 L17 12.5 L12 16 L7 12.5 L7 5.5 Z" />
    {/* Inner facet */}
    <path d="M12 5 L15 7.5 L15 12 L12 14 L9 12 L9 7.5 Z" strokeWidth="1" strokeOpacity="0.6" />
    {/* Bottom spike */}
    <path d="M9 12 L7 12.5 L12 22 L17 12.5 L15 12" strokeWidth="1" strokeOpacity="0.8" />
    {/* Top vertex bright mark */}
    <line x1="12" y1="2" x2="12" y2="4.5" strokeWidth="2" strokeOpacity="0.9" />
  </svg>
);

/* ─── Mind / Intel Node (Education pillar, Brain replacement) ────────────────
   Three connected nodes — circuit/neural network ── */
export const SLMind = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Triangle of lines */}
    <line x1="12" y1="4"  x2="6"  y2="18" strokeWidth="1.2" />
    <line x1="12" y1="4"  x2="18" y2="18" strokeWidth="1.2" />
    <line x1="6"  y1="18" x2="18" y2="18" strokeWidth="1.2" />
    {/* Connector to center */}
    <line x1="12" y1="4"  x2="12" y2="12" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="6"  y1="18" x2="12" y2="12" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="18" y1="18" x2="12" y2="12" strokeWidth="1" strokeOpacity="0.5" />
    {/* Nodes */}
    <rect x="10.5" y="2.5" width="3"  height="3"  fill="currentColor" stroke="none" />
    <rect x="4.5"  y="16.5" width="3" height="3"  fill="currentColor" stroke="none" />
    <rect x="16.5" y="16.5" width="3" height="3"  fill="currentColor" stroke="none" />
    {/* Center node */}
    <rect x="10.8" y="10.8" width="2.4" height="2.4" fill="currentColor" stroke="none" />
  </svg>
);

/* ─── Ascending Steps (Career / TrendingUp replacement) ─────────────────────*/
export const SLTrend = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Staircase */}
    <polyline points="2,18 2,14 7,14 7,10 12,10 12,6 17,6" strokeWidth="1.8" />
    {/* Arrow */}
    <polyline points="14,3 17,6 14,9"  strokeWidth="1.8" />
    {/* Step dots */}
    <rect x="6"  y="13" width="2" height="2" fill="currentColor" stroke="none" />
    <rect x="11" y="9"  width="2" height="2" fill="currentColor" stroke="none" />
  </svg>
);

/* ─── Rune Book (Education / BookOpen replacement) ───────────────────────────*/
export const SLBook = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Left page */}
    <path d="M3 5 L3 19 L12 21 L12 3 Z" />
    {/* Right page */}
    <path d="M21 5 L21 19 L12 21 L12 3 Z" />
    {/* Rune marks left page */}
    <line x1="5"  y1="9"  x2="10" y2="9"  strokeWidth="1" strokeOpacity="0.55" />
    <line x1="5"  y1="12" x2="10" y2="12" strokeWidth="1" strokeOpacity="0.55" />
    <line x1="5"  y1="15" x2="8"  y2="15" strokeWidth="1" strokeOpacity="0.55" />
    {/* Rune marks right page */}
    <line x1="14" y1="9"  x2="19" y2="9"  strokeWidth="1" strokeOpacity="0.55" />
    <line x1="14" y1="12" x2="19" y2="12" strokeWidth="1" strokeOpacity="0.55" />
    <line x1="14" y1="15" x2="17" y2="15" strokeWidth="1" strokeOpacity="0.55" />
    {/* Spine center glyph */}
    <line x1="12" y1="7"  x2="12" y2="19" strokeWidth="1" strokeOpacity="0.4" />
  </svg>
);

/* ─── System Gear (Settings) ─────────────────────────────────────────────────
   8-point angular gear ── */
export const SLGear = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Outer ring segments with teeth */}
    <path d="
      M10 2 L10 4.5
      L8 3.5 L5.5 6 L6.5 8
      L4.5 10 L2 10 L2 14 L4.5 14
      L6.5 16 L5.5 18 L8 20.5 L10 19.5
      L10 22 L14 22 L14 19.5
      L16 20.5 L18.5 18 L17.5 16
      L19.5 14 L22 14 L22 10 L19.5 10
      L17.5 8 L18.5 6 L16 3.5 L14 4.5
      L14 2 Z
    " />
    {/* Inner octagon hole */}
    <path d="M10 9 L9 12 L10 15 L12 16 L14 15 L15 12 L14 9 L12 8 Z" />
  </svg>
);

/* ─── Rank Trophy ────────────────────────────────────────────────────────────
   Used in: Achievements, StatsPanel, LevelUpModal ── */
export const SLTrophy = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Cup body */}
    <path d="M8 2 L16 2 L17 9 L14 12 L14 15 L16 16 L16 18 L8 18 L8 16 L10 15 L10 12 L7 9 Z" />
    {/* Left handle */}
    <path d="M8 3 L5 3 L4 7 L7 9" strokeWidth="1.2" />
    {/* Right handle */}
    <path d="M16 3 L19 3 L20 7 L17 9" strokeWidth="1.2" />
    {/* Pedestal */}
    <line x1="8"  y1="18" x2="16" y2="18" />
    <rect x="6"   y="19"  width="12" height="2" />
    <line x1="5"  y1="21" x2="19" y2="21" strokeWidth="2" />
    {/* Star on cup */}
    <path d="M12 5 L12.8 7.5 L15 7.5 L13.2 9 L13.8 11.5 L12 10 L10.2 11.5 L10.8 9 L9 7.5 L11.2 7.5 Z"
      fill="currentColor" stroke="none" />
  </svg>
);

/* ─── Shield (defence / protection stats) ────────────────────────────────────*/
export const SLShield = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Angular shield */}
    <path d="M12 2 L20 5 L20 12 L16 18 L12 22 L8 18 L4 12 L4 5 Z" />
    {/* Center diamond emblem */}
    <path d="M12 8 L15 12 L12 16 L9 12 Z" strokeWidth="1" strokeOpacity="0.7" />
    {/* Corner marks */}
    <line x1="12" y1="2"  x2="12" y2="5"  strokeWidth="1" strokeOpacity="0.4" />
    <line x1="20" y1="5"  x2="17" y2="7"  strokeWidth="1" strokeOpacity="0.4" />
    <line x1="4"  y1="5"  x2="7"  y2="7"  strokeWidth="1" strokeOpacity="0.4" />
  </svg>
);

/* ─── Dungeon Gate ───────────────────────────────────────────────────────────
   Solo Leveling's iconic blue gate portal. Used for boss/raid content ── */
export const SLGate = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Outer arch frame */}
    <path d="M4 22 L4 10 L12 2 L20 10 L20 22" />
    {/* Inner arch */}
    <path d="M7 22 L7 11 L12 6 L17 11 L17 22" strokeWidth="1" strokeOpacity="0.6" />
    {/* Energy lines radiating from apex */}
    <line x1="12" y1="6" x2="12" y2="2"  strokeWidth="1" strokeOpacity="0.5" />
    <line x1="12" y1="6" x2="9"  y2="4"  strokeWidth="1" strokeOpacity="0.4" />
    <line x1="12" y1="6" x2="15" y2="4"  strokeWidth="1" strokeOpacity="0.4" />
    {/* Horizontal bars across gate opening */}
    <line x1="7" y1="14" x2="17" y2="14" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="7" y1="18" x2="17" y2="18" strokeWidth="1" strokeOpacity="0.5" />
    {/* Ground line */}
    <line x1="2" y1="22" x2="22" y2="22" strokeWidth="1.8" />
  </svg>
);

/* ─── XP Alert Triangle ──────────────────────────────────────────────────────
   Penalty / warning states (replaces AlertTriangle) ── */
export const SLAlert = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Angular triangle */}
    <path d="M12 2 L22 20 L2 20 Z" />
    {/* Exclamation */}
    <line x1="12" y1="9"  x2="12" y2="15" strokeWidth="2" />
    <line x1="12" y1="17" x2="12" y2="18" strokeWidth="2" />
    {/* Corner inner marks */}
    <line x1="4"  y1="20" x2="6"  y2="18" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="20" y1="20" x2="18" y2="18" strokeWidth="1" strokeOpacity="0.5" />
  </svg>
);

/* ─── Send / Submit Arrow ────────────────────────────────────────────────────
   Used in: SystemWindow send button ── */
export const SLSend = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Main arrow shaft */}
    <line x1="3" y1="12" x2="20" y2="12" strokeWidth="1.8" />
    {/* Arrow head */}
    <polyline points="14,6 20,12 14,18" strokeWidth="1.8" />
    {/* Tail ticks */}
    <line x1="3"  y1="12" x2="3"  y2="9"  strokeWidth="1" strokeOpacity="0.5" />
    <line x1="3"  y1="12" x2="3"  y2="15" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="7"  y1="12" x2="7"  y2="10" strokeWidth="1" strokeOpacity="0.35" />
    <line x1="7"  y1="12" x2="7"  y2="14" strokeWidth="1" strokeOpacity="0.35" />
  </svg>
);

/* ─── Close X ────────────────────────────────────────────────────────────────
   Used everywhere to close modals/panels ── */
export const SLClose = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    <line x1="4"  y1="4"  x2="20" y2="20" strokeWidth="2" />
    <line x1="20" y1="4"  x2="4"  y2="20" strokeWidth="2" />
    {/* Corner ticks */}
    <line x1="4"  y1="4"  x2="6"  y2="4"  strokeWidth="1" strokeOpacity="0.5" />
    <line x1="4"  y1="4"  x2="4"  y2="6"  strokeWidth="1" strokeOpacity="0.5" />
    <line x1="20" y1="4"  x2="18" y2="4"  strokeWidth="1" strokeOpacity="0.5" />
    <line x1="20" y1="4"  x2="20" y2="6"  strokeWidth="1" strokeOpacity="0.5" />
    <line x1="4"  y1="20" x2="6"  y2="20" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="4"  y1="20" x2="4"  y2="18" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="20" y1="20" x2="18" y2="20" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="20" y1="20" x2="20" y2="18" strokeWidth="1" strokeOpacity="0.5" />
  </svg>
);

/* ─── Lock ───────────────────────────────────────────────────────────────────
   Used in: locked achievements/bosses ── */
export const SLLock = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Shackle */}
    <path d="M8 11 L8 7 L8 6 Q8 3 12 3 Q16 3 16 6 L16 11" strokeLinecap="square" />
    {/* Body */}
    <rect x="4" y="11" width="16" height="11" />
    {/* Keyhole */}
    <circle cx="12" cy="16" r="2" />
    <line x1="12" y1="18" x2="12" y2="21" strokeWidth="1.5" />
  </svg>
);

/* ─── Volume On / Off ────────────────────────────────────────────────────────*/
export const SLVolume = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    <path d="M5 9 L5 15 L9 15 L15 20 L15 4 L9 9 Z" />
    <line x1="18" y1="9"  x2="22" y2="9"  strokeOpacity="0.5" strokeWidth="1" />
    <line x1="18" y1="12" x2="23" y2="12" />
    <line x1="18" y1="15" x2="22" y2="15" strokeOpacity="0.5" strokeWidth="1" />
  </svg>
);

export const SLVolumeMute = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    <path d="M5 9 L5 15 L9 15 L15 20 L15 4 L9 9 Z" />
    <line x1="18" y1="9"  x2="23" y2="14" strokeWidth="1.8" />
    <line x1="23" y1="9"  x2="18" y2="14" strokeWidth="1.8" />
  </svg>
);

/* ─── Clock / Timer ──────────────────────────────────────────────────────────*/
export const SLClock = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Octagonal clock face */}
    <path d="M9 2 L15 2 L20 7 L20 17 L15 22 L9 22 L4 17 L4 7 Z" />
    {/* Tick marks at 12,3,6,9 */}
    <line x1="12" y1="4"  x2="12" y2="6"  strokeWidth="1.5" />
    <line x1="12" y1="18" x2="12" y2="20" strokeWidth="1.5" />
    <line x1="4"  y1="12" x2="6"  y2="12" strokeWidth="1.5" />
    <line x1="18" y1="12" x2="20" y2="12" strokeWidth="1.5" />
    {/* Hands */}
    <line x1="12" y1="12" x2="12" y2="7"  strokeWidth="1.5" />
    <line x1="12" y1="12" x2="16" y2="13" strokeWidth="1.5" />
    {/* Center dot */}
    <rect x="11" y="11" width="2" height="2" fill="currentColor" stroke="none" />
  </svg>
);

/* ─── Gift / Reward ──────────────────────────────────────────────────────────*/
export const SLGift = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Box */}
    <rect x="3" y="10" width="18" height="12" />
    {/* Ribbon horizontal */}
    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
    <line x1="3" y1="16" x2="21" y2="16" strokeWidth="1" strokeOpacity="0.5" />
    {/* Ribbon vertical */}
    <line x1="12" y1="10" x2="12" y2="22" strokeWidth="2" />
    {/* Bow left loop */}
    <path d="M12 10 L8 6 L6 8 L12 10" strokeWidth="1.2" />
    {/* Bow right loop */}
    <path d="M12 10 L16 6 L18 8 L12 10" strokeWidth="1.2" />
  </svg>
);

/* ─── Sun (light mode) ───────────────────────────────────────────────────────*/
export const SLSun = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    <rect x="10" y="10" width="4" height="4" />
    {/* 8 rays */}
    {[0,45,90,135,180,225,270,315].map((deg, i) => {
      const r = Math.PI * deg / 180;
      const x1 = 12 + 6 * Math.cos(r); const y1 = 12 + 6 * Math.sin(r);
      const x2 = 12 + 9 * Math.cos(r); const y2 = 12 + 9 * Math.sin(r);
      return <line key={i} x1={x1.toFixed(1)} y1={y1.toFixed(1)} x2={x2.toFixed(1)} y2={y2.toFixed(1)} strokeWidth="1.5" />;
    })}
  </svg>
);

/* ─── Moon (dark mode) ───────────────────────────────────────────────────────*/
export const SLMoon = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    <path d="M12 3 Q6 5 6 12 Q6 19 12 21 Q5 21 3 16 Q1 11 5 7 Q8 3 12 3 Z" />
    {/* Stars */}
    <line x1="17" y1="5"  x2="17" y2="3"  strokeWidth="1" />
    <line x1="15" y1="4"  x2="19" y2="4"  strokeWidth="1" />
    <line x1="20" y1="11" x2="20" y2="9"  strokeWidth="1" />
    <line x1="18" y1="10" x2="22" y2="10" strokeWidth="1" />
  </svg>
);

/* ─── Plus / Add ─────────────────────────────────────────────────────────────*/
export const SLPlus = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    <line x1="12" y1="4"  x2="12" y2="20" strokeWidth="2" />
    <line x1="4"  y1="12" x2="20" y2="12" strokeWidth="2" />
    {/* Corner marks */}
    <line x1="12" y1="4"  x2="10" y2="4"  strokeWidth="1" strokeOpacity="0.4" />
    <line x1="12" y1="4"  x2="14" y2="4"  strokeWidth="1" strokeOpacity="0.4" />
    <line x1="12" y1="20" x2="10" y2="20" strokeWidth="1" strokeOpacity="0.4" />
    <line x1="12" y1="20" x2="14" y2="20" strokeWidth="1" strokeOpacity="0.4" />
  </svg>
);

/* ─── Edit / Pencil ──────────────────────────────────────────────────────────*/
export const SLEdit = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Pencil body */}
    <path d="M4 20 L4 16 L16 4 L20 8 L8 20 Z" />
    {/* Tip */}
    <path d="M16 4 L18 2 L22 6 L20 8 Z" fill="currentColor" stroke="none" />
    {/* Eraser line */}
    <line x1="4" y1="20" x2="8" y2="20" strokeWidth="1.5" />
    {/* Guidelines on pencil body */}
    <line x1="8"  y1="16" x2="14" y2="10" strokeWidth="1" strokeOpacity="0.4" />
  </svg>
);

/* ─── Delete / Trash ─────────────────────────────────────────────────────────*/
export const SLTrash = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Lid */}
    <line x1="3"  y1="6"  x2="21" y2="6"  strokeWidth="1.8" />
    <path d="M9 6 L9 3 L15 3 L15 6" strokeWidth="1.2" />
    {/* Body */}
    <path d="M5 6 L6 21 L18 21 L19 6" />
    {/* Inner delete lines */}
    <line x1="9"  y1="10" x2="9"  y2="17" strokeWidth="1" strokeOpacity="0.6" />
    <line x1="12" y1="10" x2="12" y2="17" strokeWidth="1" strokeOpacity="0.6" />
    <line x1="15" y1="10" x2="15" y2="17" strokeWidth="1" strokeOpacity="0.6" />
  </svg>
);

/* ─── Save / Download ────────────────────────────────────────────────────────*/
export const SLSave = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Floppy body */}
    <path d="M3 3 L3 21 L21 21 L21 7 L17 3 Z" />
    {/* Label area */}
    <rect x="7" y="3" width="8" height="6" strokeWidth="1" />
    {/* Disk hole */}
    <rect x="13" y="4" width="2" height="4" fill="currentColor" stroke="none" />
    {/* Data lines */}
    <line x1="6" y1="14" x2="18" y2="14" strokeWidth="1" strokeOpacity="0.5" />
    <line x1="6" y1="17" x2="18" y2="17" strokeWidth="1" strokeOpacity="0.5" />
  </svg>
);

/* ─── Upload / Export ────────────────────────────────────────────────────────*/
export const SLUpload = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    <line x1="12" y1="3" x2="12" y2="15" strokeWidth="1.8" />
    <polyline points="7,8 12,3 17,8" strokeWidth="1.8" />
    <path d="M4 15 L4 20 L20 20 L20 15" strokeWidth="1.5" />
  </svg>
);

/* ─── Download / Import ──────────────────────────────────────────────────────*/
export const SLDownload = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    <line x1="12" y1="3" x2="12" y2="15" strokeWidth="1.8" />
    <polyline points="7,10 12,15 17,10" strokeWidth="1.8" />
    <path d="M4 15 L4 20 L20 20 L20 15" strokeWidth="1.5" />
  </svg>
);

/* ─── Heart / HP ─────────────────────────────────────────────────────────────*/
export const SLHeart = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    <path d="M12 21 L4 13 L3 9 L5 6 L8 5 L12 8 L16 5 L19 6 L21 9 L20 13 Z" />
    {/* Inner glow line */}
    <line x1="12" y1="8" x2="12" y2="15" strokeWidth="1" strokeOpacity="0.4" />
  </svg>
);

/* ─── User / Profile ─────────────────────────────────────────────────────────*/
export const SLUser = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Head */}
    <path d="M8 8 L8 6 L9 4 L12 3 L15 4 L16 6 L16 8 L15 10 L12 11 L9 10 Z" />
    {/* Shoulders */}
    <path d="M5 22 L5 18 L7 15 L12 14 L17 15 L19 18 L19 22" />
  </svg>
);

/* ─── Mail ───────────────────────────────────────────────────────────────────*/
export const SLMail = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    <rect x="2" y="5" width="20" height="14" />
    <polyline points="2,5 12,13 22,5" strokeWidth="1.5" />
    <line x1="2"  y1="19" x2="8"  y2="13" strokeWidth="1" strokeOpacity="0.4" />
    <line x1="22" y1="19" x2="16" y2="13" strokeWidth="1" strokeOpacity="0.4" />
  </svg>
);

/* ─── Log Out ────────────────────────────────────────────────────────────────*/
export const SLLogOut = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    <path d="M9 3 L3 3 L3 21 L9 21" />
    <line x1="13" y1="12" x2="22" y2="12" strokeWidth="1.8" />
    <polyline points="17,7 22,12 17,17" strokeWidth="1.8" />
  </svg>
);

/* ─── Refresh ────────────────────────────────────────────────────────────────*/
export const SLRefresh = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    <path d="M4 8 Q8 2 16 4 Q21 6 21 12" strokeLinecap="square" />
    <polyline points="1,5 4,8 7,5" strokeWidth="1.5" />
    <path d="M20 16 Q16 22 8 20 Q3 18 3 12" strokeLinecap="square" />
    <polyline points="23,19 20,16 17,19" strokeWidth="1.5" />
  </svg>
);

/* ─── DollarSign / Coin ──────────────────────────────────────────────────────*/
export const SLCoin = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Octagonal coin */}
    <path d="M9 2 L15 2 L20 7 L20 17 L15 22 L9 22 L4 17 L4 7 Z" />
    {/* Dollar symbol */}
    <line x1="12" y1="6"  x2="12" y2="18" />
    <path d="M9 9 L14 9 Q16 9 16 11 Q16 13 12 13 Q16 13 16 15 Q16 17 14 17 L9 17" strokeWidth="1.5" />
  </svg>
);

/* ─── Target / Aim ───────────────────────────────────────────────────────────*/
export const SLTarget = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    {/* Outer ring */}
    <path d="M9 2 L15 2 L20 7 L20 17 L15 22 L9 22 L4 17 L4 7 Z" />
    {/* Middle ring */}
    <path d="M10.5 6.5 L13.5 6.5 L17 10.5 L17 13.5 L13.5 17.5 L10.5 17.5 L7 13.5 L7 10.5 Z" />
    {/* Crosshairs */}
    <line x1="12" y1="2"  x2="12" y2="6.5" strokeWidth="1" strokeOpacity="0.6" />
    <line x1="12" y1="17.5" x2="12" y2="22" strokeWidth="1" strokeOpacity="0.6" />
    <line x1="2"  y1="12" x2="7"  y2="12"  strokeWidth="1" strokeOpacity="0.6" />
    <line x1="17" y1="12" x2="22" y2="12"  strokeWidth="1" strokeOpacity="0.6" />
    {/* Center dot */}
    <rect x="10.5" y="10.5" width="3" height="3" fill="currentColor" stroke="none" />
  </svg>
);

/* ─── Check / Success ────────────────────────────────────────────────────────*/
export const SLCheck = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    <polyline points="4,12 9,18 20,6" strokeWidth="2.2" />
    <line x1="4"  y1="12" x2="4"  y2="10" strokeWidth="1" strokeOpacity="0.4" />
    <line x1="20" y1="6"  x2="22" y2="6"  strokeWidth="1" strokeOpacity="0.4" />
  </svg>
);

/* ─── ChevronDown ────────────────────────────────────────────────────────────*/
export const SLChevronDown = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    <polyline points="4,8 12,16 20,8" strokeWidth="1.8" />
  </svg>
);

/* ─── ChevronRight ───────────────────────────────────────────────────────────*/
export const SLChevronRight = ({ size = 24, className, style }) => (
  <svg {...base(size, className, style)}>
    <polyline points="8,4 16,12 8,20" strokeWidth="1.8" />
    {/* Tick marks for HUD feel */}
    <line x1="16" y1="12" x2="18" y2="12" strokeWidth="1" strokeOpacity="0.4" />
  </svg>
);
