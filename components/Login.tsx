
import React from 'react';
import { Language } from '../types';
import { translations } from '../utils/i18n';

interface LoginProps {
  lang: Language;
}

const Login: React.FC<LoginProps> = ({ lang }) => {
  const t = translations[lang];

  const handleGoogleLogin = () => {
    window.location.href = 'https://api.vocabmaster.store/oauth2/authorization/google';
    // window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-12 text-center border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-indigo-200">
          <span className="text-white font-black text-4xl">V</span>
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 mb-2">{t.login_title}</h1>
        <p className="text-slate-500 mb-10 leading-relaxed">
          {t.login_desc}
        </p>

        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-100 p-5 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-indigo-200 transition-all shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
          {t.login_google}
        </button>

        <p className="mt-8 text-xs text-slate-400 font-medium">
          {t.login_terms}
        </p>
      </div>
    </div>
  );
};

export default Login;
