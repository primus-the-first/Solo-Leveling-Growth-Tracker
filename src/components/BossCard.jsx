import { useRef } from 'react';
import { Skull, Zap, Trophy, Lock, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';

const BossCard = ({ boss, playerLevel, onChallenge, darkMode = true }) => {
  const cardRef = useRef(null);
  
  const isUnlocked = playerLevel >= boss.levelRequired;
  const isDefeated = boss.defeated;
  
  // Hover animation
  const handleMouseEnter = () => {
    if (cardRef.current && isUnlocked && !isDefeated) {
      gsap.to(cardRef.current, {
        scale: 1.02,
        boxShadow: '0 0 40px rgba(239, 68, 68, 0.4)',
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };
  
  const handleMouseLeave = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1,
        boxShadow: isDefeated 
          ? '0 0 20px rgba(74, 222, 128, 0.2)' 
          : '0 0 20px rgba(239, 68, 68, 0.2)',
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative p-5 rounded-2xl transition-all duration-300
        ${isDefeated 
          ? 'bg-gradient-to-br from-green-900/30 to-gray-900/50 border border-green-500/30' 
          : isUnlocked 
            ? 'bg-gradient-to-br from-red-900/30 to-gray-900/50 border border-red-500/30' 
            : 'bg-gray-900/50 border border-gray-700/30 opacity-60'
        }
      `}
      style={{
        boxShadow: isDefeated 
          ? '0 0 20px rgba(74, 222, 128, 0.2)' 
          : isUnlocked 
            ? '0 0 20px rgba(239, 68, 68, 0.2)' 
            : 'none'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Status Badge */}
      <div className="absolute -top-2 -right-2">
        {isDefeated ? (
          <div className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            DEFEATED
          </div>
        ) : !isUnlocked ? (
          <div className="px-3 py-1 bg-gray-600 text-gray-300 text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
            <Lock className="w-3 h-3" />
            LV.{boss.levelRequired}
          </div>
        ) : null}
      </div>
      
      <div className="flex items-start gap-4">
        {/* Boss Icon */}
        <div className={`
          w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0
          ${isDefeated 
            ? 'bg-green-500/20 border border-green-500/30' 
            : isUnlocked 
              ? 'bg-red-500/20 border border-red-500/30' 
              : 'bg-gray-700/50 border border-gray-600/30'
          }
        `}>
          <Skull className={`w-8 h-8 ${
            isDefeated ? 'text-green-400' : isUnlocked ? 'text-red-400' : 'text-gray-500'
          }`} />
        </div>
        
        {/* Boss Info */}
        <div className="flex-1">
          <h3 className={`font-bold text-lg mb-1 ${
            isDefeated ? 'text-green-300 line-through' : isUnlocked ? 'text-red-300' : 'text-gray-500'
          }`}>
            {boss.name}
          </h3>
          <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {boss.description}
          </p>
          
          {/* Rewards */}
          <div className="flex flex-wrap gap-2">
            <div className={`
              flex items-center gap-1 px-2 py-1 rounded-lg text-xs
              ${isDefeated 
                ? 'bg-green-500/20 text-green-300' 
                : 'bg-amber-500/20 text-amber-300'
              }
            `}>
              <Zap className="w-3 h-3" />
              +{boss.xpReward} XP
            </div>
            {boss.titleReward && (
              <div className={`
                flex items-center gap-1 px-2 py-1 rounded-lg text-xs
                ${isDefeated 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-purple-500/20 text-purple-300'
                }
              `}>
                <Trophy className="w-3 h-3" />
                {boss.titleReward}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Challenge Button */}
      {isUnlocked && !isDefeated && (
        <button
          onClick={() => onChallenge?.(boss)}
          className="w-full mt-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-lg hover:from-red-500 hover:to-orange-400 transition-all"
        >
          ⚔️ Challenge Boss
        </button>
      )}
    </div>
  );
};

export default BossCard;
