
import React, { useState } from 'react';
import DetailView from './DetailView';

const SEASONS = [
  { name: 'Spring', emoji: '🌱', color: '#dcfce7', accent: '#22c55e', description: 'Flowers bloom and baby animals are born!' },
  { name: 'Summer', emoji: '☀️', color: '#fef9c3', accent: '#eab308', description: 'The weather is hot and we play at the beach!' },
  { name: 'Autumn', emoji: '🍂', color: '#ffedd5', accent: '#f97316', description: 'Leaves change color and fall from the trees!' },
  { name: 'Winter', emoji: '❄️', color: '#e0f2fe', accent: '#3b82f6', description: 'It gets cold and sometimes it snows!' },
];

const SeasonsView: React.FC<{ onSpeak: (t: string) => void }> = ({ onSpeak }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % SEASONS.length);
    }
  };

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + SEASONS.length) % SEASONS.length);
    }
  };

  const selected = selectedIndex !== null ? SEASONS[selectedIndex] : null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-extrabold text-slate-800 animate-in fade-in slide-in-from-top-4 duration-700">
          The Four Seasons 🌈
        </h2>
        <p className="text-slate-500 mt-2 font-medium">Watch how the world changes throughout the year!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        {SEASONS.map((s, index) => (
          <button
            key={s.name}
            onClick={() => setSelectedIndex(index)}
            className="group relative h-64 rounded-[4rem] p-10 shadow-2xl hover:scale-105 transition-all flex items-center justify-between border-b-8 border-black/5 active:scale-95 overflow-hidden animate-in slide-in-from-left-8 duration-700"
            style={{ 
              backgroundColor: s.color,
              animationDelay: `${index * 150}ms`
            }}
          >
             {/* Decorative background shape */}
             <div 
               className="absolute top-0 right-0 w-48 h-48 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-40 transition-all group-hover:scale-150 duration-700"
               style={{ backgroundColor: s.accent }}
             />

             <div className="relative z-10 text-left">
                <span className="text-4xl font-black text-slate-800 block mb-3 group-hover:translate-x-2 transition-transform duration-300">
                  {s.name}
                </span>
                <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full w-fit">
                   <span className="text-lg font-bold text-slate-700">{s.emoji} Beautiful Days</span>
                </div>
             </div>

             <div className="relative z-10 flex items-center justify-center">
                <span className="text-[10rem] drop-shadow-2xl animate-bounce group-hover:rotate-12 transition-transform duration-500" style={{ animationDuration: '3s' }}>
                  {s.emoji}
                </span>
             </div>

             {/* Sparkle effects on hover */}
             <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-10 left-1/2 w-2 h-2 bg-white rounded-full animate-ping" />
                <div className="absolute bottom-10 right-1/4 w-3 h-3 bg-white rounded-full animate-ping delay-300" />
             </div>
          </button>
        ))}
      </div>

      {selected && (
        <DetailView 
          title={selected.name}
          emoji={selected.emoji}
          color={selected.color}
          description={selected.description}
          aiPrompt={`A full 3D animated style landscape representing ${selected.name} season. Friendly 3D characters playing in the scene. High detail, vibrant Pixar-style environment.`}
          onClose={() => setSelectedIndex(null)}
          onSpeak={onSpeak}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
};

export default SeasonsView;
