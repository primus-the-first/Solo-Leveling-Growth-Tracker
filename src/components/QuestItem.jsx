import { useRef } from 'react';
import { Circle, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';

const QuestItem = ({ quest, onToggle, variant = 'daily', darkMode = true }) => {
  const itemRef = useRef(null);
  const checkRef = useRef(null);

  const handleClick = () => {
    // Animate the check icon
    if (!quest.completed) {
      gsap.fromTo(checkRef.current,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(2)' }
      );
      
      // Success pulse on the item
      gsap.to(itemRef.current, {
        boxShadow: variant === 'daily' 
          ? '0 0 30px rgba(74, 222, 128, 0.5)' 
          : variant === 'weekly'
            ? '0 0 30px rgba(168, 85, 247, 0.5)'
            : '0 0 30px rgba(251, 191, 36, 0.5)',
        duration: 0.3,
        yoyo: true,
        repeat: 1
      });
    } else {
      gsap.to(checkRef.current, {
        scale: 0,
        duration: 0.2,
        ease: 'power2.in'
      });
    }
    
    onToggle(quest.id);
  };

  // Color variants
  const colors = {
    daily: {
      completed: 'text-green-400',
      border: 'border-green-500/30',
      glow: '0 0 20px rgba(74, 222, 128, 0.3)',
      badge: 'bg-green-500/20 border-green-500/50 text-green-300',
    },
    weekly: {
      completed: 'text-purple-400',
      border: 'border-purple-500/30',
      glow: '0 0 20px rgba(168, 85, 247, 0.3)',
      badge: 'bg-purple-500/20 border-purple-500/50 text-purple-300',
    },
    monthly: {
      completed: 'text-amber-400',
      border: 'border-amber-500/30',
      glow: '0 0 20px rgba(251, 191, 36, 0.3)',
      badge: 'bg-amber-500/20 border-amber-500/50 text-amber-300',
    },
  };

  const variantColors = colors[variant] || colors.daily;

  return (
    <div
      ref={itemRef}
      onClick={handleClick}
      className={`
        quest-item group
        ${quest.completed ? `completed ${variant}` : ''}
        ${quest.completed ? variantColors.border : (darkMode ? '' : 'border-gray-200')}
        ${darkMode ? '' : 'bg-gray-50'}
      `}
      style={{
        boxShadow: quest.completed ? variantColors.glow : 'none'
      }}
    >
      {/* Checkbox */}
      <div ref={checkRef} className="flex-shrink-0">
        {quest.completed ? (
          <CheckCircle2 className={`w-6 h-6 ${variantColors.completed}`} />
        ) : (
          <Circle className={`w-6 h-6 ${darkMode ? 'text-gray-600 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-600'} transition-colors`} />
        )}
      </div>

      {/* Task Text */}
      <span className={`
        flex-1 transition-all duration-300
        ${quest.completed 
          ? 'line-through text-gray-500' 
          : darkMode 
            ? 'text-gray-300 group-hover:text-white' 
            : 'text-gray-700 group-hover:text-gray-900'
        }
      `}>
        {quest.task}
      </span>

      {/* Pillar Tag */}
      {quest.pillar && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
          {quest.pillar}
        </span>
      )}

      {/* XP Badge */}
      <div className={`
        xp-badge transition-all duration-300
        ${quest.completed ? variantColors.badge : ''}
      `}>
        +{quest.xp} XP
      </div>
    </div>
  );
};

export default QuestItem;
