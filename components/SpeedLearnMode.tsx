
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
    <div className="max-w-xl mx-auto py-12 px-4 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8">
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 font-medium">{t.cancel_session}</button>
        <div className="px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold text-sm">
          {t.streak}: {sessionResults.filter(r => r.score === SRSScore.GOOD).length}
        </div>
        <div className="text-slate-500 font-bold text-sm">
          {currentIndex + 1} / {vocabs.length}
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-12">
        <div 
          className={`h-full transition-all duration-100 ${timeLeft < 1 ? 'bg-rose-500' : 'bg-indigo-500'}`}
          style={{ width: `${(timeLeft / TIMER_SECONDS) * 100}%` }}
        ></div>
      </div>

      <div className={`w-full bg-white p-10 rounded-3xl shadow-xl border-4 transition-all duration-300 text-center flex flex-col items-center gap-6 ${
        feedback === 'correct' ? 'border-emerald-500 scale-105' : 
        feedback === 'wrong' ? 'border-rose-500 scale-95' : 'border-slate-50'
      }`}>
        <div>
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 block">{t.question_match}</span>
          <h2 className="text-5xl font-black text-slate-900 mb-2">{currentVocab.word}</h2>
        </div>
        
        <div className="w-12 h-1 bg-slate-100"></div>

        <h3 className="text-3xl font-bold text-indigo-600">{displayMeaning}</h3>
      </div>

      <div className="mt-12 w-full grid grid-cols-2 gap-6">
        <button 
          onClick={() => handleAnswer(false)}
          disabled={feedback !== null}
          className="bg-white border-2 border-slate-200 text-slate-700 p-8 rounded-2xl font-black text-2xl hover:bg-rose-50 hover:border-rose-200 transition-all flex flex-col items-center gap-2"
        >
          <span>{t.no}</span>
          <span className="text-[10px] font-medium text-slate-400">{lang === 'vi' ? 'Mũi tên trái' : 'Left Arrow'}</span>
        </button>
        <button 
          onClick={() => handleAnswer(true)}
          disabled={feedback !== null}
          className="bg-indigo-600 text-white p-8 rounded-2xl font-black text-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex flex-col items-center gap-2"
        >
          <span>{t.yes}</span>
          <span className="text-[10px] font-medium text-indigo-200">{lang === 'vi' ? 'Mũi tên phải' : 'Right Arrow'}</span>
        </button>
      </div>

      <p className="mt-8 text-slate-400 text-sm font-medium animate-pulse">{t.react_fast}</p>
    </div>
  );
};

export default SpeedLearnMode;
