import React, { useState } from 'react';
import { chatWithAssistantApi } from '../services/api';
import { Bot, Send, User, Sparkles, HelpCircle } from 'lucide-react';

export const AIChatPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Welcome to your full-page AI Career Assistant. Ask me anything about your current skills, roadmap timeline, project choices, or learning strategies!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
          text: 'Sorry, I encountered an issue fetching a response. Please check your backend server.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'What should I learn after JavaScript?',
    'Am I ready for React?',
    'Should I learn MongoDB or SQL first?',
    'Which project should I build next?',
    'What skills am I missing?',
    'How long will my roadmap take?'
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="border-b border-gray-800 pb-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          <span>Interactive AI Assistant</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Bot className="w-8 h-8 text-brand-accent" />
          AI Career Assistant Chat
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Ask personalized career questions. Your assistant has live access to your saved profile, roadmap, and project recommendations.
        </p>
      </div>

      {/* Main Chat Box Container */}
      <div className="glass-panel rounded-3xl border border-gray-800 flex flex-col h-[600px] overflow-hidden shadow-glow-indigo">
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gradient-to-tr from-brand-600 to-indigo-600 text-cyan-300'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[80%] ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-none shadow-glow-indigo'
                    : 'glass-card border border-gray-800 text-gray-200 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-2 text-xs text-gray-400 p-2">
              <Bot className="w-4 h-4 text-brand-accent animate-spin-slow" />
              <span>AI Mentor is crafting a personalized answer...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        <div className="px-6 py-3 border-t border-gray-800 bg-dark-bg/40">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-brand-accent" />
            Suggested Questions to Ask:
          </p>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-xs px-3 py-1.5 rounded-xl bg-dark-card hover:bg-gray-800 border border-gray-700 text-gray-300 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Box */}
        <div className="p-4 border-t border-gray-800 bg-dark-card/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your target role, roadmap, or projects..."
              className="flex-1 px-4 py-3 rounded-2xl bg-dark-bg border border-gray-700 focus:border-brand-500 focus:outline-none text-xs sm:text-sm text-white placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-glow-indigo transition-all flex items-center space-x-2"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
