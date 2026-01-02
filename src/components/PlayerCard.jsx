import { useRef, useEffect, useState } from 'react';
import { Zap, Flame, Trophy, TrendingUp, Shield } from 'lucide-react';
import gsap from 'gsap';
import ProgressBar from './ProgressBar';
import { getCurrentLevelXP, getNextLevelXP } from '../gameState';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Generate a license number from player data
const generateLicenseNo = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString().padStart(12, '0').slice(0, 12);
};

// Get rank based on level
const getRank = (level) => {
  if (level >= 50) return { letter: 'S', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500' };
  if (level >= 40) return { letter: 'A', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500' };
  if (level >= 30) return { letter: 'B', color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500' };
  if (level >= 20) return { letter: 'C', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500' };
  if (level >= 10) return { letter: 'D', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500' };
  return { letter: 'E', color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500' };
};

const PlayerCard = ({ player, darkMode }) => {
  const { user } = useAuth();
  const hunterName = player?.name || user?.displayName || 'Hunter';
  const cardRef = useRef(null);
  const xpBarRef = useRef(null);
  
  // Calculate XP progress for current level
  const currentLevelXP = getCurrentLevelXP(player.level);
  const nextLevelXP = getNextLevelXP(player.level);
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  const xpInCurrentLevel = Math.max(0, Math.min(player.totalXP - currentLevelXP, xpNeededForLevel));
  const xpProgress = xpNeededForLevel <= 0 ? 100 : Math.min((xpInCurrentLevel / xpNeededForLevel) * 100, 100);
  
  const licenseNo = generateLicenseNo(hunterName);
  const rank = getRank(player.level);
  
  // Entrance animation
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: -20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative mb-8 rounded-2xl overflow-hidden ${
        player.penalties?.active ? 'ring-2 ring-red-500/50' : ''
      }`}
      style={{
        background: darkMode 
          ? 'linear-gradient(135deg, #1a2a4a 0%, #0f172a 50%, #1e3a5f 100%)'
          : 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #e0f2fe 100%)',
        boxShadow: darkMode 
          ? '0 0 30px rgba(34, 211, 238, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
          : '0 4px 20px rgba(0,0,0,0.1)',
      }}
    >
      {/* Header Bar */}
      <div 
        className="px-6 py-3 flex justify-between items-center"
        style={{
          background: darkMode 
            ? 'linear-gradient(90deg, #164e63 0%, #0e7490 50%, #155e75 100%)'
            : 'linear-gradient(90deg, #0891b2 0%, #06b6d4 50%, #0891b2 100%)',
        }}
      >
        <h3 className="text-white font-bold tracking-wider text-lg">Hunter's License</h3>
        <span className="text-cyan-200 text-sm font-medium">Hunter's Association</span>
      </div>
      
      {/* Main Content */}
      <div className="p-6 flex gap-6">
        {/* Left Side - Photo & Stats */}
        <div className="flex flex-col items-center gap-3">
          {/* Photo Frame */}
          <div 
            className="w-24 h-28 rounded-lg border-2 border-cyan-500/50 overflow-hidden flex items-center justify-center"
            style={{
              background: darkMode 
                ? 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)'
                : 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)',
            }}
          >
            <div className="w-20 h-24 rounded bg-gradient-to-br from-cyan-600 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-inner">
              {hunterName.charAt(0).toUpperCase()}
            </div>
          </div>
          
          {/* Level Badge */}
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className={`text-sm font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>
              Lv.{player.level}
            </span>
          </div>
        </div>
        
        {/* Middle - Info Fields */}
        <div className="flex-1 space-y-3">
          {/* License Number Row */}
          <div className="flex justify-between items-start">
            <div>
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>License No:</span>
              <p className={`font-mono font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                {licenseNo}
              </p>
            </div>
            <div className="text-right">
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Rank:</span>
              <div className={`w-10 h-10 rounded-lg ${rank.bg} border-2 ${rank.border} flex items-center justify-center`}>
                <span className={`text-2xl font-black ${rank.color}`}>{rank.letter}</span>
              </div>
            </div>
          </div>
          
          {/* Name */}
          <div>
            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Name:</span>
            <p className={`text-xl font-bold font-display ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {hunterName}
            </p>
          </div>
          
          {/* Category / Title */}
          <div>
            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Category:</span>
            <p className={`font-semibold ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
              {player.title}
            </p>
          </div>
          
          {/* XP Progress */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>XP Progress</span>
              <span className={darkMode ? 'text-cyan-400' : 'text-cyan-600'}>
                {xpNeededForLevel > 0 
                  ? `${xpInCurrentLevel.toLocaleString()} / ${xpNeededForLevel.toLocaleString()}`
                  : 'Max Level'
                }
              </span>
            </div>
            <div ref={xpBarRef}>
              <ProgressBar
                value={xpProgress}
                maxValue={100}
                gradient="cyan-purple"
                showLabel={false}
                height="h-2"
                animated={true}
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>
        
        {/* Right Side - Chip & Stats */}
        <div className="flex flex-col justify-between items-end">
          {/* XP Multiplier */}
          {player.xpMultiplier > 1 && (
            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full font-semibold">
              {player.xpMultiplier}x XP
            </span>
          )}
          
          {/* Hologram Chip */}
          <div 
            className="w-14 h-10 rounded-lg flex items-center justify-center mt-auto"
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 25%, #d97706 50%, #fbbf24 75%, #f59e0b 100%)',
              backgroundSize: '200% 200%',
              animation: 'shimmer 3s ease infinite',
            }}
          >
            <div className="w-12 h-8 rounded border border-amber-600/50 grid grid-cols-3 gap-0.5 p-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-amber-700/50 rounded-sm" />
              ))}
            </div>
          </div>
          
          {/* Stats */}
          <div className="text-right mt-2 space-y-1">
            <div className="flex items-center gap-1 justify-end">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {player.totalXP.toLocaleString()} XP
              </span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <Flame className={`w-3 h-3 ${(player.streaks?.daily ?? 0) > 0 ? 'text-orange-400' : 'text-gray-500'}`} />
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {player.streaks?.daily ?? 0}d Streak
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - Certification */}
      <div 
        className={`px-6 py-2 text-center text-xs border-t ${
          darkMode ? 'border-cyan-900/50 text-gray-500' : 'border-cyan-200 text-gray-500'
        }`}
      >
        This individual has been certified to work as a hunter by the Hunter's Association
      </div>
      
      {/* Decorative Corner Elements */}
      <div className="absolute top-16 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-500/30" />
      <div className="absolute top-16 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-500/30" />
      <div className="absolute bottom-8 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-500/30" />
      <div className="absolute bottom-8 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-500/30" />
      
      {/* CSS for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default PlayerCard;
