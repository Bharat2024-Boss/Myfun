
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { Book, Sparkles, Loader2, PlayCircle, Volume2, X, Star, Rocket, Ghost, Heart } from 'lucide-react';
import { Language } from '../types';

const THEMES = [
  { id: 'dragon', label: 'Friendly Dragon', emoji: '🐲', icon: Star, color: 'bg-emerald-100 text-emerald-600' },
  { id: 'space', label: 'Space Adventure', emoji: '🚀', icon: Rocket, color: 'bg-blue-100 text-blue-600' },
  { id: 'lost', label: 'Lost Puppy', emoji: '🐶', icon: Heart, color: 'bg-rose-100 text-rose-600' },
  { id: 'magic', label: 'Magic Castle', emoji: '🏰', icon: Ghost, color: 'bg-purple-100 text-purple-600' },
];

const StoriesView: React.FC<{ onSpeak: (t: string) => void, language?: Language }> = ({ onSpeak, language = 'English' }) => {
  const [topic, setTopic] = useState('');
  const [storyData, setStoryData] = useState<{ title: string; story: string; imagePrompt: string } | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const generateMagicStory = async (selectedTopic?: string) => {
    const finalTopic = selectedTopic || topic;
    if (!finalTopic.trim()) return;
    
    setLoading(true);
    setStoryData(null);
    setImageUrl(null);

    try {
      const result = await geminiService.generateStory(finalTopic, language);
      setStoryData(result);
      
      // Generate the illustration in parallel
      const img = await geminiService.generateImage(result.imagePrompt);
      setImageUrl(img);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const startReading = () => {
    if (!storyData) return;
    setIsReading(true);
    onSpeak(`${storyData.title}. ${storyData.story}`);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-black text-slate-800 mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
          Magic Bedtime Stories! 📖
        </h2>
        <p className="text-xl text-slate-500 font-medium">Pick a theme or tell Sparky what to write about!</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => generateMagicStory(theme.label)}
            className={`${theme.color} p-8 rounded-[3rem] shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center gap-4 group border-4 border-white`}
          >
            <div className="bg-white/50 p-4 rounded-full group-hover:rotate-12 transition-transform">
              <span className="text-5xl">{theme.emoji}</span>
            </div>
            <span className="font-black text-lg text-center leading-tight">{theme.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[4rem] shadow-2xl p-10 border-4 border-amber-100 relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <Book size={200} />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Your story idea... (e.g. A cat who can fly)"
              className="flex-1 px-8 py-5 rounded-full border-4 border-amber-50 focus:border-amber-400 outline-none text-xl font-bold shadow-inner placeholder:text-slate-300"
            />
            <button 
              onClick={() => generateMagicStory()}
              disabled={loading || !topic}
              className="bg-amber-500 text-white px-10 py-5 rounded-full font-black text-xl hover:bg-amber-600 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              Write My Story!
            </button>
          </div>

          {loading && (
            <div className="flex flex-col items-center gap-4 py-20 animate-pulse">
               <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
                 <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
               </div>
               <p className="text-2xl font-black text-amber-600">Sparky is thinking of a story...</p>
            </div>
          )}

          {storyData && !loading && (
            <div className="bg-amber-50 rounded-[3rem] p-10 border-4 border-amber-100 animate-in zoom-in duration-500 flex flex-col items-center text-center">
               <h4 className="text-4xl font-black text-amber-800 mb-6">{storyData.title}</h4>
               
               <div className="w-full max-w-md aspect-square bg-white rounded-[3rem] shadow-xl mb-8 overflow-hidden relative">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Story Illustration" className="w-full h-full object-cover animate-in fade-in duration-1000" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-300">
                      <Loader2 className="animate-spin w-8 h-8" />
                      <span className="font-bold">Drawing illustration...</span>
                    </div>
                  )}
               </div>

               <button 
                 onClick={startReading}
                 className="bg-amber-500 text-white px-12 py-6 rounded-full font-black text-3xl hover:bg-amber-600 transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95"
               >
                 <PlayCircle size={48} /> Open Magic Book
               </button>
            </div>
          )}
        </div>
      </div>

      {isReading && storyData && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
          <button 
            onClick={() => setIsReading(false)}
            className="absolute top-8 right-8 bg-white/10 p-4 rounded-full text-white hover:bg-white/20 transition-colors shadow-2xl z-[110]"
          >
            <X size={40} />
          </button>
          
          <div className="max-w-4xl w-full bg-white rounded-[4rem] md:rounded-[6rem] shadow-2xl relative animate-in zoom-in duration-500 flex flex-col md:flex-row overflow-hidden">
            <div className="w-full md:w-2/5 bg-slate-50 flex items-center justify-center p-8 border-r-8 border-slate-100">
               <div className="w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Story Scene" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-amber-100 flex items-center justify-center text-8xl">📖</div>
                  )}
               </div>
            </div>

            <div className="w-full md:w-3/5 p-10 md:p-16 flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl font-black text-amber-600 mb-8 leading-tight">{storyData.title}</h2>
              <p className="text-2xl md:text-3xl text-slate-700 font-fredoka leading-relaxed mb-12">
                {storyData.story}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => onSpeak(storyData.story)}
                  className="flex-1 bg-amber-500 text-white py-6 rounded-full font-black text-2xl flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-xl shadow-amber-200"
                >
                  <Volume2 size={32} /> Read to Me
                </button>
                <button 
                  onClick={() => setIsReading(false)}
                  className="flex-1 bg-slate-800 text-white py-6 rounded-full font-black text-2xl hover:scale-105 transition-transform"
                >
                  Close Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesView;
