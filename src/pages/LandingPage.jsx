import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SLZap, SLChevronRight, SLFlame, SLTarget, SLTrophy } from '../components/icons/SLIcons';
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
  const landingContentRef = useRef(null);

  // Redirect if already logged in — check onboarding status first
  useEffect(() => {
    if (!loading && user) {
      getDoc(doc(db, 'users', user.uid, 'gameData', 'onboarding'))
        .then(snap => {
          navigate(snap.exists() && snap.data()?.completed ? '/app' : '/onboarding', { replace: true });
        })
        .catch(() => navigate('/app', { replace: true }));
    }
  }, [user, loading, navigate]);

  // Entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Safety check if elements exist
      if (!titleRef.current) return;

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

  const handleAuthSuccess = () => {
    // Navigation is handled by the useEffect watching user/loading state
    setShowAuthModal(false);
  };

  const features = [
    { icon: SLFlame, title: 'Daily Quests', desc: 'Build habits that level you up', color: '#F97316' },
    { icon: SLTarget, title: 'Track Progress', desc: 'Visualize your growth journey', color: '#4E9AFE' },
    { icon: SLTrophy, title: 'Earn Rewards', desc: 'Unlock achievements & titles', color: '#F59E0B' },
  ];

  return (
    <div className="min-h-screen overflow-hidden relative" style={{ background: '#05080F' }}>
      {/* Video Background */}
      <div
        className="absolute inset-0 z-0 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/landing-poster.png')" }}
      >
        {/* Mobile Video */}
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
        {/* Desktop Video */}
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
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #05080F 0%, rgba(5,8,15,0.15) 50%, transparent 100%)' }} />
        {/* Scanline texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(78,154,254,0.5) 2px, rgba(78,154,254,0.5) 3px)',
          backgroundSize: '100% 4px'
        }} />
      </div>

      {/* Content */}
      <div ref={landingContentRef} className="relative z-10 landing-content">
        {/* Navigation */}
        <nav className="flex justify-between items-center px-6 md:px-12 py-6">
          <div className="flex items-center gap-2">
            <SLZap size={28} style={{ color: '#4E9AFE' }} />
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.1rem', letterSpacing: '0.2em', color: '#E8F0FF' }}>
              LEVEL <span style={{ color: '#4E9AFE' }}>ZERO</span>
            </span>
          </div>
          <button
            onClick={handleGetStarted}
            className="hidden md:flex items-center gap-2 px-4 py-2 transition-colors"
            style={{ color: '#4A6FA5', border: '1px solid rgba(78,154,254,0.25)', borderRadius: '3px', fontFamily: 'Orbitron, sans-serif', fontSize: '0.75rem', letterSpacing: '0.15em' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#4E9AFE'; e.currentTarget.style.borderColor = 'rgba(78,154,254,0.6)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4A6FA5'; e.currentTarget.style.borderColor = 'rgba(78,154,254,0.25)'; }}
          >
            SIGN IN <SLChevronRight size={14} />
          </button>
        </nav>

        {/* Hero Section */}
        <main className="container mx-auto px-6 md:px-12 pt-8 md:pt-16 lg:pt-24">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1">

              {/* System label above title */}
              <div className="mb-4 flex justify-center lg:justify-start">
                <span style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '0.65rem',
                  letterSpacing: '0.25em',
                  color: '#4E9AFE',
                  border: '1px solid rgba(78,154,254,0.35)',
                  borderRadius: '2px',
                  padding: '3px 10px',
                }}>
                  ▸ SYSTEM INITIALIZING
                </span>
              </div>

              <h1
                ref={titleRef}
                className="font-black leading-tight mb-6"
                style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2.4rem, 7vw, 5rem)', letterSpacing: '0.05em' }}
              >
                <span style={{ color: '#E8F0FF' }}>YOUR</span>
                <br />
                <span style={{ background: 'linear-gradient(90deg, #4E9AFE, #76FFFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  AWAKENING
                </span>
                <br />
                <span style={{ color: '#E8F0FF' }}>BEGINS NOW</span>
              </h1>

              <p
                ref={subtitleRef}
                className="mb-8 max-w-md mx-auto lg:mx-0"
                style={{ color: '#4A6FA5', fontSize: '1rem', letterSpacing: '0.05em', lineHeight: 1.7 }}
              >
                Walk your path. Take action. Conquer.
                <br />
                <span style={{ color: '#76FFFA' }}>Become a legend.</span>
              </p>

              <button
                ref={ctaRef}
                onClick={handleGetStarted}
                className="group relative transition-all duration-300"
                style={{
                  padding: '14px 36px',
                  background: 'rgba(78,154,254,0.12)',
                  border: '1px solid rgba(78,154,254,0.6)',
                  borderRadius: '3px',
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '0.85rem',
                  letterSpacing: '0.2em',
                  color: '#E8F0FF',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(78,154,254,0.2)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(78,154,254,0.22)'; e.currentTarget.style.boxShadow = '0 0 32px rgba(78,154,254,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(78,154,254,0.12)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(78,154,254,0.2)'; }}
              >
                <span className="flex items-center gap-3">
                  [ GET STARTED ]
                  <SLChevronRight size={16} style={{ color: '#4E9AFE' }} />
                </span>
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16 md:mt-24 pb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card p-6 transition-all duration-300"
                style={{
                  background: 'rgba(13,30,54,0.7)',
                  border: '1px solid rgba(78,154,254,0.18)',
                  borderRadius: '4px',
                  borderLeft: `3px solid ${feature.color}`,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${feature.color}66`; e.currentTarget.style.background = 'rgba(13,30,54,0.9)'; e.currentTarget.style.boxShadow = `0 0 20px ${feature.color}22`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(78,154,254,0.18)'; e.currentTarget.style.background = 'rgba(13,30,54,0.7)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <feature.icon size={36} style={{ color: feature.color, marginBottom: '1rem' }} />
                <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.85rem', letterSpacing: '0.15em', color: '#E8F0FF', marginBottom: '0.5rem' }}>
                  {feature.title.toUpperCase()}
                </h3>
                <p style={{ color: '#4A6FA5', fontSize: '0.875rem', lineHeight: 1.6 }}>{feature.desc}</p>
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
