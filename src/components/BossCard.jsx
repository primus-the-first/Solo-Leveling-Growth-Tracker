import { useRef } from 'react';
import gsap from 'gsap';
import { SLSkull, SLZap, SLTrophy, SLLock, SLQuestDone, SLSwords } from './icons/SLIcons';

const BossCard = ({ boss, playerLevel, onChallenge, darkMode = true }) => {
  const cardRef  = useRef(null);
  const isUnlocked = playerLevel >= boss.levelRequired;
  const isDefeated = boss.defeated;

  const accentColor = isDefeated ? '#22C55E' : isUnlocked ? '#EF4444' : '#4A5568';

  const handleMouseEnter = () => {
    if (cardRef.current && isUnlocked && !isDefeated) {
      gsap.to(cardRef.current, { scale: 1.015, boxShadow: `0 0 30px ${accentColor}35`, duration: 0.25, ease: 'power2.out' });
    }
  };
  const handleMouseLeave = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, { scale: 1, boxShadow: `0 0 12px ${accentColor}18`, duration: 0.25, ease: 'power2.out' });
    }
  };

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden"
      style={{
        borderRadius: '4px',
        border: `1px solid ${accentColor}30`,
        borderTop: `2px solid ${accentColor}`,
        background: 'var(--sl-panel)',
        boxShadow: `0 0 12px ${accentColor}18`,
        padding: '1.1rem',
        opacity: !isUnlocked ? 0.55 : 1,
        transition: 'box-shadow 0.25s ease, opacity 0.2s',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Status chip */}
      <div className="absolute top-2 right-2">
        {isDefeated ? (
          <div className="flex items-center gap-1 px-2 py-0.5" style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '2px' }}>
            <SLQuestDone size={10} style={{ color: '#22C55E' }} />
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.55rem', letterSpacing: '0.15em', color: '#22C55E' }}>DEFEATED</span>
          </div>
        ) : !isUnlocked ? (
          <div className="flex items-center gap-1 px-2 py-0.5" style={{ background: 'rgba(74,85,104,0.2)', border: '1px solid rgba(74,85,104,0.4)', borderRadius: '2px' }}>
            <SLLock size={10} style={{ color: '#6B8FC7' }} />
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.55rem', letterSpacing: '0.15em', color: '#6B8FC7' }}>LV.{boss.levelRequired}</span>
          </div>
        ) : null}
      </div>

      <div className="flex items-start gap-4">
        {/* Boss icon */}
        <div
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            width: '56px', height: '56px',
            borderRadius: '3px',
            background: `${accentColor}10`,
            border: `1px solid ${accentColor}30`,
          }}
        >
          <SLSkull size={28} style={{ color: accentColor }} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3
            className="font-bold mb-1 truncate"
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              color: isDefeated ? '#22C55E' : isUnlocked ? '#EF4444' : 'var(--sl-muted)',
              textDecoration: isDefeated ? 'line-through' : 'none',
            }}
          >
            {boss.name}
          </h3>
          <p className="text-sm mb-3" style={{ color: 'var(--sl-muted)', fontFamily: 'Rajdhani, sans-serif' }}>
            {boss.description}
          </p>

          {/* Reward chips */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 px-2 py-0.5" style={{ background: isDefeated ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${isDefeated ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`, borderRadius: '2px' }}>
              <SLZap size={11} style={{ color: isDefeated ? '#22C55E' : '#F59E0B' }} />
              <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.65rem', color: isDefeated ? '#22C55E' : '#F59E0B' }}>+{boss.xpReward} XP</span>
            </div>
            {boss.titleReward && (
              <div className="flex items-center gap-1 px-2 py-0.5" style={{ background: isDefeated ? 'rgba(34,197,94,0.1)' : 'rgba(168,85,247,0.1)', border: `1px solid ${isDefeated ? 'rgba(34,197,94,0.3)' : 'rgba(168,85,247,0.3)'}`, borderRadius: '2px' }}>
                <SLTrophy size={11} style={{ color: isDefeated ? '#22C55E' : '#A855F7' }} />
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.65rem', color: isDefeated ? '#22C55E' : '#A855F7' }}>{boss.titleReward}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Challenge button */}
      {isUnlocked && !isDefeated && (
        <button
          onClick={() => onChallenge?.(boss)}
          className="w-full mt-4 flex items-center justify-center gap-2 py-2 transition-all duration-200 hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(90deg, rgba(239,68,68,0.15), rgba(239,68,68,0.08))',
            border: '1px solid rgba(239,68,68,0.5)',
            borderRadius: '3px',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            color: '#EF4444',
          }}
        >
          <SLSwords size={14} />
          CHALLENGE BOSS
        </button>
      )}

      {/* Corner marks */}
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b" style={{ borderColor: `${accentColor}40` }} />
    </div>
  );
};

export default BossCard;
