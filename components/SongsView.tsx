
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { Music2, Play, Sparkles, Loader2, Volume2, X, Star, Disc } from 'lucide-react';
import { Language } from '../types';

const THEMES = [
  { id: 'counting', label: 'Number Party', emoji: '🔟', color: 'bg-rose-100 text-rose-600' },
  { id: 'alphabet', label: 'ABC Rock', emoji: '🎸', color: 'bg-blue-100 text-blue-600' },
  { id: 'colors', label: 'Rainbow Jive', emoji: '🌈', color: 'bg-yellow-100 text-yellow-600' },
  { id: 'healthy', label: 'Veggie Boogie', emoji: '🥦', color: 'bg-emerald-100 text-emerald-600' },
];

const SongsView: React.FC<{ onSpeak: (t: string) => void, language?: Language }> = ({ onSpeak, language = 'English' }) => {
  // Fix: changed setPrompt to setTopic to match usage in the input field.
  const [topic, setTopic] = useState('');
  const [songData, setSongData] = useState<{ title: string; lyrics: string; vibe: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerate = async (customPrompt?: string) => {
    const p = customPrompt || topic;
    if (!p.trim()) return;
    setLoading(true);
    setSongData(null);
    try {
      const data = await geminiService.generateSong(p, language);
      setSongData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const startConcert = () => {
    if (!songData) return;
    setIsPlaying(true);
    onSpeak(`${songData.title}. Here are the lyrics: ${songData.lyrics}`);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-5xl font-black text-slate-800 mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
          The Music Room! 🎵
        </h2>
        <p className="text-xl text-slate-500 font-medium">Create your own educational songs and sing along!</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleGenerate(theme.label)}
            className={`${theme.color} p-8 rounded-[3rem] shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex flex-col items-center gap-4 group border-4 border-white`}
          >
            <div className="bg-white/50 p-5 rounded-full group-hover:rotate-12 transition-transform">
              <span className="text-5xl">{theme.emoji}</span>
            </div>
            <span className="font-black text-lg text-center leading-tight">{theme.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[4rem] shadow-2xl p-8 md:p-12 border-8 border-pink-50 relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <Disc size={200} className="animate-spin" style={{ animationDuration: '10s' }} />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What should we sing about?..."
              className="flex-1 px-8 py-5 rounded-full border-4 border-pink-50 focus:border-pink-400 outline-none text-xl font-bold shadow-inner"
            />
            <button 
              onClick={() => handleGenerate()}
              disabled={loading || !topic}
              className="bg-pink-500 text-white px-10 py-5 rounded-full font-black text-xl hover:bg-pink-600 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Music2 />}
              Write Song
            </button>
          </div>

          {loading && (
            <div className="flex flex-col items-center gap-4 py-20 animate-pulse text-center">
               <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                 <Music2 className="w-12 h-12 text-pink-500 animate-bounce" />
               </div>
               <p className="text-2xl font-black text-pink-600">Composing a catchy tune...</p>
            </div>
          )}

          {songData && !loading && (
            <div className="bg-pink-50 rounded-[3rem] p-10 border-4 border-pink-100 animate-in zoom-in duration-500 flex flex-col items-center text-center">
               <div className="flex items-center gap-2 text-pink-400 font-black mb-2 uppercase tracking-widest text-sm">
                 <Star size={16} fill="currentColor" /> New Hit Record <Star size={16} fill="currentColor" />
               </div>
               <h3 className="text-4xl font-black text-pink-800 mb-2">{songData.title}</h3>
               <p className="text-pink-400 font-bold mb-8 capitalize italic">Style: {songData.vibe}</p>
               
               <button 
                 onClick={startConcert}
                 className="bg-pink-500 text-white px-12 py-6 rounded-full font-black text-3xl hover:bg-pink-600 transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95"
               >
                 <Play size={48} /> Start Concert
               </button>
            </div>
          )}
        </div>
      </div>

      {isPlaying && songData && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
          <button 
            onClick={() => setIsPlaying(false)}
            className="absolute top-8 right-8 bg-white/10 p-4 rounded-full text-white hover:bg-white/20 transition-colors shadow-2xl z-[110]"
          >
            <X size={40} />
          </button>
          
          <div className="max-w-4xl w-full bg-white rounded-[4rem] md:rounded-[6rem] shadow-2xl relative animate-in zoom-in duration-500 flex flex-col items-center p-12 overflow-hidden border-8 border-pink-200">
            <div className="bg-pink-100 p-8 rounded-full mb-8 relative">
              <Disc className="text-pink-500 w-24 h-24 animate-spin" style={{ animationDuration: '3s' }} />
              <div className="absolute -top-2 -right-2 bg-amber-400 p-2 rounded-full border-4 border-white">
                 <Sparkles className="text-white" />
              </div>
            </div>
            
            <h2 className="text-5xl font-black text-pink-600 mb-4 text-center">{songData.title}</h2>
            <div className="max-w-2xl w-full bg-slate-50 p-10 rounded-[3rem] mb-12 border-2 border-slate-100 shadow-inner">
               <pre className="text-2xl md:text-3xl text-slate-700 font-fredoka leading-relaxed text-center whitespace-pre-wrap">
                 {songData.lyrics}
               </pre>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
              <button 
                onClick={() => onSpeak(songData.lyrics)}
                className="flex-1 bg-pink-500 text-white py-6 rounded-full font-black text-2xl flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-xl shadow-pink-200"
              >
                <Volume2 size={32} /> Sing Along
              </button>
              <button 
                onClick={() => setIsPlaying(false)}
                className="flex-1 bg-slate-800 text-white py-6 rounded-full font-black text-2xl hover:scale-105 transition-transform"
              >
                End Song
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongsView;
