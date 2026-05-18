import { useEffect } from 'react';
import { SLClock, SLRefresh } from './icons/SLIcons';
import { useQuestTimer } from '../hooks/useQuestTimer';

const QuestResetTimer = ({ resetType, onReset, darkMode = true }) => {
  const { formattedTime, shouldReset, resetComplete } = useQuestTimer(resetType);
  
  // Handle reset when timer expires
  useEffect(() => {
    if (shouldReset && onReset) {
      onReset();
      resetComplete();
    }
  }, [shouldReset, onReset, resetComplete]);
  
  // Label based on type
  const labels = {
    daily: 'Daily Reset',
    weekly: 'Weekly Reset',
    monthly: 'Monthly Reset',
  };
  
  // Colors based on type
  const colors = {
    daily: 'text-cyan-400',
    weekly: 'text-purple-400',
    monthly: 'text-amber-400',
  };
  
  return (
    <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      <SLClock size={14} className={colors[resetType] || 'text-gray-400'} />
      <span>{labels[resetType] || 'Reset'} in</span>
      <span className={`font-mono font-semibold ${colors[resetType] || 'text-gray-300'}`}>
        {formattedTime}
      </span>
      {shouldReset && (
        <SLRefresh size={14} className="animate-spin" style={{ color: '#22C55E' }} />
      )}
    </div>
  );
};

export default QuestResetTimer;
