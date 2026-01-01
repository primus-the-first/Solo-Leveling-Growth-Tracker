import { useState, useEffect, useCallback } from 'react';

// Get time until next reset
export const getTimeUntilReset = (resetType) => {
  const now = new Date();
  let resetTime;
  
  switch (resetType) {
    case 'daily':
      // Next midnight
      resetTime = new Date(now);
      resetTime.setDate(resetTime.getDate() + 1);
      resetTime.setHours(0, 0, 0, 0);
      break;
      
    case 'weekly': {
      // Next Monday midnight
      resetTime = new Date(now);
      const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
      resetTime.setDate(resetTime.getDate() + daysUntilMonday);
      resetTime.setHours(0, 0, 0, 0);
      break;
    }
      
    case 'monthly':
      // First day of next month
      resetTime = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
      break;
      
    default:
      resetTime = new Date(now.getTime() + 86400000);
  }
  
  return resetTime.getTime() - now.getTime();
};

// Format time remaining
export const formatTimeRemaining = (ms) => {
  if (ms <= 0) return 'Resetting...';
  
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m ${seconds}s`;
  }
};

// Hook to track quest reset timer
export const useQuestTimer = (resetType) => {
  const [timeRemaining, setTimeRemaining] = useState(() => getTimeUntilReset(resetType));
  const [shouldReset, setShouldReset] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeUntilReset(resetType);
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        setShouldReset(true);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [resetType]);
  
  const resetComplete = useCallback(() => {
    setShouldReset(false);
  }, []);
  
  return {
    timeRemaining,
    formattedTime: formatTimeRemaining(timeRemaining),
    shouldReset,
    resetComplete,
  };
};

// Check if we need to reset quests (based on last reset date)
export const shouldResetQuests = (lastResetDate, resetType) => {
  if (!lastResetDate) return true;
  
  const now = new Date();
  const lastReset = new Date(lastResetDate);
  
  switch (resetType) {
    case 'daily':
      // Reset if it's a new day
      return now.toDateString() !== lastReset.toDateString();
      
    case 'weekly': {
      // Reset if it's a new week (Monday)
      const nowWeek = getWeekNumber(now);
      const lastWeek = getWeekNumber(lastReset);
      return nowWeek !== lastWeek;
    }
      
    case 'monthly':
      // Reset if it's a new month
      return now.getMonth() !== lastReset.getMonth() || 
             now.getFullYear() !== lastReset.getFullYear();
      
    default:
      return false;
  }
};

// Get ISO week number
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

export default useQuestTimer;
