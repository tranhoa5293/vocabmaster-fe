
import React, { useState, useEffect, useCallback } from 'react';
import { Vocabulary, Language } from '../types';
import { translations } from '../utils/i18n';

interface MatchModeProps {
  vocabs: Vocabulary[];
  onFinish: () => void;
  onCancel: () => void;
  onNextSet?: () => void;
  lang: Language;
}

const MatchMode: React.FC<MatchModeProps> = ({ vocabs, onFinish, onCancel, onNextSet, lang }) => {
  const t = translations[lang];
  const [words, setWords] = useState<Array<{id: string, text: string}>>([]);
  const [meanings, setMeanings] = useState<Array<{id: string, text: string}>>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<string | null>(null);
  const [matches, setMatches] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<{ wordId: string, meaningId: string, type: 'correct' | 'wrong' } | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const initGame = useCallback(() => {
    const w = vocabs.map(v => ({ id: v.id, text: v.word })).sort(() => 0.5 - Math.random());
    const m = vocabs.map(v => ({ id: v.id, text: v.meaning })).sort(() => 0.5 - Math.random());
    setWords(w);
    setMeanings(m);
    setMatches(new Set());
    setFeedback(null);
    setIsFinished(false);
    setSelectedWord(null);
    setSelectedMeaning(null);
  }, [vocabs]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    if (selectedWord && selectedMeaning) {
      const isCorrect = selectedWord === selectedMeaning;
      
      setFeedback({
        wordId: selectedWord,
        meaningId: selectedMeaning,
        type: isCorrect ? 'correct' : 'wrong'
      });

      const timer = setTimeout(() => {
        if (isCorrect) {
          setMatches(prev => new Set([...prev, selectedWord]));
        }
        setFeedback(null);
        setSelectedWord(null);
        setSelectedMeaning(null);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [selectedWord, selectedMeaning]);

  useEffect(() => {
    if (matches.size > 0 && matches.size === vocabs.length) {
      const timer = setTimeout(() => setIsFinished(true), 500);
      return () => clearTimeout(timer);
    }
  }, [matches.size, vocabs.length]);

  if (isFinished) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center gap-6 sm:gap-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl sm:text-5xl">🏆</div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{t.complete}</h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">{t.match_success}</p>
          </div>
          
          <div className="w-full flex flex-col gap-3">
            {onNextSet && (
              <button 
                onClick={onNextSet} 
                className="w-full bg-indigo-600 text-white p-4 sm:p-5 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              >
                🚀 {t.continue_next}
              </button>
            )}
            <button 
              onClick={initGame} 
              className="w-full bg-indigo-50 text-indigo-600 p-4 sm:p-5 rounded-2xl font-black hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
            >
              🔄 {t.replay_set}
            </button>
            <button 
              onClick={onFinish} 
              className="w-full bg-white border-2 border-slate-100 text-slate-600 p-4 sm:p-5 rounded-2xl font-black hover:bg-slate-50 transition-colors"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getButtonStyle = (id: string, type: 'word' | 'meaning') => {
    const isMatched = matches.has(id);
    const isSelected = type === 'word' ? selectedWord === id : selectedMeaning === id;
    const isFeedback = feedback && (type === 'word' ? feedback.wordId === id : feedback.meaningId === id);

    if (isMatched) {
      return 'bg-slate-50 border-transparent text-slate-200 opacity-40 cursor-default pointer-events-none scale-95';
    }

    if (isFeedback) {
      return feedback?.type === 'correct' 
        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg scale-[1.02] z-10' 
        : 'border-rose-500 bg-rose-50 text-rose-700 animate-shake ring-2 ring-rose-100';
    }

    if (isSelected) {
      return 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md ring-2 ring-indigo-100 z-10';
    }

    return 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm cursor-pointer active:scale-95';
  };

  return (
    <div className="max-w-4xl mx-auto py-2 sm:py-4 px-3 sm:px-4 flex flex-col items-center pb-20 sm:pb-4">
      <div className="w-full flex justify-between items-center mb-6">
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 font-bold text-[10px] uppercase tracking-widest transition-colors">
          &larr; {t.cancel_session}
        </button>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-1.5 w-16 sm:w-32 bg-slate-100 rounded-full overflow-hidden">
             <div 
               className="h-full bg-emerald-500 transition-all duration-500" 
               style={{ width: `${(matches.size / vocabs.length) * 100}%` }}
             ></div>
          </div>
          <div className="text-slate-500 font-black text-[9px] tabular-nums bg-white px-2 py-0.5 rounded-full border border-slate-100">
            {matches.size} / {vocabs.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-2 sm:gap-x-8 gap-y-2 w-full max-w-2xl">
        <div className="space-y-2">
          <h3 className="text-center font-black text-slate-400 uppercase tracking-[0.15em] text-[8px] mb-2">{t.match_words}</h3>
          {words.map(w => (
            <button
              key={w.id}
              disabled={matches.has(w.id) || !!feedback}
              onClick={() => setSelectedWord(w.id)}
              className={`w-full p-2 sm:p-3 rounded-xl border-2 font-bold text-xs sm:text-base transition-all min-h-[3.5rem] flex items-center justify-center text-center leading-snug shadow-sm break-words px-3 ${getButtonStyle(w.id, 'word')}`}
            >
              {w.text}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="text-center font-black text-slate-400 uppercase tracking-[0.15em] text-[8px] mb-2">{t.match_meanings}</h3>
          {meanings.map(m => (
            <button
              key={m.id}
              disabled={matches.has(m.id) || !!feedback}
              onClick={() => setSelectedMeaning(m.id)}
              className={`w-full p-2 sm:p-3 rounded-xl border-2 font-bold text-xs sm:text-base transition-all min-h-[3.5rem] flex items-center justify-center text-center leading-snug shadow-sm break-words px-3 ${getButtonStyle(m.id, 'meaning')}`}
            >
              {m.text}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default MatchMode;
