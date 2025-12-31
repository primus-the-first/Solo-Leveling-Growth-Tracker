import { useRef } from 'react';
import { Circle, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';

const QuestItem = ({ quest, onToggle, variant = 'daily' }) => {
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
          : '0 0 30px rgba(168, 85, 247, 0.5)',
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

  const completedColor = variant === 'daily' ? 'text-green-400' : 'text-purple-400';
  const completedBorder = variant === 'daily' 
    ? 'border-green-500/30' 
    : 'border-purple-500/30';
  const completedGlow = variant === 'daily'
    ? '0 0 20px rgba(74, 222, 128, 0.3)'
    : '0 0 20px rgba(168, 85, 247, 0.3)';

  return (
    <div
      ref={itemRef}
      onClick={handleClick}
      className={`
        quest-item group
        ${quest.completed ? `completed ${variant} ${completedBorder}` : ''}
      `}
      style={{
        boxShadow: quest.completed ? completedGlow : 'none'
      }}
    >
      {/* Checkbox */}
      <div ref={checkRef} className="flex-shrink-0">
        {quest.completed ? (
          <CheckCircle2 className={`w-6 h-6 ${completedColor}`} />
        ) : (
          <Circle className="w-6 h-6 text-gray-600 group-hover:text-gray-400 transition-colors" />
        )}
      </div>

      {/* Task Text */}
      <span className={`
        flex-1 text-gray-300 transition-all duration-300
        ${quest.completed ? 'line-through text-gray-500' : 'group-hover:text-white'}
      `}>
        {quest.task}
      </span>

      {/* XP Badge */}
      <div className={`
        xp-badge transition-all duration-300
        ${quest.completed 
          ? variant === 'daily' 
            ? 'bg-green-500/20 border-green-500/50 text-green-300' 
            : 'bg-purple-500/20 border-purple-500/50 text-purple-300'
          : ''
        }
      `}>
        +{quest.xp} XP
      </div>
    </div>
  );
};

export default QuestItem;
