import { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { SLGear } from './icons/SLIcons';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import SystemButton from './SystemButton';
import { getCurrentLevelXP, getNextLevelXP } from '../gameState';

const RANK_COLORS = {
  E: '#4E9AFE',
  D: '#22C55E',
  C: '#3B82F6',
  B: '#A855F7',
  A: '#EF4444',
  S: '#F59E0B',
};

const getPlayerRank = (level) => {
  if (level >= 25) return 'S';
  if (level >= 20) return 'A';
  if (level >= 15) return 'B';
  if (level >= 10) return 'C';
  if (level >= 5)  return 'D';
  return 'E';
};

const Header = ({ player, darkMode, onOpenSettings, onOpenSystem }) => {
  const { user } = useAuth();
  const hunterName = (player?.name || user?.displayName || 'Hunter').toUpperCase();
  const rank = getPlayerRank(player?.level ?? 1);
  const rankColor = RANK_COLORS[rank];

  const currentLevelXP = getCurrentLevelXP(player?.level ?? 1);
  const nextLevelXP    = getNextLevelXP(player?.level ?? 1);
  const xpNeeded       = nextLevelXP - currentLevelXP;
  const xpIn           = Math.max(0, Math.min((player?.totalXP ?? 0) - currentLevelXP, xpNeeded));
  const xpPct          = xpNeeded <= 0 ? 100 : Math.min((xpIn / xpNeeded) * 100, 100);

  const barRef  = useRef(null);
  const fillRef = useRef(null);
  const hudRef  = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(hudRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
      gsap.to(barRef.current, {
        boxShadow: `0 0 10px ${rankColor}60, 0 0 20px ${rankColor}30`,
        repeat: -1, yoyo: true, duration: 2, ease: 'sine.inOut',
      });
    }, hudRef);
    return () => ctx.revert();
  }, [rankColor]);

  const dark = darkMode !== false;

  return (
    <header
      ref={hudRef}
      className="w-full px-4 py-3 flex items-center justify-between gap-4"
      style={{
        background: dark
          ? 'linear-gradient(90deg, #05080F 0%, #0A1628 50%, #05080F 100%)'
          : 'linear-gradient(90deg, #f0f4ff 0%, #e8eeff 50%, #f0f4ff 100%)',
        borderBottom: dark
          ? '1px solid rgba(78,154,254,0.18)'
          : '1px solid rgba(78,154,254,0.25)',
      }}
    >
      {/* LEFT — Rank + Name */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Rank badge */}
        <div
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center font-black text-lg"
          style={{
            fontFamily: 'Orbitron, sans-serif',
            color: rankColor,
            border: `1px solid ${rankColor}`,
            boxShadow: `0 0 10px ${rankColor}40`,
            background: `${rankColor}12`,
            borderRadius: '3px',
          }}
        >
          {rank}
        </div>

        {/* Name + level */}
        <div className="min-w-0">
          <p
            className="text-xs tracking-widest truncate"
            style={{ fontFamily: 'Orbitron, sans-serif', color: 'var(--sl-muted)' }}
          >
            HUNTER
          </p>
          <h1
            className="text-base font-bold leading-tight tracking-wider truncate"
            style={{
              fontFamily: 'Orbitron, sans-serif',
              color: dark ? 'var(--sl-white)' : '#0A1628',
            }}
          >
            {hunterName}
          </h1>
        </div>
      </div>

      {/* CENTER — XP bar */}
      <div className="flex-1 max-w-sm hidden sm:block">
        <div className="flex justify-between items-center mb-1">
          <span className="sys-label">XP</span>
          <span
            className="text-xs"
            style={{ fontFamily: 'Share Tech Mono, monospace', color: 'var(--sl-blue)' }}
          >
            LV.{player?.level ?? 1}
            <span style={{ color: 'var(--sl-muted)' }}> — {player?.title ?? 'Awakened'}</span>
          </span>
        </div>
        <div
          ref={barRef}
          className="w-full"
          style={{
            height: '6px',
            background: 'rgba(10,22,40,0.8)',
            borderRadius: '2px',
            border: '1px solid rgba(78,154,254,0.15)',
          }}
        >
          <div
            ref={fillRef}
            style={{
              height: '100%',
              width: `${xpPct}%`,
              background: 'linear-gradient(90deg, #4E9AFE, #76FFFA)',
              borderRadius: '1px',
              boxShadow: '0 0 6px rgba(78,154,254,0.6)',
              transition: 'width 0.8s ease-out',
            }}
          />
        </div>
        <div className="flex justify-between mt-0.5">
          <span className="sys-label">{xpIn.toLocaleString()} XP</span>
          <span className="sys-label">{xpNeeded > 0 ? `${xpNeeded.toLocaleString()} to next` : 'MAX'}</span>
        </div>
      </div>

      {/* RIGHT — Streak + Controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {(player?.streaks?.daily ?? 0) > 0 && (
          <div
            className="hidden sm:flex items-center gap-1.5 px-2 py-1"
            style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '0.7rem',
              color: '#F97316',
              border: '1px solid rgba(249,115,22,0.3)',
              borderRadius: '2px',
              background: 'rgba(249,115,22,0.08)',
            }}
          >
            🔥 {player.streaks.daily}D
          </div>
        )}

        <SystemButton onClick={onOpenSystem} darkMode={dark} />

        <button
          onClick={onOpenSettings}
          className="p-2 transition-all duration-200 hover:scale-110 cursor-pointer"
          style={{
            border: '1px solid rgba(78,154,254,0.2)',
            borderRadius: '3px',
            background: 'rgba(78,154,254,0.05)',
          }}
          aria-label="Settings"
        >
          <SLGear
            size={18}
            style={{ color: dark ? 'var(--sl-muted)' : '#4A6FA5' }}
          />
        </button>
      </div>
    </header>
  );
};

Header.propTypes = {
  player: PropTypes.object,
  darkMode: PropTypes.bool.isRequired,
  onOpenSettings: PropTypes.func.isRequired,
  onOpenSystem: PropTypes.func,
};

export default Header;
