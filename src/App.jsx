import { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import PillarCard from './components/PillarCard';
import QuestItem from './components/QuestItem';
import StatsPanel from './components/StatsPanel';
import Footer from './components/Footer';
import CalendarHeatmap from './components/CalendarHeatmap';
import SystemMessage from './components/SystemMessage';

function App() {
  // Preloader State
  const [showPreloader, setShowPreloader] = useState(true);
  
  // State Initialization with Persistence
  const [activeTab, setActiveTab] = useState('overview');
  const contentRef = useRef(null);
  
  // Load initial state or use defaults
  const loadState = (key, defaultVal) => {
    try {
      const saved = localStorage.getItem(`solo-leveling-${key}`);
      return saved ? JSON.parse(saved) : defaultVal;
    } catch (e) {
      console.error('Failed to load state', e);
      return defaultVal;
    }
  };

  const [pillars, setPillars] = useState(() => loadState('pillars', [
    {
      id: 1,
      type: 'personal',
      title: 'Personal & Discipline',
      icon: 'flame',
      level: 1,
      xp: 0,
      stats: [
        { name: 'Self Control', value: 45 },
        { name: 'Daily Discipline', value: 30 },
        { name: 'Habit Strength', value: 25 },
      ]
    },
    {
      id: 2,
      type: 'spiritual',
      title: 'Spiritual Growth',
      icon: 'star',
      level: 1,
      xp: 0,
      stats: [
        { name: 'Inner Peace', value: 35 },
        { name: 'Courage', value: 40 },
        { name: 'Wisdom', value: 30 },
      ]
    },
    {
      id: 3,
      type: 'career',
      title: 'Career & Skills',
      icon: 'brain',
      level: 1,
      xp: 0,
      stats: [
        { name: 'Web Dev', value: 50 },
        { name: 'AI/ML', value: 35 },
        { name: 'Data Analysis', value: 40 },
      ]
    },
    {
      id: 4,
      type: 'financial',
      title: 'Financial',
      icon: 'trending-up',
      level: 1,
      xp: 0,
      stats: [
        { name: 'Income', value: 20 },
        { name: 'Savings', value: 15 },
        { name: 'Investment', value: 10 },
      ]
    },
  ]));

  const [dailyQuests, setDailyQuests] = useState(() => loadState('dailyQuests', [
    { id: 1, task: '5 min morning reflection', xp: 10, completed: false },
    { id: 2, task: '60-90 min focused work', xp: 25, completed: false },
    { id: 3, task: '5 min evening journal', xp: 10, completed: false },
    { id: 4, task: 'Track daily spending', xp: 5, completed: false },
  ]));

  const [weeklyQuests, setWeeklyQuests] = useState(() => loadState('weeklyQuests', [
    { id: 1, task: 'Review habit streaks', xp: 30, completed: false },
    { id: 2, task: 'Read 1 spiritual chapter', xp: 25, completed: false },
    { id: 3, task: 'Build project feature', xp: 50, completed: false },
    { id: 4, task: 'Review income & expenses', xp: 20, completed: false },
  ]));

  const [monthlyQuests, setMonthlyQuests] = useState(() => loadState('monthlyQuests', [
    { id: 1, task: 'Complete 30-Day Coding Challenge', xp: 500, completed: false },
    { id: 2, task: 'Read 2 Non-Fiction Books', xp: 300, completed: false },
    { id: 3, task: 'Hit gym 15 times', xp: 400, completed: false },
  ]));

  const [stats, setStats] = useState(() => loadState('stats', {
    daysCompleted: 0,
    totalXP: 0,
    longestStreak: 0,
  }));

  // Simple History System for Calendar
  const [history, setHistory] = useState(() => loadState('history', {}));

  // Persistence Effects
  useEffect(() => { localStorage.setItem('solo-leveling-pillars', JSON.stringify(pillars)); }, [pillars]);
  useEffect(() => { localStorage.setItem('solo-leveling-dailyQuests', JSON.stringify(dailyQuests)); }, [dailyQuests]);
  useEffect(() => { localStorage.setItem('solo-leveling-weeklyQuests', JSON.stringify(weeklyQuests)); }, [weeklyQuests]);
  useEffect(() => { localStorage.setItem('solo-leveling-monthlyQuests', JSON.stringify(monthlyQuests)); }, [monthlyQuests]);
  useEffect(() => { localStorage.setItem('solo-leveling-stats', JSON.stringify(stats)); }, [stats]);
  useEffect(() => { localStorage.setItem('solo-leveling-history', JSON.stringify(history)); }, [history]);
  
  // Update History on XP Gain
  const updateHistory = (xp) => {
    const today = new Date().toISOString().split('T')[0];
    setHistory(prev => ({
      ...prev,
      [today]: {
        xp: (prev[today]?.xp || 0) + xp,
        completed: true
      }
    }));
    
    // Update Total XP
    setStats(prev => ({
      ...prev,
      totalXP: prev.totalXP + xp
    }));
  };

  // Toggle daily quest completion
  const toggleDailyQuest = (id) => {
    setDailyQuests(prev => 
      prev.map(quest => {
        if (quest.id === id) {
          // If completing, add XP to history
          if (!quest.completed) updateHistory(quest.xp);
          // Note: Removing XP on uncheck is complex with history, ignoring for simplicity in MVP
          return { ...quest, completed: !quest.completed };
        }
        return quest;
      })
    );
  };

  // Toggle weekly quest completion
  const toggleWeeklyQuest = (id) => {
    setWeeklyQuests(prev => 
      prev.map(quest => {
        if (quest.id === id) {
          if (!quest.completed) updateHistory(quest.xp);
          return { ...quest, completed: !quest.completed };
        }
        return quest;
      })
    );
  };

  // Toggle monthly quest completion
  const toggleMonthlyQuest = (id) => {
    setMonthlyQuests(prev => 
      prev.map(quest => {
        if (quest.id === id) {
          if (!quest.completed) updateHistory(quest.xp);
          return { ...quest, completed: !quest.completed };
        }
        return quest;
      })
    );
  };

  // Animate tab content change is now handled by CSS keyframes on the main element with key={activeTab}

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
             {/* Calendar Heatmap on Dashboard */}
             <CalendarHeatmap history={history} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pillars.map((pillar, index) => (
                <PillarCard key={pillar.id} pillar={pillar} index={index} />
              ))}
            </div>
          </div>
        );
      
      case 'daily':
        return (
          <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto animate-enter">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">Daily Quests</h2>
              <div className="xp-badge">
                {dailyQuests.filter(q => q.completed).length}/{dailyQuests.length} Complete
              </div>
            </div>
            <div className="space-y-3">
              {dailyQuests.map(quest => (
                <QuestItem 
                  key={quest.id}
                  quest={quest}
                  onToggle={toggleDailyQuest}
                  variant="daily"
                />
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-between items-center">
              <span className="text-gray-400">Total Potential XP</span>
              <span className="text-xl font-bold text-cyan-400">
                +{dailyQuests.reduce((sum, q) => sum + q.xp, 0)} XP
              </span>
            </div>
          </div>
        );
      
      case 'weekly':
        return (
          <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto animate-enter">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Weekly Quests
              </h2>
              <div className="xp-badge bg-purple-500/20 border-purple-500/50">
                {weeklyQuests.filter(q => q.completed).length}/{weeklyQuests.length} Complete
              </div>
            </div>
            <div className="space-y-3">
              {weeklyQuests.map(quest => (
                <QuestItem 
                  key={quest.id}
                  quest={quest}
                  onToggle={toggleWeeklyQuest}
                  variant="weekly"
                />
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-between items-center">
              <span className="text-gray-400">Total Potential XP</span>
              <span className="text-xl font-bold text-purple-400">
                +{weeklyQuests.reduce((sum, q) => sum + q.xp, 0)} XP
              </span>
            </div>
          </div>
        );

      case 'monthly':
        return (
          <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto animate-enter shadow-amber-500/10 border-amber-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-500">
                Monthly Quests
              </h2>
              <div className="xp-badge bg-amber-500/20 border-amber-500/50 text-amber-300">
                {monthlyQuests.filter(q => q.completed).length}/{monthlyQuests.length} Complete
              </div>
            </div>
            <div className="space-y-3">
              {monthlyQuests.map(quest => (
                <QuestItem 
                  key={quest.id}
                  quest={quest}
                  onToggle={toggleMonthlyQuest}
                  variant="monthly" // Need to handle this variant in QuestItem styling
                />
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-between items-center">
              <span className="text-gray-400">Total Potential XP</span>
              <span className="text-xl font-bold text-amber-400">
                +{monthlyQuests.reduce((sum, q) => sum + q.xp, 0)} XP
              </span>
            </div>
          </div>
        );
      
      case 'stats':
        return <StatsPanel stats={stats} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 md:px-8 relative overflow-hidden font-body">
      {/* System Preloader */}
      {showPreloader && (
        <SystemMessage onAccept={() => setShowPreloader(false)} />
      )}

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent" />
        
        {/* Floating orbs */}
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
        <Header />
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
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

export default App;
