import { useState, useRef, useEffect } from 'react';
import { Skull, Swords, Heart, Shield, Zap, Trophy, X } from 'lucide-react';
import gsap from 'gsap';
import { calculateBossHP } from '../gameState';

// Pre-generated defeat particles
const DEFEAT_PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: 50 + (Math.random() - 0.5) * 40,
  angle: (i / 30) * 360,
  distance: 100 + Math.random() * 150,
  size: 4 + Math.random() * 8,
  color: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4'][Math.floor(Math.random() * 5)],
  delay: Math.random() * 0.3,
}));

const BossBattle = ({ boss, onDefeat, onClose, playerLevel, onAttack }) => {
  const validPlayerLevel = Math.max(1, Number(playerLevel) || 1);
  const [phase, setPhase] = useState('intro'); // 'intro' | 'battle' | 'victory'
  const [bossHP, setBossHP] = useState(() => calculateBossHP(boss, validPlayerLevel));
  const [playerHP, setPlayerHP] = useState(100);
  const [isAttacking, setIsAttacking] = useState(false);
  const [damageText, setDamageText] = useState(null);

  const overlayRef = useRef(null);
  const bossRef = useRef(null);
  const playerRef = useRef(null);
  const victoryRef = useRef(null);
  const particlesRef = useRef([]);
  const counterAttackTimerRef = useRef(null);

  const maxBossHP = calculateBossHP(boss, validPlayerLevel);
  
  // Intro animation
  useEffect(() => {
    if (phase === 'intro' && overlayRef.current) {
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
      
      if (bossRef.current) {
        gsap.fromTo(bossRef.current,
          { scale: 0, rotation: -180 },
          { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.5)', delay: 0.3 }
        );
      }
      
      // Auto-transition to battle
      const timer = setTimeout(() => setPhase('battle'), 1500);
      return () => clearTimeout(timer);
    }
  }, [phase]);
  
  // Victory animation
  // Victory animation
  useEffect(() => {
    let tl;
    let timer;
    const bossNode = bossRef.current;
    const victoryNode = victoryRef.current;
    const particlesHelpers = particlesRef.current;

    if (phase === 'victory') {
      // Boss death animation
      if (bossRef.current) {
        tl = gsap.timeline();
        
        // Shake violently
        tl.to(bossRef.current, {
          x: -10, duration: 0.05, yoyo: true, repeat: 10
        });
        
        // Flash white
        tl.to(bossRef.current, {
          filter: 'brightness(3)',
          duration: 0.2,
        });
        
        // Explode outward
        tl.to(bossRef.current, {
          scale: 2,
          opacity: 0,
          filter: 'brightness(5) blur(10px)',
          duration: 0.5,
          ease: 'power2.out'
        });
      }
      
      // Animate defeat particles
      particlesRef.current.forEach((particle, i) => {
        if (particle) {
          const p = DEFEAT_PARTICLES[i];
          gsap.fromTo(particle,
            { x: 0, y: 0, opacity: 1, scale: 0 },
            {
              x: Math.cos(p.angle * Math.PI / 180) * p.distance,
              y: Math.sin(p.angle * Math.PI / 180) * p.distance,
              opacity: 0,
              scale: 1.5,
              duration: 1 + Math.random() * 0.5,
              delay: p.delay,
              ease: 'power2.out'
            }
          );
        }
      });
      
      // Show victory message
      timer = setTimeout(() => {
        if (victoryRef.current) {
          gsap.fromTo(victoryRef.current,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' }
          );
        }
      }, 800);
    }

    // Cleanup
    return () => {
      if (tl) tl.kill();
      clearTimeout(timer);
      if (bossNode) gsap.killTweensOf(bossNode);
      if (victoryNode) gsap.killTweensOf(victoryNode);
      if (particlesHelpers) gsap.killTweensOf(particlesHelpers);
      if (counterAttackTimerRef.current) clearTimeout(counterAttackTimerRef.current);
    };
  }, [phase]);
  
  // Attack handler
  const handleAttack = () => {
    if (isAttacking || phase !== 'battle' || playerHP <= 0) return;
    
    setIsAttacking(true);
    
    // Play attack sound
    onAttack?.();
    
    // Calculate damage (based on player level)
    const baseDamage = 15 + validPlayerLevel * 2;
    const variance = Math.floor(Math.random() * 11) - 5;
    const damage = Math.max(5, baseDamage + variance);
    
    // Animate attack
    if (playerRef.current) {
      gsap.to(playerRef.current, {
        x: 50,
        duration: 0.15,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
      });
    }
    
    // Boss hit reaction
    setTimeout(() => {
      if (bossRef.current) {
        gsap.to(bossRef.current, {
          x: -20,
          filter: 'brightness(2)',
          duration: 0.1,
          yoyo: true,
          repeat: 1,
        });
      }
      
      // Show damage
      setDamageText({ value: damage, x: 50 + Math.random() * 40 - 20 });
      setTimeout(() => setDamageText(null), 800);
      
      // Apply damage
      setBossHP(prev => {
        const newHP = Math.max(0, prev - damage);
        if (newHP === 0) {
          setTimeout(() => setPhase('victory'), 300);
          setIsAttacking(false);
        } else {
          // Boss counter-attack
          counterAttackTimerRef.current = setTimeout(() => {
            if (phase !== 'battle') return;
            
            const bossDamage = Math.floor(10 + Math.random() * 15);
            setPlayerHP(prev => {
              const newHP = Math.max(0, prev - bossDamage);
              if (newHP === 0) {
                setPhase('defeat');
                setIsAttacking(false);
              }
              return newHP;
            });
            
            if (bossRef.current) {
              gsap.to(bossRef.current, {
                x: 20,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
              });
            }
            setIsAttacking(false);
          }, 400);
        }
        return newHP;
      });
    }, 150);
  };
  
  // Victory claim
  const handleVictoryClaim = () => {
    onDefeat?.(boss);
    onClose?.();
  };

  if (!boss) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[150] flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(30, 15, 15, 0.98) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700 transition-colors z-10"
      >
        <X className="w-6 h-6 text-gray-400" />
      </button>
      
      {/* Battle Arena */}
      <div className="relative w-full max-w-2xl mx-4">
        
        {/* Boss Section */}
        <div className="text-center mb-8">
          {/* Boss Name */}
          <h2 className="text-3xl font-bold text-red-400 mb-2 font-display tracking-wider">
            {boss.name}
          </h2>
          
          {/* Boss HP Bar */}
          <div className="max-w-md mx-auto mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Boss HP</span>
              <span className="text-red-400">{bossHP}/{maxBossHP}</span>
            </div>
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-red-500/30">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-300"
                style={{ width: `${(bossHP / maxBossHP) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Boss Avatar */}
          <div className="relative inline-block">
            <div
              ref={bossRef}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-red-900 to-gray-900 border-4 border-red-500 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.5)]"
            >
              <Skull className="w-16 h-16 text-red-400" />
            </div>
            
            {/* Defeat particles container */}
            {phase === 'victory' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {DEFEAT_PARTICLES.map((p, i) => (
                  <div
                    key={p.id}
                    ref={el => particlesRef.current[i] = el}
                    className="absolute rounded-full"
                    style={{
                      width: p.size,
                      height: p.size,
                      backgroundColor: p.color,
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Damage text */}
            {damageText && (
              <div
                className="absolute top-0 text-3xl font-bold text-yellow-400 animate-bounce"
                style={{ left: `${damageText.x}%`, transform: 'translateX(-50%)' }}
              >
                -{damageText.value}
              </div>
            )}
          </div>
        </div>
        
        {/* Victory Overlay */}
        {phase === 'victory' && (
          <div
            ref={victoryRef}
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
          >
            <div className="text-center p-8 rounded-2xl bg-gray-900/90 border-2 border-amber-500/50 shadow-[0_0_60px_rgba(251,191,36,0.3)]">
              <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-amber-400 mb-2 font-display">
                VICTORY!
              </h1>
              <p className="text-gray-300 mb-4">
                You have defeated {boss.name}!
              </p>
              <div className="flex gap-4 justify-center mb-6">
                <div className="px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
                  <Zap className="w-5 h-5 text-green-400 inline mr-2" />
                  <span className="text-green-300 font-semibold">+{boss.xpReward} XP</span>
                </div>
                {boss.titleReward && (
                  <div className="px-4 py-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                    <Trophy className="w-5 h-5 text-purple-400 inline mr-2" />
                    <span className="text-purple-300 font-semibold">{boss.titleReward}</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleVictoryClaim}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-[0_0_20px_rgba(251,191,36,0.4)]"
              >
                Claim Rewards
              </button>
            </div>
          </div>
        )}
        
        {/* Defeat Overlay */}
        {phase === 'defeat' && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center z-20 animate-enter"
          >
            <div className="text-center p-8 rounded-2xl bg-gray-900/90 border-2 border-red-500/50 shadow-[0_0_60px_rgba(239,68,68,0.3)]">
              <Skull className="w-20 h-20 text-red-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-red-500 mb-2 font-display">
                DEFEAT
              </h1>
              <p className="text-gray-300 mb-6">
                You were overwhelmed by {boss.name}.
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all border border-gray-500"
              >
                Retreat
              </button>
            </div>
          </div>
        )}
        
        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent flex-1" />
          <Swords className="w-8 h-8 text-gray-500 mx-4" />
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent flex-1" />
        </div>
        
        {/* Player Section */}
        <div className="text-center">
          {/* Player HP */}
          <div className="max-w-md mx-auto mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Your HP</span>
              <span className="text-green-400">{playerHP}/100</span>
            </div>
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-green-500/30">
              <div
                className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all duration-300"
                style={{ width: `${playerHP}%` }}
              />
            </div>
          </div>
          
          {/* Player Avatar */}
          <div
            ref={playerRef}
            className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-cyan-900 to-gray-900 border-4 border-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.4)] mb-6"
          >
            <Shield className="w-10 h-10 text-cyan-400" />
          </div>
          
          {/* Attack Button */}
          {phase === 'battle' && (
            <button
              onClick={handleAttack}
              disabled={isAttacking}
              className={`
                px-8 py-4 text-xl font-bold rounded-xl transition-all
                ${isAttacking 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-500 hover:to-orange-400 shadow-[0_0_30px_rgba(239,68,68,0.4)]'
                }
              `}
            >
              <Swords className="w-6 h-6 inline mr-2" />
              {isAttacking ? 'Attacking...' : 'ATTACK!'}
            </button>
          )}
          
          {/* Battle Instructions */}
          {phase === 'intro' && (
            <p className="text-gray-400 animate-pulse">
              Prepare for battle...
            </p>
          )}
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            💡 Defeat the boss to earn rewards and level up!
          </p>
        </div>
        </div>
      </div>

  );
};

export default BossBattle;
