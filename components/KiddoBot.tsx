
import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, MessageCircle, X, Lightbulb } from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface KiddoBotProps {
  language: string;
  onSpeak: (t: string) => void;
  shouldIntro: boolean;
}

const KiddoBot: React.FC<KiddoBotProps> = ({ language, onSpeak, shouldIntro }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fact, setFact] = useState<string | null>(null);
  const [loadingFact, setLoadingFact] = useState(false);

  useEffect(() => {
    if (shouldIntro) {
      const introText = "Hello! I'm Sparky, your learning buddy! Click me if you want to learn something amazing!";
      setTimeout(() => {
        onSpeak(introText);
        setIsOpen(true);
      }, 1500);
    }
  }, [shouldIntro]);

  const getNewFact = async () => {
    setLoadingFact(true);
    setFact(null);
    try {
      const newFact = await geminiService.generateDailyFact(language);
      setFact(newFact);
      onSpeak(newFact);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingFact(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 pointer-events-none">
      {/* Speech Bubble */}
      {isOpen && (
        <div className="pointer-events-auto bg-white p-6 rounded-[2.5rem] shadow-2xl border-4 border-blue-100 max-w-[280px] animate-in slide-in-from-bottom-4 zoom-in relative mb-2">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute -top-2 -right-2 bg-slate-100 p-1 rounded-full text-slate-400 hover:text-slate-600 shadow-sm"
          >
            <X size={16} />
          </button>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-blue-500 font-bold text-sm uppercase tracking-wider">
              <Sparkles size={14} /> Sparky says:
            </div>
            
            {fact ? (
              <p className="text-slate-700 font-fredoka text-lg leading-tight">
                {fact}
              </p>
            ) : (
              <p className="text-slate-700 font-fredoka text-lg leading-tight">
                Hi! Want to learn a <span className="text-blue-500 font-bold">New Fact</span> today?
              </p>
            )}

            <button 
              onClick={getNewFact}
              disabled={loadingFact}
              className="mt-2 bg-blue-500 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
            >
              {loadingFact ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Lightbulb size={18} />
              )}
              {loadingFact ? "Thinking..." : "Teach me!"}
            </button>
          </div>
          
          {/* Bubble Tail */}
          <div className="absolute -bottom-3 right-8 w-6 h-6 bg-white border-r-4 border-b-4 border-blue-100 rotate-45" />
        </div>
      )}

      {/* The Bot Avatar */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto group relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-2xl flex items-center justify-center border-4 border-white hover:scale-110 active:scale-95 transition-all animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20 group-hover:opacity-40" />
        <Bot size={48} className="text-white drop-shadow-lg" />
        
        {/* Glow effect */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center">
          <Sparkles size={12} className="text-white" />
        </div>
      </button>
    </div>
  );
};

export default KiddoBot;
