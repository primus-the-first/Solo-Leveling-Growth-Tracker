import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { loadState, saveState } from '../gameState';

const SoundToggle = ({ onToggle, darkMode = true }) => {
  const [enabled, setEnabled] = useState(() => loadState('soundEnabled', true));
  
  const handleToggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    onToggle?.(newState);
    saveState('soundEnabled', newState);
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        p-2 rounded-lg transition-all duration-200
        ${enabled 
          ? darkMode 
            ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' 
            : 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200'
          : darkMode
            ? 'bg-gray-700/50 text-gray-500 hover:bg-gray-700'
            : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
        }
      `}
      title={enabled ? 'Sound On' : 'Sound Off'}
    >
      {enabled ? (
        <Volume2 className="w-5 h-5" />
      ) : (
        <VolumeX className="w-5 h-5" />
      )}
    </button>
  );
};

export default SoundToggle;
