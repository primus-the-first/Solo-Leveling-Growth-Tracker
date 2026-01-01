import { TrendingUp, Flame, Clock, Sparkles } from 'lucide-react';

const MultiplierDisplay = ({ multiplier, streakDays, darkMode = true }) => {
  // Determine multiplier tier for styling
  const getTier = () => {
    if (multiplier >= 2.0) return { tier: 'legendary', color: 'from-amber-400 to-yellow-300', glow: 'amber' };
    if (multiplier >= 1.5) return { tier: 'epic', color: 'from-purple-400 to-pink-400', glow: 'purple' };
    if (multiplier >= 1.25) return { tier: 'rare', color: 'from-cyan-400 to-blue-400', glow: 'cyan' };
    return { tier: 'common', color: 'from-gray-400 to-gray-300', glow: 'gray' };
  };
  
  const { tier, color, glow } = getTier();
  
  // Calculate bonus percentage
  const bonusPercent = Math.round((multiplier - 1) * 100);
  
  return (
    <div className={`
      relative p-4 rounded-xl overflow-hidden
      ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'}
      border ${tier === 'legendary' ? 'border-amber-500/50' : tier === 'epic' ? 'border-purple-500/50' : tier === 'rare' ? 'border-cyan-500/50' : 'border-gray-700/30'}
    `}
    style={{
      boxShadow: multiplier > 1 ? `0 0 20px rgba(${glow === 'amber' ? '251, 191, 36' : glow === 'purple' ? '168, 85, 247' : glow === 'cyan' ? '6, 182, 212' : '107, 114, 128'}, 0.2)` : 'none'
    }}
    >
      {/* Animated background for active multipliers */}
      {multiplier > 1 && (
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-5`} />
          <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" 
               style={{ animationDuration: '3s' }} />
        </div>
      )}
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            tier === 'legendary' ? 'bg-amber-500/20' :
            tier === 'epic' ? 'bg-purple-500/20' :
            tier === 'rare' ? 'bg-cyan-500/20' :
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <TrendingUp className={`w-5 h-5 ${
              tier === 'legendary' ? 'text-amber-400' :
              tier === 'epic' ? 'text-purple-400' :
              tier === 'rare' ? 'text-cyan-400' :
              'text-gray-400'
            }`} />
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${color}`}>
                {multiplier.toFixed(2)}x
              </span>
              {tier !== 'common' && (
                <Sparkles className={`w-4 h-4 ${
                  tier === 'legendary' ? 'text-amber-400' :
                  tier === 'epic' ? 'text-purple-400' :
                  'text-cyan-400'
                } animate-pulse`} />
              )}
            </div>
            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              XP Multiplier
            </span>
          </div>
        </div>
        
        {bonusPercent > 0 && (
          <div className={`text-right`}>
            <div className={`text-lg font-semibold ${
              tier === 'legendary' ? 'text-amber-400' :
              tier === 'epic' ? 'text-purple-400' :
              tier === 'rare' ? 'text-cyan-400' :
              'text-gray-400'
            }`}>
              +{bonusPercent}%
            </div>
            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Bonus XP
            </span>
          </div>
        )}
      </div>
      
      {/* Streak contribution */}
      {streakDays > 0 && (
        <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-700/50' : 'border-gray-200'} flex items-center gap-2`}>
          <Flame className="w-4 h-4 text-orange-400" />
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {streakDays} day streak active
          </span>
        </div>
      )}
    </div>
  );
};

export default MultiplierDisplay;
