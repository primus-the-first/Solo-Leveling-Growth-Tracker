import React from 'react';

const CalendarHeatmap = ({ history }) => {
  // Generate days for the current month
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), i + 1);
    return {
      date: d.toISOString().split('T')[0],
      day: i + 1,
      isToday: d.getDate() === today.getDate(),
      entry: null // Will be filled from history
    };
  });

  return (
    <div className="glass-card p-6 rounded-2xl mb-8 animate-enter delay-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold font-display text-cyan-400 tracking-wider">
          SYSTEM LOG // {today.toLocaleString('default', { month: 'long' }).toUpperCase()}
        </h3>
        <div className="text-xs font-mono text-gray-500">
          CONSISTENCY TRACKER
        </div>
      </div>

      <div className="grid grid-cols-7 sm:grid-cols-10 gap-2">
        {days.map((d) => {
          const historyEntry = history[d.date];
          const hasActivity = historyEntry && historyEntry.xp > 0;
          
          return (
            <div
              key={d.date}
              className={`
                aspect-square rounded-md border flex items-center justify-center text-xs font-mono relative group transition-all duration-300
                ${d.isToday 
                  ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.3)]' 
                  : hasActivity
                    ? 'border-emerald-500/50 bg-emerald-500/10'
                    : 'border-gray-800 bg-gray-900/50 text-gray-700'
                }
                ${hasActivity ? 'hover:scale-110 hover:bg-emerald-500/20 cursor-pointer' : ''}
              `}
            >
              <span className={d.isToday ? 'text-cyan-300 font-bold' : hasActivity ? 'text-emerald-400' : ''}>
                {d.day}
              </span>

              {/* Tooltip */}
              {hasActivity && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-gray-900 border border-gray-700 rounded px-2 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                  {historyEntry.xp} XP Earned
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarHeatmap;
