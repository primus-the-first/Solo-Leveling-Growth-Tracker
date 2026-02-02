import { useRef } from 'react';
import { Flame, Star, Brain, TrendingUp, BookOpen } from 'lucide-react';
import gsap from 'gsap';
import ProgressBar from './ProgressBar';
import { calculatePillarStats } from '../gameState';

const iconMap = {
  flame: Flame,
  star: Star,
  brain: Brain,
  'trending-up': TrendingUp,
  book: BookOpen,
};

const pillarClasses = {
  personal: 'pillar-personal',
  spiritual: 'pillar-spiritual',
  career: 'pillar-career',
  financial: 'pillar-financial',
  education: 'pillar-education',
};

const gradientMap = {
  personal: 'red-orange',
  spiritual: 'purple-pink',
  career: 'blue-cyan',
  financial: 'green-emerald',
  education: 'cyan-purple',
};

const iconColors = {
  personal: 'text-orange-400',
  spiritual: 'text-purple-400',
  career: 'text-cyan-400',
  financial: 'text-green-400',
  education: 'text-blue-400',
};

const PillarCard = ({ pillar, index, darkMode }) => {
  const cardRef = useRef(null);
  const IconComponent = iconMap[pillar.icon] || Flame;
  const currentXP = Number(pillar.xp ?? 0);

  // Calculate dynamic stats based on pillar level and XP
  const displayStats = calculatePillarStats(pillar);

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
      className={`glass-card p-6 rounded-2xl relative overflow-hidden group cursor-pointer animate-enter ${pillarClasses[pillar.id] || ''}`}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-200'} ${iconColors[pillar.id] || 'text-gray-400'}`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{pillar.title}</h3>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Level {pillar.level}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold gradient-text">{currentXP % 100}</span>
          <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>/100 XP</span>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mb-5">
        <ProgressBar 
          value={currentXP % 100} 
          maxValue={100} 
          gradient={gradientMap[pillar.id] || 'cyan-purple'}
          showLabel={false}
          height="h-3"
          darkMode={darkMode}
        />
      </div>

      {/* Individual Stats */}
      <div className="space-y-3">
        {displayStats && displayStats.map((stat, i) => (
          <div key={i}>
            <div className="flex justify-between mb-1">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.name}</span>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{stat.value}%</span>
            </div>
            <ProgressBar 
              value={stat.value} 
              maxValue={100} 
              gradient={gradientMap[pillar.id] || 'cyan-purple'}
              showLabel={false}
              height="h-1.5"
              darkMode={darkMode}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PillarCard;

