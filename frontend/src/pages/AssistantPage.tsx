import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, Globe, MessageSquare } from 'lucide-react';
import { api } from '../services/api';

export const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; language?: string }>>([
    {
      role: 'assistant',
      content: 'Hello! I am Michira AI, your multilingual route & journey assistant powered by real-time terrain and traveler review intelligence. You can ask me questions in English, हिन्दी, मराठी, தமிழ், or తెలుగు!',
      language: 'en'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { label: 'Marathi: कमी गर्दीची ठिकाणे', text: 'मला गोव्यात कमी गर्दीची ठिकाणे सांगा.', lang: 'mr' },
    { label: 'Hindi: पर्यटकों की समस्याएं', text: 'गोवा में पर्यटकों की मुख्य समस्याएं क्या हैं?', lang: 'hi' },
    { label: 'English: Hidden Gems', text: 'What are the top emerging hidden gems in Goa?', lang: 'en' },
    { label: 'English: Best Time Baga', text: 'What is the best time to visit Baga Beach to avoid crowd?', lang: 'en' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string, langOverride?: string) => {
    const query = textToSend || inputMessage;
    const lang = langOverride || selectedLanguage;
    if (!query.trim()) return;

    const newMsgs = [...messages, { role: 'user' as const, content: query, language: lang }];
    setMessages(newMsgs);
    if (!textToSend) setInputMessage('');
    setSending(true);

    try {
      const res = await api.sendChatMessage(query, lang, 'goa');
      if (res.success && res.data) {
        setMessages([...newMsgs, {
          role: 'assistant',
          content: res.data.content,
          language: res.data.language
        }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ced8d5] text-xs font-bold uppercase tracking-wider text-[#324340] shadow-inner">
          <Globe className="w-3.5 h-3.5" />
          <span>Multilingual Regional Assistant</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172021] uppercase tracking-tight">
          Ask Michira AI
        </h1>
        <p className="text-xs sm:text-sm text-[#4e5f5c] max-w-lg mx-auto">
          Query real tourist reviews, terrain conditions, crowd forecasts, and hidden gems in your preferred regional language.
        </p>
      </div>

      {/* Language Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { code: 'en', label: 'English' },
          { code: 'hi', label: 'हिन्दी (Hindi)' },
          { code: 'mr', label: 'मराठी (Marathi)' },
          { code: 'ta', label: 'தமிழ் (Tamil)' },
          { code: 'te', label: 'తెలుగు (Telugu)' }
        ].map(l => (
          <button
            key={l.code}
            onClick={() => setSelectedLanguage(l.code)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              selectedLanguage === l.code
                ? 'clay-pill-active'
                : 'clay-pill'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedLanguage(qp.lang);
              handleSend(qp.text, qp.lang);
            }}
            className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-[#d0dbd8] hover:bg-[#c2ceca] text-[#2c3d3a] shadow-inner transition-colors"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="clay-card overflow-hidden flex flex-col h-[520px]">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                m.role === 'user'
                  ? 'bg-[#1c2324] text-white'
                  : 'bg-[#d0deda] text-[#1c2324] shadow-inner font-mono'
              }`}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : 'M'}
              </div>

              <div className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'clay-dark-btn text-white rounded-tr-none'
                  : 'clay-card-white text-[#1a2324] rounded-tl-none space-y-2'
              }`}>
                <div className="whitespace-pre-line font-sans">{m.content}</div>
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#d0deda] text-[#1c2324] flex items-center justify-center text-xs shrink-0 font-mono font-bold">
                M
              </div>
              <div className="p-4 rounded-2xl clay-card-white text-[#526461] text-xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#1c2324] animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-[#1c2324] animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-[#1c2324] animate-pulse delay-150"></div>
                <span>Analyzing terrain & review intelligence in {selectedLanguage.toUpperCase()}...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#ccd7d4]/80 border-t border-[#b9c6c2]/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask Michira in ${selectedLanguage === 'mr' ? 'मराठी' : selectedLanguage === 'hi' ? 'हिन्दी' : 'English'}...`}
              className="flex-1 bg-[#e8efed] rounded-full px-5 py-3 text-xs text-[#1a2324] placeholder-[#6d7e7b] focus:outline-none focus:ring-2 focus:ring-[#1a2324] shadow-inner font-medium"
            />
            <button
              type="submit"
              disabled={sending || !inputMessage.trim()}
              className="clay-dark-btn px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

