
import React, { useState } from 'react';
import DetailView from './DetailView';

interface Item {
  name: string;
  emoji: string;
  fact: string;
  color: string;
}

const DATA: Record<'fruits' | 'vegetables', Item[]> = {
  fruits: [
    { name: 'Apple', emoji: '🍎', fact: 'Apples float in water because 25% of them is air!', color: '#fee2e2' },
    { name: 'Banana', emoji: '🍌', fact: 'Bananas are actually giant herbs!', color: '#fef9c3' },
    { name: 'Strawberry', emoji: '🍓', fact: 'Strawberries are the only fruit with seeds on the outside!', color: '#ffe4e6' },
    { name: 'Grape', emoji: '🍇', fact: 'Grapes can come in many colors like purple, green, and red!', color: '#f3e8ff' },
    { name: 'Watermelon', emoji: '🍉', fact: 'Watermelon is 92% water and very cooling!', color: '#dcfce7' },
  ],
  vegetables: [
    { name: 'Carrot', emoji: '🥕', fact: 'Eating carrots is great for your eyes!', color: '#ffedd5' },
    { name: 'Broccoli', emoji: '🥦', fact: 'Broccoli looks like little green trees!', color: '#d1fae5' },
    { name: 'Tomato', emoji: '🍅', fact: 'Tomatoes are scientifically a fruit, but we eat them as veggies!', color: '#fee2e2' },
    { name: 'Corn', emoji: '🌽', fact: 'An average ear of corn has an even number of rows!', color: '#fef9c3' },
    { name: 'Potato', emoji: '🥔', fact: 'Potatoes can grow in many different shapes!', color: '#fef3c7' },
  ]
};

const FruitsVegView: React.FC<{ type: 'fruits' | 'vegetables', onSpeak: (t: string) => void }> = ({ type, onSpeak }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const items = DATA[type];

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % items.length);
    }
  };

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + items.length) % items.length);
    }
  };

  const selectedItem = selectedIndex !== null ? items[selectedIndex] : null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-slate-800 capitalize">Healthy {type}! {type === 'fruits' ? '🍎' : '🥕'}</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {items.map((item, index) => (
          <button
            key={item.name}
            onClick={() => setSelectedIndex(index)}
            className="aspect-square bg-white rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex flex-col items-center justify-center gap-4 border-b-8 border-slate-100 active:scale-95"
          >
            <span className="text-7xl group-hover:bounce">{item.emoji}</span>
            <span className="text-2xl font-black text-slate-700">{item.name}</span>
          </button>
        ))}
      </div>

      {selectedItem && (
        <DetailView 
          title={selectedItem.name}
          emoji={selectedItem.emoji}
          color={selectedItem.color}
          description={selectedItem.fact}
          aiPrompt={`A happy, high-quality 3D animated character of a ${selectedItem.name} with a cute smiley face. Pixar-style, vibrant, friendly 3D render, white background.`}
          onClose={() => setSelectedIndex(null)}
          onSpeak={onSpeak}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
};

export default FruitsVegView;
