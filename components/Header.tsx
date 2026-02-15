
import React from 'react';
import { LearningMode, Language } from '../types';
import { translations } from '../utils/i18n';

interface HeaderProps {
  currentMode: LearningMode;
  onModeChange: (mode: LearningMode) => void;
  userStats: { dueCount: number; newCount: number };
  lang: Language;
  onLangChange: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ currentMode, onModeChange, userStats, lang, onLangChange }) => {
  const t = translations[lang];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onModeChange('dashboard')}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
            Vocab Master
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => onModeChange('dashboard')}
            className={`text-sm font-bold transition-colors ${currentMode === 'dashboard' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            {t.dashboard}
          </button>
          <button 
            onClick={() => onModeChange('browse')}
            className={`text-sm font-bold transition-colors ${currentMode === 'browse' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            {t.library}
          </button>
          <button 
            onClick={() => onModeChange('flashcard')}
            className={`text-sm font-bold transition-colors ${currentMode === 'flashcard' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            {t.flashcards}
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
            <button 
              onClick={() => onLangChange('vi')}
              className={`px-2 py-1 text-[10px] font-black rounded-lg transition-all ${lang === 'vi' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
            >
              VN
            </button>
            <button 
              onClick={() => onLangChange('en')}
              className={`px-2 py-1 text-[10px] font-black rounded-lg transition-all ${lang === 'en' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
            >
              EN
            </button>
          </div>

          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.due_today}</span>
            <span className="text-sm font-black text-indigo-600">{userStats.dueCount} {t.words}</span>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm ring-1 ring-slate-100">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
