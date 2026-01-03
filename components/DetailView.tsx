
import React, { useEffect, useState } from 'react';
import { Volume2, X, Sparkles, Loader2, ChevronLeft, ChevronRight, Languages } from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface DetailViewProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  color?: string;
  description: string;
  onClose: () => void;
  onSpeak: (t: string) => void;
  aiPrompt?: string;
  onNext?: () => void;
  onPrev?: () => void;
  language?: string;
}

const DetailView: React.FC<DetailViewProps> = ({ 
  title, subtitle, emoji, color, description, onClose, onSpeak, aiPrompt, onNext, onPrev, language = 'English'
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [translatedDesc, setTranslatedDesc] = useState<string>(description);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (aiPrompt) {
        setLoading(true);
        try {
          const img = await geminiService.generateImage(aiPrompt);
          setImageUrl(img);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    };
    init();
  }, [aiPrompt, title]);

  useEffect(() => {
    // Start voice immediately (internal service handles translation)
    onSpeak(`${title}. ${description}`);

    // Update text in parallel
    const handleTranslation = async () => {
      if (language === 'English') {
        setTranslatedDesc(description);
      } else {
        setTranslating(true);
        const translated = await geminiService.translateText(description, language);
        setTranslatedDesc(translated);
        setTranslating(false);
      }
    };
    handleTranslation();
  }, [description, language, title]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 overflow-hidden">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {onPrev && (
        <button onClick={onPrev} className="fixed left-4 md:left-8 z-[60] bg-white/90 p-4 md:p-6 rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all text-slate-700 border-4 border-slate-100 hidden sm:flex">
          <ChevronLeft size={48} />
        </button>
      )}
      {onNext && (
        <button onClick={onNext} className="fixed right-4 md:right-8 z-[60] bg-white/90 p-4 md:p-6 rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all text-slate-700 border-4 border-slate-100 hidden sm:flex">
          <ChevronRight size={48} />
        </button>
      )}

      <div className="relative w-full max-w-5xl bg-white rounded-[4rem] shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500 border-8 border-white">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 bg-slate-100 p-3 rounded-full hover:bg-slate-200 transition-colors"
        >
          <X size={24} className="text-slate-500" />
        </button>

        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-slate-50 relative">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="font-bold text-slate-400 text-center px-4">Creating Character...</p>
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-contain drop-shadow-2xl animate-in fade-in zoom-in duration-700" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 rounded-3xl" style={{ backgroundColor: color || '#f1f5f9' }}>
              <span className="text-[12rem] drop-shadow-2xl">{emoji}</span>
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center gap-6">
          <div>
            <h2 className="text-6xl font-extrabold text-slate-800 tracking-tight">{title}</h2>
            {subtitle && <p className="text-3xl font-bold text-blue-500 mt-2">{subtitle}</p>}
          </div>

          <div className="p-8 bg-slate-50 rounded-[3rem] border-2 border-slate-100 relative min-h-[160px] flex items-center justify-center">
            {translating ? (
              <div className="flex items-center gap-3 text-slate-400 animate-pulse">
                <Languages size={24} className="animate-spin" /> <span>Translating text...</span>
              </div>
            ) : (
              <p className="text-2xl md:text-3xl text-slate-700 font-fredoka leading-relaxed">
                {translatedDesc}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => onSpeak(`${title}. ${description}`)}
              className="w-full bg-blue-500 text-white py-6 rounded-full font-bold text-3xl flex items-center justify-center gap-4 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-200"
            >
              <Volume2 size={40} /> Play Voice
            </button>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-bold">
              <Sparkles size={16} className="text-amber-400" />
              <span>Instant AI Multi-Language Voice</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
