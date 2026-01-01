import { useCallback, useRef, useEffect } from 'react';
import { loadState, saveState } from '../gameState';

// Sound configuration with Web Audio API synthesized sounds
const SOUND_CONFIG = {
  xpGain: { frequency: 880, duration: 0.1, type: 'sine', volume: 0.3 },
  questComplete: { frequency: 523.25, duration: 0.15, type: 'triangle', volume: 0.4 },
  levelUp: { frequencies: [523.25, 659.25, 783.99, 1046.5], duration: 0.2, type: 'sine', volume: 0.5 },
  attack: { frequency: 150, duration: 0.08, type: 'sawtooth', volume: 0.3 },
  bossHit: { frequency: 100, duration: 0.15, type: 'square', volume: 0.4 },
  bossDefeat: { frequencies: [261.63, 329.63, 392, 523.25], duration: 0.3, type: 'sine', volume: 0.5 },
  victory: { frequencies: [523.25, 659.25, 783.99, 1046.5, 1318.5], duration: 0.25, type: 'sine', volume: 0.5 },
  click: { frequency: 1200, duration: 0.03, type: 'sine', volume: 0.15 },
  error: { frequency: 200, duration: 0.2, type: 'square', volume: 0.3 },
  penaltyAlert: { frequencies: [400, 300, 200], duration: 0.3, type: 'sawtooth', volume: 0.4 },
  rewardClaim: { frequencies: [440, 554.37, 659.25], duration: 0.15, type: 'triangle', volume: 0.4 },
};

const useSounds = () => {
  const audioContextRef = useRef(null);
  const enabledRef = useRef(loadState('soundEnabled', true));
  
  // Initialize AudioContext on first interaction
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume if suspended (browser autoplay policy)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);
  
  // Play a single tone
  const playTone = useCallback((frequency, duration, type = 'sine', volume = 0.3, startTime = 0) => {
    if (!enabledRef.current) return;
    
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + startTime);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime + startTime);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + startTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + startTime + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start(ctx.currentTime + startTime);
      oscillator.stop(ctx.currentTime + startTime + duration + 0.1);
    } catch (e) {
      console.warn('Sound playback failed:', e);
    }
  }, [getAudioContext]);
  
  // Play a sequence of tones (for melodies)
  const playSequence = useCallback((frequencies, duration, type = 'sine', volume = 0.3) => {
    if (!enabledRef.current) return;
    
    frequencies.forEach((freq, index) => {
      playTone(freq, duration, type, volume, index * duration * 0.8);
    });
  }, [playTone]);
  
  // Sound effect functions
  const playXPGain = useCallback(() => {
    const config = SOUND_CONFIG.xpGain;
    playTone(config.frequency, config.duration, config.type, config.volume);
  }, [playTone]);
  
  const playQuestComplete = useCallback(() => {
    const config = SOUND_CONFIG.questComplete;
    playTone(config.frequency, config.duration, config.type, config.volume);
    playTone(config.frequency * 1.5, config.duration, config.type, config.volume, 0.1);
  }, [playTone]);
  
  const playLevelUp = useCallback(() => {
    const config = SOUND_CONFIG.levelUp;
    playSequence(config.frequencies, config.duration, config.type, config.volume);
  }, [playSequence]);
  
  const playAttack = useCallback(() => {
    const config = SOUND_CONFIG.attack;
    playTone(config.frequency, config.duration, config.type, config.volume);
  }, [playTone]);
  
  const playBossHit = useCallback(() => {
    const config = SOUND_CONFIG.bossHit;
    playTone(config.frequency, config.duration, config.type, config.volume);
  }, [playTone]);
  
  const playBossDefeat = useCallback(() => {
    const config = SOUND_CONFIG.bossDefeat;
    playSequence(config.frequencies, config.duration, config.type, config.volume);
  }, [playSequence]);
  
  const playVictory = useCallback(() => {
    const config = SOUND_CONFIG.victory;
    playSequence(config.frequencies, config.duration, config.type, config.volume);
  }, [playSequence]);
  
  const playClick = useCallback(() => {
    const config = SOUND_CONFIG.click;
    playTone(config.frequency, config.duration, config.type, config.volume);
  }, [playTone]);
  
  const playError = useCallback(() => {
    const config = SOUND_CONFIG.error;
    playTone(config.frequency, config.duration, config.type, config.volume);
  }, [playTone]);
  
  const playPenaltyAlert = useCallback(() => {
    const config = SOUND_CONFIG.penaltyAlert;
    playSequence(config.frequencies, config.duration, config.type, config.volume);
  }, [playSequence]);
  
  const playRewardClaim = useCallback(() => {
    const config = SOUND_CONFIG.rewardClaim;
    playSequence(config.frequencies, config.duration, config.type, config.volume);
  }, [playSequence]);
  
  // Toggle sound enabled
  const toggleSound = useCallback(() => {
    enabledRef.current = !enabledRef.current;
    saveState('soundEnabled', enabledRef.current);
    return enabledRef.current;
  }, []);
  
  // Set sound enabled
  const setSoundEnabled = useCallback((enabled) => {
    enabledRef.current = enabled;
    saveState('soundEnabled', enabled);
  }, []);
  
  // Check if sound is enabled
  const isSoundEnabled = useCallback(() => enabledRef.current, []);
  
  // Cleanup AudioContext
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return {
    // Sound effects
    playXPGain,
    playQuestComplete,
    playLevelUp,
    playAttack,
    playBossHit,
    playBossDefeat,
    playVictory,
    playClick,
    playError,
    playPenaltyAlert,
    playRewardClaim,
    // Controls
    toggleSound,
    setSoundEnabled,
    isSoundEnabled,
  };
};

export default useSounds;
