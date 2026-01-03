
import React, { useState } from 'react';
import DetailView from './DetailView';

const DAYS = [
  { name: 'Monday', emoji: '🌙', color: '#e0e7ff', description: 'The first day of the school week!' },
  { name: 'Tuesday', emoji: '🎈', color: '#fef3c7', description: 'Time for more learning and fun!' },
  { name: 'Wednesday', emoji: '🐪', color: '#dcfce7', description: 'We are in the middle of the week!' },
  { name: 'Thursday', emoji: '🌱', color: '#f3e8ff', description: 'Almost there! One more day till Friday!' },
  { name: 'Friday', emoji: '🎉', color: '#ffe4e6', description: 'Yay! The weekend is almost here!' },
  { name: 'Saturday', emoji: '🍦', color: '#fef9c3', description: 'A day for playing outside and treats!' },
  { name: 'Sunday', emoji: '☀️', color: '#ffedd5', description: 'A relaxing day with family and friends!' },
];

const WeekDaysView: React.FC<{ onSpeak: (t: string) => void }> = ({ onSpeak }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % DAYS.length);
    }
  };

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + DAYS.length) % DAYS.length);
    }
  };

  const selected = selectedIndex !== null ? DAYS[selectedIndex] : null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-slate-800">Days of the Week 📅</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {DAYS.map((day, index) => (
          <button
            key={day.name}
            onClick={() => setSelectedIndex(index)}
            className="aspect-video bg-white rounded-[2rem] p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex flex-col items-center justify-center gap-2 border-b-8 border-indigo-100 active:scale-95"
          >
            <span className="text-4xl">{day.emoji}</span>
            <span className="text-2xl font-black text-indigo-500">{day.name}</span>
          </button>
        ))}
      </div>

      {selected && (
        <DetailView 
          title={selected.name}
          emoji={selected.emoji}
          color={selected.color}
          description={selected.description}
          aiPrompt={`A cute 3D character style illustration representing ${selected.name} for children. Bright colors, friendly vibe.`}
          onClose={() => setSelectedIndex(null)}
          onSpeak={onSpeak}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
};

export default WeekDaysView;
