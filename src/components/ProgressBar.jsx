import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const ProgressBar = ({ value, maxValue = 100, gradient, showLabel = true, height = 'h-2', animated = true, darkMode = true }) => {
  const barRef = useRef(null);
  const percentage = Math.min((value / maxValue) * 100, 100);

  useEffect(() => {
    if (animated && barRef.current) {
      gsap.fromTo(barRef.current, 
        { width: '0%' },
        { 
          width: `${percentage}%`,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.3
        }
      );
    }
  }, [percentage, animated]);

  const gradientStyles = {
    'red-orange': 'bg-gradient-to-r from-red-500 to-orange-500',
    'purple-pink': 'bg-gradient-to-r from-purple-500 to-pink-500',
    'blue-cyan': 'bg-gradient-to-r from-blue-500 to-cyan-400',
    'green-emerald': 'bg-gradient-to-r from-emerald-500 to-green-400',
    'cyan-purple': 'bg-gradient-to-r from-cyan-400 to-purple-500',
  };

  const glowStyles = {
    'red-orange': '0 0 10px rgba(239, 68, 68, 0.5), 0 0 20px rgba(249, 115, 22, 0.3)',
    'purple-pink': '0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(236, 72, 153, 0.3)',
    'blue-cyan': '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(34, 211, 238, 0.3)',
    'green-emerald': '0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(74, 222, 128, 0.3)',
    'cyan-purple': '0 0 10px rgba(34, 211, 238, 0.5), 0 0 20px rgba(168, 85, 247, 0.3)',
  };

  const trackBackground = darkMode ? 'bg-gray-800/80' : 'bg-gray-200';

  return (
    <div className="w-full">
      <div className={`w-full ${height} ${trackBackground} rounded-full overflow-hidden relative`}>
        {/* Background shimmer */}
        <div className="absolute inset-0 shimmer opacity-30" />
        
        {/* Progress fill */}
        <div 
          ref={barRef}
          className={`${height} rounded-full ${gradientStyles[gradient] || gradientStyles['cyan-purple']} relative`}
          style={{ 
            width: animated ? '0%' : `${percentage}%`,
            boxShadow: glowStyles[gradient] || glowStyles['cyan-purple'],
            transition: animated ? 'none' : 'width 0.5s ease-out'
          }}
        >
          {/* Inner glow */}
          <div className="absolute inset-0 bg-white/20 rounded-full" 
            style={{ 
              background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 50%)' 
            }} 
          />
        </div>
      </div>
      
      {showLabel && (
        <div className={`flex justify-between mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
          <span>{value}</span>
          <span>{maxValue}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;

