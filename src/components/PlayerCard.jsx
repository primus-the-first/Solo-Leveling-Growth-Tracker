import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { getCurrentLevelXP, getNextLevelXP } from '../gameState';
import { useAuth } from '../context/AuthContext';

const RANK_DATA = {
  E: { color: '#4E9AFE', label: 'E-RANK' },
  D: { color: '#22C55E', label: 'D-RANK' },
  C: { color: '#3B82F6', label: 'C-RANK' },
  B: { color: '#A855F7', label: 'B-RANK' },
  A: { color: '#EF4444', label: 'A-RANK' },
  S: { color: '#F59E0B', label: 'S-RANK' },
};

const getPlayerRank = (level) => {
  if (level >= 25) return 'S';
  if (level >= 20) return 'A';
  if (level >= 15) return 'B';
  if (level >= 10) return 'C';
  if (level >= 5)  return 'D';
  return 'E';
};

const StatRow = ({ label, value, color }) => (
  <div className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid rgba(78,154,254,0.07)' }}>
    <span className="sys-label">{label}</span>
    <span
      style={{
        fontFamily: 'Share Tech Mono, monospace',
        fontSize: '0.82rem',
        color: color || 'var(--sl-white)',
      }}
    >
      {value}
    </span>
  </div>
);

const PlayerCard = ({ player, darkMode }) => {
  const { user } = useAuth();
  const hunterName = (player?.name || user?.displayName || 'Hunter').toUpperCase();
  const cardRef = useRef(null);

  const rank     = getPlayerRank(player?.level ?? 1);
  const rankData = RANK_DATA[rank];

  const currentLevelXP = getCurrentLevelXP(player.level);
  const nextLevelXP    = getNextLevelXP(player.level);
  const xpNeeded       = nextLevelXP - currentLevelXP;
  const xpIn           = Math.max(0, Math.min(player.totalXP - currentLevelXP, xpNeeded));
  const xpPct          = xpNeeded <= 0 ? 100 : Math.min((xpIn / xpNeeded) * 100, 100);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: -16, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, []);

  const dark = darkMode !== false;

  return (
    <div
      ref={cardRef}
      className="relative mb-6 overflow-hidden"
      style={{
        background: dark ? 'var(--sl-panel)' : 'rgba(240,244,255,0.95)',
        border: `1px solid ${rankData.color}30`,
        borderTop: `2px solid ${rankData.color}`,
        borderRadius: '4px',
        boxShadow: dark
          ? `0 0 30px ${rankData.color}15, 0 4px 20px rgba(0,0,0,0.4)`
          : '0 2px 16px rgba(10,22,40,0.12)',
      }}
    >
      {/* Window Title Bar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          background: dark
            ? `linear-gradient(90deg, ${rankData.color}18 0%, rgba(10,22,40,0.6) 100%)`
            : `linear-gradient(90deg, ${rankData.color}15 0%, rgba(240,244,255,0.8) 100%)`,
          borderBottom: `1px solid ${rankData.color}25`,
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: rankData.color, boxShadow: `0 0 6px ${rankData.color}` }}
          />
          <span
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              color: rankData.color,
            }}
          >
            SYSTEM — STATUS WINDOW
          </span>
        </div>
        <span className="sys-label">{player.penalties?.active ? '⚠ PENALTY ACTIVE' : 'ONLINE'}</span>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Top row: Avatar + Name block */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div
            className="flex-shrink-0 w-16 h-16 flex items-center justify-center text-2xl font-black"
            style={{
              background: dark
                ? `linear-gradient(135deg, ${rankData.color}20, rgba(10,22,40,0.8))`
                : `linear-gradient(135deg, ${rankData.color}15, rgba(240,244,255,0.9))`,
              border: `1px solid ${rankData.color}40`,
              borderRadius: '3px',
              fontFamily: 'Orbitron, sans-serif',
              color: rankData.color,
              boxShadow: `0 0 16px ${rankData.color}20`,
            }}
          >
            {hunterName.charAt(0)}
          </div>

          {/* Name + rank + title */}
          <div className="flex-1 min-w-0">
            <h2
              className="font-black leading-none mb-1 truncate"
              style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '1.1rem',
                color: dark ? 'var(--sl-white)' : '#0A1628',
                letterSpacing: '0.05em',
              }}
            >
              {hunterName}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="px-2 py-0.5 text-xs font-bold tracking-widest"
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '0.6rem',
                  color: rankData.color,
                  border: `1px solid ${rankData.color}`,
                  borderRadius: '2px',
                  background: `${rankData.color}12`,
                }}
              >
                {rankData.label}
              </span>
              <span className="sys-label truncate">{player.title}</span>
            </div>
          </div>

          {/* Level */}
          <div
            className="flex-shrink-0 text-center px-3 py-2"
            style={{
              border: `1px solid ${rankData.color}40`,
              borderRadius: '3px',
              background: `${rankData.color}08`,
            }}
          >
            <div className="sys-label">LEVEL</div>
            <div
              className="font-black"
              style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '1.4rem',
                color: rankData.color,
                lineHeight: 1,
              }}
            >
              {player.level}
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="sys-label">EXPERIENCE POINTS</span>
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.72rem', color: 'var(--sl-blue)' }}>
              {xpIn.toLocaleString()} / {xpNeeded > 0 ? xpNeeded.toLocaleString() : '---'}
            </span>
          </div>
          <div
            style={{
              height: '8px',
              background: 'rgba(10,22,40,0.8)',
              borderRadius: '2px',
              border: '1px solid rgba(78,154,254,0.12)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${xpPct}%`,
                background: `linear-gradient(90deg, ${rankData.color}, #76FFFA)`,
                borderRadius: '1px',
                boxShadow: `0 0 8px ${rankData.color}80`,
                transition: 'width 0.8s ease-out',
              }}
            />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-x-6">
          <div>
            <StatRow label="TOTAL XP"   value={player.totalXP.toLocaleString()} color="var(--sl-blue)" />
            <StatRow label="STREAK"     value={`${player.streaks?.daily ?? 0}D`} color="#F97316" />
            <StatRow label="MULTIPLIER" value={`${player.xpMultiplier ?? 1}×`}   color="var(--sl-aqua)" />
          </div>
          <div>
            <StatRow label="SKILL PTS"  value={typeof player.skillPoints === 'object' ? Object.values(player.skillPoints ?? {}).reduce((a, b) => a + b, 0) : (player.skillPoints ?? 0)} color="var(--sl-gold)" />
            <StatRow label="STATUS"     value={player.penalties?.active ? 'PENALTY' : 'ACTIVE'} color={player.penalties?.active ? '#EF4444' : '#22C55E'} />
            <StatRow label="QUESTS"     value={`${player.streaks?.weekly ?? 0}WK`} color="var(--sl-muted)" />
          </div>
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2" style={{ borderColor: rankData.color }} />
      <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2" style={{ borderColor: rankData.color }} />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2" style={{ borderColor: rankData.color }} />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2" style={{ borderColor: rankData.color }} />
    </div>
  );
};

export default PlayerCard;
