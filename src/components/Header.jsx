import { useLayoutEffect, useRef } from 'react';
import { Sparkles, Zap } from 'lucide-react';
import gsap from 'gsap';

const Header = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const badgeRef = useRef(null);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Continuous glow pulse on badge
      gsap.to(badgeRef.current, {
        boxShadow: '0 0 30px rgba(34, 211, 238, 0.5), 0 0 60px rgba(168, 85, 247, 0.3)',
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: 'sine.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={containerRef} className="text-center py-8 px-4 relative">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Main Title */}
      <h1 
        ref={titleRef}
        className="font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-wider mb-3 gradient-text animate-enter"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        PRIMUS AETERNUS
      </h1>
      
      {/* Subtitle */}
      <p 
        ref={subtitleRef}
        className="text-gray-400 text-lg md:text-xl tracking-widest mb-6 flex items-center justify-center gap-2 animate-enter delay-200"
      >
        <Sparkles className="w-5 h-5 text-cyan-400" />
        2026 Growth System
        <Sparkles className="w-5 h-5 text-purple-400" />
      </p>
      
      {/* Level Badge */}
      <div 
        ref={badgeRef}
        className="inline-flex items-center gap-2 level-badge animate-enter delay-300"
      >
        <Zap className="w-4 h-4 text-cyan-400" />
        <span className="text-cyan-300">Level 1</span>
        <span className="text-gray-400">-</span>
        <span className="text-purple-300">Awakened Hunter</span>
        <Zap className="w-4 h-4 text-purple-400" />
      </div>
    </header>
  );
};

export default Header;
