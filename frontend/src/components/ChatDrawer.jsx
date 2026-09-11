import React, { useState, useRef, useEffect } from 'react';
import { chatWithAssistantApi } from '../services/api';
import { Bot, Send, User, X, Sparkles, MessageSquare } from 'lucide-react';
import { FormattedMessage } from './FormattedMessage';

export const ChatDrawer = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I am your AI Career Mentor. I have full context on your target career, skills, and roadmap. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await chatWithAssistantApi(query, newMessages);
      setMessages([...newMessages, { sender: 'assistant', text: res.data.reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          sender: 'assistant',
          text: 'Sorry, I encountered an issue fetching a response. Please check your backend connection or try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'What should I learn after JavaScript?',
    'Am I ready for React?',
    'Which project should I build next?',
    'What skills am I currently missing?'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-dark-bg/95 backdrop-blur-xl border-l border-gray-800 shadow-2xl flex flex-col justify-between animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-dark-card/50">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 p-0.5 shadow-glow-indigo flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              AI Career Assistant
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[11px] text-gray-400">Context-Aware Career Guide</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gradient-to-tr from-brand-600 to-indigo-600 text-cyan-300'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div
              className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[80%] ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-none shadow-glow-indigo'
                  : 'glass-card border border-gray-800 text-gray-200 rounded-tl-none'
              }`}
            >
              {msg.sender === 'user' ? msg.text : <FormattedMessage text={msg.text} />}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-xs text-gray-400 p-2">
            <Bot className="w-4 h-4 text-brand-accent animate-spin-slow" />
            <span>AI Mentor is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggested Prompts */}
      <div className="px-4 py-2 border-t border-gray-800/60 bg-dark-bg/40">
        <p className="text-[10px] uppercase font-bold text-gray-500 mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Suggested Questions
        </p>
        <div className="flex flex-wrap gap-1.5">
          {samplePrompts.map((prompt, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-dark-card hover:bg-gray-800 border border-gray-700 text-gray-300 transition-colors text-left truncate max-w-full"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-gray-800 bg-dark-card/50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about skills, projects, roadmap..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-dark-bg border border-gray-700 focus:border-brand-500 focus:outline-none text-xs text-white placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 disabled:opacity-50 text-white shadow-glow-indigo transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
