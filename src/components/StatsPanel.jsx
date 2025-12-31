import { useLayoutEffect, useRef } from 'react';
import { Trophy, Flame, Zap, Lock, Unlock, Target, Star, Briefcase, Coins } from 'lucide-react';
import gsap from 'gsap';

const StatsPanel = ({ stats }) => {
  const containerRef = useRef(null);
  const achievementsRef = useRef([]);
  const milestonesRef = useRef([]);

  /* Removed broken GSAP animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
    }, containerRef);
    return () => ctx.revert();
  }, []);
  */

  const achievements = [
    { label: 'Days Completed', value: stats.daysCompleted, max: 365, icon: Target },
    { label: 'Total XP Earned', value: stats.totalXP, icon: Zap },
    { label: 'Longest Streak', value: `${stats.longestStreak} days`, icon: Flame },
  ];

  const milestones = [
    { label: '30-Day Streak', unlocked: stats.longestStreak >= 30 },
    { label: 'First Project Complete', unlocked: false },
    { label: 'GHC 5,000 Earned', unlocked: false },
    { label: 'Level 10 Reached', unlocked: false },
    { label: 'All Pillars Level 5', unlocked: false },
    { label: '2026 Master', unlocked: false },
  ];

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Achievements Section */}
      <div className="glass-card p-6 rounded-2xl animate-enter">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-yellow-500/20">
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Achievements</h3>
        </div>

        <div className="space-y-4">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <div 
                key={index}
                ref={el => achievementsRef.current[index] = el}
                className="stat-card flex items-center justify-between group hover:bg-gray-800/80 transition-colors duration-300 animate-enter"
                style={{ animationDelay: `${index * 100 + 200}ms` }}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5 text-cyan-400" />
                  <span className="text-gray-300">{achievement.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold gradient-text">{achievement.value}</span>
                  {achievement.max && (
                    <span className="text-gray-500 text-sm">/{achievement.max}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestones Section */}
      <div className="glass-card p-6 rounded-2xl animate-enter delay-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Star className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Milestones</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              ref={el => milestonesRef.current[index] = el}
              className={`
                p-4 rounded-xl text-center transition-colors duration-300 animate-enter
                ${milestone.unlocked 
                  ? 'bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30' 
                  : 'bg-gray-800/50 border border-gray-700/30 opacity-50'
                }
              `}
              style={{ animationDelay: `${index * 100 + 400}ms` }}
            >
              <div className="mb-2">
                {milestone.unlocked ? (
                  <Unlock className="w-6 h-6 text-purple-400 mx-auto" />
                ) : (
                  <Lock className="w-6 h-6 text-gray-500 mx-auto" />
                )}
              </div>
              <span className={`text-sm ${milestone.unlocked ? 'text-white' : 'text-gray-500'}`}>
                {milestone.label}
              </span>
              {!milestone.unlocked && (
                <span className="block text-lg mt-1">🔒</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
