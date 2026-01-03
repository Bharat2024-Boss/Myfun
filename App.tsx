
import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  Palette, 
  Apple, 
  Carrot, 
  Hash, 
  Music, 
  Sparkles,
  Volume2,
  ChevronLeft,
  Trophy,
  Calendar,
  CloudSun,
  Clock,
  Globe,
  Download,
  WifiOff,
  CheckCircle2,
  Info,
  Mic
} from 'lucide-react';
import { Category, Language, LANGUAGES } from './types';
import HomeView from './components/HomeView';
import AlphabetView from './components/AlphabetView';
import ColorsView from './components/ColorsView';
import FruitsVegView from './components/FruitsVegView';
import MathView from './components/MathView';
import RhymeTimeView from './components/RhymeTimeView';
import QuizView from './components/QuizView';
import WeekDaysView from './components/WeekDaysView';
import MonthsView from './components/MonthsView';
import SeasonsView from './components/SeasonsView';
import LiveTalkView from './components/LiveTalkView';
import { geminiService, decodeBase64, decodeAudioData } from './services/geminiService';

const App: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState<Category>('home');
  const [language, setLanguage] = useState<Language>('English');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showLangs, setShowLangs] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallInfo, setShowInstallInfo] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      setShowInstallInfo(true);
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstalled(true);
    }
  };

  const speak = async (text: string) => {
    if (isSpeaking || !isOnline) return;
    try {
      setIsSpeaking(true);
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      const translatedText = await geminiService.translateText(text, language);
      const base64Audio = await geminiService.textToSpeech(translatedText);
      
      if (base64Audio) {
        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("Speech error:", error);
      setIsSpeaking(false);
    }
  };

  const categories = [
    { id: 'livetalk', label: 'Talk to Sparky', icon: Mic, color: 'bg-indigo-600 animate-pulse' },
    { id: 'alphabet', label: 'ABC Letters', icon: BookOpen, color: 'bg-rose-400' },
    { id: 'colors', label: 'Rainbow Colors', icon: Palette, color: 'bg-sky-400' },
    { id: 'fruits', label: 'Yummy Fruits', icon: Apple, color: 'bg-orange-400' },
    { id: 'vegetables', label: 'Crunchy Veggies', icon: Carrot, color: 'bg-green-400' },
    { id: 'math', label: 'Math Magic', icon: Hash, color: 'bg-purple-400' },
    { id: 'weekdays', label: 'Week Days', icon: Calendar, color: 'bg-indigo-400' },
    { id: 'months', label: 'Months', icon: Clock, color: 'bg-cyan-400' },
    { id: 'seasons', label: 'Seasons', icon: CloudSun, color: 'bg-amber-400' },
    { id: 'stories', label: 'Rhyme Time', icon: Music, color: 'bg-yellow-400' },
    { id: 'quiz', label: 'Quiz Master', icon: Trophy, color: 'bg-emerald-400' },
  ];

  const renderView = () => {
    switch (currentCategory) {
      case 'home': return <HomeView onSelectCategory={setCurrentCategory} categories={categories} />;
      case 'alphabet': return <AlphabetView onSpeak={speak} />;
      case 'colors': return <ColorsView onSpeak={speak} />;
      case 'fruits': return <FruitsVegView type="fruits" onSpeak={speak} />;
      case 'vegetables': return <FruitsVegView type="vegetables" onSpeak={speak} />;
      case 'math': return <MathView onSpeak={speak} />;
      case 'weekdays': return <WeekDaysView onSpeak={speak} />;
      case 'months': return <MonthsView onSpeak={speak} />;
      case 'seasons': return <SeasonsView onSpeak={speak} />;
      case 'stories': return <RhymeTimeView onSpeak={speak} language={language} />;
      case 'quiz': return <QuizView onSpeak={speak} onGoHome={() => setCurrentCategory('home')} />;
      case 'livetalk': return <LiveTalkView onBack={() => setCurrentCategory('home')} />;
      default: return <HomeView onSelectCategory={setCurrentCategory} categories={categories} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col pb-safe">
      {/* Background Decorations */}
      <div className="bubble w-64 h-64 bg-blue-300 top-10 left-10"></div>
      <div className="bubble w-48 h-48 bg-pink-300 bottom-10 right-10"></div>
      <div className="bubble w-32 h-32 bg-yellow-300 top-1/2 left-1/2"></div>

      {/* Header */}
      <header className="p-4 md:p-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => setCurrentCategory('home')}>
          <div className="bg-white p-2 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
            <Sparkles className="text-amber-500 w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-3xl font-bold text-slate-800 tracking-tight leading-none">KiddoLand</h1>
            {isInstalled && <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 uppercase tracking-tighter"><CheckCircle2 size={10} /> App Installed</span>}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {!isOnline && (
            <div className="flex items-center gap-1 bg-rose-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
              <WifiOff size={14} /> Offline
            </div>
          )}
          
          <div className="relative">
            <button onClick={() => setShowLangs(!showLangs)} className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-full shadow-md text-slate-700 font-bold text-xs md:text-sm">
              <Globe size={16} className="text-blue-500" />
              <span className="hidden sm:inline">{language}</span>
              <span>{LANGUAGES.find(l => l.value === language)?.flag}</span>
            </button>
            {showLangs && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-slate-50 p-1 grid grid-cols-2 gap-1 z-50 w-48 animate-in fade-in zoom-in">
                {LANGUAGES.map((l) => (
                  <button key={l.value} onClick={() => { setLanguage(l.value); setShowLangs(false); }}
                    className={`p-2 rounded-xl flex items-center gap-2 text-xs font-bold transition-all ${language === l.value ? 'bg-blue-500 text-white' : 'hover:bg-slate-100 text-slate-600'}`}>
                    <span>{l.flag}</span> <span className="truncate">{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {currentCategory !== 'home' && (
            <button onClick={() => setCurrentCategory('home')} className="flex items-center gap-1 bg-white px-3 py-2 rounded-full shadow-md text-slate-600 font-bold text-xs md:text-sm">
              <ChevronLeft size={16} /> <span className="hidden sm:inline">Back</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 z-10 overflow-y-auto pb-24">
        {renderView()}
      </main>

      {/* Global Audio Indicator */}
      {isSpeaking && currentCategory !== 'livetalk' && (
        <div className="fixed bottom-6 left-6 bg-white p-3 md:p-4 rounded-full shadow-2xl z-50 animate-bounce flex items-center gap-2 border-2 border-amber-300">
          <Volume2 className="text-amber-500 animate-pulse" size={20} />
          <span className="text-amber-600 font-bold text-xs md:text-sm">Speaking...</span>
        </div>
      )}

      {/* Install Helper Dialog */}
      {showInstallInfo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Info size={40} className="text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">How to Install?</h3>
            <p className="text-slate-600 mb-6 font-medium">
              1. Tap the <span className="font-bold text-blue-500">three dots</span> or <span className="font-bold text-blue-500">share icon</span> in your browser.<br/>
              2. Select <span className="font-bold">"Add to Home Screen"</span> or <span className="font-bold">"Install App"</span>.
            </p>
            <button 
              onClick={() => setShowInstallInfo(false)}
              className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Mobile Install Hint */}
      {deferredPrompt && !isInstalled && (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full px-6">
           <button onClick={installApp} className="w-full bg-emerald-500 text-white h-14 rounded-full shadow-2xl flex items-center justify-center gap-2 font-black animate-bounce border-4 border-white">
              <Download size={20} /> Install Offline App
           </button>
        </div>
      )}

      {/* Offline AI Warning */}
      {!isOnline && (
        <div className="fixed bottom-0 left-0 right-0 bg-rose-500 text-white text-[10px] font-bold text-center py-1 z-[100] uppercase tracking-widest">
          AI Voice & 3D Magic needs WiFi. All lessons work offline!
        </div>
      )}
    </div>
  );
};

export default App;
