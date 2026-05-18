import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const GRADIENT_MAP = {
  'red-orange':    { fill: 'linear-gradient(90deg, #EF4444, #F97316)', glow: 'rgba(239,68,68,0.5)'   },
  'purple-pink':   { fill: 'linear-gradient(90deg, #A855F7, #EC4899)', glow: 'rgba(168,85,247,0.5)'  },
  'blue-cyan':     { fill: 'linear-gradient(90deg, #4E9AFE, #76FFFA)', glow: 'rgba(78,154,254,0.5)'  },
  'green-emerald': { fill: 'linear-gradient(90deg, #22C55E, #4ADE80)', glow: 'rgba(34,197,94,0.5)'   },
  'cyan-purple':   { fill: 'linear-gradient(90deg, #4E9AFE, #76FFFA)', glow: 'rgba(78,154,254,0.5)'  },
};

const ProgressBar = ({ value, maxValue = 100, gradient, showLabel = true, height = 'h-2', animated = true, darkMode = true }) => {
  const barRef   = useRef(null);
  const percentage = Math.min((value / maxValue) * 100, 100);
  const theme    = GRADIENT_MAP[gradient] || GRADIENT_MAP['cyan-purple'];

  useEffect(() => {
    if (animated && barRef.current) {
      gsap.fromTo(barRef.current,
        { width: '0%' },
        { width: `${percentage}%`, duration: 1.0, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [percentage, animated]);

  const trackH = height === 'h-3' ? '12px' : height === 'h-2' ? '8px' : height === 'h-1.5' ? '6px' : '6px';

  return (
    <div className="w-full">
      <div
        style={{
          width: '100%',
          height: trackH,
          background: darkMode ? 'rgba(10,22,40,0.8)' : 'rgba(200,215,240,0.6)',
          borderRadius: '2px',
          border: darkMode ? '1px solid rgba(78,154,254,0.1)' : '1px solid rgba(78,154,254,0.15)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          ref={barRef}
          style={{
            height: '100%',
            width: animated ? '0%' : `${percentage}%`,
            background: theme.fill,
            borderRadius: '1px',
            boxShadow: `0 0 6px ${theme.glow}`,
            transition: animated ? 'none' : 'width 0.5s ease-out',
          }}
        />
      </div>

      {showLabel && (
        <div
          className="flex justify-between mt-1"
          style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '0.65rem',
            color: darkMode ? 'var(--sl-muted)' : '#64748b',
          }}
        >
          <span>{value}</span>
          <span>{maxValue}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
