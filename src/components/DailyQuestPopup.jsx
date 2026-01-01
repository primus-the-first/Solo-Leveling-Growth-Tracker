import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const DailyQuestPopup = ({ 
  dailyQuests, 
  onAccept, 
  onApplyPenalty,
  lastVisitDate 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [showPenalty, setShowPenalty] = useState(false);
  
  // Check if there are incomplete quests from yesterday
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const missedQuests = lastVisitDate && lastVisitDate !== today && lastVisitDate === yesterday;
  const incompleteCount = dailyQuests.filter(q => !q.completed).length;
  
  // Determine message based on situation
  const getMessage = () => {
    if (missedQuests && incompleteCount > 0) {
      return `[PENALTY DETECTED]\n\nYou failed to complete ${incompleteCount} quests yesterday.\n\nThe System does not forgive weakness.`;
    }
    return 'Welcome, Hunter.\nYour Daily Quests await.';
  };
  
  const fullText = getMessage();
  
  // Typing animation effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        // Show penalty button if applicable
        if (missedQuests && incompleteCount > 0) {
          setShowPenalty(true);
        }
      }
    }, 40);
    return () => clearInterval(interval);
  }, [fullText, missedQuests, incompleteCount]);

  const handleAccept = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      // Apply penalty if there were missed quests
      if (missedQuests && incompleteCount > 0 && onApplyPenalty) {
        onApplyPenalty(incompleteCount);
      }
      onAccept();
    }, 500);
  };

  if (!isVisible) return null;

  const isPenaltyMode = missedQuests && incompleteCount > 0;

  return (
    <div 
      className={`
        fixed inset-0 z-[100] flex items-center justify-center
        bg-black/80 backdrop-blur-sm
        transition-opacity duration-500
        ${isFadingOut ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* System Window */}
      <div 
        className={`
          relative max-w-md w-full mx-4
          bg-gradient-to-b ${isPenaltyMode ? 'from-red-900/90 to-red-950/95' : 'from-blue-900/90 to-blue-950/95'}
          border-2 ${isPenaltyMode ? 'border-red-500/80' : 'border-blue-500/80'}
          rounded-lg overflow-hidden
          shadow-[0_0_40px_${isPenaltyMode ? 'rgba(239,68,68,0.4)' : 'rgba(59,130,246,0.4)'},inset_0_0_20px_${isPenaltyMode ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)'}]
          transform transition-all duration-500
          ${isFadingOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
        `}
      >
        {/* Top Border Glow */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent ${isPenaltyMode ? 'via-red-400' : 'via-blue-400'} to-transparent opacity-80`} />
        
        {/* Header */}
        <div className={`border-b ${isPenaltyMode ? 'border-red-500/50' : 'border-blue-500/50'} py-4 px-6`}>
          <div className="flex items-center justify-center gap-2">
            {isPenaltyMode ? (
              <AlertTriangle className="text-red-400 w-6 h-6" />
            ) : (
              <span className="text-blue-400 text-xl">!</span>
            )}
            <h2 className={`font-display text-xl md:text-2xl ${isPenaltyMode ? 'text-red-100' : 'text-blue-100'} tracking-[0.3em] uppercase`}>
              {isPenaltyMode ? 'Penalty Alert' : 'System Alert'}
            </h2>
            {isPenaltyMode ? (
              <AlertTriangle className="text-red-400 w-6 h-6" />
            ) : (
              <span className="text-blue-400 text-xl">!</span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="py-6 px-6 text-center">
          <p className={`${isPenaltyMode ? 'text-red-100' : 'text-blue-100'} text-lg font-body leading-relaxed whitespace-pre-line min-h-[4em]`}>
            {displayedText}
            <span className="animate-pulse">|</span>
          </p>
        </div>

        {/* Quest List */}
        <div className="px-6 pb-4 max-h-48 overflow-y-auto">
          <div className="space-y-2">
            {dailyQuests.slice(0, 5).map((quest, idx) => (
              <div 
                key={quest.id || idx}
                className={`flex items-center gap-3 px-3 py-2 rounded ${isPenaltyMode ? 'bg-red-950/50' : 'bg-blue-950/50'} border ${isPenaltyMode ? 'border-red-500/30' : 'border-blue-500/30'}`}
              >
                {quest.completed ? (
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                ) : (
                  <XCircle className={`w-4 h-4 ${isPenaltyMode ? 'text-red-400' : 'text-gray-500'} flex-shrink-0`} />
                )}
                <span className={`text-sm ${quest.completed ? 'text-green-300 line-through' : isPenaltyMode ? 'text-red-200' : 'text-blue-200'}`}>
                  {quest.task}
                </span>
                <span className={`ml-auto text-xs ${isPenaltyMode ? 'text-red-400' : 'text-blue-400'}`}>+{quest.xp} XP</span>
              </div>
            ))}
          </div>
        </div>

        {/* Penalty Info */}
        {showPenalty && (
          <div className="px-6 pb-4">
            <div className="bg-red-900/50 border border-red-500/50 rounded p-3 text-center">
              <p className="text-red-200 text-sm font-mono">
                Penalty: -{incompleteCount * 10} XP | Multiplier reduced
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className={`border-t ${isPenaltyMode ? 'border-red-500/50' : 'border-blue-500/50'} py-4 px-6 flex justify-center`}>
          <button
            onClick={handleAccept}
            className={`
              px-8 py-3 
              ${isPenaltyMode ? 'bg-red-600/30 hover:bg-red-500/50' : 'bg-blue-600/30 hover:bg-blue-500/50'}
              border ${isPenaltyMode ? 'border-red-400/60 hover:border-red-300' : 'border-blue-400/60 hover:border-blue-300'}
              rounded
              ${isPenaltyMode ? 'text-red-100' : 'text-blue-100'} font-display text-lg tracking-widest uppercase
              transition-all duration-300
              hover:shadow-[0_0_20px_${isPenaltyMode ? 'rgba(239,68,68,0.5)' : 'rgba(59,130,246,0.5)'}]
              active:scale-95
            `}
          >
            {isPenaltyMode ? '[ Accept Penalty ]' : '[ Accept ]'}
          </button>
        </div>

        {/* Bottom Border Glow */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent ${isPenaltyMode ? 'via-red-400' : 'via-blue-400'} to-transparent opacity-80`} />
      </div>
    </div>
  );
};

export default DailyQuestPopup;
