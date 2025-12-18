
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: (email: string, pass: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, pass);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
        {/* Dekoracyjny blask w tle */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl"></div>
        
        <div className="bg-blue-600 h-1.5 relative z-10"></div>
        
        <div className="p-10 relative z-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-900/40">
                <i className="fa-solid fa-lock text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Panel Dostępu</h1>
            <p className="text-slate-400">Zaloguj się do systemu Print Expert</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300 ml-1">Adres E-mail / Login</label>
              <div className="relative group">
                <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"></i>
                <input 
                  type="text" 
                  required 
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-slate-600"
                  placeholder="twoj@email.pl lub admin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300 ml-1">Hasło</label>
              <div className="relative group">
                <i className="fa-solid fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"></i>
                <input 
                  type="password" 
                  required 
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-slate-600"
                  placeholder="••••••••"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-900/40 active:scale-[0.98]">
                Zaloguj się
              </button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-800 text-center">
             <p className="text-sm text-slate-500">
               Dane testowe administratora:
             </p>
             <div className="mt-2 inline-flex items-center space-x-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                <span className="text-xs font-mono text-blue-400">admin</span>
                <span className="text-slate-600">/</span>
                <span className="text-xs font-mono text-blue-400">admin</span>
             </div>
          </div>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => navigate('/register')} 
              className="text-slate-400 text-sm hover:text-white transition"
            >
              Nie masz konta? <span className="text-blue-400 font-bold">Zarejestruj się</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
