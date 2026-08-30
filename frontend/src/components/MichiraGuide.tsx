import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import chimeSound from '../assets/floraphonic-happy-pop-3-185288.mp3';
import './MichiraGuide.css';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Message { role: 'user' | 'assistant'; content: string; }
interface PageContext { pageTitle?: string; destination?: string; }
type UIState = 'idle' | 'open' | 'closing';
type GeminiTurn = { role: 'user' | 'model'; parts: [{ text: string }] };

function toGeminiHistory(msgs: Message[]): GeminiTurn[] {
  return msgs.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
}

function usePageContext(): PageContext {
  const { pathname } = useLocation();
  if (pathname.startsWith('/destination/')) {
    const name = pathname.replace('/destination/', '').split('-').map((w: string) => w[0].toUpperCase() + w.slice(1)).join(' ');
    return { destination: name, pageTitle: `Destination: ${name}` };
  }
  const map: Record<string, string> = {
    '/explore': 'Explore Indian Destinations',
    '/planner': 'AI Journey Planner',
    '/reviews': 'Traveler Review Intelligence',
    '/experiences': 'Local Experiences',
    '/intelligence': 'Heritage Intelligence',
    '/admin': 'Tourism Analytics',
    '/': 'MICHIRA – India Heritage Discovery',
  };
  return { pageTitle: map[pathname] };
}

// ── SVGs ──────────────────────────────────────────────────────────────────────
const MichiraLogo = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 40 40" fill="none" width={size} height={size} aria-hidden="true">
    <path d="M20 3 L27 13 L27 16 L13 16 L13 13 Z" fill="#B99550" />
    <rect x="15" y="16" width="10" height="16" fill="none" stroke="#B99550" strokeWidth="1.2" />
    <path d="M11 32 H29 V36 H11 Z" fill="#B99550" opacity="0.9" />
    <circle cx="20" cy="9" r="1.4" fill="#0B0D0D" />
  </svg>
);
const ArrowRight = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const ArrowLeft = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
const SendIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1a1305" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;

const QUICK_ACTIONS = [
  { id: 'about', label: 'Tell me about this place', prompt: 'Tell me something fascinating about this destination — its history, architecture, and what makes it special.' },
  { id: 'timing', label: 'Best time to visit', prompt: 'What is the best time of year to visit, and what should I expect during peak vs. off-season?' },
  { id: 'reviews', label: 'What do travelers say?', prompt: 'What do travelers commonly love about this place, and any common concerns I should know about?' },
  { id: 'plan', label: 'Plan my trip', prompt: 'Help me plan a visit. Must-see spots, how many days, and what not to miss?' },
  { id: 'translate', label: 'Translate this', prompt: 'Give me useful travel phrases in the local language — greetings, directions, ordering food.' },
];

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// ── Main component ─────────────────────────────────────────────────────────────
interface Props {
  showToast: boolean;
  showFab: boolean;
  onDismissToast: () => void;
}

export const MichiraGuide: React.FC<Props> = ({ showToast, showFab, onDismissToast }) => {
  const pageContext = usePageContext();
  const [ui, setUi] = useState<UIState>('idle');
  const [mode, setMode] = useState<'menu' | 'chat'>('menu');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const toastPlayedRef = useRef(false);
  const pendingSoundRef = useRef(false);
  const soundUnlockedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio(chimeSound);
    audio.preload = 'auto';
    audio.volume = 0.5;
    audioRef.current = audio;

    const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    const audioContext = AudioContextCtor ? new AudioContextCtor() : null;
    audioContextRef.current = audioContext;

    if (audioContext) {
      fetch(chimeSound)
        .then(response => response.arrayBuffer())
        .then(buffer => audioContext.decodeAudioData(buffer.slice(0)))
        .then(decoded => {
          audioBufferRef.current = decoded;
        })
        .catch(error => {
          console.warn('[MICHIRA] Failed to decode toast sound buffer, falling back to HTML audio.', error);
        });
    }

    return () => {
      audio.pause();
      audioRef.current = null;
      audioBufferRef.current = null;
      if (audioContextRef.current) {
        void audioContextRef.current.close().catch(() => { });
        audioContextRef.current = null;
      }
    };
  }, []);

  const playToastSound = useCallback(() => {
    const audioContext = audioContextRef.current;
    const audioBuffer = audioBufferRef.current;

    if (audioContext && audioBuffer) {
      const startPlayback = () => {
        const source = audioContext.createBufferSource();
        const gain = audioContext.createGain();
        gain.gain.value = 0.55;
        source.buffer = audioBuffer;
        source.connect(gain);
        gain.connect(audioContext.destination);
        source.start(0);
      };

      if (audioContext.state === 'running') {
        startPlayback();
        return Promise.resolve();
      }

      return audioContext.resume().then(() => {
        startPlayback();
      });
    }

    if (!audioRef.current) return Promise.reject(new Error('Audio not ready'));

    audioRef.current.currentTime = 0;
    return audioRef.current.play();
  }, []);

  useEffect(() => {
    const unlockAndReplay = () => {
      soundUnlockedRef.current = true;

      if (!pendingSoundRef.current) return;

      playToastSound()
        .then(() => {
          pendingSoundRef.current = false;
        })
        .catch(() => {
          // Keep pending until the browser allows playback on a later gesture.
        });
    };

    document.addEventListener('pointerdown', unlockAndReplay);
    document.addEventListener('keydown', unlockAndReplay);
    document.addEventListener('touchstart', unlockAndReplay);

    return () => {
      document.removeEventListener('pointerdown', unlockAndReplay);
      document.removeEventListener('keydown', unlockAndReplay);
      document.removeEventListener('touchstart', unlockAndReplay);
    };
  }, [playToastSound]);

  useEffect(() => {
    if (!showToast) {
      toastPlayedRef.current = false;
      pendingSoundRef.current = false;
      return;
    }

    if (!audioRef.current || toastPlayedRef.current) return;

    const triggerSound = () => {
      if (!soundUnlockedRef.current) {
        pendingSoundRef.current = true;
        return;
      }

      toastPlayedRef.current = true;
      playToastSound().catch(error => {
        pendingSoundRef.current = true;
        toastPlayedRef.current = false;
        console.warn('[MICHIRA] Toast sound playback failed after user interaction.', error);
      });
    };

    const animationFrame = window.requestAnimationFrame(() => {
      triggerSound();
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [showToast, playToastSound]);

  useEffect(() => {
    if (ui === 'open' && mode === 'chat') messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending, ui, mode]);

  useEffect(() => {
    if (ui === 'open' && mode === 'chat') setTimeout(() => inputRef.current?.focus(), 100);
  }, [ui, mode]);

  const openGuide = useCallback(() => {
    if (messages.length === 0) setMode('menu');
    setUi('open');
  }, [messages.length]);

  const closeGuide = useCallback(() => {
    setUi('closing');
    setTimeout(() => setUi('idle'), 300);
  }, []);

  const dismissToast = useCallback(() => {
    onDismissToast();
  }, [onDismissToast]);

  const sendMessage = useCallback(async (text: string) => {
    const history = toGeminiHistory(messages);
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setSending(true);
    setMode('chat');
    try {
      const res = await fetch(`${API_BASE}/guide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, pageContext, conversationHistory: history, language: 'en' }),
      });
      const json = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: json.success ? json.data.content : (json.error || 'Something went wrong.'),
      }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Unable to reach MICHIRA GUIDE. Please check your connection.' }]);
    } finally {
      setSending(false);
    }
  }, [messages, pageContext]);

  const ctxLabel = pageContext.destination || pageContext.pageTitle;

  // ── Render ──────────────────────────────────────────────────────────────────

  // Full guide card takes priority
  if (ui === 'open' || ui === 'closing') {
    return (
      <div className={`mg-card${ui === 'closing' ? ' mg-closing' : ''}`} role="dialog" aria-label="MICHIRA GUIDE" aria-modal="false">
        <div className="mg-header">
          <div className="mg-header-left">
            <div className="mg-header-icon"><MichiraLogo size={17} /></div>
            <span className="mg-header-title">MICHIRA GUIDE</span>
            <div className="mg-header-dot" />
          </div>
          <button className="mg-close-btn" onClick={closeGuide} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="mg-body">
          {mode === 'menu' ? (
            <div className="mg-menu">
              <p className="mg-greeting">"Namaste. What would you<br />like to discover?"</p>
              <p className="mg-greeting-sub">Your AI travel concierge for India's heritage.</p>
              {ctxLabel && (
                <div className="mg-context-pill">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" /></svg>
                  {ctxLabel}
                </div>
              )}
              <div className="mg-divider" />
              <p className="mg-actions-label">Quick questions</p>
              {QUICK_ACTIONS.map(a => (
                <button key={a.id} className="mg-action" onClick={() => sendMessage(a.prompt)}>
                  <span className="mg-action-text">{a.label}</span>
                  <span className="mg-action-arrow"><ArrowRight /></span>
                </button>
              ))}
            </div>
          ) : (
            <>
              <button className="mg-back-btn" onClick={() => setMode('menu')}><ArrowLeft /> Quick actions</button>
              <div className="mg-messages" aria-live="polite">
                {messages.map((m, i) => (
                  <div key={i} className={`mg-msg mg-msg-${m.role}`}>
                    <span className="mg-msg-label">{m.role === 'user' ? 'You' : 'MICHIRA'}</span>
                    <div className="mg-msg-bubble">{m.content}</div>
                  </div>
                ))}
                {sending && (
                  <div className="mg-msg mg-msg-assistant">
                    <span className="mg-msg-label">MICHIRA</span>
                    <div className="mg-typing">
                      <div className="mg-typing-dot" /><div className="mg-typing-dot" /><div className="mg-typing-dot" />
                      <span className="mg-typing-text">thinking…</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </>
          )}
        </div>

        <form className="mg-input-bar" onSubmit={e => { e.preventDefault(); const t = input.trim(); if (t && !sending) sendMessage(t); }}>
          <input ref={inputRef} className="mg-input" type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask MICHIRA anything…" disabled={sending} autoComplete="off" />
          <button type="submit" className="mg-send-btn" disabled={!input.trim() || sending}><SendIcon /></button>
        </form>
      </div>
    );
  }

  if (ui === 'idle') {
    return (
      <div className="mg-floating-ui">
        {showToast && (
          <div
            className="mg-toast"
            ref={toastRef}
            onClick={openGuide}
            role="button"
            tabIndex={0}
            aria-label="Open MICHIRA GUIDE"
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openGuide();
              }
            }}
          >
            <div className="mg-toast-logo"><MichiraLogo size={20} /></div>
            <div className="mg-toast-body">
              <span className="mg-toast-msg">Hey 🪔 How can we help?</span>
            </div>
            <button
              className="mg-toast-close"
              aria-label="Dismiss"
              onClick={event => {
                event.stopPropagation();
                dismissToast();
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {showFab && (
          <button className="mg-fab" onClick={openGuide} aria-label="Open MICHIRA GUIDE">
            <div className="mg-fab-logo"><MichiraLogo size={18} /></div>
            <span className="mg-fab-label">Journey With MICHIRA</span>
          </button>
        )}
      </div>
    );
  }

  return null;
};
