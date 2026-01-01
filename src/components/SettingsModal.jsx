import { useRef, useEffect } from 'react';
import { Download, Upload, Trash2, X, Settings } from 'lucide-react';
import gsap from 'gsap';
import { exportSaveData, importSaveData } from '../gameState';

const SettingsModal = ({ isVisible, onClose, darkMode }) => {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  // Animation
  useEffect(() => {
    if (isVisible && overlayRef.current && modalRef.current) {
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      gsap.fromTo(modalRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' }
      );
    }
  }, [isVisible]);

  const handleExport = () => {
    const data = exportSaveData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hunter_stats_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onerror = () => {
      alert('Error reading file.');
      e.target.value = '';
    };
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (confirm('WARNING: This will overwrite your current progress. Are you sure?')) {
          const success = importSaveData(json);
          if (success) {
            alert('Data restored successfully! The system will now reload.');
            window.location.reload();
          } else {
            alert('Failed to import data. Invalid file format.');
          }
        }
      } catch {
        alert('Error reading file. Please ensure it is a valid JSON backup.');
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const handleReset = () => {
    if (confirm('CRITICAL WARNING: This will PERMANENTLY DELETE all your progress, stats, and journal entries. This action cannot be undone.\n\nAre you absolutely sure you want to reset?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={`w-full max-w-md mx-4 p-6 rounded-2xl border ${
          darkMode 
            ? 'bg-gray-900/95 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.15)]' 
            : 'bg-white border-cyan-200 shadow-xl'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Settings className={`w-5 h-5 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>System Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Data Management</h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Backup your hunter credentials or restore from a previous save.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                  darkMode 
                    ? 'border-cyan-500/30 hover:bg-cyan-900/20 text-cyan-300' 
                    : 'border-cyan-200 hover:bg-cyan-50 text-cyan-700'
                }`}
              >
                <Download className="w-6 h-6" />
                <span className="text-sm font-medium">Export Save</span>
              </button>

              <button
                onClick={handleImportClick}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                  darkMode 
                    ? 'border-purple-500/30 hover:bg-purple-900/20 text-purple-300' 
                    : 'border-purple-200 hover:bg-purple-50 text-purple-700'
                }`}
              >
                <Upload className="w-6 h-6" />
                <span className="text-sm font-medium">Import Save</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".json" 
                className="hidden" 
              />
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${darkMode ? 'bg-red-900/10 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>Reset Progress</h3>
                <p className={`text-xs mt-1 mb-3 ${darkMode ? 'text-red-300/70' : 'text-red-600/70'}`}>
                  Permanently delete all data and start over.
                </p>
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Reset System
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
