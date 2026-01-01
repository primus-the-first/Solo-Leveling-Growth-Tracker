import { useRef, useEffect } from 'react';
import { Trophy, Zap, Star, Sparkles } from 'lucide-react';
import gsap from 'gsap';

// Pre-generated static particles (seeded positions for demo)
const PARTICLES = [
  { id: 0, x: 12, color: '#22d3ee', size: 8, delay: 0.1, isCircle: true },
  { id: 1, x: 25, color: '#a855f7', size: 6, delay: 0.2, isCircle: false },
  { id: 2, x: 38, color: '#f59e0b', size: 10, delay: 0.05, isCircle: true },
  { id: 3, x: 52, color: '#10b981', size: 7, delay: 0.3, isCircle: false },
  { id: 4, x: 65, color: '#ec4899', size: 9, delay: 0.15, isCircle: true },
  { id: 5, x: 78, color: '#22d3ee', size: 5, delay: 0.25, isCircle: false },
  { id: 6, x: 88, color: '#a855f7', size: 11, delay: 0.1, isCircle: true },
  { id: 7, x: 8, color: '#f59e0b', size: 6, delay: 0.35, isCircle: false },
  { id: 8, x: 42, color: '#10b981', size: 8, delay: 0.2, isCircle: true },
  { id: 9, x: 95, color: '#ec4899', size: 7, delay: 0.4, isCircle: false },
];

const LevelUpModal = ({ isVisible, level, title, xpBonus, onClose, onShow }) => {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  
  // Entrance animation
  useEffect(() => {
    if (isVisible && overlayRef.current && cardRef.current) {
      // Play sound
      onShow?.();
      
      // Overlay fade in
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
      
      // Card dramatic entrance
      gsap.fromTo(cardRef.current,
        { scale: 0.3, opacity: 0, rotateY: -180 },
        { 
          scale: 1, 
          opacity: 1, 
          rotateY: 0, 
          duration: 0.8, 
          ease: 'back.out(1.5)',
          delay: 0.2 
        }
      );
      
      // Animate particles falling
      particlesRef.current.forEach((particle, i) => {
        if (particle) {
          gsap.fromTo(particle,
            { y: -20, opacity: 1, rotation: 0 },
            { 
              y: window.innerHeight + 50, 
              opacity: 0, 
              rotation: Math.random() * 720 - 360,
              duration: 2 + Math.random() * 2,
              delay: PARTICLES[i]?.delay || 0,
              ease: 'power1.out'
            }
          );
        }
      });
    }
  }, [isVisible, onShow]);
  
  if (!isVisible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
      }}
      onClick={onClose}
    >
      {/* Confetti Particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={p.id}
          ref={el => particlesRef.current[i] = el}
          className="absolute pointer-events-none"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? '50%' : '2px',
          }}
        />
      ))}
      
      {/* Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/30 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      
      {/* Main Card */}
      <div
        ref={cardRef}
        className="relative max-w-md w-full mx-4 p-8 rounded-2xl text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 40, 0.95) 0%, rgba(20, 20, 30, 0.98) 100%)',
          border: '2px solid rgba(34, 211, 238, 0.5)',
          boxShadow: '0 0 60px rgba(34, 211, 238, 0.3), 0 0 120px rgba(168, 85, 247, 0.2)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Badge */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <div className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white font-bold text-sm uppercase tracking-widest shadow-lg">
            Level Up!
          </div>
        </div>
        
        {/* Icon */}
        <div className="mb-6 mt-4">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
            <Trophy className="w-12 h-12 text-amber-400" />
          </div>
        </div>
        
        {/* Level Number */}
        <div className="mb-4">
          <span className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 font-display">
            {level}
          </span>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-2 font-display tracking-wide">
          {title}
        </h2>
        
        <p className="text-gray-400 mb-6">
          You have grown stronger, Hunter.
        </p>
        
        {/* Rewards */}
        <div className="flex justify-center gap-4 mb-6">
          {xpBonus && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
              <Zap className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-semibold">+{xpBonus} XP</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
            <Star className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-semibold">New Title</span>
          </div>
        </div>
        
        {/* Continue Button */}
        <button
          onClick={onClose}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          style={{
            boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)',
          }}
        >
          <Sparkles className="w-5 h-5" />
          Continue
        </button>
      </div>
    </div>
  );
};

export default LevelUpModal;
