import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabsRef = useRef([]);
  const indicatorRef = useRef(null);
  const containerRef = useRef(null);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'stats', label: 'Stats' },
  ];

  /* Removed broken GSAP animation to fix visibility issues
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
    }, containerRef);
    return () => ctx.revert();
  }, []);
  */

  const handleTabClick = (tabId, index, e) => {
    // Animate the clicked tab
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    gsap.to(tabsRef.current[tabIndex], {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    });
    
    setActiveTab(tabId);
  };

  return (
    <nav ref={containerRef} className="flex justify-center mb-8 relative z-20">
      <div className="glass-card p-1 rounded-xl flex items-center gap-1 relative">
        {/* Animated Background Indicator */}
        <div 
          ref={indicatorRef}
          className="absolute h-full top-0 rounded-lg bg-gray-800/50 hidden" // Hidden GSAP indicator for now
        />

        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={el => tabsRef.current[index] = el}
            onClick={(e) => handleTabClick(tab.id, index, e)}
            className={`
              tab-button group relative overflow-hidden animate-enter px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300
              ${activeTab === tab.id 
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 shadow-lg' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Active Tab Glow */}
            {activeTab === tab.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse" />
            )}
            <span className="relative z-10">{tab.label}</span>
            
            {/* Active Indicator */}
            {activeTab === tab.id && (
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                style={{ boxShadow: '0 0 10px rgba(34, 211, 238, 0.8)' }}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default TabNavigation;
