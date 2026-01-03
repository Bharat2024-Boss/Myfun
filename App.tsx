
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
  Globe
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
import { geminiService, decodeBase64, decodeAudioData } from './services/geminiService';

const App: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState<Category>('home');
  const [language, setLanguage] = useState<Language>('English');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showLangs, setShowLangs] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const speak = async (text: string) => {
    if (isSpeaking) return;
    try {
      setIsSpeaking(true);
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;

      // 1. Translate if needed
      const translatedText = await geminiService.translateText(text, language);
      
      // 2. Generate natural audio
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
      case 'home':
        return <HomeView onSelectCategory={setCurrentCategory} categories={categories} />;
      case 'alphabet':
        return <AlphabetView onSpeak={speak} />;
      case 'colors':
        return <ColorsView onSpeak={speak} />;
      case 'fruits':
        return <FruitsVegView type="fruits" onSpeak={speak} />;
      case 'vegetables':
        return <FruitsVegView type="vegetables" onSpeak={speak} />;
      case 'math':
        return <MathView onSpeak={speak} />;
      case 'weekdays':
        return <WeekDaysView onSpeak={speak} />;
      case 'months':
        return <MonthsView onSpeak={speak} />;
      case 'seasons':
        return <SeasonsView onSpeak={speak} />;
      case 'stories':
        return <RhymeTimeView onSpeak={speak} language={language} />;
      case 'quiz':
        return <QuizView onSpeak={speak} onGoHome={() => setCurrentCategory('home')} />;
      default:
        return <HomeView onSelectCategory={setCurrentCategory} categories={categories} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Background Decorations */}
      <div className="bubble w-64 h-64 bg-blue-300 top-10 left-10"></div>
      <div className="bubble w-48 h-48 bg-pink-300 bottom-10 right-10"></div>
      <div className="bubble w-32 h-32 bg-yellow-300 top-1/2 left-1/2"></div>

      {/* Header */}
      <header className="p-4 md:p-6 flex items-center justify-between z-20">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setCurrentCategory('home')}
        >
          <div className="bg-white p-2 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
            <Sparkles className="text-amber-500 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">KiddoLand</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative">
            <button 
              onClick={() => setShowLangs(!showLangs)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all text-slate-700 font-bold active:scale-95"
            >
              <Globe size={18} className="text-blue-500" />
              {LANGUAGES.find(l => l.value === language)?.flag} {language}
            </button>
            {showLangs && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-3xl shadow-2xl border-4 border-slate-50 p-2 grid grid-cols-2 gap-2 z-50 w-64 animate-in fade-in zoom-in slide-in-from-top-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => {
                      setLanguage(l.value);
                      setShowLangs(false);
                    }}
                    className={`p-3 rounded-2xl flex items-center gap-2 text-sm font-bold transition-all ${language === l.value ? 'bg-blue-500 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {currentCategory !== 'home' && (
            <button 
              onClick={() => setCurrentCategory('home')}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all text-slate-600 font-semibold active:scale-95"
            >
              <ChevronLeft size={20} /> Back
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 z-10 overflow-y-auto pb-24">
        {renderView()}
      </main>

      {/* Global Audio Indicator (Floating) */}
      {isSpeaking && (
        <div className="fixed bottom-6 left-6 bg-white p-4 rounded-full shadow-2xl z-50 animate-bounce flex items-center gap-2 border-2 border-amber-300">
          <Volume2 className="text-amber-500 animate-pulse" />
          <span className="text-amber-600 font-bold text-sm">Kiddo is learning...</span>
        </div>
      )}
    </div>
  );
};

export default App;
