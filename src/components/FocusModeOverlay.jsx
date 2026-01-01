import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Clock, CheckCircle2, Circle, Flame, XCircle } from 'lucide-react';
import gsap from 'gsap';

const FocusModeOverlay = ({ 
  isActive, 
  penaltyType, 
  recoveryQuests, 
  onQuestComplete, 
  onExit,
  // darkMode prop available for future theming
}) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes default
  
  // Animation on mount
  useEffect(() => {
    if (isActive && overlayRef.current) {
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
      gsap.fromTo(contentRef.current,
        { scale: 0.8, y: 50 },
        { scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)', delay: 0.2 }
      );
    }
  }, [isActive]);

  // Countdown timer
  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if all quests completed
  const allComplete = recoveryQuests?.every(q => q.completed) || false;

  if (!isActive) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, rgba(127, 29, 29, 0.95) 0%, rgba(0, 0, 0, 0.98) 50%, rgba(127, 29, 29, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-red-600/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-red-800/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main Content */}
      <div
        ref={contentRef}
        className="relative max-w-lg w-full mx-4 p-8 rounded-2xl border-2 border-red-500/50"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 30, 35, 0.95) 0%, rgba(20, 20, 25, 0.98) 100%)',
          boxShadow: '0 0 50px rgba(220, 38, 38, 0.3), inset 0 0 30px rgba(220, 38, 38, 0.1)',
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
            <AlertTriangle className="w-10 h-10 text-red-400 animate-pulse" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-red-400 font-display tracking-wider mb-2">
            ⚠️ PENALTY ZONE ACTIVE ⚠️
          </h1>
          
          <p className="text-gray-400 text-sm">
            {penaltyType === 'penalty_zone' 
              ? '"You have failed to complete daily quests. Penalty will be given."'
              : 'Complete recovery tasks to exit Focus Mode'}
          </p>
        </div>

        {/* Timer */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-2">
            <Clock className="w-4 h-4" />
            <span>Time in Focus Mode</span>
          </div>
          <div className="text-4xl font-mono font-bold text-red-300">
            {formatTime(timeRemaining)}
          </div>
          {timeRemaining === 0 && (
            <p className="text-yellow-400 text-sm mt-2">
              ⚡ Time's up! Complete tasks to exit.
            </p>
          )}
        </div>

        {/* Recovery Tasks */}
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            Complete these tasks to exit:
          </h3>
          
          <div className="space-y-3">
            {recoveryQuests?.map((quest, index) => (
              <div
                key={quest.id || index}
                onClick={() => onQuestComplete?.(quest.id)}
                className={`
                  flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300
                  ${quest.completed 
                    ? 'bg-green-500/20 border border-green-500/30' 
                    : 'bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50'
                  }
                `}
                style={{
                  boxShadow: quest.completed ? '0 0 20px rgba(74, 222, 128, 0.2)' : 'none'
                }}
              >
                {quest.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-500 flex-shrink-0" />
                )}
                
                <span className={`flex-1 ${quest.completed ? 'text-gray-400 line-through' : 'text-gray-300'}`}>
                  {quest.task}
                </span>
                
                <span className={`text-sm font-semibold ${quest.completed ? 'text-green-400' : 'text-red-400'}`}>
                  +{quest.xp} XP
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Recovery Progress</span>
            <span className="text-gray-300">
              {recoveryQuests?.filter(q => q.completed).length || 0} / {recoveryQuests?.length || 0}
            </span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-green-500 rounded-full transition-all duration-500"
              style={{ 
                width: `${((recoveryQuests?.filter(q => q.completed).length || 0) / (recoveryQuests?.length || 1)) * 100}%` 
              }}
            />
          </div>
        </div>

        {/* Exit Button */}
        {allComplete ? (
          <button
            onClick={onExit}
            className="w-full py-4 rounded-xl font-bold text-white transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500"
            style={{
              boxShadow: '0 0 30px rgba(74, 222, 128, 0.4)'
            }}
          >
            ✅ EXIT PENALTY ZONE
          </button>
        ) : (
          <div className="text-center py-4 rounded-xl bg-gray-800/50 border border-red-500/30">
            <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <span className="text-gray-400 text-sm">
              Cannot Skip - Complete All Tasks
            </span>
          </div>
        )}

        {/* Bonus XP Notice */}
        {allComplete && (
          <p className="text-center text-green-400 text-sm mt-4 animate-pulse">
            🎉 Recovery Bonus: +50 XP will be awarded!
          </p>
        )}
      </div>
    </div>
  );
};

export default FocusModeOverlay;
