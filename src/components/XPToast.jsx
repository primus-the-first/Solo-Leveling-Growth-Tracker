import { useRef, useEffect } from 'react';
import { Zap, TrendingUp, Flame, Star, Gift } from 'lucide-react';
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
  const getStyles = () => {
    switch (type) {
      case 'streak':
        return {
          icon: Flame,
          bg: 'from-orange-500/20 to-red-500/20',
          border: 'border-orange-500/50',
          text: 'text-orange-400',
        };
      case 'achievement':
        return {
          icon: Star,
          bg: 'from-amber-500/20 to-yellow-500/20',
          border: 'border-amber-500/50',
          text: 'text-amber-400',
        };
      case 'bonus':
        return {
          icon: Gift,
          bg: 'from-purple-500/20 to-pink-500/20',
          border: 'border-purple-500/50',
          text: 'text-purple-400',
        };
      case 'multiplier':
        return {
          icon: TrendingUp,
          bg: 'from-green-500/20 to-emerald-500/20',
          border: 'border-green-500/50',
          text: 'text-green-400',
        };
      default: // quest
        return {
          icon: Zap,
          bg: 'from-cyan-500/20 to-blue-500/20',
          border: 'border-cyan-500/50',
          text: 'text-cyan-400',
        };
    }
  };
  
  const styles = getStyles();
  const IconComponent = styles.icon;
  
  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div
      ref={toastRef}
      className={`fixed ${positionClasses[position] || positionClasses['top-right']} z-[150] pointer-events-none`}
      style={style}
    >
      <div className={`
        px-5 py-3 rounded-xl 
        bg-gradient-to-r ${styles.bg} 
        border ${styles.border}
        backdrop-blur-md
        shadow-lg
        flex items-center gap-3
      `}>
        <IconComponent className={`w-6 h-6 ${styles.text}`} />
        <div>
          <span className={`text-2xl font-bold ${styles.text}`}>
            +{xp} XP
          </span>
          {pillar && (
            <span className="text-xs text-gray-400 ml-2 uppercase tracking-wider">
              {pillar}
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
