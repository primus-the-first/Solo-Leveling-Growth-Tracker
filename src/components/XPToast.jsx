import { useRef, useEffect } from 'react';
import { SLZap, SLTrend, SLFlame, SLCrystal, SLGift } from './icons/SLIcons';
import gsap from 'gsap';

const XPToast = ({ xp, type = 'quest', pillar, onComplete, position = 'top-right', style }) => {
  const toastRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  
  // Keep callback ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  
  // Animation
  useEffect(() => {
    if (toastRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (typeof onCompleteRef.current === 'function') {
            setTimeout(() => onCompleteRef.current(), 500);
          }
        }
      });
      
      // Slide in with spring
      tl.fromTo(toastRef.current,
        { x: 100, opacity: 0, scale: 0.8 },
        { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }
      );
      
      // Hold
      tl.to(toastRef.current, { duration: 1.5 });
      
      // Float up and fade out
      tl.to(toastRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in'
      });
    }
  }, []);
  
  // Get icon and colors based on type
  const TOAST_STYLES = {
    streak:     { Icon: SLFlame,   color: '#F97316', bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.4)'  },
    achievement:{ Icon: SLCrystal, color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)' },
    bonus:      { Icon: SLGift,    color: '#A855F7', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.4)' },
    multiplier: { Icon: SLTrend,   color: '#22C55E', bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.4)'  },
    quest:      { Icon: SLZap,     color: '#4E9AFE', bg: 'rgba(78,154,254,0.12)', border: 'rgba(78,154,254,0.4)' },
  };

  const { Icon, color, bg, border } = TOAST_STYLES[type] || TOAST_STYLES.quest;

  const positionClasses = {
    'top-right':    'top-4 right-4',
    'top-left':     'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left':  'bottom-4 left-4',
  };

  return (
    <div
      ref={toastRef}
      className={`fixed ${positionClasses[position] || positionClasses['top-right']} z-[150] pointer-events-none`}
      style={style}
    >
      <div
        className="flex items-center gap-3 px-4 py-2.5"
        style={{
          background: bg,
          border: `1px solid ${border}`,
          borderLeft: `3px solid ${color}`,
          borderRadius: '3px',
          boxShadow: `0 0 20px ${color}25`,
        }}
      >
        <Icon size={20} style={{ color, flexShrink: 0 }} />
        <div>
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.1rem', fontWeight: 700, color }}>
            +{xp} XP
          </span>
          {pillar && (
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.65rem', color: 'var(--sl-muted)', marginLeft: '0.5rem', letterSpacing: '0.1em' }}>
              {pillar.toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Container to manage multiple toasts
export const XPToastContainer = ({ toasts, onRemoveToast }) => {
  return (
    <>
      {toasts.map((toast, index) => (
        <XPToast
          key={toast.id}
          xp={toast.xp}
          type={toast.type}
          pillar={toast.pillar}
          position={toast.position}
          style={{ 
            ...toast.style, 
            transform: `translateY(${index * 70}px) ${toast.style?.transform || ''}`.trim() 
          }}
          onComplete={() => onRemoveToast(toast.id)}
        />
      ))}
    </>
  );
};

export default XPToast;
