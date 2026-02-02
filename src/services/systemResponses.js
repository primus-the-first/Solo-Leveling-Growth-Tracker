// System Response Generator - Phase 1 MVP (Canned Responses Only)
// No AI calls - pure rule-based logic for $0 cost

/**
 * Generate a response from The System based on player state and query
 * @param {string} query - User's question/command
 * @param {object} context - { player, dailyQuests, weeklyQuests, monthlyQuests, pillars, bossBattles, achievements }
 * @returns {string} The System's response
 */
export const generateSystemResponse = (query, context) => {
  const { player, dailyQuests, weeklyQuests, monthlyQuests, pillars, bossBattles, achievements } = context;
  
  const intent = detectIntent(query);
  
  // Get appropriate response based on intent
  switch (intent) {
    case 'greeting':
      return getGreetingResponse(player);
    case 'status':
      return getStatusResponse(player, dailyQuests);
    case 'streak':
      return getStreakResponse(player);
    case 'level':
      return getLevelResponse(player);
    case 'quests':
      return getQuestResponse(dailyQuests, weeklyQuests, monthlyQuests);
    case 'penalty':
      return getPenaltyResponse(player);
    case 'boss':
      return getBossResponse(bossBattles, player);
    case 'pillar':
      return getPillarResponse(pillars);
    case 'achievements':
      return getAchievementResponse(achievements);
    case 'motivation':
      return getMotivationResponse(player);
    case 'help':
      return getHelpResponse();
    default:
      return getFallbackResponse(player);
  }
};

/**
 * Detect user intent from query using keyword matching
 */
const detectIntent = (query) => {
  const lower = query.toLowerCase().trim();
  
  // Greeting patterns
  if (/^(hi|hello|hey|greetings|yo|sup)/.test(lower)) return 'greeting';
  
  // Status queries
  if (lower.includes('status') || lower.includes('how am i') || lower.includes('summary') || lower.includes('overview')) return 'status';
  
  // Streak queries
  if (lower.includes('streak') || lower.includes('days in a row') || lower.includes('consecutive')) return 'streak';
  
  // Level queries
  if (lower.includes('level') || lower.includes('rank') || lower.includes('xp') || lower.includes('experience')) return 'level';
  
  // Quest queries
  if (lower.includes('quest') || lower.includes('task') || lower.includes('today') || lower.includes('daily') || lower.includes('todo')) return 'quests';
  
  // Penalty queries
  if (lower.includes('penalty') || lower.includes('punishment') || lower.includes('missed') || lower.includes('failed')) return 'penalty';
  
  // Boss queries
  if (lower.includes('boss') || lower.includes('battle') || lower.includes('fight') || lower.includes('enemy')) return 'boss';
  
  // Pillar queries
  if (lower.includes('pillar') || lower.includes('skill') || lower.includes('stat') || lower.includes('focus')) return 'pillar';
  
  // Achievement queries
  if (lower.includes('achievement') || lower.includes('unlock') || lower.includes('badge') || lower.includes('trophy')) return 'achievements';
  
  // Motivation queries
  if (lower.includes('motivate') || lower.includes('encourage') || lower.includes('inspire') || lower.includes('push')) return 'motivation';
  
  // Help queries
  if (lower.includes('help') || lower.includes('what can') || lower.includes('how do') || lower.includes('commands')) return 'help';
  
  return 'unknown';
};

// ============ RESPONSE GENERATORS ============

const getGreetingResponse = (player) => {
  const { level, name, title } = player;
  
  if (level < 5) {
    return `Acknowledged, ${name}. You stand at the beginning of your journey. The System observes your progress.`;
  } else if (level < 15) {
    return `${title}. The System recognizes your dedication. Continue your ascension.`;
  } else {
    return `${title} ${name}. Your power grows formidable. The System awaits your next command.`;
  }
};

const getStatusResponse = (player, dailyQuests) => {
  const { level, title, totalXP, streaks, xpMultiplier } = player;
  const completedToday = dailyQuests.filter(q => q.completed).length;
  const totalToday = dailyQuests.length;
  
  return `STATUS REPORT:
• Level ${level} - ${title}
• Total XP: ${totalXP.toLocaleString()}
• Streak: ${streaks.daily} days
• XP Multiplier: ${xpMultiplier}x
• Today's Progress: ${completedToday}/${totalToday} quests

${completedToday === totalToday ? 'All daily quests complete. Exemplary performance.' : `${totalToday - completedToday} quests remain. Do not falter.`}`;
};

const getStreakResponse = (player) => {
  const { streaks, xpMultiplier } = player;
  const { daily, longestDaily } = streaks;
  
  if (daily === 0) {
    return 'Your streak stands at zero. The path to power requires daily discipline. Begin today.';
  } else if (daily < 7) {
    return `Current streak: ${daily} days. ${7 - daily} more days until Week Warrior bonus. Do not break the chain.`;
  } else if (daily < 30) {
    return `${daily} day streak active. XP multiplier: ${xpMultiplier}x. Your longest streak: ${longestDaily} days. Continue your ascension.`;
  } else {
    return `Impressive. ${daily} consecutive days of discipline. Your dedication rivals the Shadow Monarch's own. Multiplier: ${xpMultiplier}x.`;
  }
};

const getLevelResponse = (player) => {
  const { level, title, totalXP } = player;
  
  const levelMessages = {
    1: 'You are Awakened. Every hunter begins here. Prove your worth through daily quests.',
    5: 'B-Rank achieved. You have surpassed the weak. Continue climbing.',
    10: 'A-Rank. Few reach this height. The gates grow more dangerous ahead.',
    15: 'S-Rank. You walk among the elite. National recognition awaits.',
    20: 'National Hunter status. Your name echoes across the land.',
    25: 'Shadow Monarch. Maximum level achieved. You stand at the pinnacle.'
  };
  
  const nearestLevel = Object.keys(levelMessages)
    .map(Number)
    .filter(l => l <= level)
    .pop() || 1;
  
  return `Level ${level}: ${title}
Total XP: ${totalXP.toLocaleString()}

${levelMessages[nearestLevel]}`;
};

const getQuestResponse = (dailyQuests, weeklyQuests, monthlyQuests) => {
  const dailyComplete = dailyQuests.filter(q => q.completed).length;
  const weeklyComplete = weeklyQuests.filter(q => q.completed).length;
  const monthlyComplete = monthlyQuests.filter(q => q.completed).length;
  
  const dailyXP = dailyQuests.filter(q => !q.completed).reduce((sum, q) => sum + q.xp, 0);
  const weeklyXP = weeklyQuests.filter(q => !q.completed).reduce((sum, q) => sum + q.xp, 0);
  
  let response = `QUEST STATUS:
• Daily: ${dailyComplete}/${dailyQuests.length} (${dailyXP} XP remaining)
• Weekly: ${weeklyComplete}/${weeklyQuests.length} (${weeklyXP} XP remaining)
• Monthly: ${monthlyComplete}/${monthlyQuests.length}

`;

  if (dailyComplete === dailyQuests.length) {
    response += 'Daily quests complete. Rest or pursue additional challenges.';
  } else {
    const nextQuest = dailyQuests.find(q => !q.completed);
    response += `Next task: "${nextQuest?.task}". Execute immediately.`;
  }
  
  return response;
};

const getPenaltyResponse = (player) => {
  const { penalties, xpMultiplier } = player;
  
  if (penalties.active) {
    return `WARNING: PENALTY ZONE ACTIVE
You have failed to maintain discipline. Complete all recovery quests to restore your standing.
Current XP multiplier: ${xpMultiplier}x (reduced)
Total infractions: ${penalties.missedDays}

The weak are not forgiven. Prove yourself.`;
  } else if (penalties.missedDays > 0) {
    return `You have accumulated ${penalties.missedDays} total infractions. 
Current status: Clear
XP Multiplier: ${xpMultiplier}x

Maintain your discipline. The System does not forget past failures.`;
  } else {
    return 'Your record is clean. Zero penalties recorded. Continue this exemplary performance.';
  }
};

const getBossResponse = (bossBattles, player) => {
  const defeated = bossBattles.filter(b => b.defeated);
  const available = bossBattles.filter(b => !b.defeated && b.levelRequired <= player.level);
  const locked = bossBattles.filter(b => !b.defeated && b.levelRequired > player.level);
  
  let response = `BOSS BATTLE STATUS:
• Defeated: ${defeated.length}/${bossBattles.length}
• Available: ${available.length}
• Locked: ${locked.length}

`;

  if (available.length > 0) {
    const nextBoss = available[0];
    response += `Next challenge: ${nextBoss.name}
"${nextBoss.description}"
Reward: ${nextBoss.xpReward} XP + Title: "${nextBoss.titleReward}"

Challenge when ready.`;
  } else if (locked.length > 0) {
    const nextLocked = locked[0];
    response += `Next boss unlocks at Level ${nextLocked.levelRequired}. Continue leveling.`;
  } else {
    response += 'All bosses defeated. You have conquered every challenge. The Shadow Monarch rises.';
  }
  
  return response;
};

const getPillarResponse = (pillars) => {
  const pillarArray = Object.values(pillars);
  const lowestPillar = pillarArray.reduce((min, p) => p.level < min.level ? p : min);
  const highestPillar = pillarArray.reduce((max, p) => p.level > max.level ? p : max);
  
  let response = `PILLAR ANALYSIS:

`;
  
  pillarArray.forEach(p => {
    response += `• ${p.title}: Level ${p.level} (${p.xp} XP)\n`;
  });
  
  response += `
Strongest: ${highestPillar.title}
Weakest: ${lowestPillar.title}

${lowestPillar.level < highestPillar.level - 2 
  ? `Focus on ${lowestPillar.title} to achieve balance. Weakness invites failure.`
  : 'Your pillars are well-balanced. Continue steady progression.'}`;
  
  return response;
};

const getAchievementResponse = (achievements) => {
  const unlocked = achievements.filter(a => a.unlocked);
  const locked = achievements.filter(a => !a.unlocked);
  const totalXPEarned = unlocked.reduce((sum, a) => sum + a.xp, 0);
  
  let response = `ACHIEVEMENT STATUS:
• Unlocked: ${unlocked.length}/${achievements.length}
• XP from achievements: ${totalXPEarned}

`;

  if (unlocked.length > 0) {
    response += `Earned:\n`;
    unlocked.forEach(a => {
      response += `✓ ${a.name}\n`;
    });
    response += '\n';
  }
  
  if (locked.length > 0) {
    const nextAchievement = locked[0];
    response += `Next target: "${nextAchievement.name}"
${nextAchievement.description}
Reward: ${nextAchievement.xp} XP`;
  }
  
  return response;
};

const getMotivationResponse = (player) => {
  const { level, streaks, title } = player;
  
  const motivationalMessages = [
    'Arise. The weak hesitate while the strong advance. Which are you?',
    'Every quest completed is a step toward transcendence. Move forward.',
    'Pain is temporary. Glory is eternal. Push through.',
    'The gate to power stands before you. Only your effort opens it.',
    'Champions are forged through daily discipline. Forge yourself.',
    'You have come too far to stop now. Continue ascending.',
    'The System chose you for a reason. Prove it was not mistaken.',
    'Weakness today becomes regret tomorrow. Choose strength.',
  ];
  
  let message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  
  if (streaks.daily >= 7) {
    message += `\n\n${streaks.daily}-day streak active. You embody discipline itself.`;
  }
  
  if (level >= 10) {
    message += `\n\n${title}. Your power speaks for itself.`;
  }
  
  return message;
};

const getHelpResponse = () => {
  return `THE SYSTEM - AVAILABLE COMMANDS:

• "status" - View complete character overview
• "streak" - Check current streak and multiplier
• "level" - View rank and progression details
• "quests" - Daily/weekly/monthly quest status
• "penalty" - Check penalty status and history
• "boss" - View available boss battles
• "pillar" - Analyze skill pillar balance
• "achievements" - View unlocked badges
• "motivate" - Receive encouragement

Speak your query, Hunter. The System listens.`;
};

const getFallbackResponse = (player) => {
  const responses = [
    'The System does not understand your query. Speak clearly, Hunter.',
    'Rephrase your question. The System awaits a valid command.',
    `${player.title}. Your words are unclear. Try asking about your status, quests, or level.`,
    'Unknown command. Say "help" to view available queries.',
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export default generateSystemResponse;
