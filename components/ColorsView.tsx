
import React, { useState } from 'react';
import DetailView from './DetailView';

const COLORS = [
  { name: 'Red', hex: '#ef4444', emoji: '🍎', text: 'Red as a juicy apple' },
  { name: 'Orange', hex: '#f97316', emoji: '🍊', text: 'Orange as a crunchy carrot' },
  { name: 'Yellow', hex: '#eab308', emoji: '☀️', text: 'Yellow as the bright sun' },
  { name: 'Green', hex: '#22c55e', emoji: '🌳', text: 'Green as a tall tree' },
  { name: 'Blue', hex: '#3b82f6', emoji: '🌊', text: 'Blue as the wide ocean' },
  { name: 'Purple', hex: '#a855f7', emoji: '🍇', text: 'Purple as sweet grapes' },
  { name: 'Pink', hex: '#ec4899', emoji: '🌸', text: 'Pink as a pretty flower' },
  { name: 'Brown', hex: '#78350f', emoji: '🐻', text: 'Brown as a fluffy bear' },
  { name: 'White', hex: '#ffffff', emoji: '☁️', text: 'White as a soft cloud' },
  { name: 'Black', hex: '#000000', emoji: '🐈‍⬛', text: 'Black as a quiet cat' },
];

const ColorsView: React.FC<{ onSpeak: (t: string) => void }> = ({ onSpeak }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % COLORS.length);
    }
  };

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + COLORS.length) % COLORS.length);
    }
  };

  const selectedColor = selectedIndex !== null ? COLORS[selectedIndex] : null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-slate-800">Pick a Color! 🎨</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {COLORS.map((color, index) => (
          <button
            key={color.name}
            onClick={() => setSelectedIndex(index)}
            className="aspect-square rounded-[2rem] p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex flex-col items-center justify-between border-b-8 border-black/10 active:scale-95"
            style={{ backgroundColor: color.hex }}
          >
            <span className="text-6xl drop-shadow-lg">{color.emoji}</span>
            <span className={`text-xl font-black ${['White', 'Yellow', 'Pink'].includes(color.name) ? 'text-slate-800' : 'text-white'}`}>
              {color.name}
            </span>
          </button>
        ))}
      </div>

      {selectedColor && (
        <DetailView 
          title={selectedColor.name}
          color={selectedColor.hex}
          emoji={selectedColor.emoji}
          description={selectedColor.text}
          onClose={() => setSelectedIndex(null)}
          onSpeak={onSpeak}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
};

export default ColorsView;
