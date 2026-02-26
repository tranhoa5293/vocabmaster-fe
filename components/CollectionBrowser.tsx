
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Collection, Lesson, Vocabulary, Language } from '../types';
import { api } from '../services/api';
import { translations } from '../utils/i18n';

interface CollectionBrowserProps {
  collections: Collection[];
  vocabulary: Vocabulary[];
  selectedCollectionId: string | null;
  onSelectCollection: (id: string | null) => void;
  onStudyLesson: (lessonId: string, collectionId: string) => void;
  onStudyCollection: (collectionId: string) => void;
  onCreateCollection: () => void;
  onCreateLesson: (collectionId: string) => void;
  onUploadVocab: (lessonId: string) => void;
  lang: Language;
  userId?: string;
}

const CollectionBrowser: React.FC<CollectionBrowserProps> = ({ 
  collections, vocabulary, selectedCollectionId, onSelectCollection, onStudyLesson, onStudyCollection, onCreateCollection, onCreateLesson, onUploadVocab, lang, userId 
}) => {
  const t = translations[lang];
  const [activeLessons, setActiveLessons] = useState<Lesson[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const [favCollections, setFavCollections] = useState<Set<string>>(new Set());
  const [favLessons, setFavLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    const collFavs = new Set(collections.filter(c => c.isFavorite).map(c => c.id));
    setFavCollections(collFavs);
  }, [collections]);

  const activeCollection = useMemo(() => collections.find(c => c.id === selectedCollectionId), [collections, selectedCollectionId]);
  const isOwner = useMemo(() => activeCollection?.creatorId === userId, [activeCollection, userId]);

  const filteredCollections = useMemo(() => {
    return collections.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFavorite = showOnlyFavorites ? favCollections.has(c.id) : true;
      return matchesSearch && matchesFavorite;
    });
  }, [collections, searchQuery, showOnlyFavorites, favCollections]);

  const fetchLessons = useCallback(async (collectionId: string) => {
    setIsLoadingLessons(true);
    try {
      const lessons: Lesson[] = await api.getLessons(collectionId);
      setActiveLessons(lessons);
      const lessonFavs = new Set<string>(lessons.filter(l => l.isFavorite).map(l => l.id));
      
      setFavLessons(prev => {
        const next = new Set(prev);
        lessonFavs.forEach(id => next.add(id));
        return next;
      });
    } catch (error) {
      console.error("Failed to load lessons:", error);
    } finally {
      setIsLoadingLessons(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCollectionId) {
      fetchLessons(selectedCollectionId);
    } else {
      setActiveLessons([]);
    }
  }, [selectedCollectionId, fetchLessons]);

  const toggleFavCollection = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavCollections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

    try {
      await api.toggleFavoriteCollection(id);
    } catch (err) {
      console.error("API error toggling collection favorite:", err);
      setFavCollections(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    }
  };

  const toggleFavLesson = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavLessons(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

    try {
      await api.toggleFavoriteLesson(id);
    } catch (err) {
      console.error("API error toggling lesson favorite:", err);
      setFavLessons(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    }
  };

  const getLocalizedCategory = (cat: string) => {
    const key = `cat_${cat.toLowerCase()}`;
    return (t as any)[key] || cat;
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900">{t.library}</h2>
          <p className="text-slate-500">{t.library_desc}</p>
        </div>
        {!selectedCollectionId && (
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input 
                  type="text" 
                  placeholder={t.search_placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all text-sm"
                />
            </div>
            <button 
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`p-2.5 rounded-xl border transition-all ${showOnlyFavorites ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white border-slate-200 text-slate-400'}`}
              title={t.favorites}
            >
              {showOnlyFavorites ? '❤️' : '🤍'}
            </button>
            <button 
                onClick={onCreateCollection}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 whitespace-nowrap text-sm"
              >
                {t.create_new}
              </button>
          </div>
        )}
      </div>

      {!selectedCollectionId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map(c => (
            <div 
              key={c.id} 
              className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:border-indigo-200 transition-all hover:shadow-xl cursor-pointer relative" 
              onClick={() => onSelectCollection(c.id)}
            >
              <button 
                onClick={(e) => toggleFavCollection(e, c.id)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-lg hover:scale-110 transition-transform"
              >
                {favCollections.has(c.id) ? '❤️' : '🤍'}
              </button>

              <div className="h-40 bg-slate-50 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform relative">
                {c.imageUrl || '📚'}
                <div className="absolute bottom-3 left-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] font-black text-white uppercase tracking-wider">{c.activeLearners || 0} {t.active_now}</span>
                </div>
              </div>
              
              <div className="p-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">
                  {getLocalizedCategory(c.category)}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{c.name}</h3>
                <p className="text-slate-500 text-sm mt-1 line-clamp-2 leading-relaxed">{c.description}</p>
                
                <div className="mt-6 flex items-center justify-between">
                   <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">U{i}</div>
                      ))}
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[8px] font-bold text-indigo-600">+</div>
                   </div>
                  <span className="text-indigo-600 text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">{t.explore} &rarr;</span>
                </div>
              </div>
            </div>
          ))}
          {filteredCollections.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
               <span className="text-4xl mb-4 block">🔍</span>
               <p className="text-slate-400 font-bold">{t.no_results}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-left-4">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => onSelectCollection(null)} className="text-sm font-bold text-indigo-600 flex items-center gap-2 hover:gap-3 transition-all">
              &larr; {t.back}
            </button>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => selectedCollectionId && fetchLessons(selectedCollectionId)}
                className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1"
              >
                🔄 {t.refresh}
              </button>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-black text-slate-900">{activeCollection?.name}</h1>
              <p className="text-slate-500 mt-1">{activeCollection?.description}</p>
              <div className="flex items-center gap-4 mt-4">
                 <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {activeCollection?.activeLearners || 0} {t.active_now}
                 </div>
                 <button 
                  onClick={(e) => toggleFavCollection(e, selectedCollectionId)}
                  className="text-xs font-bold text-rose-500 flex items-center gap-1"
                 >
                   {favCollections.has(selectedCollectionId) ? `❤️ ${t.fav_added}` : `🤍 ${t.fav_add}`}
                 </button>
              </div>
            </div>
            <button 
              onClick={() => onStudyCollection(selectedCollectionId)}
              className="w-full md:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 relative z-10"
            >
              {t.study_all}
            </button>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              {t.lessons}
              <span className="bg-slate-100 text-slate-400 text-[10px] px-2 py-0.5 rounded-full">{activeLessons.length}</span>
            </h3>
            {isOwner && (
              <button 
                onClick={() => onCreateLesson(selectedCollectionId)}
                className="text-xs font-bold bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-md whitespace-nowrap"
              >
                ➕ {t.modal_lesson_title}
              </button>
            )}
          </div>
          
          {isLoadingLessons ? (
            <div className="flex flex-col items-center py-12 gap-4">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 font-medium italic text-sm">{t.loading}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeLessons.length > 0 ? activeLessons.map(l => {
                const count = l.totalWord || 0;
                return (
                  <div key={l.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-indigo-200 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={(e) => toggleFavLesson(e, l.id)}
                        className={`text-lg transition-transform hover:scale-125 ${favLessons.has(l.id) ? 'grayscale-0' : 'grayscale opacity-30'}`}
                      >
                        ❤️
                      </button>
                      <div>
                        <h4 className="font-bold text-slate-900">{l.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            {count > 0 ? `${count} ${t.words}` : t.new_lesson}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                            {l.activeLearners || 0} {t.active_now}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       {isOwner && (
                         <button 
                          onClick={() => onUploadVocab(l.id)}
                          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                          title={t.modal_upload_title}
                        >
                          ➕
                        </button>
                       )}
                      <button 
                        onClick={() => onStudyLesson(l.id, l.collectionId)}
                        className="px-5 py-2.5 rounded-xl font-bold text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        {t.start_now}
                      </button>
                    </div>
                  </div>
                )
              }) : (
                <div className="col-span-full py-20 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-[2rem] bg-white flex flex-col items-center gap-4">
                  <div className="text-4xl">📭</div>
                  <p className="font-bold">{t.no_lessons}</p>
                  {isOwner && (
                    <button 
                      onClick={() => onCreateLesson(selectedCollectionId)}
                      className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                    >
                      {t.modal_lesson_title}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionBrowser;
