import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Plus, X } from 'lucide-react';
import gsap from 'gsap';
import { generateOnboardingSummary } from '../services/gemini';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Onboarding questions - Solo Leveling System style
const ONBOARDING_STEPS = [
  {
    id: 'splash',
    type: 'splash',
    title: '[SYSTEM ONLINE]',
    message: `You were not meant to survive.

Hunter Level: 0.

Prove otherwise.`,
  },
  {
    id: 'welcome',
    type: 'message',
    title: '[SYSTEM MESSAGE]',
    message: `You stood at the brink and did not retreat.

The world has acknowledged your resolve.

From this moment onward, you will either evolve… or be erased.`,
  },
  {
    id: 'hunterName',
    type: 'hunterName',
    title: '[SYSTEM MESSAGE]',
    message: `Before you begin your ascension, the System must know...

What shall you be called, Hunter?`,
  },
  {
    id: 'personal',
    type: 'question',
    pillar: 'Personal & Discipline',
    title: '[SYSTEM MESSAGE]',
    subtitle: 'System Initialization → Level 0 / Status',
    message: 'Discipline forges power. What daily habits do you want to master?',
  },
  {
    id: 'spiritual',
    type: 'question',
    pillar: 'Spiritual Growth',
    title: '[SYSTEM MESSAGE]',
    message: 'True strength comes from within. What gives you purpose and peace?',
  },
  {
    id: 'financial',
    type: 'question',
    pillar: 'Financial Freedom',
    title: '[SYSTEM MESSAGE]',
    message: 'Freedom requires resources. What are your financial goals?',
  },
  {
    id: 'career',
    type: 'question',
    pillar: 'Career & Skills',
    title: '[SYSTEM MESSAGE]',
    message: 'Skills are your weapons. What abilities do you want to develop?',
  },
  {
    id: 'education',
    type: 'question',
    pillar: 'Knowledge & Learning',
    title: '[SYSTEM MESSAGE]',
    message: 'Knowledge is power. What do you want to learn this year?',
  },
  {
    id: 'summary',
    type: 'summary',
    title: '[SYSTEM ANALYSIS COMPLETE]',
    message: 'Generating hunter profile...',
  },
];

const OnboardingFlow = ({ onComplete }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [goalInputs, setGoalInputs] = useState(['']); // Array of goal inputs
  const [hunterName, setHunterName] = useState(''); // User's chosen hunter name
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const popupRef = useRef(null);
  const inputRef = useRef(null);

  const step = ONBOARDING_STEPS[currentStep];

  // Generate summary function
  const generateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const summary = await generateOnboardingSummary(answers);
      setSummaryText(summary);
    } catch {
      setSummaryText('Your path has been recorded. The System watches. Begin your ascension.');
    }
    setIsGeneratingSummary(false);
  };

  // Redirect to landing if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Animate popup entrance
  useEffect(() => {
    if (popupRef.current && !isTransitioning && user) {
      gsap.fromTo(popupRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [currentStep, isTransitioning, user]);

  // Focus input on question steps
  useEffect(() => {
    if (step?.type === 'question' && inputRef.current && user) {
      setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, [step, user]);

  // Generate summary when reaching summary step
  useEffect(() => {
    if (step?.type === 'summary' && answers.length > 0 && !summaryText && user) {
      generateSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, answers, summaryText, user]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="text-purple-400 font-mono animate-pulse">Loading...</div>
      </div>
    );
  }

  // Don't render if not logged in
  if (!user) {
    return null;
  }

  const handleNext = () => {
    setIsTransitioning(true);
    
    // Animate out
    gsap.to(popupRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        // Show loading state
        setShowLoading(true);
        
        // Wait 2 seconds before showing next alert
        setTimeout(() => {
          setShowLoading(false);
          
          if (currentStep < ONBOARDING_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
          } else {
            completeOnboarding();
          }
          setIsTransitioning(false);
        }, 2000);
      }
    });
  };

  const addGoalInput = () => {
    setGoalInputs(prev => [...prev, '']);
  };

  const removeGoalInput = (index) => {
    if (goalInputs.length > 1) {
      setGoalInputs(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateGoalInput = (index, value) => {
    setGoalInputs(prev => prev.map((g, i) => i === index ? value : g));
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    const validGoals = goalInputs.filter(g => g.trim());
    if (validGoals.length === 0) return;

    setAnswers(prev => [...prev, {
      pillar: step.pillar,
      goals: validGoals
    }]);
    setGoalInputs(['']); // Reset for next pillar
    handleNext();
  };

  const handleSubmitHunterName = (e) => {
    e.preventDefault();
    if (!hunterName.trim()) return;
    handleNext();
  };

  const completeOnboarding = async () => {
    if (user) {
      try {
        // Save hunter name to user profile
        await setDoc(doc(db, 'users', user.uid), {
          hunterName: hunterName.trim() || 'Hunter',
          updatedAt: new Date().toISOString()
        }, { merge: true });
        
        // Save onboarding data to Firestore
        await setDoc(doc(db, 'users', user.uid, 'gameData', 'onboarding'), {
          completed: true,
          completedAt: new Date().toISOString(),
          hunterName: hunterName.trim() || 'Hunter',
          goals: answers
        });
      } catch (error) {
        console.error('Failed to save onboarding data:', error);
      }
    }
    onComplete?.();
    navigate('/app');
  };

  return (
    <div 
      className={`
        fixed inset-0 z-[100] flex items-center justify-center
        bg-black/80 backdrop-blur-sm
      `}
    >
      {/* Loading State - Realistic Blue Flame */}
      {showLoading && (
        <div className="flex flex-col items-center gap-6">
          {/* Realistic Flame Container */}
          <div className="relative w-24 h-32">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full animate-pulse" />
            
            {/* Main flame body */}
            <div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-24 rounded-full"
              style={{
                background: 'linear-gradient(to top, #1e40af 0%, #3b82f6 30%, #60a5fa 60%, #93c5fd 80%, transparent 100%)',
                filter: 'blur(2px)',
                animation: 'flicker 0.15s infinite alternate'
              }}
            />
            
            {/* Inner bright core */}
            <div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-20 rounded-full"
              style={{
                background: 'linear-gradient(to top, #60a5fa 0%, #93c5fd 40%, #dbeafe 70%, white 90%, transparent 100%)',
                filter: 'blur(3px)',
                animation: 'flicker 0.1s infinite alternate'
              }}
            />
            
            {/* Secondary flame wisps */}
            <div 
              className="absolute bottom-2 left-1/2 -translate-x-[60%] w-6 h-16 rounded-full opacity-70"
              style={{
                background: 'linear-gradient(to top, #3b82f6 0%, #60a5fa 50%, transparent 100%)',
                filter: 'blur(2px)',
                animation: 'flickerLeft 0.2s infinite alternate',
                transform: 'translateX(-60%) rotate(-15deg)'
              }}
            />
            <div 
              className="absolute bottom-2 left-1/2 -translate-x-[40%] w-6 h-16 rounded-full opacity-70"
              style={{
                background: 'linear-gradient(to top, #3b82f6 0%, #60a5fa 50%, transparent 100%)',
                filter: 'blur(2px)',
                animation: 'flickerRight 0.18s infinite alternate',
                transform: 'translateX(-40%) rotate(15deg)'
              }}
            />
          </div>
          
          <p className="text-blue-400 font-mono text-sm animate-pulse">Initializing...</p>
          
          {/* Flame animation keyframes */}
          <style>{`
            @keyframes flicker {
              0% { transform: translateX(-50%) scaleY(1) scaleX(1); opacity: 1; }
              100% { transform: translateX(-50%) scaleY(1.05) scaleX(0.95); opacity: 0.9; }
            }
            @keyframes flickerLeft {
              0% { transform: translateX(-60%) rotate(-15deg) scaleY(1); }
              100% { transform: translateX(-55%) rotate(-20deg) scaleY(1.1); }
            }
            @keyframes flickerRight {
              0% { transform: translateX(-40%) rotate(15deg) scaleY(1); }
              100% { transform: translateX(-45%) rotate(20deg) scaleY(1.1); }
            }
          `}</style>
        </div>
      )}

      {/* System Window - Hidden during loading */}
      {!showLoading && (<div 
        ref={popupRef}
        className={`
          relative max-w-md w-full mx-4
          bg-gradient-to-b from-blue-900/90 to-blue-950/95
          border-2 border-blue-500/80
          rounded-lg overflow-hidden
          shadow-[0_0_40px_rgba(59,130,246,0.4),inset_0_0_20px_rgba(59,130,246,0.1)]
        `}
      >
        {/* Top Border Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-80" />
        
        {/* Header */}
        <div className="border-b border-blue-500/50 py-4 px-6">
          <div className="flex items-center justify-center gap-2">
            <span className="text-blue-400 text-xl">!</span>
            <h2 className="font-display text-xl md:text-2xl text-blue-100 tracking-[0.3em] uppercase">
              {step.type === 'splash' ? 'System Online' : 'System Alert'}
            </h2>
            <span className="text-blue-400 text-xl">!</span>
          </div>
          {step.subtitle && (
            <p className="text-center text-blue-400/60 font-mono text-xs mt-2">{step.subtitle}</p>
          )}
        </div>

        {/* Body */}
        <div className="py-8 px-6 text-center">
          {step.type === 'summary' ? (
            <p className="text-blue-100 text-lg md:text-xl font-body leading-relaxed whitespace-pre-line">
              {isGeneratingSummary ? (
                <span className="animate-pulse">Analyzing hunter potential...|</span>
              ) : (
                summaryText || step.message
              )}
            </p>
          ) : (
            <p className="text-blue-100 text-lg md:text-xl font-body leading-relaxed whitespace-pre-line">
              {step.message}
            </p>
          )}
        </div>

        {/* Input for questions - Multiple Goals */}
        {step.type === 'question' && (
          <div className="px-6 pb-4">
            <form onSubmit={handleSubmitAnswer} className="space-y-3">
              {goalInputs.map((goal, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    ref={index === goalInputs.length - 1 ? inputRef : null}
                    type="text"
                    value={goal}
                    onChange={(e) => updateGoalInput(index, e.target.value)}
                    placeholder={`Goal ${index + 1}...`}
                    className="flex-1 px-4 py-3 bg-blue-950/50 border border-blue-500/50 rounded text-blue-100 font-body placeholder-blue-300/40 focus:outline-none focus:border-blue-400 focus:bg-blue-950/70 transition-all"
                  />
                  {goalInputs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGoalInput(index)}
                      className="px-3 py-2 bg-red-900/30 border border-red-500/40 rounded text-red-400 hover:bg-red-900/50 hover:border-red-400 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              {/* Add Goal Button */}
              <button
                type="button"
                onClick={addGoalInput}
                className="w-full px-4 py-2 bg-blue-900/20 border border-blue-500/30 border-dashed rounded text-blue-400 hover:bg-blue-900/40 hover:border-blue-400 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add another goal
              </button>
            </form>
          </div>
        )}

        {/* Input for Hunter Name */}
        {step.type === 'hunterName' && (
          <div className="px-6 pb-4">
            <form onSubmit={handleSubmitHunterName}>
              <input
                ref={inputRef}
                type="text"
                value={hunterName}
                onChange={(e) => setHunterName(e.target.value)}
                placeholder="Enter your Hunter name..."
                className="w-full px-4 py-3 bg-blue-950/50 border border-blue-500/50 rounded text-blue-100 font-body placeholder-blue-300/40 focus:outline-none focus:border-blue-400 focus:bg-blue-950/70 transition-all text-center text-xl"
              />
            </form>
          </div>
        )}

        {/* Action Button */}
        <div className="border-t border-blue-500/50 py-4 px-6 flex justify-center">
          {step.type === 'hunterName' ? (
            <button
              onClick={handleSubmitHunterName}
              disabled={!hunterName.trim()}
              className="
                px-8 py-3 
                bg-blue-600/30 hover:bg-blue-500/50
                disabled:bg-gray-800/30 disabled:border-gray-600/40 disabled:text-gray-500 disabled:cursor-not-allowed
                border border-blue-400/60 hover:border-blue-300
                rounded
                text-blue-100 font-display text-lg tracking-widest uppercase
                transition-all duration-300
                hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]
                active:scale-95
              "
            >
              [ Confirm ]
            </button>
          ) : step.type === 'question' ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={goalInputs.every(g => !g.trim())}
              className="
                px-8 py-3 
                bg-blue-600/30 hover:bg-blue-500/50
                disabled:bg-gray-800/30 disabled:border-gray-600/40 disabled:text-gray-500 disabled:cursor-not-allowed
                border border-blue-400/60 hover:border-blue-300
                rounded
                text-blue-100 font-display text-lg tracking-widest uppercase
                transition-all duration-300
                hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]
                active:scale-95
              "
            >
              [ Submit ]
            </button>
          ) : step.type === 'summary' && !isGeneratingSummary ? (
            <button
              onClick={handleNext}
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
              [ Begin ]
            </button>
          ) : step.type !== 'summary' && (
            <button
              onClick={handleNext}
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
          )}
        </div>

        {/* Progress indicator */}
        <div className="pb-4 flex justify-center gap-2">
          {ONBOARDING_STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentStep
                  ? 'bg-blue-400 shadow-sm shadow-blue-400/50'
                  : idx < currentStep
                  ? 'bg-blue-400/50'
                  : 'bg-blue-900'
              }`}
            />
          ))}
        </div>

        {/* Bottom Border Glow */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-80" />
      </div>)}
    </div>
  );
};

export default OnboardingFlow;
