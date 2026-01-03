
import React, { useState } from 'react';
import { Hash, Table as TableIcon, Sparkles } from 'lucide-react';
import DetailView from './DetailView';

const NUMBERS = Array.from({ length: 20 }, (_, i) => i + 1);

const MathView: React.FC<{ onSpeak: (t: string) => void }> = ({ onSpeak }) => {
  const [tab, setTab] = useState<'counting' | 'tables'>('counting');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [tableNum, setTableNum] = useState(2);

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % NUMBERS.length);
    }
  };

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + NUMBERS.length) % NUMBERS.length);
    }
  };

  const selectedNumber = selectedIndex !== null ? NUMBERS[selectedIndex] : null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex bg-white/50 p-2 rounded-full mb-12 shadow-inner max-w-md mx-auto">
        <button 
          onClick={() => setTab('counting')}
          className={`flex-1 py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all ${tab === 'counting' ? 'bg-purple-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Hash size={20} /> Numbers
        </button>
        <button 
          onClick={() => setTab('tables')}
          className={`flex-1 py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all ${tab === 'tables' ? 'bg-purple-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <TableIcon size={20} /> Tables
        </button>
      </div>

      {tab === 'counting' ? (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <h3 className="text-4xl font-black text-slate-800">Choose a Number! 🔢</h3>
            <p className="text-slate-500 mt-2">Click a number to see its magic!</p>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-5 gap-4">
            {NUMBERS.map((n, index) => (
              <button
                key={n}
                onClick={() => setSelectedIndex(index)}
                className="aspect-square bg-white rounded-3xl text-4xl font-black text-purple-500 shadow-lg hover:shadow-2xl hover:scale-110 hover:rotate-2 transition-all border-b-8 border-purple-100 flex items-center justify-center active:scale-95"
              >
                {n}
              </button>
            ))}
          </div>

          {selectedNumber && (
            <DetailView 
              title={selectedNumber.toString()}
              subtitle={`Let's count to ${selectedNumber}!`}
              description={`The number ${selectedNumber} is a very special number! Can you count ${selectedNumber} items with me?`}
              aiPrompt={`A cute and colorful illustration showing exactly ${selectedNumber} friendly, animated objects (like stars, balloons, or rubber ducks) on a clean background.`}
              onClose={() => setSelectedIndex(null)}
              onSpeak={onSpeak}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-right-8 duration-500">
          <div className="bg-white rounded-[3rem] p-8 shadow-xl border-b-8 border-purple-50">
            <h4 className="text-2xl font-black text-slate-700 mb-6 text-center">Select a Table</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-2 lg:grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <button
                  key={n}
                  onClick={() => {
                    setTableNum(n);
                    onSpeak(`The table of ${n}`);
                  }}
                  className={`py-5 rounded-2xl font-black text-2xl transition-all shadow-md active:scale-95 ${tableNum === n ? 'bg-purple-500 text-white scale-105 shadow-purple-200' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}`}
                >
                  Table {n}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[4rem] p-10 shadow-2xl border-4 border-purple-100 overflow-hidden relative">
             <div className="absolute -top-10 -right-10 opacity-5">
                <TableIcon size={240} />
             </div>
             <div className="flex items-center justify-between mb-10">
                <h4 className="text-4xl font-black text-purple-600">Table of {tableNum}</h4>
             </div>
             <div className="space-y-4">
               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                 <div 
                   key={i} 
                   className="text-3xl font-black text-slate-600 flex justify-between items-center border-b-4 border-purple-50 pb-3 cursor-pointer hover:bg-purple-50 rounded-2xl px-4 transition-colors group"
                   onClick={() => onSpeak(`${tableNum} times ${i} is ${tableNum * i}`)}
                 >
                   <span className="group-hover:scale-110 transition-transform">{tableNum} × {i}</span>
                   <span className="text-purple-500 text-4xl">= {tableNum * i}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MathView;
