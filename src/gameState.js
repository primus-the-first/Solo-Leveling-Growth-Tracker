// Game State Configuration and Utilities
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Level progression thresholds
export const LEVEL_THRESHOLDS = [
  { level: 1, xpRequired: 0, title: 'Awakened Hunter' },
  { level: 2, xpRequired: 100, title: 'E-Rank Hunter' },
  { level: 3, xpRequired: 300, title: 'D-Rank Hunter' },
  { level: 4, xpRequired: 700, title: 'C-Rank Hunter' },
  { level: 5, xpRequired: 1400, title: 'B-Rank Hunter' },
  { level: 6, xpRequired: 2400, title: 'B-Rank Hunter' },
  { level: 7, xpRequired: 3700, title: 'B-Rank Hunter' },
  { level: 8, xpRequired: 5300, title: 'A-Rank Hunter' },
  { level: 9, xpRequired: 7200, title: 'A-Rank Hunter' },
  { level: 10, xpRequired: 10000, title: 'A-Rank Hunter' },
  { level: 11, xpRequired: 13000, title: 'A-Rank Hunter' },
  { level: 12, xpRequired: 16000, title: 'A-Rank Hunter' },
  { level: 13, xpRequired: 19000, title: 'A-Rank Hunter' },
  { level: 14, xpRequired: 22000, title: 'A-Rank Hunter' },
  { level: 15, xpRequired: 25000, title: 'S-Rank Hunter' },
  { level: 16, xpRequired: 30000, title: 'S-Rank Hunter' },
  { level: 17, xpRequired: 35000, title: 'S-Rank Hunter' },
  { level: 18, xpRequired: 40000, title: 'S-Rank Hunter' },
  { level: 19, xpRequired: 45000, title: 'S-Rank Hunter' },
  { level: 20, xpRequired: 50000, title: 'National Hunter' },
  { level: 21, xpRequired: 60000, title: 'National Hunter' },
  { level: 22, xpRequired: 70000, title: 'National Hunter' },
  { level: 23, xpRequired: 80000, title: 'National Hunter' },
  { level: 24, xpRequired: 90000, title: 'National Hunter' },
  { level: 25, xpRequired: 100000, title: 'Shadow Monarch' },
];

// Calculate level from total XP
export const calculateLevel = (totalXP) => {
  let level = 1;
  let title = 'Awakened Hunter';
  
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i].xpRequired) {
      level = LEVEL_THRESHOLDS[i].level;
      title = LEVEL_THRESHOLDS[i].title;
      break;
    }
  }
  
  return { level, title };
};

// Get XP required for next level
export const getNextLevelXP = (currentLevel) => {
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (LEVEL_THRESHOLDS[i].level > currentLevel) {
      return LEVEL_THRESHOLDS[i].xpRequired;
    }
  }
  return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].xpRequired;
};

// Get current level XP threshold
export const getCurrentLevelXP = (currentLevel) => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (LEVEL_THRESHOLDS[i].level <= currentLevel) {
      return LEVEL_THRESHOLDS[i].xpRequired;
    }
  }
  return 0;
};

// Initial player state
export const DEFAULT_PLAYER = {
  name: 'Primus',
  level: 1,
  totalXP: 0,
  title: 'Awakened Hunter',
  avatar: 'hunter-1',
  xpMultiplier: 1.0,
  streaks: {
    daily: 0,
    weekly: 0,
    longestDaily: 0,
  },
  penalties: {
    active: false,
    type: null, // 'warning' | 'xp_reduction' | 'penalty_zone'
    missedDays: 0,
    xpReduction: 0,
  },
  skillPoints: {
    personal: 0,
    spiritual: 0,
    financial: 0,
    career: 0,
    education: 0,
  },
  realLifeRewards: [],
};

// Initial pillars state
export const DEFAULT_PILLARS = {
  personal: {
    id: 'personal',
    title: 'Personal & Discipline',
    icon: 'flame',
    color: 'orange',
    level: 1,
    xp: 0,
    xpBonus: 0,
    stats: [
      { name: 'Self Control', value: 45 },
      { name: 'Daily Discipline', value: 30 },
      { name: 'Habit Strength', value: 25 },
    ],
  },
  spiritual: {
    id: 'spiritual',
    title: 'Spiritual Growth',
    icon: 'star',
    color: 'purple',
    level: 1,
    xp: 0,
    xpBonus: 0,
    stats: [
      { name: 'Inner Peace', value: 35 },
      { name: 'Courage', value: 40 },
      { name: 'Wisdom', value: 30 },
    ],
  },
  financial: {
    id: 'financial',
    title: 'Financial Freedom',
    icon: 'trending-up',
    color: 'green',
    level: 1,
    xp: 0,
    xpBonus: 0,
    stats: [
      { name: 'Income', value: 20 },
      { name: 'Savings', value: 15 },
      { name: 'Investment', value: 10 },
    ],
  },
  career: {
    id: 'career',
    title: 'Career & Skills',
    icon: 'brain',
    color: 'cyan',
    level: 1,
    xp: 0,
    xpBonus: 0,
    stats: [
      { name: 'Web Dev', value: 50 },
      { name: 'AI/ML', value: 35 },
      { name: 'Data Analysis', value: 40 },
    ],
  },
  education: {
    id: 'education',
    title: 'Education & Knowledge',
    icon: 'book',
    color: 'blue',
    level: 1,
    xp: 0,
    xpBonus: 0,
    stats: [
      { name: 'Books Read', value: 10 },
      { name: 'Courses Completed', value: 5 },
      { name: 'Skills Acquired', value: 15 },
    ],
  },
};

// Default quests
export const DEFAULT_DAILY_QUESTS = [
  { id: 1, task: 'Read 10-20 pages', xp: 20, pillar: 'personal', completed: false },
  { id: 2, task: 'Prayer/Reflection 5-10 min', xp: 10, pillar: 'spiritual', completed: false },
  { id: 3, task: 'Skill Practice 30-60 min', xp: 20, pillar: 'career', completed: false },
  { id: 4, task: 'Track Spending', xp: 30, pillar: 'financial', completed: false },
  { id: 5, task: 'Discipline Act (avoid distractions)', xp: 15, pillar: 'personal', completed: false },
];

export const DEFAULT_WEEKLY_QUESTS = [
  { id: 1, task: 'Read 30-50 pages', xp: 50, pillar: 'personal', completed: false },
  { id: 2, task: 'Complete Project Milestone', xp: 50, pillar: 'career', completed: false },
  { id: 3, task: 'Weekly Financial Review', xp: 20, pillar: 'financial', completed: false },
  { id: 4, task: 'Weekly Spiritual Reflection', xp: 20, pillar: 'spiritual', completed: false },
];

export const DEFAULT_MONTHLY_QUESTS = [
  { id: 1, task: 'Complete 1 Book', xp: 100, pillar: 'personal', completed: false },
  { id: 2, task: 'Achieve Financial Target', xp: 100, pillar: 'financial', completed: false },
  { id: 3, task: 'Complete Major Project', xp: 100, pillar: 'career', completed: false },
  { id: 4, task: 'Monthly Journal Summary', xp: 50, pillar: 'spiritual', completed: false },
];

// Default boss battles
export const DEFAULT_BOSS_BATTLES = [
  {
    id: 'addiction-boss',
    name: 'Shadow of Temptation',
    description: 'Defeat addiction through discipline',
    hp: 100,
    xpReward: 500,
    titleReward: 'Willpower Master',
    levelRequired: 1, // Unlocked from start
    defeated: false,
    pillar: 'personal',
  },
  {
    id: 'debt-boss',
    name: 'Debt Dragon',
    description: 'Slay the beast of financial burden',
    hp: 150,
    xpReward: 1000,
    titleReward: 'Debt Slayer',
    levelRequired: 3,
    defeated: false,
    pillar: 'financial',
  },
  {
    id: 'fear-boss',
    name: 'Fear of Failure',
    description: 'Overcome the paralysis of doubt',
    hp: 80,
    xpReward: 300,
    titleReward: 'Fearless',
    levelRequired: 2,
    defeated: false,
    pillar: 'personal',
  },
  {
    id: 'procrastination-boss',
    name: 'Time Thief',
    description: 'Vanquish the stealer of hours',
    hp: 120,
    xpReward: 750,
    titleReward: 'Time Lord',
    levelRequired: 5,
    defeated: false,
    pillar: 'career',
  },
];

// Default achievements
export const DEFAULT_ACHIEVEMENTS = [
  { id: 'first-quest', name: 'First Steps', description: 'Complete your first quest', category: 'quests', xp: 10, unlocked: false, progress: 0 },
  { id: 'week-warrior', name: 'Week Warrior', description: 'Maintain a 7-day streak', category: 'streak', xp: 50, unlocked: false, progress: 0 },
  { id: 'month-master', name: 'Month Master', description: 'Maintain a 30-day streak', category: 'streak', xp: 200, unlocked: false, progress: 0 },
  { id: 'bookworm', name: 'Bookworm', description: 'Read 5 books', category: 'pillar_education', xp: 250, unlocked: false, progress: 0 },
  { id: 'shadow-slayer', name: 'Shadow Slayer', description: 'Defeat your first boss', category: 'boss', xp: 500, unlocked: false, progress: 0 },
  { id: 'penalty-survivor', name: 'Penalty Survivor', description: 'Exit the Penalty Zone', category: 'level', xp: 100, unlocked: false, progress: 0 },
];

// Streak bonus XP
export const STREAK_BONUSES = {
  7: { xp: 50, multiplier: 1.2, duration: '24hrs' },
  30: { xp: 200, multiplier: 1.5, duration: 'permanent' },
  100: { xp: 500, multiplier: 2.0, duration: 'permanent' },
};

// Settings
export const DEFAULT_SETTINGS = {
  soundEnabled: true,
  notificationsEnabled: true,
  darkMode: true,
};

// Storage key prefix
export const STORAGE_PREFIX = 'solo-leveling-v3-';

// Load state from localStorage
export const loadState = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(STORAGE_PREFIX + key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.error('Failed to load state:', key, e);
    return defaultValue;
  }
};

// Save state to localStorage
export const saveState = (key, value) => {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save state:', key, e);
  }
};

// Export all save data to a JSON object
export const exportSaveData = () => {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(STORAGE_PREFIX)) {
      try {
        const value = JSON.parse(localStorage.getItem(key));
        // Remove prefix for cleaner export
        const cleanKey = key.replace(STORAGE_PREFIX, '');
        data[cleanKey] = value;
      } catch {
        console.warn('Skipping non-JSON item:', key);
      }
    }
  }
  return data;
};

// Import save data
export const importSaveData = (jsonData) => {
  try {
    // Validate basic structure
    if (!jsonData || typeof jsonData !== 'object') {
      throw new Error('Invalid save file format');
    }

    // Clear existing game state first
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Restore data
    Object.entries(jsonData).forEach(([key, value]) => {
      saveState(key, value);
    });
    
    return true;
  } catch (e) {
    console.error('Import failed:', e);
    return false;
  }
};

// ============================================
// Firestore Cloud Sync Functions
// ============================================

// Save all game data to Firestore
export const saveToFirestore = async (userId, gameData = null) => {
  if (!userId) return false;
  
  try {
    const dataToSave = gameData || exportSaveData();
    await setDoc(doc(db, 'users', userId, 'gameData', 'current'), {
      ...dataToSave,
      lastSaved: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (e) {
    console.error('Failed to save to Firestore:', e);
    return false;
  }
};

// Load game data from Firestore
export const loadFromFirestore = async (userId) => {
  if (!userId) return null;
  
  try {
    const docRef = doc(db, 'users', userId, 'gameData', 'current');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Remove Firestore metadata
      delete data.lastSaved;
      return data;
    }
    return null;
  } catch (e) {
    console.error('Failed to load from Firestore:', e);
    return null;
  }
};

// Sync localStorage with Firestore (load from cloud, merge with local)
export const syncWithFirestore = async (userId) => {
  if (!userId) return false;
  
  try {
    const cloudData = await loadFromFirestore(userId);
    
    if (cloudData) {
      // Import cloud data to localStorage
      importSaveData(cloudData);
      return true;
    }
    
    // No cloud data - push local data to cloud
    await saveToFirestore(userId);
    return true;
  } catch (e) {
    console.error('Sync failed:', e);
    return false;
  }
};
