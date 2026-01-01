import { useRef } from 'react';
import { Trophy, Flame, Zap, Lock, Unlock, Target, Star, TrendingUp, BookOpen } from 'lucide-react';

const StatsPanel = ({ player, pillars, achievements, darkMode = true }) => {
  const containerRef = useRef(null);
  const achievementsRef = useRef([]);
  const milestonesRef = useRef([]);

  // Player stats for display
  const playerStats = [
    { label: 'Total XP Earned', value: player.totalXP.toLocaleString(), icon: Zap },
    { label: 'Current Level', value: player.level, icon: TrendingUp },
    { label: 'Current Streak', value: `${player.streaks.daily} days`, icon: Flame },
    { label: 'Longest Streak', value: `${player.streaks.longestDaily} days`, icon: Trophy },
  ];

  // Dynamic milestones based on actual progress
  const milestones = [
    { label: '7-Day Streak', unlocked: player.streaks.daily >= 7 || player.streaks.longestDaily >= 7 },
    { label: '30-Day Streak', unlocked: player.streaks.daily >= 30 || player.streaks.longestDaily >= 30 },
    { label: 'Level 5 Reached', unlocked: player.level >= 5 },
    { label: 'Level 10 Reached', unlocked: player.level >= 10 },
    { label: '1000 XP Earned', unlocked: player.totalXP >= 1000 },
    { label: '10000 XP Earned', unlocked: player.totalXP >= 10000 },
  ];

  // Pillar icons
  const pillarIcons = {
    personal: Flame,
    spiritual: Star,
    financial: TrendingUp,
    career: Target,
    education: BookOpen,
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Player Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {playerStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className={`glass-card p-4 rounded-xl text-center animate-enter ${
                darkMode ? '' : 'bg-white/80'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <IconComponent className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
              <div className={`text-2xl font-bold ${darkMode ? 'gradient-text' : 'text-gray-900'}`}>
                {stat.value}
              </div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar Levels */}
        <div className={`glass-card p-6 rounded-2xl animate-enter ${darkMode ? '' : 'bg-white/80'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
              <Target className={`w-6 h-6 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
            </div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Pillar Levels</h3>
          </div>

          <div className="space-y-3">
            {pillars.map((pillar, index) => {
              const IconComponent = pillarIcons[pillar.id] || Star;
              return (
                <div
                  key={pillar.id}
                  ref={el => achievementsRef.current[index] = el}
                  className={`flex items-center justify-between p-3 rounded-xl transition-colors duration-300 animate-enter ${
                    darkMode ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={{ animationDelay: `${index * 100 + 200}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-5 h-5 ${
                      pillar.id === 'personal' ? 'text-orange-400' :
                      pillar.id === 'spiritual' ? 'text-purple-400' :
                      pillar.id === 'financial' ? 'text-green-400' :
                      pillar.id === 'career' ? 'text-cyan-400' :
                      'text-blue-400'
                    }`} />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{pillar.title}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold gradient-text">Lv.{pillar.level}</span>
                    <span className={`text-sm ml-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {pillar.xp % 100}/100 XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestones Section */}
        <div className={`glass-card p-6 rounded-2xl animate-enter delay-200 ${darkMode ? '' : 'bg-white/80'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
              <Star className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Milestones</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                ref={el => milestonesRef.current[index] = el}
                className={`
                  p-4 rounded-xl text-center transition-all duration-300 animate-enter
                  ${milestone.unlocked 
                    ? darkMode 
                      ? 'bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30' 
                      : 'bg-gradient-to-br from-purple-100 to-cyan-100 border border-purple-300'
                    : darkMode
                      ? 'bg-gray-800/50 border border-gray-700/30 opacity-50'
                      : 'bg-gray-100 border border-gray-200 opacity-50'
                  }
                `}
                style={{ animationDelay: `${index * 100 + 400}ms` }}
              >
                <div className="mb-2">
                  {milestone.unlocked ? (
                    <Unlock className={`w-6 h-6 mx-auto ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  ) : (
                    <Lock className={`w-6 h-6 mx-auto ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  )}
                </div>
                <span className={`text-sm ${milestone.unlocked ? (darkMode ? 'text-white' : 'text-gray-900') : (darkMode ? 'text-gray-500' : 'text-gray-400')}`}>
                  {milestone.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      {achievements && achievements.length > 0 && (
        <div className={`glass-card p-6 rounded-2xl animate-enter ${darkMode ? '' : 'bg-white/80'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
              <Trophy className={`w-6 h-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            </div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Achievements</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`
                  p-4 rounded-xl text-center transition-all duration-300
                  ${achievement.unlocked 
                    ? darkMode 
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
                      : 'bg-gradient-to-br from-yellow-100 to-orange-100 border border-yellow-300'
                    : darkMode
                      ? 'bg-gray-800/50 border border-gray-700/30 opacity-50'
                      : 'bg-gray-100 border border-gray-200 opacity-50'
                  }
                `}
              >
                <div className="mb-2 text-2xl">
                  {achievement.unlocked ? '🏆' : '🔒'}
                </div>
                <div className={`font-semibold text-sm ${achievement.unlocked ? (darkMode ? 'text-white' : 'text-gray-900') : (darkMode ? 'text-gray-500' : 'text-gray-400')}`}>
                  {achievement.name}
                </div>
                <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  +{achievement.xp} XP
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPanel;
