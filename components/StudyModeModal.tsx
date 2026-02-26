
import React from 'react';
import { LearningMode, SessionStep, Language } from '../types';
import { translations } from '../utils/i18n';

interface StudyModeModalProps {
  lang: Language;
  onClose: () => void;
  onSelect: (blueprint: LearningMode | SessionStep[]) => void;
  collectionId?: string;
  lessonId?: string;
}

const StudyModeModal: React.FC<StudyModeModalProps> = ({ lang, onClose, onSelect, collectionId, lessonId }) => {
  const t = translations[lang];

  const smartLearningBlueprint: SessionStep[] = [
    { mode: 'flashcard', title: t.memorize },
    { mode: 'multiple-choice', title: t.recognition },
    { mode: 'input', title: t.writing }
  ];

  const modes = [
    { 
      id: 'smart', 
      title: t.smart_study, 
      desc: t.smart_study_desc, 
      icon: '🧠', 
      highlight: true,
      blueprint: smartLearningBlueprint 
    },
    { 
      id: 'flashcard', 
      title: t.flashcards, 
      desc: t.flashcards, 
      icon: '🎴', 
      blueprint: 'flashcard' as LearningMode 
    },
    { 
      id: 'multiple-choice', 
      title: t.multiple_choice, 
      desc: t.pick_meaning, 
      icon: '🔘', 
      blueprint: 'multiple-choice' as LearningMode 
    },
    { 
      id: 'input', 
      title: t.input_write, 
      desc: t.type_meaning, 
      icon: '⌨️', 
      blueprint: 'input' as LearningMode 
    },
    { 
      id: 'speed-learn', 
      title: t.speed_learn, 
      desc: t.react_fast, 
      icon: '⚡', 
      blueprint: 'speed-learn' as LearningMode 
    },
    { 
      id: 'match', 
      title: t.match_game, 
      desc: t.match_words, 
      icon: '🔗', 
      blueprint: 'match' as LearningMode 
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{t.modes}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              {lessonId ? 'Session for Lesson' : collectionId ? 'Session for Collection' : 'Global Session'}
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 text-2xl transition-colors">&times;</button>
        </div>

        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-1 gap-3">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => onSelect(m.blueprint)}
                className={`group relative p-5 rounded-[1.5rem] border-2 text-left transition-all duration-200 flex items-center gap-4 ${
                  m.highlight 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:border-indigo-700' 
                  : 'bg-white border-slate-100 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/30'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${
                  m.highlight ? 'bg-white/20' : 'bg-slate-50'
                }`}>
                  {m.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-black text-base ${m.highlight ? 'text-white' : 'text-slate-900'}`}>{m.title}</h4>
                  <p className={`text-[10px] sm:text-xs font-medium leading-tight mt-0.5 ${m.highlight ? 'text-indigo-100' : 'text-slate-400'}`}>{m.desc}</p>
                </div>
                {m.highlight && (
                    <span className="bg-white/20 text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">Recommended</span>
                )}
                <div className={`text-xl transition-transform group-hover:translate-x-1 ${m.highlight ? 'text-white/40' : 'text-slate-200'}`}>&rarr;</div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end">
           <button 
             onClick={onClose}
             className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-800 transition-colors text-sm"
           >
             {t.cancel}
           </button>
        </div>
      </div>
    </div>
  );
};

export default StudyModeModal;
