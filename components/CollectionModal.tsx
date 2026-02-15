
import React, { useState } from 'react';
import { Collection, Lesson, Vocabulary, Language } from '../types';
import { translations } from '../utils/i18n';

interface CollectionModalProps {
  type: 'collection' | 'upload' | 'lesson';
  lessonId?: string;
  collectionId?: string;
  onClose: () => void;
  onSaveCollection?: (name: string, desc: string, cat: string) => void;
  onSaveLesson?: (collectionId: string, name: string) => Promise<void>;
  onSaveVocab?: (lessonId: string, items: Array<Partial<Vocabulary>>) => Promise<void>;
  lang: Language;
}

const CollectionModal: React.FC<CollectionModalProps> = ({ type, lessonId, collectionId, onClose, onSaveCollection, onSaveLesson, onSaveVocab, lang }) => {
  const t = translations[lang];
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState('General');
  const [csvText, setCsvText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const smartParse = (text: string): Array<Partial<Vocabulary>> => {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    return lines.map(line => {
      const separatorRegex = /\s*[-–—:|]\s*|\t+/;
      const parts = line.split(separatorRegex).map(s => s.trim()).filter(s => s !== '');

      if (parts.length < 2) return null;

      let word = parts[0];
      let pronunciation = '';
      let meaning = '';
      let example = '';

      if (parts.length >= 3) {
        pronunciation = parts[1];
        meaning = parts[2];
        if (parts.length > 3) {
          example = parts.slice(3).join(' - ');
        }
      } else {
        meaning = parts[1];
      }

      return { word, meaning, pronunciation, example };
    }).filter(Boolean) as Array<Partial<Vocabulary>>;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (type === 'collection' && onSaveCollection) {
        onSaveCollection(name, desc, cat);
        onClose();
      } else if (type === 'lesson' && onSaveLesson && collectionId) {
        await onSaveLesson(collectionId, name);
        onClose();
      } else if (type === 'upload' && onSaveVocab && lessonId) {
        const items = smartParse(csvText);
        if (items.length === 0) {
          alert(t.import_error);
          setIsSaving(false);
          return;
        }
        await onSaveVocab(lessonId, items);
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert(t.update_failed);
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    if (type === 'collection') {
      return (
        <>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t.label_name}</label>
            <input required value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Ex: TOEIC Essentials" className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 transition-all outline-none" />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t.label_cat}</label>
            <select value={cat} onChange={e => setCat(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 transition-all outline-none text-sm font-bold">
              <option>General</option>
              <option>Academic</option>
              <option>Business</option>
              <option>Travel</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t.label_desc}</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="..." className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 transition-all outline-none h-24 resize-none" />
          </div>
        </>
      );
    }
    
    if (type === 'lesson') {
      return (
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t.label_lesson_name}</label>
          <input required value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Ex: Unit 1: Workplace" className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 transition-all outline-none" />
          <p className="mt-2 text-[10px] text-slate-400 font-medium italic">Tạo bài học trống, bạn có thể nhập từ vựng vào sau.</p>
        </div>
      );
    }

    // Default: 'upload' type
    return (
      <>
        <div className="bg-indigo-50 p-5 rounded-2xl space-y-2 border border-indigo-100">
          <p className="text-xs text-indigo-700 font-bold uppercase tracking-wider">{t.format_support}</p>
          <ul className="text-xs text-indigo-600 leading-relaxed list-disc list-inside opacity-80">
            <li><code className="bg-white px-1 rounded font-bold">Word - Pronunciation - Meaning</code></li>
            <li><code className="bg-white px-1 rounded font-bold">Word - Meaning</code></li>
          </ul>
          <p className="text-[10px] text-indigo-400 italic mt-2">
            {t.format_tip}
          </p>
        </div>
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t.label_list}</label>
          <textarea 
            required 
            value={csvText} 
            onChange={e => setCsvText(e.target.value)} 
            placeholder={"ACCURATE (adj) - /ˈækjərət/ - ..."} 
            className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 transition-all outline-none h-48 resize-none font-mono text-sm leading-relaxed" 
          />
        </div>
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-900">
            {type === 'collection' ? t.modal_collection_title : 
             type === 'lesson' ? t.modal_lesson_title : 
             t.modal_upload_title}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {renderContent()}

          <div className="flex gap-4">
            <button type="button" onClick={onClose} disabled={isSaving} className="flex-1 p-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">{t.cancel}</button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="flex-1 p-4 rounded-2xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center justify-center"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                type === 'collection' || type === 'lesson' ? t.create : t.save_all
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollectionModal;
