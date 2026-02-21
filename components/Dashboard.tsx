
import React from 'react';
import { LearningMode, UserVocabulary, Language, ActiveLearner, LeaderboardData } from '../types';
import { translations } from '../utils/i18n';

interface DashboardProps {
  stats: {
    totalLearning: number;
    dueCount: number;
    masteredCount: number;
  };
  progressData: {
    items: (UserVocabulary & { word?: string })[];
    currentPage: number;
    totalPages: number;
  };
  activeLearners: ActiveLearner[];
  leaderboard: LeaderboardData;
  onPageChange: (page: number) => void;
  onStartStudy: (mode: LearningMode) => void;
  onStartSmartSession: () => void;
  lang: Language;
  userId?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  stats, 
  progressData, 
  activeLearners,
  leaderboard,
  onPageChange,
  onStartStudy, 
  onStartSmartSession,
  lang,
  userId
}) => {
  const t = translations[lang];
  const cellClass = "px-6 py-4 whitespace-nowrap";
  const headerClass = "px-6 py-3 text-left text-xs font-black text-slate-400 uppercase tracking-widest";

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-amber-500';
      case 2: return 'text-slate-400';
      case 3: return 'text-amber-700';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-1 hover:shadow-md transition-shadow">
          <span className="text-slate-500 text-sm font-medium">{t.learning}</span>
          <span className="text-3xl font-black text-slate-900">{stats.totalLearning}</span>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-1 hover:shadow-md transition-shadow">
          <span className="text-slate-500 text-sm font-medium">{t.due_review}</span>
          <span className="text-3xl font-black text-indigo-600">{stats.dueCount}</span>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-1 hover:shadow-md transition-shadow">
          <span className="text-slate-500 text-sm font-medium">{t.mastered}</span>
          <span className="text-3xl font-black text-emerald-600">{stats.masteredCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Actions Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-100">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-black mb-2">{t.smart_study}</h2>
              <p className="text-indigo-100 opacity-90">{t.smart_study_desc}</p>
            </div>
            <button 
              onClick={onStartSmartSession}
              className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-lg active:scale-95 whitespace-nowrap"
            >
              {t.start_now}
            </button>
          </div>

          <div>
            <h2 className="text-xl font-black mb-6 text-slate-900 flex items-center gap-2">
              <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
              {t.modes}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StudyCard title={t.speed_learn} desc={t.react_fast} icon="⚡" highlight onClick={() => onStartStudy('speed-learn')} count={stats.dueCount} lang={lang} t={t} />
              <StudyCard title={t.flashcards} desc={t.flashcards} icon="🎴" onClick={() => onStartStudy('flashcard')} count={stats.dueCount} lang={lang} t={t} />
              <StudyCard title={t.multiple_choice} desc={t.pick_meaning} icon="🔘" onClick={() => onStartStudy('multiple-choice')} count={stats.dueCount} lang={lang} t={t} />
              <StudyCard title={t.input_write} desc={t.type_meaning} icon="⌨️" onClick={() => onStartStudy('input')} count={stats.dueCount} lang={lang} t={t} />
              <StudyCard title={t.match_game} desc={t.match_words} icon="🔗" onClick={() => onStartStudy('match')} count={stats.dueCount} lang={lang} t={t} />
            </div>
          </div>
        </div>

        {/* Community & Social Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              {t.active_learners_title}
            </h3>
            <div className="space-y-4">
              {activeLearners.slice(0, 5).map((act, i) => (
                <div key={i} className="flex items-center gap-3 animate-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${i * 150}ms` }}>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-lg border border-slate-100">{act.icon || '👤'}</div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-900">{act.name}</p>
                    <p className="text-[10px] text-slate-400">{act.action}</p>
                  </div>
                  <span className="text-[10px] font-medium text-slate-300 whitespace-nowrap">{act.time}</span>
                </div>
              ))}
              {activeLearners.length === 0 && (
                <p className="text-xs text-slate-400 italic text-center py-4">{t.no_recent_activity}</p>
              )}
            </div>
            <button 
              disabled
              className="w-full mt-6 py-3 rounded-xl border-2 border-dashed border-slate-100 text-slate-300 text-xs font-bold cursor-not-allowed"
            >
              {t.join_group_coming_soon}
            </button>
          </div>

          <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100">
             <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">{t.weekly_leaderboard}</h3>
             <div className="space-y-3">
                {leaderboard.topUsers.slice(0, 3).map((p, i) => {
                  const rank = p.rank || (i + 1);
                  const isCurrent = userId === p.userId;
                  return (
                    <div key={p.userId} className={`flex items-center justify-between p-1 rounded-lg ${isCurrent ? 'bg-white/50 ring-1 ring-indigo-200 shadow-sm' : ''}`}>
                      <div className="flex items-center gap-3">
                        <span className={`font-black text-sm ${getRankColor(rank)}`}>#{rank}</span>
                        <span className="text-xs font-bold text-slate-700">{p.name} {isCurrent && t.you_bracket}</span>
                      </div>
                      <span className="text-[10px] font-black text-indigo-600">{p.score} pts</span>
                    </div>
                  );
                })}
                
                {/* Display Current User if not in Top 3 list provided by backend */}
                {(!leaderboard.topUsers.some(u => u.userId === userId)) && (
                  <>
                    <div className="h-px bg-indigo-100 mx-2"></div>
                    <div className="flex items-center justify-between p-1 rounded-lg bg-white/80 ring-1 ring-indigo-200 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-sm text-slate-500">
                          #{leaderboard.userRank || '?'}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{t.you}</span>
                      </div>
                      <span className="text-[10px] font-black text-indigo-600">{leaderboard.userScore} pts</span>
                    </div>
                  </>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Progress Table */}
      <div className="animate-in fade-in duration-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
            {t.progress}
          </h3>
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
            <button 
              disabled={progressData.currentPage === 0}
              onClick={() => onPageChange(progressData.currentPage - 1)}
              className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="text-xs font-black text-slate-400 tabular-nums uppercase tracking-widest">
              {t.page} {progressData.currentPage + 1} / {progressData.totalPages || 1}
            </span>
            <button 
              disabled={progressData.currentPage >= progressData.totalPages - 1}
              onClick={() => onPageChange(progressData.currentPage + 1)}
              className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full table-fixed">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className={`${headerClass} w-[45%]`}>{t.vocabulary}</th>
                <th className={`${headerClass} w-[25%]`}>{t.interval}</th>
                <th className={`${headerClass} w-[30%]`}>{t.next_review}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {progressData.items.map(uv => (
                <tr key={uv.vocabId} className="hover:bg-indigo-50/30 transition-colors">
                  <td className={`${cellClass} font-bold text-slate-900 truncate`}>
                    {uv.word || <span className="text-slate-300 font-normal italic">ID: {uv.vocabId.substring(0, 8)}...</span>}
                  </td>
                  <td className={`${cellClass} text-slate-500`}>
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">{uv.interval} {t.days}</span>
                  </td>
                  <td className={`${cellClass} text-slate-500 tabular-nums text-sm font-medium`}>
                    {new Date(uv.nextReviewAt).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US')}
                  </td>
                </tr>
              ))}
              {progressData.items.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <div className="text-4xl mb-4 opacity-20">📊</div>
                    <p className="text-slate-400 font-bold italic">{t.progress_empty}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StudyCard: React.FC<{ title: string; desc: string; icon: string; onClick: () => void; count: number; lang: Language; t: any; highlight?: boolean }> = ({ title, desc, icon, onClick, count, lang, t, highlight }) => (
  <button 
    onClick={onClick}
    className={`group p-6 rounded-3xl border transition-all text-left flex flex-col items-start gap-3 w-full ${
      highlight ? 'bg-amber-50 border-amber-200 shadow-sm shadow-amber-100' : 'bg-white border-slate-100 shadow-sm'
    } hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1`}
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform ${
      highlight ? 'bg-amber-100' : 'bg-indigo-50'
    }`}>
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="font-black text-slate-900 text-lg leading-tight">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed mt-1">{desc}</p>
    </div>
    <div className={`mt-auto pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
      highlight ? 'text-amber-600' : 'text-indigo-600'
    }`}>
      <span className={`w-2 h-2 rounded-full bg-current ${count > 0 ? 'animate-pulse' : 'opacity-20'}`}></span>
      {count} {t.words_to_review}
    </div>
  </button>
);

export default Dashboard;
