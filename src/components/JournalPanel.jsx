import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Book, Plus, Trash2, Save, Edit3, FileText, X } from 'lucide-react';

const JournalEditor = ({ entry, onSave, onCancel, darkMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(entry.title);
  const [editContent, setEditContent] = useState(entry.content);

  const handleSaveWrapper = () => {
    onSave(editTitle, editContent);
    setIsEditing(false);
  };

  const handleCancelWrapper = () => {
    // Reset to original props if canceling
    setEditTitle(entry.title);
    setEditContent(entry.content);
    setIsEditing(false);
    onCancel?.();
  };

  return (
    <>
      {/* Toolbar */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-200'} flex justify-between items-center`}>
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className={`bg-transparent font-bold text-lg focus:outline-none w-full mr-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}
            placeholder="Entry Title"
            autoFocus
          />
        ) : (
          <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{entry.title}</h2>
        )}
        
        <div className="flex gap-2 shrink-0">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelWrapper}
                className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSaveWrapper}
                className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-colors text-sm"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                darkMode 
                  ? 'bg-gray-800 text-cyan-400 hover:bg-gray-700' 
                  : 'bg-gray-100 text-cyan-600 hover:bg-gray-200'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
      </div>
      
      {/* Editor / Preview */}
      <div className="flex-1 overflow-hidden relative">
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className={`w-full h-full p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed ${
              darkMode 
                ? 'bg-gray-900/30 text-gray-300 placeholder:text-gray-600' 
                : 'bg-gray-50 text-gray-800 placeholder:text-gray-400'
            }`}
            placeholder="Write your entry here... (Markdown supported)"
          />
        ) : (
          <div className={`h-full overflow-y-auto p-6 prose ${darkMode ? 'prose-invert' : ''} max-w-none`}>
            <ReactMarkdown>{entry.content}</ReactMarkdown>
          </div>
        )}
      </div>
      
      {/* Help text for markdown */}
      {isEditing && (
        <div className={`px-4 py-2 text-xs border-t ${darkMode ? 'border-gray-700/50 text-gray-500' : 'border-gray-200 text-gray-500'}`}>
          Supports Markdown: # Heading, **bold**, *italic*, - list
        </div>
      )}
    </>
  );
};

const JournalPanel = ({ journal, setJournal, darkMode = true }) => {
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  
  // Find currently selected entry
  const selectedEntry = journal.find(e => e.id === selectedEntryId);
  
  const handleCreateEntry = () => {
    const newEntry = {
      id: Date.now().toString(),
      title: 'New Entry',
      content: '# New Entry\n\nWrite your thoughts here...',
      date: new Date().toISOString(),
    };
    
    setJournal(prev => [newEntry, ...prev]);
    setSelectedEntryId(newEntry.id);
  };
  
  const handleSave = (id, title, content) => {
    setJournal(prev => prev.map(entry => 
      entry.id === id
        ? { 
            ...entry, 
            title: title, 
            content: content, 
            date: new Date().toISOString() 
          } 
        : entry
    ));
  };
  
  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this entry?')) {
      setJournal(prev => prev.filter(entry => entry.id !== id));
      if (selectedEntryId === id) {
        setSelectedEntryId(null);
      }
    }
  };

  // Format date helper
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`glass-card rounded-2xl overflow-hidden flex flex-col md:flex-row h-[600px] ${darkMode ? '' : 'bg-white/80'}`}>
      {/* Sidebar - Entry List */}
      <div className={`w-full md:w-1/3 border-r ${darkMode ? 'border-gray-700/50' : 'border-gray-200'} flex flex-col max-h-[200px] md:max-h-full`}>
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-200'} flex justify-between items-center`}>
          <div className="flex items-center gap-2">
            <Book className={`w-5 h-5 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Journal</h3>
          </div>
          <button
            onClick={handleCreateEntry}
            className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
            title="New Entry"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {journal.length === 0 ? (
            <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <p>No entries yet.</p>
              <p className="text-xs mt-1">Start your journey.</p>
            </div>
          ) : (
            journal.map(entry => (
              <div
                key={entry.id}
                onClick={() => setSelectedEntryId(entry.id)}
                className={`
                  p-3 rounded-xl cursor-pointer transition-all border
                  ${selectedEntryId === entry.id
                    ? darkMode 
                      ? 'bg-cyan-900/20 border-cyan-500/50' 
                      : 'bg-cyan-50 border-cyan-200'
                    : darkMode
                      ? 'bg-transparent border-transparent hover:bg-gray-800/50'
                      : 'bg-transparent border-transparent hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`font-medium truncate pr-2 ${
                    selectedEntryId === entry.id 
                      ? darkMode ? 'text-cyan-300' : 'text-cyan-700'
                      : darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {entry.title || 'Untitled'}
                  </h4>
                  <button
                    onClick={(e) => handleDelete(entry.id, e)}
                    className={`opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity ${
                      selectedEntryId === entry.id ? 'opacity-100' : ''
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {formatDate(entry.date)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-opacity-50">
        {selectedEntry ? (
          <JournalEditor
            key={selectedEntry.id}
            entry={selectedEntry}
            onSave={(title, content) => handleSave(selectedEntry.id, title, content)}
            darkMode={darkMode}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <FileText className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">Select an entry or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalPanel;
