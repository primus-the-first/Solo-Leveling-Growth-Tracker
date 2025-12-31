import { useRef, useLayoutEffect } from 'react';
import { Flame, Star, Brain, TrendingUp } from 'lucide-react';
import gsap from 'gsap';
import ProgressBar from './ProgressBar';

const iconMap = {
  flame: Flame,
  star: Star,
  brain: Brain,
  'trending-up': TrendingUp,
};

const pillarClasses = {
  personal: 'pillar-personal',
  spiritual: 'pillar-spiritual',
  career: 'pillar-career',
  financial: 'pillar-financial',
};

const gradientMap = {
  personal: 'red-orange',
  spiritual: 'purple-pink',
  career: 'blue-cyan',
  financial: 'green-emerald',
};

const iconColors = {
  personal: 'text-orange-400',
  spiritual: 'text-purple-400',
  career: 'text-cyan-400',
  financial: 'text-green-400',
};

const PillarCard = ({ pillar, index }) => {
  const cardRef = useRef(null);
  const IconComponent = iconMap[pillar.icon] || Flame;

  // Removed broken GSAP animation
  // useLayoutEffect(() => { ... }, [index]);

  const handleHover = (isHovering) => {
    gsap.to(cardRef.current, {
      scale: isHovering ? 1.02 : 1,
      boxShadow: isHovering 
        ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
        : 'none',
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  return (
    <div
      ref={cardRef}
      className={`glass-card p-6 rounded-2xl relative overflow-hidden group cursor-pointer animate-enter ${pillarClasses[pillar.type]}`}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gray-800/50 ${iconColors[pillar.type]}`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">{pillar.title}</h3>
            <p className="text-xs text-gray-500">Level {pillar.level}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold gradient-text">{pillar.xp}</span>
          <span className="text-gray-500 text-sm">/100 XP</span>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mb-5">
        <ProgressBar 
          value={pillar.xp} 
          maxValue={100} 
          gradient={gradientMap[pillar.type]}
          showLabel={false}
          height="h-3"
        />
      </div>

      {/* Individual Stats */}
      <div className="space-y-3">
        {pillar.stats.map((stat, i) => (
          <div key={i}>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-400">{stat.name}</span>
              <span className="text-sm font-medium text-gray-300">{stat.value}%</span>
            </div>
            <ProgressBar 
              value={stat.value} 
              maxValue={100} 
              gradient={gradientMap[pillar.type]}
              showLabel={false}
              height="h-1.5"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PillarCard;
