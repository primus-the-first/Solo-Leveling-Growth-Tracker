import { useRef } from 'react';
import gsap from 'gsap';
import { SLQuestBox, SLQuestDone } from './icons/SLIcons';

const VARIANT = {
  daily: {
    doneColor:  '#22C55E',
    glow:       '0 0 16px rgba(34,197,94,0.35)',
    badgeBg:    'rgba(34,197,94,0.12)',
    badgeBorder:'rgba(34,197,94,0.4)',
    badgeText:  '#22C55E',
  },
  weekly: {
    doneColor:  '#A855F7',
    glow:       '0 0 16px rgba(168,85,247,0.35)',
    badgeBg:    'rgba(168,85,247,0.12)',
    badgeBorder:'rgba(168,85,247,0.4)',
    badgeText:  '#A855F7',
  },
  monthly: {
    doneColor:  '#F59E0B',
    glow:       '0 0 16px rgba(245,158,11,0.35)',
    badgeBg:    'rgba(245,158,11,0.12)',
    badgeBorder:'rgba(245,158,11,0.4)',
    badgeText:  '#F59E0B',
  },
};

const QuestItem = ({ quest, onToggle, variant = 'daily', darkMode = true }) => {
  const itemRef  = useRef(null);
  const checkRef = useRef(null);
  const v = VARIANT[variant] || VARIANT.daily;

  const handleClick = () => {
    if (!quest.completed) {
      gsap.fromTo(checkRef.current,
        { scale: 0, rotation: -90 },
        { scale: 1, rotation: 0, duration: 0.35, ease: 'back.out(2)' }
      );
      gsap.to(itemRef.current, {
        boxShadow: v.glow, duration: 0.25, yoyo: true, repeat: 1,
      });
    } else {
      gsap.to(checkRef.current, { scale: 0, duration: 0.18, ease: 'power2.in' });
    }
    onToggle(quest.id);
  };

  return (
    <div
      ref={itemRef}
      onClick={handleClick}
      className={`quest-item group ${quest.completed ? `completed ${variant}` : ''}`}
      style={{ boxShadow: quest.completed ? v.glow : 'none' }}
    >
      {/* Checkbox icon */}
      <div ref={checkRef} className="flex-shrink-0">
        {quest.completed
          ? <SLQuestDone size={22} style={{ color: v.doneColor }} />
          : <SLQuestBox  size={22} style={{ color: darkMode ? '#2B5080' : '#94A3B8' }}
              className="group-hover:!text-[var(--sl-blue)] transition-colors" />
        }
      </div>

      {/* Task text */}
      <span
        className="flex-1 text-sm transition-all duration-200"
        style={{
          color: quest.completed
            ? 'var(--sl-muted)'
            : darkMode ? 'var(--sl-white)' : '#1e293b',
          textDecoration: quest.completed ? 'line-through' : 'none',
          fontFamily: 'Rajdhani, sans-serif',
          fontWeight: 500,
          letterSpacing: '0.02em',
        }}
      >
        {quest.task}
      </span>

      {/* Pillar tag */}
      {quest.pillar && (
        <span
          className="text-xs px-1.5 py-0.5 hidden sm:inline"
          style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '0.6rem',
            color: 'var(--sl-muted)',
            border: '1px solid rgba(78,154,254,0.15)',
            borderRadius: '2px',
          }}
        >
          {quest.pillar.toUpperCase()}
        </span>
      )}

      {/* XP badge */}
      <div
        className="xp-badge flex-shrink-0"
        style={quest.completed ? {
          background: v.badgeBg,
          borderColor: v.badgeBorder,
          color: v.badgeText,
        } : {}}
      >
        +{quest.xp} XP
      </div>
    </div>
  );
};

export default QuestItem;
