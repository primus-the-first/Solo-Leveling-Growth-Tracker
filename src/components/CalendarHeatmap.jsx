import React from 'react';

const CalendarHeatmap = ({ history, darkMode }) => {
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
        <h3 className={`text-xl font-bold font-display tracking-wider ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
          SYSTEM LOG // {today.toLocaleString('default', { month: 'long' }).toUpperCase()}
        </h3>
        <div className={`text-xs font-mono ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
          CONSISTENCY TRACKER
        </div>
      </div>

      <div className="grid grid-cols-7 sm:grid-cols-10 gap-2">
        {days.map((d) => {
          const historyEntry = history[d.date];
          const hasActivity = historyEntry && historyEntry.xp > 0;
          
          // Apply styles based on darkMode
          let boxClasses = darkMode 
            ? 'border-gray-700 bg-gray-800/50 text-gray-600' 
            : 'border-gray-300 bg-gray-100 text-gray-500';
          let textClasses = '';
          
          if (d.isToday) {
            boxClasses = 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.3)]';
            textClasses = darkMode ? 'text-cyan-300 font-bold' : 'text-cyan-600 font-bold';
          } else if (hasActivity) {
            boxClasses = 'border-emerald-500/50 bg-emerald-500/10';
            textClasses = darkMode ? 'text-emerald-400' : 'text-emerald-600';
          }
          
          return (
            <div
              key={d.date}
              className={`
                aspect-square rounded-md border flex items-center justify-center text-xs font-mono relative group transition-all duration-300
                ${boxClasses}
                ${hasActivity ? 'hover:scale-110 hover:bg-emerald-500/20 cursor-pointer' : ''}
              `}
            >
              <span className={textClasses}>
                {d.day}
              </span>

              {/* Tooltip */}
              {hasActivity && (
                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max rounded px-2 py-1 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl ${
                  darkMode ? 'bg-gray-900 border border-gray-700 text-white' : 'bg-white border border-gray-200 text-gray-800'
                }`}>
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


