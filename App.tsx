
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import FlashcardMode from './components/FlashcardMode';
import MultipleChoiceMode from './components/MultipleChoiceMode';
import InputMode from './components/InputMode';
import MatchMode from './components/MatchMode';
import SpeedLearnMode from './components/SpeedLearnMode';
import CollectionBrowser from './components/CollectionBrowser';
import CollectionModal from './components/CollectionModal';
import SEOContent from './components/SEOContent';
import { LearningMode, UserVocabulary, Vocabulary, SessionStep, Collection, Lesson, User, Language, ActiveLearner, LeaderboardData } from './types';
import { api } from './services/api';
import { translations } from './utils/i18n';

type AppState = LearningMode | 'session-summary' | 'loading' | 'login';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentMode, setCurrentMode] = useState<AppState>('loading');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>(() => {
    try {
      return (localStorage.getItem('app_lang') as Language) || 'vi';
    } catch (e) {
      return 'vi';
    }
  });
  
  const [stats, setStats] = useState({ totalLearning: 0, dueCount: 0, masteredCount: 0 });
  const [progressPage, setProgressPage] = useState({ items: [], currentPage: 0, totalPages: 0 });
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeLearners, setActiveLearners] = useState<ActiveLearner[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardData>({ topUsers: [], userScore: 0 });
  
  const [sessionSteps, setSessionSteps] = useState<SessionStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeStudySet, setActiveStudySet] = useState<Vocabulary[]>([]);
  const [currentSessionLessonId, setCurrentSessionLessonId] = useState<string | null>(null);
  const [currentSessionCollectionId, setCurrentSessionCollectionId] = useState<string | null>(null);
  
  const [sessionBlueprint, setSessionBlueprint] = useState<LearningMode | SessionStep[] | null>(null);
  
  const [modalState, setModalState] = useState<{ type: 'collection' | 'upload' | 'lesson', lessonId?: string, collectionId?: string } | null>(null);
  const [lastSessionResults, setLastSessionResults] = useState<{correct: number, total: number} | null>(null);

  const t = translations[lang] || translations['en'];
  const isInitialized = useRef(false);

  const handleRoute = useCallback((forceUser?: User | null) => {
    const path = window.location.pathname;
    const token = api.getToken();
    const currentUser = forceUser !== undefined ? forceUser : user;

    if (path === '/' || path === '/dashboard' || path === '/library' || path.startsWith('/library/') || path === '/articles') {
        setSessionSteps([]);
        setCurrentStepIndex(0);
        setActiveStudySet([]);
        setLastSessionResults(null);
    }

    if (path === '/logout') {
      api.logout();
      setUser(null);
      window.history.pushState({}, '', '/login');
      setCurrentMode('login');
      return;
    }

    if (path === '/login') {
      if (token && currentUser) {
        window.history.replaceState({}, '', '/dashboard');
        setCurrentMode('dashboard');
        setSelectedCollectionId(null);
      } else {
        setCurrentMode('login');
      }
      return;
    }

    if (!token && path !== '/login' && path !== '/articles') {
      window.history.replaceState({}, '', '/login');
      setCurrentMode('login');
      return;
    }

    if (path === '/' || path === '/dashboard') {
      setCurrentMode('dashboard');
      setSelectedCollectionId(null);
    } else if (path === '/library') {
      setCurrentMode('browse');
      setSelectedCollectionId(null);
    } else if (path === '/articles') {
      setCurrentMode('articles');
      setSelectedCollectionId(null);
    } else if (path.startsWith('/library/')) {
      const parts = path.split('/');
      const id = parts[2];
      setCurrentMode('browse');
      setSelectedCollectionId(id || null);
    } else {
      window.history.replaceState({}, '', '/dashboard');
      setCurrentMode('dashboard');
      setSelectedCollectionId(null);
    }
  }, [user]);

  const navigateTo = useCallback((path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      handleRoute();
    } else {
      handleRoute();
    }
  }, [handleRoute]);

  const refreshDashboardData = async (page: number = 0) => {
    try {
      const [studyStats, cols] = await Promise.all([
        api.getStudyStats().catch(() => ({ totalLearning: 0, dueCount: 0, masteredCount: 0 })),
        api.getCollections().catch(() => [])
      ]);
      setStats(studyStats);
      setCollections(cols);

      const [progress, learners, lbData] = await Promise.all([
        api.getUserProgress(page, 10).catch(() => ({ content: [], totalPages: 0 })),
        api.getActiveLearners().catch(() => []),
        api.getLeaderboard('weekly').catch(() => ({ topUsers: [], userScore: 0 }))
      ]);
      setProgressPage({
        items: progress.content || progress.items || [],
        currentPage: page,
        totalPages: progress.totalPages || 1
      });
      setActiveLearners(learners);
      setLeaderboard(lbData);
    } catch (err) {
      console.error("Dashboard refresh failed", err);
    }
  };

  const initApp = async () => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');

    if (tokenFromUrl) {
      api.setToken(tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const savedToken = api.getToken();
    if (!savedToken) {
      if (window.location.pathname === '/articles') {
        setCurrentMode('articles');
      } else {
        handleRoute(null);
      }
      return;
    }

    try {
      const currentUser = await api.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        await refreshDashboardData();
        handleRoute(currentUser);
      } else {
        api.logout();
        handleRoute(null);
      }
    } catch (err) {
      console.error("Auth initialization failed:", err);
      api.logout();
      handleRoute(null);
    }
  };

  useEffect(() => {
    initApp();
  }, []);

  useEffect(() => {
    const onPopState = () => handleRoute();
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [handleRoute]);

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
  }, [lang]);

  const startSession = async (modeOrSteps: LearningMode | SessionStep[], lessonId?: string, collectionId?: string) => {
    try {
      setCurrentMode('loading');
      setCurrentSessionLessonId(lessonId || null);
      setCurrentSessionCollectionId(collectionId || null);
      setSessionBlueprint(modeOrSteps); 
      
      const modeString = Array.isArray(modeOrSteps) ? modeOrSteps[0].mode : modeOrSteps;
      const dueVocabs = await api.getDueVocabulary(10, lessonId, modeString, collectionId);
      
      if (dueVocabs.length === 0) {
        alert(t.no_reviews_due);
        navigateTo('/dashboard');
        return;
      }

      setActiveStudySet(dueVocabs);
      if (Array.isArray(modeOrSteps)) {
        setSessionSteps(modeOrSteps);
        setCurrentStepIndex(0);
        setCurrentMode(modeOrSteps[0].mode);
      } else {
        setSessionSteps([{ mode: modeOrSteps, title: modeOrSteps.toUpperCase() }]);
        setCurrentStepIndex(0);
        setCurrentMode(modeOrSteps);
      }
    } catch (err) {
      alert(t.error_loading);
      navigateTo('/dashboard');
    }
  };

  const handleFinishStep = async (results: Array<{ vocabId: string; score: number }>) => {
    let correctCount = 0;
    try {
      results.forEach(r => {
        if (r.score >= 3) correctCount++;
      });

      await api.updateSRSBatch(results);

      await refreshDashboardData(progressPage.currentPage);

      if (currentStepIndex < sessionSteps.length - 1) {
        const nextIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextIndex);
        setCurrentMode(sessionSteps[nextIndex].mode);
      } else {
        setLastSessionResults({ correct: correctCount, total: results.length });
        setCurrentMode('session-summary');
      }
    } catch (err) {
      console.error("Update SRS batch failed:", err);
      alert(t.update_failed);
    }
  };

  if (currentMode === 'loading') return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold animate-pulse">{t.syncing}</p>
      </div>
    </div>
  );

  const getFullLearningSteps = (): SessionStep[] => [
    { mode: 'flashcard', title: t.memorize },
    { mode: 'multiple-choice', title: t.recognition },
    { mode: 'input', title: t.writing }
  ];

  const renderContent = () => {
    switch (currentMode) {
      case 'login':
        return <Login lang={lang} />;
      case 'dashboard':
        return (
          <Dashboard 
            stats={stats}
            progressData={progressPage}
            activeLearners={activeLearners}
            leaderboard={leaderboard}
            onPageChange={(p) => refreshDashboardData(p)}
            onStartStudy={(mode) => startSession(mode)} 
            onStartSmartSession={() => startSession(getFullLearningSteps())}
            lang={lang}
            userId={user?.id}
          />
        );
      case 'browse':
        return (
          <CollectionBrowser 
            collections={collections}
            vocabulary={[]}
            selectedCollectionId={selectedCollectionId}
            onSelectCollection={(id) => navigateTo(id ? `/library/${id}` : '/library')}
            onStudyLesson={(lId) => startSession(getFullLearningSteps(), lId)}
            onStudyCollection={(cId) => startSession(getFullLearningSteps(), undefined, cId)}
            onCreateCollection={() => setModalState({ type: 'collection' })}
            onCreateLesson={(cId) => setModalState({ type: 'lesson', collectionId: cId })}
            onUploadVocab={(lId) => setModalState({ type: 'upload', lessonId: lId })}
            lang={lang}
          />
        );
      case 'articles':
        return (
          <SEOContent 
            lang={lang} 
            onStartStudy={() => navigateTo('/dashboard')}
          />
        );
      case 'session-summary':
        return (
          <div className="max-w-xl mx-auto py-12 px-4 text-center">
             <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center gap-6">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl">🎉</div>
                <h2 className="text-3xl font-black text-slate-900">{t.complete}</h2>
                <div className="text-center">
                  <p className="text-3xl font-black text-indigo-600">{lastSessionResults?.correct}/{lastSessionResults?.total}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{t.correct}</p>
                </div>
                <div className="w-full flex flex-col gap-3">
                  <button 
                    onClick={() => {
                      const nextBlueprint = sessionBlueprint || (currentSessionCollectionId ? getFullLearningSteps() : 'flashcard');
                      startSession(nextBlueprint, currentSessionLessonId || undefined, currentSessionCollectionId || undefined);
                    }} 
                    className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                  >
                    🚀 {t.continue_next}
                  </button>
                  <button onClick={() => navigateTo('/dashboard')} className="w-full bg-white border-2 border-slate-100 text-slate-600 p-5 rounded-2xl font-bold hover:bg-slate-50 transition-colors">
                    Dashboard
                  </button>
                </div>
             </div>
          </div>
        );
      case 'flashcard': return <FlashcardMode lang={lang} vocabs={activeStudySet} onFinish={handleFinishStep} onCancel={() => navigateTo('/dashboard')} />;
      case 'multiple-choice': return <MultipleChoiceMode lang={lang} vocabs={activeStudySet} allVocabs={activeStudySet} onFinish={handleFinishStep} onCancel={() => navigateTo('/dashboard')} />;
      case 'input': return <InputMode lang={lang} vocabs={activeStudySet} onFinish={handleFinishStep} onCancel={() => navigateTo('/dashboard')} />;
      case 'speed-learn': return <SpeedLearnMode lang={lang} vocabs={activeStudySet} allVocabs={activeStudySet} onFinish={handleFinishStep} onCancel={() => navigateTo('/dashboard')} />;
      case 'match': return (
        <MatchMode 
          lang={lang} 
          vocabs={activeStudySet} 
          onFinish={() => navigateTo('/dashboard')} 
          onCancel={() => navigateTo('/dashboard')} 
          onNextSet={() => startSession('match', currentSessionLessonId || undefined, currentSessionCollectionId || undefined)}
        />
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 
        Fix for comparison error on 'loading':
        Removed redundant currentMode !== 'loading' check since an early return 
        already ensures currentMode is not 'loading' at this point.
      */}
      {currentMode !== 'login' && (
        <Header 
          currentMode={currentMode as LearningMode} 
          onModeChange={(m) => navigateTo(m === 'dashboard' ? '/dashboard' : (m === 'browse' ? '/library' : (m === 'articles' ? '/articles' : '/')))}
          userStats={{ dueCount: stats.dueCount, newCount: 0 }}
          lang={lang}
          onLangChange={setLang}
        />
      )}
      <main className="flex-grow max-w-7xl mx-auto py-6 w-full">
        {renderContent()}
      </main>
      {modalState && (
        <CollectionModal 
          lang={lang}
          type={modalState.type} 
          lessonId={modalState.lessonId}
          collectionId={modalState.collectionId}
          onClose={() => setModalState(null)} 
          onSaveCollection={async (name, desc, cat) => {
            await api.saveCollection({ name, description: desc, category: cat });
            await refreshDashboardData();
          }}
          onSaveLesson={async (cId, name) => {
            await api.saveLesson(cId, name);
            await refreshDashboardData();
          }}
          onSaveVocab={async (lId, items) => {
            await api.importVocabulary(lId, items);
            await refreshDashboardData();
          }}
        />
      )}
    </div>
  );
};

export default App;
