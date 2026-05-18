import { useRef } from 'react';
import gsap from 'gsap';

const TABS = [
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'daily',    label: 'DAILY'    },
  { id: 'weekly',   label: 'WEEKLY'   },
  { id: 'monthly',  label: 'MONTHLY'  },
  { id: 'journal',  label: 'JOURNAL'  },
  { id: 'stats',    label: 'STATS'    },
];

const TabNavigation = ({ activeTab, setActiveTab, darkMode }) => {
  const tabsRef = useRef([]);
  const dark    = darkMode !== false;

  const handleTabClick = (tabId) => {
    const idx = TABS.findIndex(t => t.id === tabId);
    gsap.to(tabsRef.current[idx], {
      scale: 0.94, duration: 0.08, yoyo: true, repeat: 1, ease: 'power2.inOut',
    });
    setActiveTab(tabId);
  };

  return (
    <nav className="w-full mb-6 relative z-20">
      {/* outer container */}
      <div
        className="flex items-end gap-0 overflow-x-auto"
        style={{
          borderBottom: dark
            ? '1px solid rgba(78,154,254,0.18)'
            : '1px solid rgba(78,154,254,0.2)',
        }}
      >
        {TABS.map((tab, index) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={el => tabsRef.current[index] = el}
              onClick={() => handleTabClick(tab.id)}
              className="animate-enter flex-shrink-0"
              style={{
                animationDelay: `${index * 60}ms`,
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '0.62rem',
                letterSpacing: '0.15em',
                fontWeight: 600,
                padding: '0.6rem 1.1rem',
                cursor: 'pointer',
                transition: 'color 0.2s, background 0.2s',
                position: 'relative',
                color: isActive
                  ? 'var(--sl-blue)'
                  : dark ? 'var(--sl-muted)' : '#64748b',
                background: isActive
                  ? dark ? 'rgba(78,154,254,0.08)' : 'rgba(78,154,254,0.06)'
                  : 'transparent',
                borderTop: isActive ? '1px solid rgba(78,154,254,0.3)' : '1px solid transparent',
                borderLeft: isActive ? '1px solid rgba(78,154,254,0.15)' : '1px solid transparent',
                borderRight: isActive ? '1px solid rgba(78,154,254,0.15)' : '1px solid transparent',
                borderBottom: isActive ? '1px solid var(--sl-panel)' : '1px solid transparent',
                marginBottom: '-1px',
                borderRadius: '3px 3px 0 0',
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, #4E9AFE, #76FFFA)',
                    boxShadow: '0 0 8px rgba(78,154,254,0.8)',
                    borderRadius: '2px 2px 0 0',
                  }}
                />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default TabNavigation;
