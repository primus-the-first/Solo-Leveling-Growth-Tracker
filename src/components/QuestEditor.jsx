import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

const PILLARS = [
  { id: 'personal', label: 'Personal', color: 'orange' },
  { id: 'spiritual', label: 'Spiritual', color: 'purple' },
  { id: 'financial', label: 'Financial', color: 'green' },
  { id: 'career', label: 'Career', color: 'cyan' },
  { id: 'education', label: 'Education', color: 'blue' },
];

const pillarColors = {
  personal: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
  spiritual: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
  financial: 'bg-green-500/20 border-green-500/50 text-green-400',
  career: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400',
  education: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
};

const QuestEditor = ({ quests, setQuests, questType = 'daily', darkMode = true }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);

  const handleEdit = (quest) => {
    setEditingId(quest.id);
    setEditForm({ ...quest });
  };

  const handleSave = () => {
    if (!editForm.task?.trim()) return;

    setQuests(prev => prev.map(q =>
      q.id === editingId ? {
        ...editForm,
        xp: parseInt(editForm.xp) || 20,
        task: editForm.task.trim()
      } : q
    ));
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this quest? This cannot be undone.')) {
      setQuests(prev => prev.filter(q => q.id !== id));
    }
  };

  const handleAdd = () => {
    if (!editForm.task?.trim()) return;

    // Generate collision-resistant ID: timestamp + random suffix
    const generateQuestId = () => `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newQuest = {
      id: generateQuestId(),
      task: editForm.task.trim(),
      xp: parseInt(editForm.xp) || 20,
      pillar: editForm.pillar || 'personal',
      completed: false,
    };
    setQuests(prev => [...prev, newQuest]);
    setShowAddForm(false);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setEditForm({});
  };

  const inputClasses = darkMode
    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-cyan-500'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-cyan-600';

  const buttonClasses = {
    save: 'p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-all',
    cancel: 'p-2 text-gray-400 hover:bg-gray-500/20 rounded-lg transition-all',
    edit: 'p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-all',
    delete: 'p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all',
  };

  return (
    <div className="space-y-3">
      {/* Quest List */}
      {quests.map(quest => (
        <div
          key={quest.id}
          className={`p-4 rounded-xl border ${
            darkMode
              ? 'bg-gray-800/50 border-gray-700'
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          {editingId === quest.id ? (
            // Edit Mode
            <div className="space-y-3">
              <input
                type="text"
                value={editForm.task || ''}
                onChange={e => setEditForm({ ...editForm, task: e.target.value })}
                placeholder="Quest description"
                className={`w-full px-3 py-2 rounded-lg border ${inputClasses}`}
                autoFocus
              />
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className={`text-xs mb-1 block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    XP Reward
                  </label>
                  <input
                    type="number"
                    value={editForm.xp || ''}
                    onChange={e => setEditForm({ ...editForm, xp: e.target.value })}
                    placeholder="XP"
                    min="1"
                    max="500"
                    className={`w-full px-3 py-2 rounded-lg border ${inputClasses}`}
                  />
                </div>
                <div className="flex-1">
                  <label className={`text-xs mb-1 block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Pillar
                  </label>
                  <select
                    value={editForm.pillar || 'personal'}
                    onChange={e => setEditForm({ ...editForm, pillar: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${inputClasses}`}
                  >
                    {PILLARS.map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={handleCancel} className={buttonClasses.cancel}>
                  <X className="w-5 h-5" />
                </button>
                <button onClick={handleSave} className={buttonClasses.save}>
                  <Save className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {quest.task}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-sm ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    +{quest.xp} XP
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${pillarColors[quest.pillar] || pillarColors.personal}`}>
                    {quest.pillar}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(quest)} className={buttonClasses.edit} title="Edit quest">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(quest.id)} className={buttonClasses.delete} title="Delete quest">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add New Quest Form */}
      {showAddForm ? (
        <div className={`p-4 rounded-xl border-2 border-dashed ${
          darkMode
            ? 'bg-gray-800/30 border-cyan-500/50'
            : 'bg-cyan-50 border-cyan-300'
        }`}>
          <div className="space-y-3">
            <input
              type="text"
              value={editForm.task || ''}
              onChange={e => setEditForm({ ...editForm, task: e.target.value })}
              placeholder="What quest do you want to add?"
              className={`w-full px-3 py-2 rounded-lg border ${inputClasses}`}
              autoFocus
            />
            <div className="flex gap-3">
              <div className="flex-1">
                <label className={`text-xs mb-1 block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  XP Reward
                </label>
                <input
                  type="number"
                  value={editForm.xp || ''}
                  onChange={e => setEditForm({ ...editForm, xp: e.target.value })}
                  placeholder="20"
                  min="1"
                  max="500"
                  className={`w-full px-3 py-2 rounded-lg border ${inputClasses}`}
                />
              </div>
              <div className="flex-1">
                <label className={`text-xs mb-1 block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Pillar
                </label>
                <select
                  value={editForm.pillar || 'personal'}
                  onChange={e => setEditForm({ ...editForm, pillar: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${inputClasses}`}
                >
                  {PILLARS.map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={handleCancel} className={buttonClasses.cancel}>
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={handleAdd}
                className={buttonClasses.save}
                disabled={!editForm.task?.trim()}
              >
                <Save className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className={`w-full py-4 rounded-xl border-2 border-dashed transition-all ${
            darkMode
              ? 'border-gray-600 text-gray-400 hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/5'
              : 'border-gray-300 text-gray-500 hover:border-cyan-500 hover:text-cyan-600 hover:bg-cyan-50'
          }`}
        >
          <Plus className="w-5 h-5 inline mr-2" />
          Add Custom {questType.charAt(0).toUpperCase() + questType.slice(1)} Quest
        </button>
      )}

      {/* Helper Text */}
      <p className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Custom quests persist through resets. Only the completion status resets.
      </p>
    </div>
  );
};

export default QuestEditor;
