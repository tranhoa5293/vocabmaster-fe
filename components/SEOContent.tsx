
import React from 'react';
import { Language } from '../types';
import { translations } from '../utils/i18n';

interface SEOContentProps {
  lang: Language;
  onStartStudy: () => void;
}

const SEOContent: React.FC<SEOContentProps> = ({ lang, onStartStudy }) => {
  const t = translations[lang];

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-16 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
          {t.seo_title}
        </h1>
        <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          {t.seo_subtitle}
        </p>
      </div>

      <div className="space-y-16">
        {/* Article: What is SRS? */}
        <section className="bg-white p-8 sm:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <span className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">🧠</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{t.art_srs_title}</h2>
          </div>
          <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
            <p>{t.art_srs_p1}</p>
            <p>{t.art_srs_p2}</p>
          </div>
        </section>

        {/* Article: TOEIC Vocabulary */}
        <section className="bg-indigo-50 p-8 sm:p-12 rounded-[3rem] border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <span className="w-12 h-12 bg-white text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">📈</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{t.art_toeic_title}</h2>
          </div>
          <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
            <p>{t.art_toeic_p1}</p>
            <p>{t.art_toeic_p2}</p>
          </div>
        </section>

        {/* Two Column Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🌍</span>
              <h3 className="text-xl font-black text-slate-900">{t.art_1000_title}</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {t.art_1000_p1}
            </p>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">⏰</span>
              <h3 className="text-xl font-black text-slate-900">{t.art_daily_title}</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {t.art_daily_p1}
            </p>
          </section>
        </div>

        {/* Call to Action */}
        <div className="bg-indigo-600 p-10 sm:p-16 rounded-[4rem] text-center text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-24 -translate-y-24"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-12 translate-y-12"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black mb-6">{t.smart_study}</h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto opacity-90">
              {t.smart_study_desc}
            </p>
            <button 
              onClick={onStartStudy}
              className="bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-xl active:scale-95"
            >
              {t.start_now}
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer Keywords for SEO */}
      <div className="mt-24 pt-8 border-t border-slate-200 text-center">
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest space-x-4">
          <span>#SRSLearning</span>
          <span>#TOEICVocabulary</span>
          <span>#EnglishPractice</span>
          <span>#1000Words</span>
          <span>#SmartLearning</span>
        </p>
      </div>
    </div>
  );
};

export default SEOContent;
