
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

  const isDashboard = currentMode === 'dashboard' || (!['dashboard', 'browse', 'articles'].includes(currentMode));
  const isBrowse = currentMode === 'browse';

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => onModeChange('dashboard')}
          >
            <div className="w-7 h-7 md:w-8 md:h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
              <span className="text-white font-bold text-lg md:text-xl">V</span>
            </div>
            <h1 className="text-base md:text-lg font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden xs:block">
              VocabMaster
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => onModeChange('dashboard')}
              className={`text-sm font-bold transition-colors ${isDashboard ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
            >
              {t.dashboard}
            </button>
            <button 
              onClick={() => onModeChange('browse')}
              className={`text-sm font-bold transition-colors ${isBrowse ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
            >
              {t.library}
            </button>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
              <button 
                onClick={() => onLangChange('vi')}
                className={`px-1.5 py-0.5 md:px-2 md:py-1 text-[9px] md:text-[10px] font-black rounded-lg transition-all ${lang === 'vi' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
              >
                VN
              </button>
              <button 
                onClick={() => onLangChange('en')}
                className={`px-1.5 py-0.5 md:px-2 md:py-1 text-[9px] md:text-[10px] font-black rounded-lg transition-all ${lang === 'en' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
              >
                EN
              </button>
            </div>

            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.due_today}</span>
              <span className="text-xs font-black text-indigo-600">{userStats.dueCount} {t.words}</span>
            </div>
            
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm ring-1 ring-slate-100 overflow-hidden">
              <span className="text-[10px] md:text-xs">JD</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation - Segmented Style */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[60]">
        <nav className="bg-white/90 backdrop-blur-xl border border-slate-200/50 shadow-2xl rounded-2xl p-1.5 flex items-center relative h-14">
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-indigo-600 rounded-xl transition-all duration-300 ease-out shadow-lg shadow-indigo-200 ${
              isDashboard ? 'left-1.5' : 'left-[calc(50%+1.5px)]'
            }`}
          />
          
          <button 
            onClick={() => onModeChange('dashboard')}
            className={`relative z-10 flex-1 flex flex-col items-center justify-center h-full transition-colors duration-300 ${isDashboard ? 'text-white' : 'text-slate-400 font-bold'}`}
          >
            <span className="text-[10px] font-black uppercase tracking-wider">{t.dashboard}</span>
          </button>
          
          <button 
            onClick={() => onModeChange('browse')}
            className={`relative z-10 flex-1 flex flex-col items-center justify-center h-full transition-colors duration-300 ${isBrowse ? 'text-white' : 'text-slate-400 font-bold'}`}
          >
            <span className="text-[10px] font-black uppercase tracking-wider">{t.library}</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default Header;
