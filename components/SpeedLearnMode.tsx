
import React, { useState, useEffect, useCallback } from 'react';
import { Vocabulary, SRSScore, Language } from '../types';
import { translations } from '../utils/i18n';

interface SpeedLearnModeProps {
  vocabs: Vocabulary[];
  allVocabs: Vocabulary[];
  onFinish: (results: Array<{ vocabId: string; score: number }>) => void;
  onCancel: () => void;
  lang: Language;
}

const TIMER_SECONDS = 3;

const SpeedLearnMode: React.FC<SpeedLearnModeProps> = ({ vocabs, allVocabs, onFinish, onCancel, lang }) => {
  const t = translations[lang];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [isCorrectMatch, setIsCorrectMatch] = useState(false);
  const [displayMeaning, setDisplayMeaning] = useState('');
  const [sessionResults, setSessionResults] = useState<Array<{ vocabId: string; score: number }>>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const currentVocab = vocabs[currentIndex];

  const generateQuestion = useCallback(() => {
    if (!currentVocab) return;
    const shouldBeCorrect = Math.random() > 0.5;
    setIsCorrectMatch(shouldBeCorrect);

    if (shouldBeCorrect) {
      setDisplayMeaning(currentVocab.meaning);
    } else {
      const others = allVocabs.filter(v => v.id !== currentVocab.id);
      const randomVocab = others[Math.floor(Math.random() * others.length)];
      setDisplayMeaning(randomVocab.meaning);
    }
    setTimeLeft(TIMER_SECONDS);
    setFeedback(null);
  }, [currentVocab, allVocabs]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  useEffect(() => {
    if (feedback !== null) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          handleAnswer(null); // Timeout is a wrong answer
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentIndex, feedback]);

  const handleAnswer = (userSaidYes: boolean | null) => {
    if (feedback !== null) return;

    const correct = userSaidYes === isCorrectMatch;
    setFeedback(correct ? 'correct' : 'wrong');

    const score = correct ? SRSScore.GOOD : SRSScore.WRONG;
    const newResults = [...sessionResults, { vocabId: currentVocab.id, score }];

    setTimeout(() => {
      if (currentIndex < vocabs.length - 1) {
        setSessionResults(newResults);
        setCurrentIndex(currentIndex + 1);
      } else {
        onFinish(newResults);
      }
    }, 600);
  };

  if (!currentVocab) return null;

  return (
    <div className="max-w-xl mx-auto py-8 px-4 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6">
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 font-bold text-[10px] uppercase tracking-widest transition-colors">{t.cancel_session}</button>
        <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-black text-[10px] uppercase tracking-wider">
          {t.streak}: {sessionResults.filter(r => r.score === SRSScore.GOOD).length}
        </div>
        <div className="text-slate-500 font-bold text-[10px] bg-slate-100 px-3 py-1 rounded-full">
          {currentIndex + 1} / {vocabs.length}
        </div>
      </div>

      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-10">
        <div 
          className={`h-full transition-all duration-100 ${timeLeft < 1 ? 'bg-rose-500' : 'bg-indigo-500'}`}
          style={{ width: `${(timeLeft / TIMER_SECONDS) * 100}%` }}
        ></div>
      </div>

      <div className={`w-full bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-xl border-4 transition-all duration-300 text-center flex flex-col items-center gap-6 ${
        feedback === 'correct' ? 'border-emerald-500 scale-[1.02]' : 
        feedback === 'wrong' ? 'border-rose-500 scale-[0.98]' : 'border-slate-50 shadow-slate-200/50'
      }`}>
        <div className="space-y-2">
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] block">{t.question_match}</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight break-words">{currentVocab.word}</h2>
        </div>
        
        <div className="w-12 h-1 bg-slate-100 rounded-full"></div>

        <h3 className="text-xl sm:text-2xl font-bold text-indigo-600 leading-tight">{displayMeaning}</h3>
      </div>

      <div className="mt-10 w-full grid grid-cols-2 gap-4 sm:gap-6">
        <button 
          onClick={() => handleAnswer(false)}
          disabled={feedback !== null}
          className="bg-white border-2 border-slate-100 text-slate-700 p-6 sm:p-8 rounded-3xl font-black text-xl sm:text-2xl hover:bg-rose-50 hover:border-rose-200 transition-all flex flex-col items-center gap-2 shadow-sm active:scale-95"
        >
          <span>{t.no}</span>
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{t.arrow_left}</span>
        </button>
        <button 
          onClick={() => handleAnswer(true)}
          disabled={feedback !== null}
          className="bg-indigo-600 text-white p-6 sm:p-8 rounded-3xl font-black text-xl sm:text-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex flex-col items-center gap-2 active:scale-95"
        >
          <span>{t.yes}</span>
          <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">{t.arrow_right}</span>
        </button>
      </div>

      <p className="mt-8 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">{t.react_fast}</p>
    </div>
  );
};

export default SpeedLearnMode;
