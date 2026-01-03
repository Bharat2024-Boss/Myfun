
import React, { useState, useEffect } from 'react';
import { Trophy, Star, ArrowRight, RefreshCw, Home } from 'lucide-react';

const QUIZ_POOL = [
  { question: "Where is the Apple?", correctId: "Apple", options: [{ id: "Apple", emoji: "🍎", label: "Apple" }, { id: "Carrot", emoji: "🥕", label: "Carrot" }, { id: "Fish", emoji: "🐟", label: "Fish" }, { id: "Banana", emoji: "🍌", label: "Banana" }] },
  { question: "Which one is the color Blue?", correctId: "Blue", options: [{ id: "Red", emoji: "🟥", label: "Red" }, { id: "Blue", emoji: "🟦", label: "Blue" }, { id: "Green", emoji: "🟩", label: "Green" }, { id: "Yellow", emoji: "🟨", label: "Yellow" }] },
  { question: "Find the Lion!", correctId: "Lion", options: [{ id: "Cat", emoji: "🐱", label: "Cat" }, { id: "Bear", emoji: "🐻", label: "Bear" }, { id: "Lion", emoji: "🦁", label: "Lion" }, { id: "Tiger", emoji: "🐯", label: "Tiger" }] },
  { question: "Where is the Letter A?", correctId: "A", options: [{ id: "A", emoji: "🅰️", label: "A" }, { id: "B", emoji: "🅱️", label: "B" }, { id: "C", emoji: "copy;", label: "C" }, { id: "D", emoji: "🇩", label: "D" }] },
  { question: "Which one is Broccoli?", correctId: "Broccoli", options: [{ id: "Tomato", emoji: "🍅", label: "Tomato" }, { id: "Corn", emoji: "🌽", label: "Corn" }, { id: "Potato", emoji: "🥔", label: "Potato" }, { id: "Broccoli", emoji: "🥦", label: "Broccoli" }] }
];

const QuizView: React.FC<{ onSpeak: (t: string) => void, onGoHome: () => void }> = ({ onSpeak, onGoHome }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const currentQuestion = QUIZ_POOL[currentIdx];

  useEffect(() => {
    if (!finished) {
      onSpeak(currentQuestion.question);
    }
  }, [currentIdx, finished]);

  const handleAnswer = (id: string) => {
    if (feedback) return;
    
    if (id === currentQuestion.correctId) {
      setScore(s => s + 1);
      setFeedback('correct');
      onSpeak("Great job! That is correct!");
    } else {
      setFeedback('wrong');
      onSpeak("Oops! Try again next time!");
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIdx < QUIZ_POOL.length - 1) {
        setCurrentIdx(c => c + 1);
      } else {
        setFinished(true);
        onSpeak(`You finished the quiz! Your score is ${score + (id === currentQuestion.correctId ? 1 : 0)} out of ${QUIZ_POOL.length}`);
      }
    }, 2000);
  };

  const restart = () => {
    setCurrentIdx(0);
    setScore(0);
    setFinished(false);
    setFeedback(null);
  };

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto text-center bg-white p-12 rounded-[4rem] shadow-2xl animate-in zoom-in duration-500">
        <div className="bg-emerald-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8">
           <Trophy size={64} className="text-emerald-500" />
        </div>
        <h2 className="text-5xl font-black text-slate-800 mb-4">Quiz Finished!</h2>
        <p className="text-2xl font-bold text-slate-500 mb-8">You got {score} out of {QUIZ_POOL.length} stars!</p>
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={restart}
            className="bg-emerald-500 text-white py-5 rounded-full font-bold text-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw /> Play Again
          </button>
          <button 
            onClick={onGoHome}
            className="bg-slate-100 text-slate-600 py-5 rounded-full font-bold text-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <Home /> Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-[4rem] shadow-2xl p-8 md:p-12 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-3 bg-emerald-400 transition-all duration-500" style={{ width: `${(currentIdx / QUIZ_POOL.length) * 100}%` }} />
        
        <div className="flex justify-between items-center mb-12">
           <span className="text-xl font-bold text-slate-400">Question {currentIdx + 1} of {QUIZ_POOL.length}</span>
           <div className="flex items-center gap-2 text-amber-500 font-bold text-xl">
             <Star className="fill-current" /> {score}
           </div>
        </div>

        <h3 className="text-4xl md:text-5xl font-black text-slate-800 text-center mb-16 px-4">
          {currentQuestion.question}
        </h3>

        <div className="grid grid-cols-2 gap-6">
          {currentQuestion.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleAnswer(opt.id)}
              disabled={!!feedback}
              className={`aspect-square md:aspect-auto md:h-48 rounded-[2.5rem] p-4 flex flex-col items-center justify-center gap-4 text-center transition-all border-b-8 shadow-xl active:scale-95 ${
                feedback === 'correct' && opt.id === currentQuestion.correctId 
                  ? 'bg-emerald-500 border-emerald-700 text-white scale-105 rotate-2' 
                  : feedback === 'wrong' && opt.id !== currentQuestion.correctId
                  ? 'bg-slate-100 border-slate-200 opacity-50'
                  : 'bg-white border-slate-100 hover:scale-105 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="text-7xl md:text-8xl drop-shadow-md">{opt.emoji}</span>
              <span className="text-xl font-black">{opt.label}</span>
            </button>
          ))}
        </div>

        {feedback && (
          <div className={`mt-12 text-center py-6 rounded-3xl animate-bounce ${feedback === 'correct' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            <p className="text-3xl font-black">
              {feedback === 'correct' ? "YES! YOU DID IT! 🌟" : "OOPS! TRY AGAIN! ❤️"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;
