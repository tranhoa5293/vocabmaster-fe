
import React, { useState, useMemo } from 'react';
import { Vocabulary, SRSScore, Language } from '../types';
import { translations } from '../utils/i18n';
import { playTTS } from '../utils/audio';

interface MultipleChoiceModeProps {
  vocabs: Vocabulary[];
  allVocabs: Vocabulary[];
  onFinish: (results: Array<{ vocabId: string; score: number }>) => void;
  onCancel: () => void;
  lang: Language;
}

const MultipleChoiceMode: React.FC<MultipleChoiceModeProps> = ({ vocabs, allVocabs, onFinish, onCancel, lang }) => {
  const t = translations[lang];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [sessionResults, setSessionResults] = useState<Array<{ vocabId: string; score: number }>>([]);

  const currentVocab = vocabs[currentIndex];

  const options = useMemo(() => {
    if (!currentVocab) return [];
    const correctAnswer = currentVocab.meaning;
    const others = allVocabs.filter(v => v.id !== currentVocab.id);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random());
    const choices = [correctAnswer, ...shuffledOthers.slice(0, 3).map(v => v.meaning)];
    return choices.sort(() => 0.5 - Math.random());
  }, [currentVocab, allVocabs]);

  const handleSelect = (option: string) => {
    if (selectedOption) return;
    const correct = option === currentVocab.meaning;
    setSelectedOption(option);
    setIsCorrect(correct);

    setTimeout(() => {
      const score = correct ? SRSScore.GOOD : SRSScore.WRONG;
      const newResults = [...sessionResults, { vocabId: currentVocab.id, score }];
      
      if (currentIndex < vocabs.length - 1) {
        setSessionResults(newResults);
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        onFinish(newResults);
      }
    }, 1000);
  };

  if (!currentVocab) return null;

  return (
    <div className="h-[calc(100vh-12rem)] max-w-4xl mx-auto flex flex-col px-4">
      {/* Header Info */}
      <div className="flex justify-between items-center py-4">
        <button onClick={onCancel} className="text-slate-400 hover:text-rose-500 font-bold text-sm transition-colors">
          {t.esc_exit}
        </button>
        <div className="bg-slate-100 px-4 py-1 rounded-full text-slate-600 font-bold text-xs uppercase tracking-widest">
          {currentIndex + 1} / {vocabs.length}
        </div>
      </div>

      {/* Question Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
        <span className="text-indigo-500 text-xs font-black uppercase tracking-widest mb-2">{t.pick_meaning}</span>
        <h2 className="text-6xl font-black text-slate-900 mb-4 tracking-tight">{currentVocab.word}</h2>
        <div className="flex items-center gap-3">
          <p className="text-2xl text-slate-400 font-medium italic">{currentVocab.pronunciation}</p>
          <button 
            onClick={() => playTTS(currentVocab.word)}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all shadow-sm"
            title="Listen"
          >
            🔊
          </button>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-4 pb-8">
        {options.map((option, idx) => {
          let stateStyles = "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:shadow-md";
          const meanings = option.split(/[;,]/);

          if (selectedOption) {
            if (option === currentVocab.meaning) {
              stateStyles = "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200 scale-[1.02]";
            } else if (selectedOption === option) {
              stateStyles = "border-rose-500 bg-rose-50 text-rose-700 scale-[0.98] opacity-80";
            } else {
              stateStyles = "border-slate-100 bg-slate-50 text-slate-300 opacity-40";
            }
          }

          return (
            <button
              key={idx}
              disabled={!!selectedOption}
              onClick={() => handleSelect(option)}
              className={`relative h-32 p-6 rounded-3xl border-2 text-left transition-all duration-200 flex flex-col justify-center gap-1 overflow-hidden ${stateStyles}`}
            >
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-tight line-clamp-2">{meanings[0].trim()}</span>
                {meanings.length > 1 && (
                  <span className="text-sm opacity-60 font-medium line-clamp-1 italic">{meanings.slice(1).join('; ').trim()}</span>
                )}
              </div>
              <span className="absolute top-4 right-4 text-xs font-black opacity-20 uppercase tracking-tighter">
                {['A', 'B', 'C', 'D'][idx]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MultipleChoiceMode;
