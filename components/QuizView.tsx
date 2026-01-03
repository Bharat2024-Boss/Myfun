
import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Star, RefreshCw, Home, CheckCircle2, XCircle } from 'lucide-react';

type QuestionType = 'multiple-choice' | 'matching';

interface Option {
  id: string;
  emoji: string;
  label: string;
}

interface Question {
  type: QuestionType;
  question: string;
  correctId?: string; // For multiple-choice
  options?: Option[]; // For multiple-choice
  pairs?: { left: Option; right: Option }[]; // For matching
}

const QUIZ_POOL: Question[] = [
  { 
    type: 'multiple-choice',
    question: "Where is the Apple?", 
    correctId: "Apple", 
    options: [
      { id: "Apple", emoji: "🍎", label: "Apple" }, 
      { id: "Carrot", emoji: "🥕", label: "Carrot" }, 
      { id: "Fish", emoji: "🐟", label: "Fish" }, 
      { id: "Banana", emoji: "🍌", label: "Banana" }
    ] 
  },
  {
    type: 'matching',
    question: "Match the Animals to their Emojis!",
    pairs: [
      { left: { id: 'lion', emoji: '🦁', label: '' }, right: { id: 'lion', emoji: '', label: 'Lion' } },
      { left: { id: 'elephant', emoji: '🐘', label: '' }, right: { id: 'elephant', emoji: '', label: 'Elephant' } },
      { left: { id: 'penguin', emoji: '🐧', label: '' }, right: { id: 'penguin', emoji: '', label: 'Penguin' } },
    ]
  },
  { 
    type: 'multiple-choice',
    question: "Which one is the color Blue?", 
    correctId: "Blue", 
    options: [
      { id: "Red", emoji: "🟥", label: "Red" }, 
      { id: "Blue", emoji: "🟦", label: "Blue" }, 
      { id: "Green", emoji: "🟩", label: "Green" }, 
      { id: "Yellow", emoji: "🟨", label: "Yellow" }
    ] 
  },
  {
    type: 'matching',
    question: "Match the Colors to the Objects!",
    pairs: [
      { left: { id: 'sun', emoji: '☀️', label: '' }, right: { id: 'sun', emoji: '', label: 'Yellow' } },
      { left: { id: 'grass', emoji: '🌿', label: '' }, right: { id: 'grass', emoji: '', label: 'Green' } },
      { left: { id: 'ocean', emoji: '🌊', label: '' }, right: { id: 'ocean', emoji: '', label: 'Blue' } },
    ]
  },
  { 
    type: 'multiple-choice',
    question: "Find the King of the Jungle!", 
    correctId: "Lion", 
    options: [
      { id: "Cat", emoji: "🐱", label: "Cat" }, 
      { id: "Bear", emoji: "🐻", label: "Bear" }, 
      { id: "Lion", emoji: "🦁", label: "Lion" }, 
      { id: "Tiger", emoji: "🐯", label: "Tiger" }
    ] 
  },
  { 
    type: 'multiple-choice',
    question: "Which one is Crunchy Broccoli?", 
    correctId: "Broccoli", 
    options: [
      { id: "Tomato", emoji: "🍅", label: "Tomato" }, 
      { id: "Corn", emoji: "🌽", label: "Corn" }, 
      { id: "Potato", emoji: "🥔", label: "Potato" }, 
      { id: "Broccoli", emoji: "🥦", label: "Broccoli" }
    ] 
  }
];

const QuizView: React.FC<{ onSpeak: (t: string) => void, onGoHome: () => void }> = ({ onSpeak, onGoHome }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  
  // Matching state
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [matchingError, setMatchingError] = useState<string | null>(null);

  const currentQuestion = QUIZ_POOL[currentIdx];

  // Shuffle right side for matching questions
  const shuffledRight = useMemo(() => {
    if (currentQuestion.type !== 'matching' || !currentQuestion.pairs) return [];
    return [...currentQuestion.pairs].sort(() => Math.random() - 0.5);
  }, [currentIdx]);

  useEffect(() => {
    if (!finished) {
      onSpeak(currentQuestion.question);
    }
  }, [currentIdx, finished]);

  const handleNextQuestion = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('correct');
      onSpeak("Great job! That is correct!");
    } else {
      setFeedback('wrong');
      onSpeak("Oops! Try again next time!");
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedLeft(null);
      setMatchedPairs([]);
      setMatchingError(null);
      
      if (currentIdx < QUIZ_POOL.length - 1) {
        setCurrentIdx(c => c + 1);
      } else {
        setFinished(true);
        onSpeak(`You finished the quiz! Your score is ${score + (isCorrect ? 1 : 0)} out of ${QUIZ_POOL.length}`);
      }
    }, 2000);
  };

  const handleMultipleChoice = (id: string) => {
    if (feedback) return;
    handleNextQuestion(id === currentQuestion.correctId);
  };

  const handleMatching = (side: 'left' | 'right', id: string) => {
    if (feedback || matchingError || matchedPairs.includes(id)) return;

    if (side === 'left') {
      setSelectedLeft(id);
      onSpeak(currentQuestion.pairs?.find(p => p.left.id === id)?.left.emoji || "Item");
    } else {
      if (!selectedLeft) {
        onSpeak("Pick a picture first!");
        return;
      }

      if (selectedLeft === id) {
        // Match!
        const newMatched = [...matchedPairs, id];
        setMatchedPairs(newMatched);
        setSelectedLeft(null);
        onSpeak("Match found!");

        if (newMatched.length === currentQuestion.pairs?.length) {
          handleNextQuestion(true);
        }
      } else {
        // Wrong match
        setMatchingError(id);
        onSpeak("Try a different one!");
        setTimeout(() => setMatchingError(null), 800);
      }
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setScore(0);
    setFinished(false);
    setFeedback(null);
    setSelectedLeft(null);
    setMatchedPairs([]);
    setMatchingError(null);
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
        
        <div className="flex justify-between items-center mb-8">
           <span className="text-xl font-bold text-slate-400">Step {currentIdx + 1} of {QUIZ_POOL.length}</span>
           <div className="flex items-center gap-2 text-amber-500 font-bold text-xl">
             <Star className="fill-current" /> {score}
           </div>
        </div>

        <h3 className="text-4xl md:text-5xl font-black text-slate-800 text-center mb-12 px-4 leading-tight">
          {currentQuestion.question}
        </h3>

        {currentQuestion.type === 'multiple-choice' && (
          <div className="grid grid-cols-2 gap-6 animate-in fade-in duration-500">
            {currentQuestion.options?.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleMultipleChoice(opt.id)}
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
        )}

        {currentQuestion.type === 'matching' && (
          <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-center justify-center animate-in slide-in-from-bottom-8 duration-500">
            {/* Left Column: Emojis */}
            <div className="flex flex-col gap-6 w-full md:w-1/3">
              {currentQuestion.pairs?.map((pair) => (
                <button
                  key={pair.left.id}
                  onClick={() => handleMatching('left', pair.left.id)}
                  disabled={matchedPairs.includes(pair.left.id)}
                  className={`h-32 md:h-40 rounded-3xl text-6xl md:text-7xl flex items-center justify-center transition-all border-b-8 shadow-lg active:scale-95 ${
                    matchedPairs.includes(pair.left.id)
                      ? 'bg-emerald-100 border-emerald-200 opacity-50'
                      : selectedLeft === pair.left.id
                      ? 'bg-blue-500 border-blue-700 text-white scale-105'
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  {pair.left.emoji}
                  {matchedPairs.includes(pair.left.id) && (
                    <div className="absolute top-2 right-2 text-emerald-500">
                      <CheckCircle2 size={32} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Middle: Connection Indicator for Visual Clarity */}
            <div className="hidden md:flex flex-col justify-around h-full py-20 text-slate-200">
               <div className="w-16 h-1 border-t-4 border-dashed rounded-full" />
               <div className="w-16 h-1 border-t-4 border-dashed rounded-full" />
               <div className="w-16 h-1 border-t-4 border-dashed rounded-full" />
            </div>

            {/* Right Column: Labels */}
            <div className="flex flex-col gap-6 w-full md:w-1/3">
              {shuffledRight.map((pair) => (
                <button
                  key={pair.right.id}
                  onClick={() => handleMatching('right', pair.right.id)}
                  disabled={matchedPairs.includes(pair.right.id)}
                  className={`h-32 md:h-40 rounded-3xl text-2xl md:text-3xl font-black flex items-center justify-center transition-all border-b-8 shadow-lg active:scale-95 px-6 text-center ${
                    matchedPairs.includes(pair.right.id)
                      ? 'bg-emerald-500 border-emerald-700 text-white'
                      : matchingError === pair.right.id
                      ? 'bg-rose-500 border-rose-700 text-white animate-shake'
                      : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {pair.right.label}
                  {matchingError === pair.right.id && <XCircle size={32} className="ml-2" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {feedback && (
          <div className={`mt-12 text-center py-6 rounded-3xl animate-bounce ${feedback === 'correct' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            <p className="text-3xl font-black">
              {feedback === 'correct' ? "YES! YOU DID IT! 🌟" : "OOPS! TRY AGAIN! ❤️"}
            </p>
          </div>
        )}

        {currentQuestion.type === 'matching' && matchedPairs.length > 0 && !feedback && (
          <div className="mt-8 text-center text-emerald-500 font-bold animate-pulse">
            Keep going! {matchedPairs.length} of {currentQuestion.pairs?.length} matched!
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default QuizView;
