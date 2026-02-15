
import React, { useState } from 'react';
import { Vocabulary, SRSScore, Language } from '../types';
import { translations } from '../utils/i18n';
import { playTTS } from '../utils/audio';

interface FlashcardModeProps {
  vocabs: Vocabulary[];
  onFinish: (results: Array<{ vocabId: string; score: number }>) => void;
  onCancel: () => void;
  lang: Language;
}

const FlashcardMode: React.FC<FlashcardModeProps> = ({ vocabs, onFinish, onCancel, lang }) => {
  const t = translations[lang];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionResults, setSessionResults] = useState<Array<{ vocabId: string; score: number }>>([]);

  const currentVocab = vocabs[currentIndex];

  const handleScore = (score: number) => {
    const newResults = [...sessionResults, { vocabId: currentVocab.id, score }];
    if (currentIndex < vocabs.length - 1) {
      setSessionResults(newResults);
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      onFinish(newResults);
    }
  };

  if (!currentVocab) return <div>Empty stack</div>;

  const meanings = currentVocab.meaning.split(/[;,]/).map(m => m.trim()).filter(m => m.length > 0);

  return (
    <div className="max-w-xl mx-auto py-6 px-4 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest transition-colors">
          {t.cancel_session}
        </button>
        <div className="bg-slate-100 px-3 py-1 rounded-full text-slate-500 font-bold text-xs">
          {currentIndex + 1} / {vocabs.length}
        </div>
      </div>

      <div 
        className={`relative w-full h-[320px] cursor-pointer transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front */}
        <div className="absolute inset-0 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center justify-center p-6 [backface-visibility:hidden]">
          <span className="text-indigo-500 text-[10px] font-black uppercase tracking-widest mb-2">{lang === 'vi' ? 'Từ vựng' : 'Vocabulary'}</span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 text-center leading-tight tracking-tight">{currentVocab.word}</h2>
          <div className="mt-8 flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
             <span className="text-xl">👆</span>
             <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">{t.reveal_meaning}</p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 bg-indigo-600 rounded-[2.5rem] shadow-xl p-6 flex flex-col items-center justify-center text-white [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden">
          <span className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-3">{lang === 'vi' ? 'Ý nghĩa' : 'Meaning'}</span>
          
          <div className="flex flex-col items-center gap-1 mb-4">
            {meanings.slice(0, 2).map((m, idx) => (
              <h2 key={idx} className="text-2xl sm:text-3xl font-bold text-center leading-tight tracking-tight">{m}</h2>
            ))}
          </div>

          <div className="w-full h-px bg-white/10 mb-4 max-w-[120px]"></div>
          
          <div className="text-center space-y-3 w-full">
            <div className="flex flex-col items-center">
              <p className="text-indigo-200 text-[9px] font-black uppercase tracking-tighter mb-0.5 opacity-60">Pronunciation</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-base font-medium">{currentVocab.pronunciation}</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); playTTS(currentVocab.word); }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  title="Listen"
                >
                  🔊
                </button>
              </div>
            </div>
            {currentVocab.example && (
              <div className="max-w-md mx-auto bg-white/5 p-3 rounded-2xl italic">
                <p className="text-indigo-200 text-[9px] font-black uppercase tracking-tighter mb-1 not-italic opacity-60">Example</p>
                <p className="leading-snug text-xs opacity-90 line-clamp-2">"{currentVocab.example}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`mt-6 w-full grid grid-cols-3 gap-3 transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <button 
          onClick={(e) => { e.stopPropagation(); handleScore(SRSScore.WRONG); }}
          className="flex flex-col items-center gap-1.5 p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm"
        >
          <span className="text-xl">❌</span>
          <span className="font-black text-[9px] uppercase tracking-tighter text-center">{t.dont_remember}</span>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleScore(SRSScore.HARD); }}
          className="flex flex-col items-center gap-1.5 p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600 transition-all shadow-sm"
        >
          <span className="text-xl">😐</span>
          <span className="font-black text-[9px] uppercase tracking-tighter text-center">{t.partial_recall}</span>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleScore(SRSScore.GOOD); }}
          className="flex flex-col items-center gap-1.5 p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm"
        >
          <span className="text-xl">✅</span>
          <span className="font-black text-[9px] uppercase tracking-tighter text-center">{t.got_it}</span>
        </button>
      </div>
      
      {!isFlipped && (
        <p className="mt-8 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
          {lang === 'vi' ? 'Nhấn vào thẻ để lật' : 'Click card to flip'}
        </p>
      )}
    </div>
  );
};

export default FlashcardMode;
