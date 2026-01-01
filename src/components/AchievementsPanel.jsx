import { useRef } from 'react';
import { Trophy, Lock, Star, Flame, Target, Zap, BookOpen, DollarSign, User2 } from 'lucide-react';
import gsap from 'gsap';

// Icon map outside component
const ICON_MAP = {
  streak: Flame,
  level: Star,
  quests: Target,
  xp: Zap,
  boss: Trophy,
  pillar_personal: User2,
  pillar_financial: DollarSign,
  pillar_education: BookOpen,
};

const AchievementCard = ({ achievement, darkMode = true }) => {
  const cardRef = useRef(null);
  
  const isUnlocked = achievement.unlocked;
  const IconComponent = ICON_MAP[achievement.category] || Trophy;
  
  // Hover animation
  const handleMouseEnter = () => {
    if (cardRef.current && isUnlocked) {
      gsap.to(cardRef.current, {
        scale: 1.05,
        duration: 0.2,
        ease: 'power2.out'
      });
    }
  };
  
  const handleMouseLeave = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out'
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative p-4 rounded-xl transition-all
        ${isUnlocked 
          ? 'bg-gradient-to-br from-amber-500/20 to-amber-900/20 border border-amber-500/40' 
          : 'bg-gray-800/30 border border-gray-700/30 opacity-50'
        }
      `}
      style={{
        boxShadow: isUnlocked ? '0 0 15px rgba(251, 191, 36, 0.2)' : 'none'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Locked overlay */}
      {!isUnlocked && (
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-xl bg-gray-900/50 z-10"
          role="status"
          aria-label="Achievement locked"
        >
          <Lock className="w-6 h-6 text-gray-500" aria-hidden="true" />
        </div>
      )}
      
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className={`
          w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
          ${isUnlocked 
            ? 'bg-amber-500/30 border border-amber-500/50' 
            : 'bg-gray-700/50 border border-gray-600/30'
          }
        `}>
          <IconComponent className={`w-6 h-6 ${isUnlocked ? 'text-amber-400' : 'text-gray-500'}`} />
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm truncate ${
            isUnlocked ? 'text-amber-300' : 'text-gray-500'
          }`}>
            {achievement.name}
          </h4>
          <p className={`text-xs truncate ${
            !isUnlocked 
              ? 'text-gray-500' 
              : darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {achievement.description}
          </p>
        </div>
      </div>
      
      {/* Progress bar for locked achievements */}
      {!isUnlocked && achievement.progress !== undefined && (
        <div className="mt-3">
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500/50 rounded-full transition-all"
              style={{ width: `${Math.min(achievement.progress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            {achievement.progress}%
          </p>
        </div>
      )}
    </div>
  );
};

const AchievementsPanel = ({ achievements, darkMode = true }) => {
  const safeAchievements = achievements || [];
  const unlockedCount = safeAchievements.filter(a => a.unlocked).length;
  
  return (
    <div className={`glass-card p-6 rounded-2xl ${darkMode ? '' : 'bg-white/80'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-amber-500/20' : 'bg-amber-100'}`}>
            <Trophy className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
          </div>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Achievements
          </h3>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
          darkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'
        }`}>
          {unlockedCount}/{safeAchievements.length}
        </div>
      </div>
      
      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {safeAchievements.map((achievement, index) => (
          <AchievementCard
            key={achievement.id || index}
            achievement={achievement}
            darkMode={darkMode}
          />
        ))}
      </div>
    </div>
  );
};

export default AchievementsPanel;
