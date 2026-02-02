import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, ChevronDown } from 'lucide-react';
import { generateSystemResponse } from '../services/systemResponses';

const SystemWindow = ({ 
  isOpen, 
  onClose, 
  player, 
  dailyQuests,
  weeklyQuests,
  monthlyQuests,
  pillars,
  bossBattles,
  achievements,
  darkMode = true 
}) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getInitialGreeting = (playerData) => {
    const { level, name, title } = playerData;
    if (level < 5) {
      return `Awakened Hunter ${name}. The System acknowledges your presence. How may I guide your ascension?`;
    } else if (level < 15) {
      return `${title}. The System stands ready to assist. Speak your query.`;
    } else {
      return `${title} ${name}. The System awaits your command.`;
    }
  };

  const addSystemMessage = (text) => {
    setMessages(prev => [...prev, { type: 'system', text, timestamp: Date.now() }]);
  };

  // Focus input when window opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      
      // Add initial greeting if no messages
      if (messages.length === 0) {
        addSystemMessage(getInitialGreeting(player));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userQuery = inputValue.trim();
    setInputValue('');
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: userQuery, timestamp: Date.now() }]);
    
    // Simulate typing delay for immersion
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
    setIsTyping(false);

    // Generate and add system response
    const context = { player, dailyQuests, weeklyQuests, monthlyQuests, pillars, bossBattles, achievements };
    const response = generateSystemResponse(userQuery, context);
    addSystemMessage(response);
  };

  const handleQuickAction = (query) => {
    setInputValue(query);
    // Trigger submit
    const context = { player, dailyQuests, weeklyQuests, monthlyQuests, pillars, bossBattles, achievements };
    setMessages(prev => [...prev, { type: 'user', text: query, timestamp: Date.now() }]);
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response = generateSystemResponse(query, context);
      addSystemMessage(response);
    }, 600);
    
    setInputValue('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Window */}
      <div className={`relative w-full max-w-2xl rounded-2xl border-2 overflow-hidden shadow-2xl animate-enter ${
        darkMode 
          ? 'bg-gray-900/95 border-cyan-500/50 shadow-cyan-500/20' 
          : 'bg-white/95 border-cyan-600 shadow-cyan-500/30'
      }`}>
        
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-2xl opacity-50 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 animate-pulse" 
               style={{ animationDuration: '3s' }} />
        </div>

        {/* Header */}
        <div className={`relative flex items-center justify-between p-4 border-b ${
          darkMode ? 'border-cyan-500/30 bg-gray-900/50' : 'border-cyan-500/30 bg-gray-100/50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              <div className="absolute inset-0 animate-ping opacity-50">
                <Sparkles className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                THE SYSTEM
              </h2>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                Omniscient Guide • Phase 1
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className={`p-2 rounded-lg transition-all ${
              darkMode 
                ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400' 
                : 'hover:bg-red-100 text-gray-500 hover:text-red-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade`}
            >
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl whitespace-pre-line ${
                msg.type === 'user'
                  ? 'bg-cyan-600 text-white rounded-br-sm'
                  : darkMode
                    ? 'bg-gray-800 border border-cyan-500/30 text-gray-200 rounded-bl-sm'
                    : 'bg-gray-100 border border-cyan-500/30 text-gray-800 rounded-bl-sm'
              }`}>
                {msg.type === 'system' && (
                  <div className="flex items-center gap-2 mb-2 text-xs text-cyan-400 font-semibold">
                    <Sparkles className="w-3 h-3" />
                    SYSTEM
                  </div>
                )}
                <div className={`text-sm leading-relaxed ${
                  msg.type === 'system' ? 'font-mono' : ''
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-fade">
              <div className={`px-4 py-3 rounded-2xl rounded-bl-sm ${
                darkMode 
                  ? 'bg-gray-800 border border-cyan-500/30' 
                  : 'bg-gray-100 border border-cyan-500/30'
              }`}>
                <div className="flex items-center gap-2 text-cyan-400">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span className="text-sm animate-pulse">The System is analyzing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className={`px-4 py-2 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['status', 'streak', 'quests', 'boss', 'motivate'].map(action => (
              <button
                key={action}
                onClick={() => handleQuickAction(action)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
                  darkMode
                    ? 'bg-gray-800 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 border border-gray-700 hover:border-cyan-500/50'
                    : 'bg-gray-100 hover:bg-cyan-50 text-gray-600 hover:text-cyan-600 border border-gray-300 hover:border-cyan-500'
                }`}
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <form 
          onSubmit={handleSubmit}
          className={`relative p-4 border-t ${
            darkMode ? 'border-cyan-500/30 bg-gray-900/50' : 'border-cyan-500/30 bg-gray-50'
          }`}
        >
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask The System..."
              className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 focus:border-cyan-500 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 focus:border-cyan-500 text-gray-900 placeholder-gray-400'
              }`}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                inputValue.trim()
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                  : darkMode
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Keyboard hint */}
        <div className={`text-center py-2 text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          Press <kbd className={`px-1.5 py-0.5 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>Enter</kbd> to send
        </div>
      </div>
    </div>
  );
};

export default SystemWindow;
