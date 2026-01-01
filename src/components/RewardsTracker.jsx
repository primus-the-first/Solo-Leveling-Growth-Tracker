import { useState } from 'react';
import { Gift, Plus, Check, Trash2, Trophy } from 'lucide-react';

const RewardsTracker = ({ player, rewards, setRewards, darkMode = true }) => {
  const [isAdding, setIsAdding] = useState(false);
  // const [editingId, setEditingId] = useState(null);
  const [newReward, setNewReward] = useState({ name: '', xpRequired: 1000 });
  
  // Add new reward
  const handleAddReward = () => {
    if (!newReward.name.trim()) return;
    
    const reward = {
      id: Date.now().toString(),
      name: newReward.name,
      xpRequired: parseInt(newReward.xpRequired) || 1000,
      claimed: false,
    };
    
    setRewards(prev => [...prev, reward]);
    setNewReward({ name: '', xpRequired: 1000 });
    setIsAdding(false);
  };
  
  // Claim reward
  const claimReward = (id) => {
    setRewards(prev => prev.map(r => 
      r.id === id ? { ...r, claimed: true } : r
    ));
  };
  
  // Delete reward
  const deleteReward = (id) => {
    setRewards(prev => prev.filter(r => r.id !== id));
  };
  
  // Check if reward is unlocked
  const isUnlocked = (xpRequired) => player.totalXP >= xpRequired;
  
  // Sort rewards by XP required
  const sortedRewards = [...rewards].sort((a, b) => a.xpRequired - b.xpRequired);

  return (
    <div className={`glass-card p-6 rounded-2xl ${darkMode ? '' : 'bg-white/80'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-amber-500/20' : 'bg-amber-100'}`}>
            <Gift className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
          </div>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Real-Life Rewards
          </h3>
        </div>
        
        <button
          onClick={() => setIsAdding(true)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
            darkMode 
              ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' 
              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          }`}
        >
          <Plus className="w-4 h-4" />
          Add Reward
        </button>
      </div>
      
      {/* Add Reward Form */}
      {isAdding && (
        <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Reward name (e.g., Coffee treat)"
              value={newReward.name}
              onChange={e => setNewReward(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
              } focus:outline-none focus:border-amber-500`}
            />
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="XP Required"
                value={newReward.xpRequired}
                onChange={e => setNewReward(prev => ({ ...prev, xpRequired: e.target.value }))}
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                } focus:outline-none focus:border-amber-500`}
              />
              <button
                onClick={handleAddReward}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-400 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className={`px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                } hover:opacity-80 transition-opacity`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Rewards List */}
      <div className="space-y-3">
        {sortedRewards.length === 0 ? (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No rewards set yet.</p>
            <p className="text-sm">Add rewards to motivate yourself!</p>
          </div>
        ) : (
          sortedRewards.map(reward => {
            const unlocked = isUnlocked(reward.xpRequired);
            const progress = Math.min((player.totalXP / reward.xpRequired) * 100, 100);
            
            return (
              <div
                key={reward.id}
                className={`p-4 rounded-xl transition-all ${
                  reward.claimed
                    ? darkMode 
                      ? 'bg-green-500/10 border border-green-500/30' 
                      : 'bg-green-50 border border-green-200'
                    : unlocked
                      ? darkMode 
                        ? 'bg-amber-500/10 border border-amber-500/30' 
                        : 'bg-amber-50 border border-amber-200'
                      : darkMode 
                        ? 'bg-gray-800/50 border border-gray-700/30 opacity-60' 
                        : 'bg-gray-50 border border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {reward.claimed ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : unlocked ? (
                      <Gift className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Gift className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    )}
                    <span className={`font-medium ${
                      reward.claimed 
                        ? 'line-through text-gray-500' 
                        : darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {reward.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${
                      unlocked && !reward.claimed
                        ? 'text-amber-400 font-semibold'
                        : darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {reward.xpRequired.toLocaleString()} XP
                    </span>
                    
                    {unlocked && !reward.claimed && (
                      <button
                        onClick={() => claimReward(reward.id)}
                        className="px-3 py-1 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-400 transition-colors"
                      >
                        Claim
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteReward(reward.id)}
                      className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
                    >
                      <Trash2 className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </button>
                  </div>
                </div>
                
                {/* Progress bar for unclaimed */}
                {!reward.claimed && (
                  <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        unlocked ? 'bg-amber-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      
      {/* Summary */}
      {sortedRewards.length > 0 && (
        <div className={`mt-6 pt-4 border-t ${darkMode ? 'border-gray-700/50' : 'border-gray-200'} flex justify-between text-sm`}>
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            {sortedRewards.filter(r => r.claimed).length} / {sortedRewards.length} claimed
          </span>
          <span className={darkMode ? 'text-amber-400' : 'text-amber-600'}>
            Next: {sortedRewards.find(r => !r.claimed && !isUnlocked(r.xpRequired))?.xpRequired.toLocaleString() || 'All unlocked!'} XP
          </span>
        </div>
      )}
    </div>
  );
};

export default RewardsTracker;
