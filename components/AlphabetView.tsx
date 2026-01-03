
import React, { useState } from 'react';
import DetailView from './DetailView';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const WORDS: Record<string, string> = {
  A: 'Apple', B: 'Bear', C: 'Cat', D: 'Dog', E: 'Elephant', F: 'Fish', G: 'Giraffe', H: 'Hat',
  I: 'Igloo', J: 'Jellyfish', K: 'Kangaroo', L: 'Lion', M: 'Monkey', N: 'Nurse', O: 'Owl',
  P: 'Penguin', Q: 'Queen', R: 'Rabbit', S: 'Sun', T: 'Tiger', U: 'Umbrella', V: 'Violin',
  W: 'Whale', X: 'Xylophone', Y: 'Yo-yo', Z: 'Zebra'
};

const AlphabetView: React.FC<{ onSpeak: (t: string) => void }> = ({ onSpeak }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % ALPHABET.length);
    }
  };

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + ALPHABET.length) % ALPHABET.length);
    }
  };

  const selectedLetter = selectedIndex !== null ? ALPHABET[selectedIndex] : null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-5xl font-extrabold text-slate-800 animate-in fade-in slide-in-from-top-4 duration-700">
          ABC Adventure! 🅰️
        </h2>
        <p className="text-slate-500 mt-2 font-medium">Click a letter to see a friend!</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-5">
        {ALPHABET.map((l, index) => (
          <button
            key={l}
            onClick={() => setSelectedIndex(index)}
            className="aspect-square bg-white rounded-[2rem] text-5xl font-black text-rose-500 shadow-lg hover:shadow-2xl hover:scale-110 hover:-rotate-3 transition-all border-b-8 border-rose-100 flex items-center justify-center active:scale-95 animate-in zoom-in duration-300"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            {l}
          </button>
        ))}
      </div>

      {selectedLetter && (
        <DetailView 
          title={selectedLetter}
          subtitle={`is for ${WORDS[selectedLetter]}`}
          description={`${selectedLetter} is the sound for ${WORDS[selectedLetter]}. Can you say it?`}
          aiPrompt={`A super cute, friendly 3D character of a ${WORDS[selectedLetter]} for a children's alphabet book. High-quality Pixar-style 3D animation render, vibrant colors.`}
          onClose={() => setSelectedIndex(null)}
          onSpeak={onSpeak}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
};

export default AlphabetView;
