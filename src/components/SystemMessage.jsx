import { useState, useEffect } from 'react';

const SystemMessage = ({ onAccept }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'Welcome, Player.\nThe Daily Quest has arrived.';
  
  // Typing animation effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      onAccept();
    }, 500);
  };

  if (!isVisible) return null;

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
          bg-gradient-to-b from-blue-900/90 to-blue-950/95
          border-2 border-blue-500/80
          rounded-lg overflow-hidden
          shadow-[0_0_40px_rgba(59,130,246,0.4),inset_0_0_20px_rgba(59,130,246,0.1)]
          transform transition-all duration-500
          ${isFadingOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
        `}
      >
        {/* Top Border Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-80" />
        
        {/* Header */}
        <div className="border-b border-blue-500/50 py-4 px-6">
          <div className="flex items-center justify-center gap-2">
            <span className="text-blue-400 text-xl">!</span>
            <h2 className="font-display text-xl md:text-2xl text-blue-100 tracking-[0.3em] uppercase">
              System Alert
            </h2>
            <span className="text-blue-400 text-xl">!</span>
          </div>
        </div>

        {/* Body */}
        <div className="py-8 px-6 text-center">
          <p className="text-blue-100 text-lg md:text-xl font-body leading-relaxed whitespace-pre-line min-h-[3em]">
            {displayedText}
            <span className="animate-pulse">|</span>
          </p>
        </div>

        {/* Action Button */}
        <div className="border-t border-blue-500/50 py-4 px-6 flex justify-center">
          <button
            onClick={handleAccept}
            className="
              px-8 py-3 
              bg-blue-600/30 hover:bg-blue-500/50
              border border-blue-400/60 hover:border-blue-300
              rounded
              text-blue-100 font-display text-lg tracking-widest uppercase
              transition-all duration-300
              hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]
              active:scale-95
            "
          >
            [ Accept ]
          </button>
        </div>

        {/* Bottom Border Glow */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-80" />
      </div>
    </div>
  );
};

export default SystemMessage;
