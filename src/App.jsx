import { useState, useRef, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import TabNavigation from './components/TabNavigation';
import PillarCard from './components/PillarCard';
import QuestItem from './components/QuestItem';
import StatsPanel from './components/StatsPanel';
import Footer from './components/Footer';
import CalendarHeatmap from './components/CalendarHeatmap';
import DailyQuestPopup from './components/DailyQuestPopup';
import PlayerCard from './components/PlayerCard';
import FocusModeOverlay from './components/FocusModeOverlay';
import QuestResetTimer from './components/QuestResetTimer';
import LevelUpModal from './components/LevelUpModal';
import { XPToastContainer } from './components/XPToast';
import RewardsTracker from './components/RewardsTracker';
import MultiplierDisplay from './components/MultiplierDisplay';
import BossBattle from './components/BossBattle';
import BossCard from './components/BossCard';
import AchievementsPanel from './components/AchievementsPanel';
import JournalPanel from './components/JournalPanel';
import QuestEditor from './components/QuestEditor';
import SystemWindow from './components/SystemWindow';
import SoundToggle from './components/SoundToggle';
import useSounds from './hooks/useSounds';
import { useAuth } from './context/AuthContext';
import {
  DEFAULT_PLAYER,
  DEFAULT_PILLARS,
  DEFAULT_DAILY_QUESTS,
  DEFAULT_WEEKLY_QUESTS,
  DEFAULT_MONTHLY_QUESTS,
  DEFAULT_BOSS_BATTLES,
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_SETTINGS,
  loadState,
  saveState,
  calculateLevel,
  STREAK_BONUSES,
  saveToFirestore,
  loadFromFirestore,
} from './gameState';
import OnboardingFlow from './components/OnboardingFlow';

// Main Dashboard Component (was App)
function Dashboard() {
  // Auth state
  const { user } = useAuth();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState(null);
  
  // Preloader State
  const [showPreloader, setShowPreloader] = useState(true);
  
  // Settings
  const [settings, setSettings] = useState(() => loadState('settings', DEFAULT_SETTINGS));
  const darkMode = settings.darkMode;
  const [showSettings, setShowSettings] = useState(false);
  
  // Sound effects
  const sounds = useSounds();
  const { playXPGain, playQuestComplete, playLevelUp, playAttack, playBossDefeat, playVictory, setSoundEnabled } = sounds;
  
  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveState('settings', settings);
  }, [settings, darkMode]);
  
  const setDarkMode = (value) => {
    setSettings(prev => ({ ...prev, darkMode: value }));
  };
  
  // Tab State
  const [activeTab, setActiveTab] = useState('overview');
  const contentRef = useRef(null);

  // ============ GAME STATE ============
  
  // Player State
  const [player, setPlayer] = useState(() => loadState('player', DEFAULT_PLAYER));
  
  // Pillars State (now as object)
  const [pillars, setPillars] = useState(() => loadState('pillars', DEFAULT_PILLARS));
  
  // Quest States
  const [dailyQuests, setDailyQuests] = useState(() => loadState('dailyQuests', DEFAULT_DAILY_QUESTS));
  const [weeklyQuests, setWeeklyQuests] = useState(() => loadState('weeklyQuests', DEFAULT_WEEKLY_QUESTS));
  const [monthlyQuests, setMonthlyQuests] = useState(() => loadState('monthlyQuests', DEFAULT_MONTHLY_QUESTS));
  
  // Boss Battles
  const [bossBattles, setBossBattles] = useState(() => loadState('bossBattles', DEFAULT_BOSS_BATTLES));
  
  // Achievements

  const [achievements, setAchievements] = useState(() => loadState('achievements', DEFAULT_ACHIEVEMENTS));
  
  // Journal
  const [journal, setJournal] = useState(() => loadState('journal', []));
  
  // History for Calendar
  const [history, setHistory] = useState(() => loadState('history', {}));

  // Quest Editor Mode
  const [editMode, setEditMode] = useState(false);

  // System Window State
  const [showSystemWindow, setShowSystemWindow] = useState(false);

  // ============ PENALTY SYSTEM ============
  
  // Focus Mode / Penalty Zone state
  const [penaltyMode, setPenaltyMode] = useState(() => loadState('penaltyMode', {
    active: false,
    type: null, // 'warning' | 'xp_reduction' | 'penalty_zone'
    startTime: null,
  }));
  
  // Recovery quests for penalty zone
  const [recoveryQuests, setRecoveryQuests] = useState(() => loadState('recoveryQuests', [
    { id: 'r1', task: 'Read 20 pages', xp: 30, completed: false },
    { id: 'r2', task: '10 minutes meditation', xp: 20, completed: false },
    { id: 'r3', task: 'Log today\'s expenses', xp: 25, completed: false },
  ]));
  
  // Persist penalty state
  useEffect(() => { saveState('penaltyMode', penaltyMode); }, [penaltyMode]);
  useEffect(() => { saveState('recoveryQuests', recoveryQuests); }, [recoveryQuests]);

  // ============ REWARD SYSTEM ============
  
  // Level up modal state
  const [levelUpModal, setLevelUpModal] = useState({
    visible: false,
    level: 1,
    title: '',
    xpBonus: 0,
  });
  
  // XP Toast notifications
  const [xpToasts, setXpToasts] = useState([]);
  
  // Real-life rewards
  const [rewards, setRewards] = useState(() => loadState('rewards', [
    { id: '1', name: 'Coffee treat ☕', xpRequired: 500, claimed: false },
    { id: '2', name: 'Game time (1 hour) 🎮', xpRequired: 1000, claimed: false },
    { id: '3', name: 'Nice meal out 🍕', xpRequired: 2500, claimed: false },
  ]));
  
  // Persist rewards
  useEffect(() => { saveState('rewards', rewards); }, [rewards]);
  
  // Add XP toast
  const showXPToast = useCallback((xp, type = 'quest', pillar = null) => {
    const id = Date.now().toString();
    setXpToasts(prev => [...prev, { id, xp, type, pillar }]);
  }, []);
  
  // Remove XP toast
  const removeXPToast = useCallback((id) => {
    setXpToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  
  // Active boss battle
  const [activeBattle, setActiveBattle] = useState(null);

  // Penalty Timer State
  const [penaltyTimeRemaining, setPenaltyTimeRemaining] = useState(() => loadState('penaltyTime', 15 * 60));

  // Penalty Timer Effect
  // Penalty Timer Effect
  useEffect(() => {
    let timer;
    if (penaltyMode.active) {
      timer = setInterval(() => {
        setPenaltyTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [penaltyMode.active]);

  // Persist penalty timer
  useEffect(() => {
    saveState('penaltyTime', penaltyTimeRemaining);
  }, [penaltyTimeRemaining]);

  // ============ PERSISTENCE ============
  
  useEffect(() => { saveState('player', player); }, [player]);
  useEffect(() => { saveState('pillars', pillars); }, [pillars]);
  useEffect(() => { saveState('dailyQuests', dailyQuests); }, [dailyQuests]);
  useEffect(() => { saveState('weeklyQuests', weeklyQuests); }, [weeklyQuests]);
  useEffect(() => { saveState('monthlyQuests', monthlyQuests); }, [monthlyQuests]);
  useEffect(() => { saveState('bossBattles', bossBattles); }, [bossBattles]);
  useEffect(() => { saveState('achievements', achievements); }, [achievements]);
  useEffect(() => { saveState('journal', journal); }, [journal]);
  useEffect(() => { saveState('history', history); }, [history]);

  // ============ FIRESTORE CLOUD SYNC ============
  
  // Load data from Firestore when user logs in
  // Load data from Firestore when user logs in
  useEffect(() => {
    let isMounted = true;

    const loadUserData = async () => {
      if (user && !isDataLoaded && !dataLoading) {
        setDataLoading(true);
        setDataError(null);
        try {
          const cloudData = await loadFromFirestore(user.uid);
          
          if (!isMounted) return;

          if (cloudData) {
            // Load cloud data into state
            if (cloudData.player) {
              setPlayer(prev => ({
                ...prev,
                ...cloudData.player
              }));
            }
            if (cloudData.pillars) setPillars(cloudData.pillars);
            if (cloudData.dailyQuests) setDailyQuests(cloudData.dailyQuests);
            if (cloudData.weeklyQuests) setWeeklyQuests(cloudData.weeklyQuests);
            if (cloudData.monthlyQuests) setMonthlyQuests(cloudData.monthlyQuests);
            if (cloudData.bossBattles) setBossBattles(cloudData.bossBattles);
            if (cloudData.achievements) setAchievements(cloudData.achievements);
            if (cloudData.journal) setJournal(cloudData.journal);
            if (cloudData.history) setHistory(cloudData.history);
          }
          setIsDataLoaded(true);

          // Check and update streaks after loading data - pass loaded quests to avoid stale state
          if (cloudData?.dailyQuests) {
            updateStreaks(cloudData.dailyQuests);
          }
        } catch (error) {
          if (isMounted) {
            console.error('Failed to load user data:', error);
            setDataError('Failed to sync. Please refresh.');
          }
        } finally {
          if (isMounted) {
            setDataLoading(false);
          }
        }
      }
    };
    loadUserData();

    return () => { isMounted = false; };
  }, [user, isDataLoaded, dataLoading]);



  // Auto-save to Firestore when game state changes (debounced)
  useEffect(() => {
    if (!user || !isDataLoaded) return;
    
    // Capture UID to avoid stale closure issues in timeout
    const uid = user.uid;

    const saveTimeout = setTimeout(async () => {
      const gameData = {
        player,
        pillars,
        dailyQuests,
        weeklyQuests,
        monthlyQuests,
        bossBattles,
        achievements,
        journal,
        history
      };
      
      try {
        await saveToFirestore(uid, gameData);
      } catch (error) {
        console.error('Auto-save failed:', error);
        // Optionally notify user via toast or UI indicator
      }
    }, 2000); // Debounce 2 seconds
    
    return () => clearTimeout(saveTimeout);
  }, [user, isDataLoaded, player, pillars, dailyQuests, weeklyQuests, monthlyQuests, bossBattles, achievements, journal, history]);


  // ============ XP SYSTEM ============
  
  // Add XP to player and optionally a pillar
  const addXP = (amount, pillarId = null) => {
    // Apply multiplier
    const multipliedXP = Math.round(amount * player.xpMultiplier);
    
    // Play XP gain sound
    playXPGain();
    
    // Update player XP
    setPlayer(prev => {
      const newTotalXP = prev.totalXP + multipliedXP;
      const { level, title } = calculateLevel(newTotalXP);
      
      return {
        ...prev,
        totalXP: newTotalXP,
        level,
        title,
      };
    });
    
    // Update pillar XP if specified
    if (pillarId && pillars[pillarId]) {
      setPillars(prev => {
        const pillar = prev[pillarId];
        const newXP = pillar.xp + multipliedXP;
        const newLevel = Math.floor(newXP / 100) + 1; // Simple level calc for pillars
        
        return {
          ...prev,
          [pillarId]: {
            ...pillar,
            xp: newXP,
            level: newLevel,
          }
        };
      });
    }
    
    // Update history
    const today = new Date().toISOString().split('T')[0];
    setHistory(prev => ({
      ...prev,
      [today]: {
        xp: (prev[today]?.xp || 0) + multipliedXP,
        completed: true,
      }
    }));
    
    return multipliedXP;
  };
  
  // Handle boss defeat - defined after addXP
  const handleBossDefeat = (boss) => {
    // Play victory sounds
    playVictory();
    playBossDefeat();
    
    // Award XP
    const awardedXP = addXP(boss.xpReward);
    showXPToast(awardedXP, 'boss');
    
    // Mark boss as defeated
    setBossBattles(prev => prev.map(b => 
      b.id === boss.id ? { ...b, defeated: true } : b
    ));
    
    // Show level up if there's a title reward
    if (boss.titleReward) {
      setTimeout(() => {
        setLevelUpModal({
          visible: true,
          level: player.level,
          title: boss.titleReward,
          xpBonus: boss.xpReward,
        });
      }, 1000);
    }

    setActiveBattle(null);

    // Check for boss achievement
    setTimeout(() => checkAchievements(), 500);
  };

  // ============ QUEST HANDLERS ============
  
  const toggleDailyQuest = (id) => {
    setDailyQuests(prev =>
      prev.map(quest => {
        if (quest.id === id) {
          if (!quest.completed) {
            addXP(quest.xp, quest.pillar);
            playQuestComplete();
            // Check achievements after quest completion
            setTimeout(() => checkAchievements(), 100);
          }
          return { ...quest, completed: !quest.completed };
        }
        return quest;
      })
    );
  };

  const toggleWeeklyQuest = (id) => {
    setWeeklyQuests(prev =>
      prev.map(quest => {
        if (quest.id === id) {
          if (!quest.completed) {
            addXP(quest.xp, quest.pillar);
            playQuestComplete();
            // Check achievements after quest completion
            setTimeout(() => checkAchievements(), 100);
          }
          return { ...quest, completed: !quest.completed };
        }
        return quest;
      })
    );
  };

  const toggleMonthlyQuest = (id) => {
    setMonthlyQuests(prev =>
      prev.map(quest => {
        if (quest.id === id) {
          if (!quest.completed) {
            addXP(quest.xp, quest.pillar);
            playQuestComplete();
            // Check achievements after quest completion
            setTimeout(() => checkAchievements(), 100);
          }
          return { ...quest, completed: !quest.completed };
        }
        return quest;
      })
    );
  };

  // ============ QUEST RESET HANDLERS ============

  const resetDailyQuests = () => {
    const newQuests = dailyQuests.map(q => ({ ...q, completed: false }));
    setDailyQuests(newQuests);
    // Update streaks with the new quest state to avoid stale state
    updateStreaks(newQuests);
  };

  const resetWeeklyQuests = () => {
    setWeeklyQuests(prev => prev.map(q => ({ ...q, completed: false })));
  };

  const resetMonthlyQuests = () => {
    setMonthlyQuests(prev => prev.map(q => ({ ...q, completed: false })));
  };

  // ============ STREAK SYSTEM ============
  
  // Check and update streaks (call this on app load/day change)
  // eslint-disable-next-line no-unused-vars
  const updateStreaks = (questsOverride) => {
    // Use provided quests or fall back to current state
    const quests = questsOverride || dailyQuests;
    // eslint-disable-next-line no-unused-vars
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    // Check if all daily quests were completed
    const allDailyCompleted = quests.every(q => q.completed);
    
    if (allDailyCompleted && quests.length > 0) {
      // Track bonus info to apply after setPlayer
      let streakBonusInfo = null;
      
      setPlayer(prev => {
        const newStreak = prev.streaks.daily + 1;
        const longestDaily = Math.max(prev.streaks.longestDaily, newStreak);
        
        // Check for streak bonuses
        let xpMultiplier = prev.xpMultiplier;
        if (STREAK_BONUSES[newStreak]) {
          xpMultiplier = STREAK_BONUSES[newStreak].multiplier;
          // Store bonus info to apply outside setPlayer
          streakBonusInfo = {
            bonusXP: STREAK_BONUSES[newStreak].xp,
            newStreak,
            level: prev.level
          };
        }
        
        return {
          ...prev,
          xpMultiplier,
          streaks: {
            ...prev.streaks,
            daily: newStreak,
            longestDaily,
          }
        };
      });
      
      // Apply bonuses outside setPlayer to avoid nested state updates
      // Use setTimeout to ensure setPlayer has completed
      if (streakBonusInfo) {
        setTimeout(() => {
          addXP(streakBonusInfo.bonusXP);
          showXPToast(streakBonusInfo.bonusXP, 'streak');
          
          // Show celebration for major milestones
          if (streakBonusInfo.newStreak === 7 || streakBonusInfo.newStreak === 30 || streakBonusInfo.newStreak === 100) {
            setLevelUpModal({
              visible: true,
              level: streakBonusInfo.level,
              title: `${streakBonusInfo.newStreak} Day Streak!`,
              xpBonus: streakBonusInfo.bonusXP,
            });
          }
        }, 0);
      }
    }
  };

  // ============ ACHIEVEMENT SYSTEM ============

  const checkAchievements = useCallback(() => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.unlocked) return achievement;

      let shouldUnlock = false;
      let newProgress = achievement.progress;

      switch (achievement.id) {
        case 'first-quest': {
          const anyQuestComplete = dailyQuests.some(q => q.completed) ||
                                  weeklyQuests.some(q => q.completed) ||
                                  monthlyQuests.some(q => q.completed);
          shouldUnlock = anyQuestComplete;
          newProgress = anyQuestComplete ? 100 : 0;
          break;
        }

        case 'week-warrior':
          shouldUnlock = player.streaks.daily >= 7;
          newProgress = Math.min((player.streaks.daily / 7) * 100, 100);
          break;

        case 'month-master':
          shouldUnlock = player.streaks.daily >= 30;
          newProgress = Math.min((player.streaks.daily / 30) * 100, 100);
          break;

        case 'shadow-slayer': {
          const anyBossDefeated = bossBattles.some(b => b.defeated);
          shouldUnlock = anyBossDefeated;
          newProgress = anyBossDefeated ? 100 : 0;
          break;
        }

        case 'penalty-survivor':
          shouldUnlock = player.penalties.missedDays > 0 && !player.penalties.active;
          newProgress = shouldUnlock ? 100 : 0;
          break;

        default:
          break;
      }

      if (shouldUnlock) {
        addXP(achievement.xp);
        showXPToast(achievement.xp, 'achievement');
        return { ...achievement, unlocked: true, progress: 100 };
      } else if (newProgress !== achievement.progress) {
        return { ...achievement, progress: newProgress };
      }

      return achievement;
    }));
  }, [dailyQuests, weeklyQuests, monthlyQuests, player.streaks.daily, player.penalties, bossBattles, addXP, showXPToast]);

  // ============ PENALTY HANDLERS ============
  
  // Activate penalty zone (call when user fails quests)
  const activatePenaltyZone = () => {
    setPenaltyMode({
      active: true,
      type: 'penalty_zone',
      startTime: Date.now(),
    });
    setPenaltyTimeRemaining(15 * 60); // Reset timer to 15 mins
    
    // Reset recovery quests
    setRecoveryQuests(prev => prev.map(q => ({ ...q, completed: false })));
    
    // Update player penalty status
    setPlayer(prev => ({
      ...prev,
      penalties: {
        ...prev.penalties,
        active: true,
        type: 'penalty_zone',
        missedDays: prev.penalties.missedDays + 1,
      }
    }));
  };
  
  // Complete a recovery quest
  const completeRecoveryQuest = (questId) => {
    setRecoveryQuests(prev => 
      prev.map(q => {
        if (q.id === questId && !q.completed) {
          // Award XP for recovery
          addXP(q.xp, 'personal');
          return { ...q, completed: true };
        }
        return q;
      })
    );
  };
  
  // Exit penalty zone
  const exitPenaltyZone = () => {
    // Check if all recovery quests are complete
    const allComplete = recoveryQuests.every(q => q.completed);
    
    if (allComplete) {
      // Award recovery bonus
      addXP(50, null);
      
      // Deactivate penalty mode
      setPenaltyMode({
        active: false,
        type: null,
        startTime: null,
      });
      
      // Update player
      setPlayer(prev => ({
        ...prev,
        penalties: {
          ...prev.penalties,
          active: false,
          type: null,
        },
        xpMultiplier: Math.min(prev.xpMultiplier + 0.5, 2.0), // Recovery bonus multiplier
      }));
      
      // Reset recovery quests for next time
      setRecoveryQuests(prev => prev.map(q => ({ ...q, completed: false })));

      // Check for penalty survivor achievement
      setTimeout(() => checkAchievements(), 100);
    }
  };

  // ============ RENDER HELPERS ============
  
  // Convert pillars object to array for rendering
  const pillarsArray = Object.values(pillars);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Player Card */}
            <PlayerCard player={player} darkMode={darkMode} />
            
            {/* Calendar Heatmap */}
            <CalendarHeatmap history={history} darkMode={darkMode} />

            {/* Pillar Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pillarsArray.map((pillar, index) => (
                <PillarCard key={pillar.id} pillar={pillar} index={index} darkMode={darkMode} />
              ))}
            </div>
          </div>
        );
      
      case 'daily':
        return (
          <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto animate-enter">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold gradient-text">Daily Quests</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    editMode
                      ? 'bg-cyan-500 text-white'
                      : darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {editMode ? 'Done' : 'Edit Quests'}
                </button>
                <div className="xp-badge">
                  {dailyQuests.filter(q => q.completed).length}/{dailyQuests.length} Complete
                </div>
              </div>
            </div>

            {/* Reset Timer */}
            <div className="mb-6">
              <QuestResetTimer
                resetType="daily"
                onReset={resetDailyQuests}
                darkMode={darkMode}
              />
            </div>

            {editMode ? (
              <QuestEditor
                quests={dailyQuests}
                setQuests={setDailyQuests}
                questType="daily"
                darkMode={darkMode}
              />
            ) : (
              <div className="space-y-3">
                {dailyQuests.map(quest => (
                  <QuestItem
                    key={quest.id}
                    quest={quest}
                    onToggle={toggleDailyQuest}
                    variant="daily"
                    darkMode={darkMode}
                  />
                ))}
              </div>
            )}
            <div className={`mt-6 pt-4 border-t ${darkMode ? 'border-gray-700/50' : 'border-gray-300'} flex justify-between items-center`}>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Total Potential XP</span>
              <span className="text-xl font-bold text-cyan-400">
                +{dailyQuests.reduce((sum, q) => sum + q.xp, 0)} XP
              </span>
            </div>
          </div>
        );
      
      case 'weekly':
        return (
          <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto animate-enter">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Weekly Quests
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    editMode
                      ? 'bg-purple-500 text-white'
                      : darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {editMode ? 'Done' : 'Edit Quests'}
                </button>
                <div className="xp-badge bg-purple-500/20 border-purple-500/50">
                  {weeklyQuests.filter(q => q.completed).length}/{weeklyQuests.length} Complete
                </div>
              </div>
            </div>

            {/* Reset Timer */}
            <div className="mb-6">
              <QuestResetTimer
                resetType="weekly"
                onReset={resetWeeklyQuests}
                darkMode={darkMode}
              />
            </div>

            {editMode ? (
              <QuestEditor
                quests={weeklyQuests}
                setQuests={setWeeklyQuests}
                questType="weekly"
                darkMode={darkMode}
              />
            ) : (
              <div className="space-y-3">
                {weeklyQuests.map(quest => (
                  <QuestItem
                    key={quest.id}
                    quest={quest}
                    onToggle={toggleWeeklyQuest}
                    variant="weekly"
                    darkMode={darkMode}
                  />
                ))}
              </div>
            )}
            <div className={`mt-6 pt-4 border-t ${darkMode ? 'border-gray-700/50' : 'border-gray-300'} flex justify-between items-center`}>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Total Potential XP</span>
              <span className="text-xl font-bold text-purple-400">
                +{weeklyQuests.reduce((sum, q) => sum + q.xp, 0)} XP
              </span>
            </div>
          </div>
        );

      case 'monthly':
        return (
          <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto animate-enter shadow-amber-500/10 border-amber-500/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-500">
                Monthly Quests
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    editMode
                      ? 'bg-amber-500 text-white'
                      : darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {editMode ? 'Done' : 'Edit Quests'}
                </button>
                <div className="xp-badge bg-amber-500/20 border-amber-500/50 text-amber-300">
                  {monthlyQuests.filter(q => q.completed).length}/{monthlyQuests.length} Complete
                </div>
              </div>
            </div>

            {/* Reset Timer */}
            <div className="mb-6">
              <QuestResetTimer
                resetType="monthly"
                onReset={resetMonthlyQuests}
                darkMode={darkMode}
              />
            </div>

            {editMode ? (
              <QuestEditor
                quests={monthlyQuests}
                setQuests={setMonthlyQuests}
                questType="monthly"
                darkMode={darkMode}
              />
            ) : (
              <div className="space-y-3">
                {monthlyQuests.map(quest => (
                  <QuestItem
                    key={quest.id}
                    quest={quest}
                    onToggle={toggleMonthlyQuest}
                    variant="monthly"
                    darkMode={darkMode}
                  />
                ))}
              </div>
            )}
            <div className={`mt-6 pt-4 border-t ${darkMode ? 'border-gray-700/50' : 'border-gray-300'} flex justify-between items-center`}>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Total Potential XP</span>
              <span className="text-xl font-bold text-amber-400">
                +{monthlyQuests.reduce((sum, q) => sum + q.xp, 0)} XP
              </span>
            </div>
          </div>
        );
      
      case 'stats':
        return (
          <div className="space-y-6">
            {/* XP Multiplier Display */}
            <MultiplierDisplay 
              multiplier={player.xpMultiplier} 
              streakDays={player.streaks.daily}
              darkMode={darkMode}
            />
            
            {/* Stats Panel */}
            <StatsPanel 
              player={player}
              pillars={pillarsArray}
              achievements={achievements}
              darkMode={darkMode}
            />
            
            {/* Real-Life Rewards */}
            <RewardsTracker
              player={player}
              rewards={rewards}
              setRewards={setRewards}
              darkMode={darkMode}
            />
            
            {/* Achievements */}
            <AchievementsPanel
              achievements={achievements}
              darkMode={darkMode}
            />
            
            {/* Boss Battles */}
            <div className={`glass-card p-6 rounded-2xl ${darkMode ? '' : 'bg-white/80'}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
                  <span className="text-2xl">💀</span>
                </div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Boss Battles
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bossBattles.map(boss => (
                  <BossCard
                    key={boss.id}
                    boss={boss}
                    playerLevel={player.level}
                    onChallenge={(b) => setActiveBattle(b)}
                    darkMode={darkMode}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'journal':
        return (
          <JournalPanel 
            journal={journal} 
            setJournal={setJournal} 
            darkMode={darkMode} 
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 md:px-8 relative overflow-hidden font-body transition-colors duration-300">
      {/* Data Sync Error */}
      {dataError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm border border-red-400/50 flex items-center gap-2 animate-fade">
          <span>⚠️</span>
          <span>{dataError}</span>
        </div>
      )}
      {/* Focus Mode Overlay */}
      <FocusModeOverlay
        isActive={penaltyMode.active}
        timeRemaining={penaltyTimeRemaining}
        penaltyType={penaltyMode.type}
        recoveryQuests={recoveryQuests}
        onQuestComplete={completeRecoveryQuest}
        onExit={exitPenaltyZone}
        darkMode={darkMode}
      />
      
      {/* Level Up Modal */}
      <LevelUpModal
        isVisible={levelUpModal.visible}
        level={levelUpModal.level}
        title={levelUpModal.title}
        xpBonus={levelUpModal.xpBonus}
        onClose={() => setLevelUpModal(prev => ({ ...prev, visible: false }))}
        onShow={playLevelUp}
      />

      {/* Settings Modal */}
      <SettingsModal 
        isVisible={showSettings} 
        onClose={() => setShowSettings(false)} 
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* System Window */}
      <SystemWindow
        isOpen={showSystemWindow}
        onClose={() => setShowSystemWindow(false)}
        player={player}
        dailyQuests={dailyQuests}
        weeklyQuests={weeklyQuests}
        monthlyQuests={monthlyQuests}
        pillars={pillars}
        bossBattles={bossBattles}
        achievements={achievements}
        darkMode={darkMode}
      />
      
      {/* XP Toast Notifications */}
      <XPToastContainer
        toasts={xpToasts}
        onRemoveToast={removeXPToast}
      />
      
      {/* Boss Battle Overlay */}
      {activeBattle && (
        <BossBattle
          boss={activeBattle}
          playerLevel={player.level}
          onDefeat={handleBossDefeat}
          onClose={() => setActiveBattle(null)}
          onAttack={playAttack}
        />
      )}
      
      {/* Daily Quest Popup with Penalty Check */}
      {showPreloader && (
        <DailyQuestPopup 
          dailyQuests={dailyQuests}
          lastVisitDate={loadState('lastVisitDate', null)}
          onAccept={() => {
            setShowPreloader(false);
            saveState('lastVisitDate', new Date().toDateString());
          }}
          onApplyPenalty={(missedCount) => {
            // Reduce XP and multiplier for missed quests
            const penaltyXP = missedCount * 10;
            setPlayer(prev => ({
              ...prev,
              totalXP: Math.max(0, prev.totalXP - penaltyXP),
              xpMultiplier: Math.max(1.0, prev.xpMultiplier - 0.1)
            }));

            // Activate penalty zone if 3+ quests missed
            if (missedCount >= 3) {
              activatePenaltyZone();
            }
          }}
        />
      )}

      {/* DEV: Test Buttons - Remove in production */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <SoundToggle onToggle={setSoundEnabled} darkMode={darkMode} />
        {import.meta.env.DEV && (
          <>
            {!penaltyMode.active && (
              <button
                onClick={activatePenaltyZone}
                className="px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white text-sm rounded-lg shadow-lg transition-all"
              >
                ⚠️ Test Penalty
              </button>
            )}
            <button
              onClick={() => {
                showXPToast(50, 'quest', 'personal');
                setLevelUpModal({ visible: true, level: player.level + 1, title: 'Shadow Knight', xpBonus: 100 });
              }}
              className="px-4 py-2 bg-purple-500/80 hover:bg-purple-600 text-white text-sm rounded-lg shadow-lg transition-all"
            >
              🎉 Test Level Up
            </button>
          </>
        )}
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent" />
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl animate-pulse"
          style={{ animationDuration: '6s', animationDelay: '2s' }}
        />
      </div>

      {/* Content Container */}
      <div className="max-w-5xl mx-auto relative z-10">
        <Header 
          player={player}
          loading={!isDataLoaded && dataLoading} // Only show loading when data is actually fetching
          darkMode={darkMode} 
          onOpenSettings={() => setShowSettings(true)}
          onOpenSystem={() => setShowSystemWindow(true)}
        />
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />
        
        {/* Tab Content */}
        <main 
          key={activeTab}
          ref={contentRef} 
          className="min-h-[400px] animate-fade"
        >
          {renderTabContent()}
        </main>

        <Footer />
      </div>
    </div>
  );
}

// App with Routes
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/onboarding" element={<OnboardingFlow />} />
      <Route path="/app" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
