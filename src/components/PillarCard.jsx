import { useRef } from 'react';
import gsap from 'gsap';
import { SLFlame, SLCrystal, SLMind, SLTrend, SLBook } from './icons/SLIcons';
import { calculatePillarStats } from '../gameState';

const iconMap = {
  flame:         SLFlame,
  star:          SLCrystal,
  brain:         SLMind,
  'trending-up': SLTrend,
  book:          SLBook,
};

const PILLAR_THEME = {
  personal:  { color: '#EF4444', label: 'VITALITY' },
  spiritual: { color: '#A855F7', label: 'SPIRIT'   },
  career:    { color: '#4E9AFE', label: 'POWER'    },
  financial: { color: '#22C55E', label: 'WEALTH'   },
  education: { color: '#76FFFA', label: 'INT'      },
};

const StatBar = ({ name, value, color }) => (
  <div className="mb-2.5">
    <div className="flex justify-between items-center mb-1">
      <span className="sys-label">{name.toUpperCase()}</span>
      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.72rem', color }}>
        {value}
      </span>
    </div>
    <div style={{ height: '4px', background: 'rgba(10,22,40,0.8)', borderRadius: '1px', border: '1px solid rgba(78,154,254,0.08)', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${value}%`, background: `linear-gradient(90deg, ${color}aa, ${color})`, borderRadius: '1px', boxShadow: `0 0 4px ${color}60`, transition: 'width 0.6s ease-out' }} />
    </div>
  </div>
);

const PillarCard = ({ pillar, index, darkMode }) => {
  const cardRef  = useRef(null);
  const IconComp = iconMap[pillar.icon] || SLFlame;
  const theme    = PILLAR_THEME[pillar.id] || PILLAR_THEME.career;
  const xpInLevel    = Number(pillar.xp ?? 0) % 100;
  const displayStats = calculatePillarStats(pillar);
  const dark = darkMode !== false;

  const handleHover = (entering) => {
    gsap.to(cardRef.current, {
      scale: entering ? 1.015 : 1,
      boxShadow: entering ? `0 0 20px ${theme.color}25, 0 8px 24px rgba(0,0,0,0.3)` : 'none',
      duration: 0.25, ease: 'power2.out',
    });
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden cursor-pointer animate-enter pillar-${pillar.id}`}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      style={{
        animationDelay: `${index * 100}ms`,
        border: `1px solid ${theme.color}25`,
        borderRadius: '4px',
        padding: '1rem',
        background: dark ? 'rgba(13,30,54,0.9)' : 'rgba(240,244,255,0.95)',
        transition: 'box-shadow 0.25s ease',
      }}
    >
      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${theme.color}, transparent)` }} />

      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div style={{ border: `1px solid ${theme.color}50`, borderRadius: '3px', background: `${theme.color}12`, color: theme.color, padding: '6px' }}>
            <IconComp size={18} />
          </div>
          <div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', color: dark ? 'var(--sl-white)' : '#0A1628' }}>
              {pillar.title.toUpperCase()}
            </div>
            <div className="sys-label">{theme.label} · LV.{pillar.level}</div>
          </div>
        </div>

        <div className="text-right">
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: theme.color, lineHeight: 1 }}>
            {xpInLevel}
          </div>
          <div className="sys-label">/ 100 XP</div>
        </div>
      </div>

      {/* Level bar */}
      <div className="mb-4" style={{ height: '6px', background: 'rgba(10,22,40,0.8)', borderRadius: '2px', border: '1px solid rgba(78,154,254,0.08)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${xpInLevel}%`, background: `linear-gradient(90deg, ${theme.color}90, ${theme.color})`, borderRadius: '1px', boxShadow: `0 0 6px ${theme.color}60`, transition: 'width 0.6s ease-out' }} />
      </div>

      {/* Sub-stats */}
      {displayStats?.map((stat, i) => (
        <StatBar key={i} name={stat.name} value={stat.value} color={theme.color} />
      ))}

      <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b" style={{ borderColor: `${theme.color}40` }} />
    </div>
  );
};

export default PillarCard;
