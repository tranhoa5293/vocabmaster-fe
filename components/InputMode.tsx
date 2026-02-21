
import React, { useState, useRef, useEffect } from 'react';
import { Vocabulary, SRSScore, Language } from '../types';
import { levenshteinDistance } from '../utils/srs';
import { FUZZY_THRESHOLD } from '../constants';
import { translations } from '../utils/i18n';
import { playTTS } from '../utils/audio';

interface InputModeProps {
  vocabs: Vocabulary[];
  onFinish: (results: Array<{ vocabId: string; score: number }>) => void;
  onCancel: () => void;
  lang: Language;
}

const InputMode: React.FC<InputModeProps> = ({ vocabs, onFinish, onCancel, lang }) => {
  const t = translations[lang];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'exact' | 'fuzzy' | 'wrong' | null>(null);
  const [sessionResults, setSessionResults] = useState<Array<{ vocabId: string; score: number }>>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const currentVocab = vocabs[currentIndex];

  useEffect(() => {
    if (!showFeedback && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, showFeedback]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showFeedback || !inputValue.trim()) return;

    const userInputs = inputValue.split(/[;,]/)
      .map(m => m.trim().toLowerCase())
      .filter(m => m.length > 0);

    const validMeanings = currentVocab.meaning
      .split(/[;,]/)
      .map(m => m.trim().toLowerCase())
      .filter(m => m.length > 0);
    
    let bestScore = SRSScore.WRONG;
    let bestType: 'exact' | 'fuzzy' | 'wrong' = 'wrong';

    for (const inputPart of userInputs) {
      for (const correctMeaning of validMeanings) {
        const distance = levenshteinDistance(inputPart, correctMeaning);
        if (distance === 0) {
          bestScore = SRSScore.GOOD;
          bestType = 'exact';
          break; 
        } else if (distance <= FUZZY_THRESHOLD) {
          if (bestType === 'wrong') {
            bestScore = SRSScore.HARD;
            bestType = 'fuzzy';
          }
        }
      }
      if (bestType === 'exact') break;
    }

    setFeedbackType(bestType);
    setShowFeedback(true);

    setTimeout(() => {
      const newResults = [...sessionResults, { vocabId: currentVocab.id, score: bestScore }];
      if (currentIndex < vocabs.length - 1) {
        setSessionResults(newResults);
        setCurrentIndex(currentIndex + 1);
        setInputValue('');
        setShowFeedback(false);
        setFeedbackType(null);
      } else {
        onFinish(newResults);
      }
    }, 1800);
  };

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-12 px-4 flex flex-col items-center pb-20 sm:pb-4">
      <div className="w-full flex justify-between items-center mb-6 sm:mb-12">
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 font-bold text-[10px] uppercase tracking-widest transition-colors">&larr; {t.cancel_session}</button>
        <div className="text-slate-500 font-bold text-[10px] bg-slate-100 px-3 py-1 rounded-full">
          {currentIndex + 1} / {vocabs.length}
        </div>
      </div>

      <div className="w-full bg-white p-6 sm:p-12 rounded-[2rem] sm:rounded-3xl shadow-sm border border-slate-100 text-center mb-8 sm:mb-12 animate-in fade-in slide-in-from-bottom-4">
        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3 block">{t.type_meaning}</span>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight break-words">{currentVocab?.word}</h2>
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <p className="text-slate-400 text-base sm:text-lg italic font-medium opacity-70 break-all">{currentVocab?.pronunciation}</p>
            <button 
              onClick={() => playTTS(currentVocab.word)}
              className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-all shadow-sm border border-slate-200"
              title="Listen"
            >
              🔊
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="relative">
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{t.label_meaning}</label>
          <input
            ref={inputRef}
            type="text"
            disabled={showFeedback}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t.label_meaning + "..."}
            className={`w-full p-5 sm:p-6 text-lg sm:text-xl rounded-2xl border-2 transition-all outline-none shadow-sm ${
                showFeedback 
                ? (feedbackType === 'wrong' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-emerald-500 bg-emerald-50 text-emerald-700') 
                : 'border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50'
            }`}
          />
        </div>

        {showFeedback && (
          <div className={`p-5 sm:p-6 rounded-2xl animate-in fade-in zoom-in-95 border-l-4 shadow-sm ${
              feedbackType === 'wrong' ? 'bg-rose-100 text-rose-800 border-rose-500' : 'bg-emerald-100 text-emerald-800 border-emerald-500'
          }`}>
            <p className="font-bold flex items-center gap-2 text-sm sm:text-base">
              {feedbackType === 'exact' && '✅ ' + t.exact_match}
              {feedbackType === 'fuzzy' && '😐 ' + t.fuzzy_match}
              {feedbackType === 'wrong' && '❌ ' + t.wrong_match}
            </p>
            <div className="mt-3">
              <span className="text-[10px] font-black uppercase opacity-60 tracking-wider">{t.correct}:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {currentVocab.meaning.split(/[;,]/).map((m, i) => (
                  <span key={i} className="bg-white/60 px-2 sm:px-3 py-1 rounded-lg font-bold text-xs sm:text-sm border border-black/5 shadow-sm">{m.trim()}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {!showFeedback && (
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="w-full bg-indigo-600 text-white p-5 sm:p-6 rounded-2xl font-black text-base sm:text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 active:scale-[0.98]"
          >
            {t.check_enter}
          </button>
        )}
      </form>
      
      <p className="mt-8 text-slate-300 text-[10px] font-black uppercase tracking-widest text-center">{t.tip_enter}</p>
    </div>
  );
};

export default InputMode;
