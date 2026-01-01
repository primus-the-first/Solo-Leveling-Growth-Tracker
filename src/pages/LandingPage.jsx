import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ChevronRight, Flame, Target, Trophy } from 'lucide-react';
import gsap from 'gsap';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const featuresRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/app');
    }
  }, [user, loading, navigate]);

  // Entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      // Title slide up
      tl.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
      
      // Subtitle fade in
      tl.fromTo(subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      );
      
      // CTA button pop
      tl.fromTo(ctaRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' },
        '-=0.2'
      );
      
      // Features stagger
      tl.fromTo('.feature-card',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: 'power2.out' },
        '-=0.2'
      );
    });
    
    return () => ctx.revert();
  }, []);

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = async () => {
    // Get the current user from Firebase auth directly (not from React state which may be stale)
    const { auth } = await import('../firebase');
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      try {
        const onboardingDoc = await getDoc(doc(db, 'users', currentUser.uid, 'gameData', 'onboarding'));
        const destination = onboardingDoc.exists() && onboardingDoc.data().completed 
          ? '/app' 
          : '/onboarding';
        
        // Animate out before navigation
        gsap.to('.landing-content', {
          opacity: 0,
          y: -30,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => navigate(destination)
        });
      } catch (error) {
        console.error('Error checking onboarding:', error);
        // Default to onboarding on error
        gsap.to('.landing-content', {
          opacity: 0,
          y: -30,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => navigate('/onboarding')
        });
      }
    } else {
      // Fallback - go to onboarding
      gsap.to('.landing-content', {
        opacity: 0,
        y: -30,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => navigate('/onboarding')
      });
    }
  };

  const features = [
    { icon: Flame, title: 'Daily Quests', desc: 'Build habits that level you up' },
    { icon: Target, title: 'Track Progress', desc: 'Visualize your growth journey' },
    { icon: Trophy, title: 'Earn Rewards', desc: 'Unlock achievements & titles' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 overflow-hidden relative">
      {/* Video Background */}
      <div 
        className="absolute inset-0 z-0 overflow-hidden bg-cover bg-center bg-no-repeat bg-gray-950"
        style={{ backgroundImage: "url('/landing-poster.png')" }}
      >
        {/* Mobile Video (visible on small screens) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/landing-poster.png"
          className="md:hidden absolute min-w-full min-h-full w-auto h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          <source src="/MOBILE-Arise-Solo-Leveling.webm" type="video/webm" />
        </video>
        {/* Desktop Video (visible on medium screens and up) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/landing-poster.png"
          className="hidden md:block absolute min-w-full min-h-full w-auto h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover"
          style={{ objectPosition: 'center 30%' }}
        >
          <source src="/hero-background.webm" type="video/webm" />
        </video>
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 landing-content">
        {/* Navigation */}
        <nav className="flex justify-between items-center px-6 md:px-12 py-6">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-purple-400" />
            <span className="text-xl md:text-2xl font-bold text-white tracking-wider">
              LEVEL <span className="text-purple-400">ZERO</span>
            </span>
          </div>
          <button
            onClick={handleGetStarted}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-purple-300 hover:text-white transition-colors"
          >
            Sign In <ChevronRight className="w-4 h-4" />
          </button>
        </nav>

        {/* Hero Section - Desktop: Side by side, Mobile: Stacked */}
        <main className="container mx-auto px-6 md:px-12 pt-8 md:pt-16 lg:pt-24">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            
            {/* Left side - Text content */}
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
              <h1 
                ref={titleRef}
                className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6"
              >
                <span className="text-white">YOUR</span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
                  AWAKENING
                </span>
                <br />
                <span className="text-white">BEGINS NOW!</span>
              </h1>
              
              <p 
                ref={subtitleRef}
                className="text-lg md:text-xl text-gray-400 mb-8 max-w-md mx-auto lg:mx-0"
              >
                Walk your path. Take action. Conquer.
                <br />
                <span className="text-purple-300">Become a legend.</span>
              </p>
              
              <button
                ref={ctaRef}
                onClick={handleGetStarted}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  Get Started
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 blur-xl opacity-50 -z-10 group-hover:opacity-75 transition-opacity" />
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div 
            ref={featuresRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 md:mt-24 pb-16"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <feature.icon className="w-10 h-10 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default LandingPage;
