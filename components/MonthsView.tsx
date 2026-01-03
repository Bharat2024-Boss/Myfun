
import React, { useState } from 'react';
import DetailView from './DetailView';

const MONTHS = [
  { name: 'January', emoji: '⛄', description: 'The start of the new year with snow!', color: 'border-blue-200' },
  { name: 'February', emoji: '💖', description: 'A short month with lots of love!', color: 'border-pink-200' },
  { name: 'March', emoji: '☘️', description: 'Flowers start to wake up!', color: 'border-green-200' },
  { name: 'April', emoji: '☔', description: 'April showers bring May flowers!', color: 'border-blue-300' },
  { name: 'May', emoji: '🌸', description: 'Everything is green and blooming!', color: 'border-rose-200' },
  { name: 'June', emoji: '☀️', description: 'Hello summer and long days!', color: 'border-yellow-200' },
  { name: 'July', emoji: '🏖️', description: 'Beach time and sunshine!', color: 'border-amber-200' },
  { name: 'August', emoji: '🍦', description: 'Ice cream and summer fun!', color: 'border-orange-200' },
  { name: 'September', emoji: '🍎', description: 'Time to go back to school!', color: 'border-red-200' },
  { name: 'October', emoji: '🎃', description: 'Crunchy leaves and pumpkins!', color: 'border-orange-300' },
  { name: 'November', emoji: '🍂', description: 'The weather gets chilly and cozy!', color: 'border-brown-200' },
  { name: 'December', emoji: '🎄', description: 'Winter holidays and sparkling lights!', color: 'border-indigo-200' },
];

const MonthsView: React.FC<{ onSpeak: (t: string) => void }> = ({ onSpeak }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % MONTHS.length);
    }
  };

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + MONTHS.length) % MONTHS.length);
    }
  };

  const selected = selectedIndex !== null ? MONTHS[selectedIndex] : null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-5xl font-extrabold text-slate-800 animate-in fade-in slide-in-from-top-4 duration-700">
          Twelve Magic Months! 🗓️
        </h2>
        <p className="text-slate-500 mt-2 font-medium">Every month has its own special story!</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6">
        {MONTHS.map((m, index) => (
          <button
            key={m.name}
            onClick={() => setSelectedIndex(index)}
            className={`group aspect-square bg-white rounded-[2.5rem] p-4 shadow-lg hover:shadow-2xl hover:scale-110 transition-all flex flex-col items-center justify-center gap-2 border-b-8 ${m.color} active:scale-95 animate-in zoom-in slide-in-from-bottom-4 duration-500`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="text-5xl group-hover:animate-bounce transition-transform duration-300">
              {m.emoji}
            </span>
            <span className="text-lg font-black text-slate-700">
              {m.name}
            </span>
          </button>
        ))}
      </div>

      {selected && (
        <DetailView 
          title={selected.name}
          emoji={selected.emoji}
          color="#ecfeff"
          description={selected.description}
          aiPrompt={`A vibrant 3D character style scene for the month of ${selected.name} with its theme ${selected.emoji}. Very cute and high quality Pixar style animation.`}
          onClose={() => setSelectedIndex(null)}
          onSpeak={onSpeak}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
};

export default MonthsView;
