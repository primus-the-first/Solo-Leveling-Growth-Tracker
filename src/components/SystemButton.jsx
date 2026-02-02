import { Sparkles } from 'lucide-react';

const SystemButton = ({ onClick, darkMode = true }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 overflow-hidden ${
        darkMode
          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/50 hover:border-cyan-400'
          : 'bg-gradient-to-r from-cyan-50 to-purple-50 hover:from-cyan-100 hover:to-purple-100 border border-cyan-500 hover:border-cyan-600'
      }`}
      title="Ask The System"
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 animate-pulse`} />
      </div>
      
      {/* Icon with pulse animation */}
      <div className="relative">
        <Sparkles className={`w-4 h-4 transition-colors ${
          darkMode ? 'text-cyan-400 group-hover:text-cyan-300' : 'text-cyan-600 group-hover:text-cyan-700'
        }`} />
        <div className="absolute inset-0 animate-ping opacity-0 group-hover:opacity-50">
          <Sparkles className="w-4 h-4 text-cyan-400" />
        </div>
      </div>
      
      {/* Text */}
      <span className={`relative text-sm font-semibold tracking-wide ${
        darkMode 
          ? 'text-cyan-400 group-hover:text-cyan-300' 
          : 'text-cyan-700 group-hover:text-cyan-800'
      }`}>
        SYSTEM
      </span>
      
      {/* Hover indicator */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
        darkMode 
          ? 'bg-gradient-to-r from-cyan-400 to-purple-400' 
          : 'bg-gradient-to-r from-cyan-500 to-purple-500'
      }`} />
    </button>
  );
};

export default SystemButton;
