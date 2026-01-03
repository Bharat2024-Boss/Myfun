
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { Music, Sparkles, Loader2, PlayCircle, Volume2, X, Languages } from 'lucide-react';
import { Language } from '../types';

const RhymeTimeView: React.FC<{ onSpeak: (t: string) => void, language?: Language }> = ({ onSpeak, language = 'English' }) => {
  const [topic, setTopic] = useState('');
  const [rhyme, setRhyme] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPerforming, setIsPerforming] = useState(false);

  const generateRhyme = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const result = await geminiService.generateRhyme(topic, language);
      setRhyme(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const startPerformance = () => {
    if (!rhyme) return;
    setIsPerforming(true);
    // Since we've already generated in target language, we call onSpeak 
    // but onSpeak usually translates. To avoid double-translation, we'd need
    // a more complex handle, but for now we rely on gemini-flash logic.
    onSpeak(`${rhyme.title}. ${rhyme.content}`);
  };

  const suggestions = ['Magic Cats', 'Flying Boats', 'Singing Sun', 'Dancing Bears'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-[4rem] shadow-2xl p-10 border-4 border-yellow-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <Music size={200} />
        </div>

        <div className="relative z-10 text-center">
          <h3 className="text-4xl font-extrabold text-slate-800 mb-8 flex items-center justify-center gap-3">
            <Sparkles className="text-yellow-500" />
            Magic Rhymes in {language}
          </h3>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What should we rhyme about?..."
              className="flex-1 px-8 py-5 rounded-full border-2 border-yellow-100 focus:border-yellow-400 outline-none text-xl font-medium shadow-inner"
            />
            <button 
              onClick={generateRhyme}
              disabled={loading || !topic}
              className="bg-yellow-400 text-yellow-900 px-10 py-5 rounded-full font-bold text-xl hover:bg-yellow-500 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              Create!
            </button>
          </div>

          {rhyme && (
            <div className="bg-yellow-50 rounded-[3rem] p-12 border-2 border-yellow-200 animate-in zoom-in duration-500">
               <h4 className="text-4xl font-black text-yellow-800 mb-4">{rhyme.title}</h4>
               <p className="text-xl text-slate-500 mb-8 italic flex items-center justify-center gap-2">
                 <Languages size={20} /> Rhyme created in {language}!
               </p>
               
               <button 
                 onClick={startPerformance}
                 className="bg-yellow-400 text-yellow-900 px-12 py-6 rounded-full font-black text-3xl hover:bg-yellow-500 transition-all flex items-center justify-center gap-4 shadow-xl mx-auto active:scale-95"
               >
                 <PlayCircle size={40} /> Open Theater
               </button>
            </div>
          )}
        </div>
      </div>

      {isPerforming && rhyme && (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-8 text-center overflow-y-auto">
          <button 
            onClick={() => setIsPerforming(false)}
            className="absolute top-8 right-8 bg-white/20 p-4 rounded-full text-white hover:bg-white/30 transition-colors shadow-lg"
          >
            <X size={40} />
          </button>
          
          <div className="max-w-4xl w-full bg-white rounded-[5rem] p-12 md:p-24 shadow-2xl relative animate-in zoom-in duration-500">
            <h2 className="text-6xl font-black text-yellow-600 mb-12 drop-shadow-sm">{rhyme.title}</h2>
            <p className="text-4xl md:text-5xl font-black text-slate-700 leading-relaxed whitespace-pre-line font-fredoka">
              {rhyme.content}
            </p>

            <div className="mt-20 flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => onSpeak(rhyme.content)}
                className="bg-yellow-400 text-yellow-900 px-12 py-6 rounded-full font-black text-2xl flex items-center justify-center gap-4 hover:scale-105 transition-transform shadow-lg"
              >
                <Volume2 size={36} /> Hear in {language}
              </button>
              <button 
                onClick={() => setIsPerforming(false)}
                className="bg-slate-800 text-white px-12 py-6 rounded-full font-black text-2xl hover:scale-105 transition-transform shadow-lg"
              >
                Close Theater
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RhymeTimeView;
