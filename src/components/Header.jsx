import { useLayoutEffect, useRef } from 'react';
import { Sparkles, Zap, Sun, Moon, Settings } from 'lucide-react';
import gsap from 'gsap';

const Header = ({ darkMode, setDarkMode, onOpenSettings }) => {
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
      {/* Theme Toggle Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`
          absolute top-4 right-4 z-50 p-3 rounded-xl 
          ${darkMode 
            ? 'bg-gray-800/80 border-gray-600 hover:bg-gray-700' 
            : 'bg-white/80 border-gray-300 hover:bg-gray-100'
          }
          border shadow-lg backdrop-blur-sm
          transition-all duration-300 hover:scale-110 
          cursor-pointer
        `}
        aria-label="Toggle theme"
      >
        {darkMode ? (
          <Sun className="w-6 h-6 text-amber-400" />
        ) : (
          <Moon className="w-6 h-6 text-blue-500" />
        )}
      </button>

      {/* Settings Button */}
      <button
        onClick={onOpenSettings}
        className={`
          absolute top-4 left-4 z-50 p-3 rounded-xl 
          ${darkMode 
            ? 'bg-gray-800/80 border-gray-600 hover:bg-gray-700' 
            : 'bg-white/80 border-gray-300 hover:bg-gray-100'
          }
          border shadow-lg backdrop-blur-sm
          transition-all duration-300 hover:scale-110 
          cursor-pointer
        `}
        aria-label="Open settings"
      >
        <Settings className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
      </button>

      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Main Title */}
      <h1 
        ref={titleRef}
        className="font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-wider mb-3 gradient-text animate-enter"
        style={{ fontFamily: 'Cinzel, serif' }}
      >
        PRIMUS AETERNUS
      </h1>
      
      {/* Subtitle */}
      <p 
        ref={subtitleRef}
        className={`text-lg md:text-xl tracking-widest mb-6 flex items-center justify-center gap-2 animate-enter delay-200 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}
      >
        <Sparkles className={`w-5 h-5 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
        2026 Growth System
        <Sparkles className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
      </p>
      
      {/* Level Badge */}
      <div 
        ref={badgeRef}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm animate-enter delay-300 ${
          darkMode 
            ? 'bg-gray-900/50 border-cyan-500/30' 
            : 'bg-white/70 border-cyan-500/50 shadow-md'
        }`}
      >
        <Zap className={`w-4 h-4 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
        <span className={darkMode ? 'text-cyan-300' : 'text-cyan-700 font-medium'}>Level 1</span>
        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>-</span>
        <span className={darkMode ? 'text-purple-300' : 'text-purple-700 font-medium'}>Awakened Hunter</span>
        <Zap className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
      </div>
    </header>
  );
};

export default Header;
