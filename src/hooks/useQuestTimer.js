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
      const daysUntilMonday = now.getDay() === 1 ? 7 : (8 - now.getDay()) % 7;
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
  const [prevResetType, setPrevResetType] = useState(resetType);
  const [timeRemaining, setTimeRemaining] = useState(() => getTimeUntilReset(resetType));
  const [shouldReset, setShouldReset] = useState(false);
  
  if (resetType !== prevResetType) {
    setPrevResetType(resetType);
    setTimeRemaining(getTimeUntilReset(resetType));
    setShouldReset(false);
  }
  
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
  
  // Normalize comparisons to UTC
  switch (resetType) {
    case 'daily':
      return now.getUTCFullYear() !== lastReset.getUTCFullYear() ||
             now.getUTCMonth() !== lastReset.getUTCMonth() ||
             now.getUTCDate() !== lastReset.getUTCDate();
      
    case 'weekly': {
      const nowISO = getISOInfo(now);
      const lastISO = getISOInfo(lastReset);
      return nowISO.week !== lastISO.week || nowISO.year !== lastISO.year;
    }
      
    case 'monthly':
      return now.getUTCFullYear() !== lastReset.getUTCFullYear() ||
             now.getUTCMonth() !== lastReset.getUTCMonth();
      
    default:
      return false;
  }
};

// Get ISO week number and year (UTC)
const getISOInfo = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const year = d.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return { week, year };
};

export default useQuestTimer;
