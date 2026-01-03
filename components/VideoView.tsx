import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { Video, Sparkles, Loader2, Play, Info, CreditCard } from 'lucide-react';

const SUGGESTIONS = [
  "A happy sun dancing over colorful mountains",
  "A friendly robot juggling fruits in a kitchen",
  "A cute dinosaur learning to count stars",
  "Alphabet letters swimming like fish in the sea"
];

const VideoView: React.FC<{ language: string }> = ({ language }) => {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      const selected = await (window as any).aistudio.hasSelectedApiKey();
      setHasKey(selected);
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    await (window as any).aistudio.openSelectKey();
    setHasKey(true);
  };

  const handleGenerate = async (customPrompt?: string) => {
    const p = customPrompt || prompt;
    if (!p.trim()) return;
    setLoading(true);
    setVideoUrl(null);
    try {
      const url = await geminiService.generateVideo(p);
      setVideoUrl(url);
    } catch (e) {
      console.error(e);
      if (e.message?.includes("Requested entity was not found")) {
        setHasKey(false);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="max-w-2xl mx-auto text-center bg-white p-12 rounded-[3rem] shadow-2xl animate-in zoom-in">
        <div className="bg-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
          <CreditCard size={48} className="text-indigo-600" />
        </div>
        <h2 className="text-4xl font-black text-slate-800 mb-6">Magic Cinema Room 🎬</h2>
        <p className="text-xl text-slate-600 mb-8 font-medium">
          To create your own custom cartoons, you need to connect your API key from a paid GCP project.
        </p>
        <a 
          href="https://ai.google.dev/gemini-api/docs/billing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-indigo-500 font-bold underline block mb-8"
        >
          Learn about API Billing
        </a>
        <button 
          onClick={handleSelectKey}
          className="w-full bg-indigo-500 text-white py-5 rounded-2xl font-black text-2xl shadow-xl hover:bg-indigo-600 transition-all"
        >
          Connect API Key
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-5xl font-black text-slate-800 mb-4 flex items-center justify-center gap-3">
          Magic Cinema Room! 🍿
        </h2>
        <p className="text-xl text-slate-500 font-medium">Type anything and watch Sparky make a movie!</p>
      </div>

      <div className="bg-white rounded-[4rem] shadow-2xl p-8 md:p-12 border-8 border-indigo-50 relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A space cat playing the guitar..."
            className="flex-1 px-8 py-5 rounded-full border-4 border-slate-100 focus:border-indigo-400 outline-none text-xl font-bold shadow-inner"
          />
          <button 
            onClick={() => handleGenerate()}
            disabled={loading || !prompt}
            className="bg-indigo-500 text-white px-10 py-5 rounded-full font-black text-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            Make Movie
          </button>
        </div>

        {!loading && !videoUrl && (
          <div className="grid grid-cols-2 gap-4 mb-10">
            {SUGGESTIONS.map(s => (
              <button 
                key={s} 
                onClick={() => handleGenerate(s)}
                className="bg-indigo-50 p-4 rounded-3xl text-indigo-700 font-bold text-sm hover:bg-indigo-100 transition-all text-left flex items-start gap-2"
              >
                <Sparkles size={16} className="mt-1 shrink-0" /> {s}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="aspect-video bg-slate-900 rounded-[3rem] flex flex-col items-center justify-center gap-6 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-500/10 animate-pulse" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <Loader2 size={48} className="text-white animate-spin" />
              </div>
              <h3 className="text-3xl font-black text-white mb-2">Creating Your Magic Movie...</h3>
              <p className="text-indigo-200 font-bold max-w-sm">Pop some corn! This takes about a minute as our AI artist draws every frame.</p>
            </div>
            {/* Loading Messages Overlay */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
               {["Mixing colors...", "Training robots...", "Polishing stars...", "Waking up characters..."].map((msg, i) => (
                 <span key={i} className={`px-4 py-2 rounded-full bg-white/5 text-white text-xs font-bold animate-in fade-in duration-500`} style={{ animationDelay: `${i * 2}s` }}>{msg}</span>
               ))}
            </div>
          </div>
        )}

        {videoUrl && (
          <div className="animate-in zoom-in duration-500">
            <div className="aspect-video bg-black rounded-[3rem] overflow-hidden shadow-2xl border-8 border-indigo-100 mb-8 group relative">
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="text-white fill-current" />
              </div>
            </div>
            <div className="flex justify-between items-center bg-indigo-50 p-6 rounded-[2rem]">
              <div className="flex items-center gap-3">
                <div className="bg-white p-3 rounded-full text-indigo-500 shadow-sm">
                   <Video />
                </div>
                <span className="font-bold text-indigo-800 text-lg">Your Magic Cartoon is Ready!</span>
              </div>
              <button 
                onClick={() => setVideoUrl(null)}
                className="bg-white text-indigo-500 px-6 py-3 rounded-full font-black hover:bg-indigo-100 transition-all shadow-sm"
              >
                Make Another
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 bg-amber-50 p-8 rounded-[3rem] border-2 border-amber-100 flex items-start gap-6">
        <div className="bg-white p-4 rounded-full shadow-sm shrink-0">
           <Info className="text-amber-500" />
        </div>
        <div>
           <h4 className="font-black text-amber-800 text-xl mb-2">How it Works</h4>
           <p className="text-amber-700 font-medium leading-relaxed">
             This cinema uses <strong>Google Veo</strong>, a super-powerful AI that generates 720p videos. Every video is unique and created just for you! It's like having your own animation studio in your pocket.
           </p>
        </div>
      </div>
    </div>
  );
};

export default VideoView;