
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Category } from '../types';

interface HomeViewProps {
  onSelectCategory: (cat: Category) => void;
  categories: { id: string; label: string; icon: LucideIcon; color: string }[];
}

const HomeView: React.FC<HomeViewProps> = ({ onSelectCategory, categories }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
          Pick an Adventure! 🚀
        </h2>
        <p className="text-xl text-slate-500 font-medium">Which magic door will you open today?</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {categories.map((cat, idx) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id as Category)}
            className={`${cat.color} p-6 md:p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center gap-4 group animate-in zoom-in duration-500`}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="bg-white/30 p-5 rounded-3xl group-hover:rotate-12 transition-transform shadow-inner">
              <cat.icon size={48} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-wide text-center leading-tight">
              {cat.label}
            </span>
          </button>
        ))}
      </div>
      
      <div className="mt-16 bg-white/60 backdrop-blur-md p-8 rounded-[3rem] border-2 border-white/50 shadow-sm flex flex-col md:flex-row items-center gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="bg-amber-100 p-6 rounded-full animate-bounce">
           <span className="text-6xl">✨</span>
        </div>
        <div className="text-left">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">3D Character Magic</h3>
          <p className="text-slate-600">Every lesson features amazing 3D character illustrations! Explore all the categories to meet them all.</p>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
