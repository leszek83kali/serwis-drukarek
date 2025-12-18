
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  auth: AuthState;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, auth, onLogout }) => {
  const isAdmin = auth.user?.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <i className="fa-solid fa-print text-blue-600 text-2xl"></i>
                <span className="text-xl font-bold text-slate-800 tracking-tight">Print <span className="text-blue-600">Expert</span></span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium">Start</Link>
              {auth.isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-slate-600 hover:text-blue-600 font-medium">
                    {isAdmin ? 'Panel Admina' : 'Moje Naprawy'}
                  </Link>
                  {!isAdmin && (
                    <Link to="/report" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">Zgłoś Usterkę</Link>
                  )}
                  <div className="flex items-center space-x-4 border-l pl-8 ml-4">
                    <div className="text-right">
                      <p className="text-sm text-slate-900 font-bold leading-none">{auth.user?.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter mt-1">{isAdmin ? 'Administrator' : 'Klient'}</p>
                    </div>
                    <button onClick={onLogout} className="text-red-500 hover:text-red-600 text-lg p-2 hover:bg-red-50 rounded-full transition">
                      <i className="fa-solid fa-right-from-bracket"></i>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium">Logowanie</Link>
                  <Link to="/register" className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition font-medium">Zarejestruj się</Link>
                </>
              )}
            </div>
            
            <div className="md:hidden">
              <i className="fa-solid fa-bars text-xl text-slate-600"></i>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Print Expert Pniewy</h3>
            <p className="text-slate-400">Najlepszy serwis drukarek w regionie. Szybko, profesjonalnie i z gwarancją jakości.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-2 text-slate-400">
              <li><i className="fa-solid fa-location-dot mr-2"></i> ul. Promienista 16, 62-045 Pniewy</li>
              <li><i className="fa-solid fa-phone mr-2"></i> +48 600 123 456</li>
              <li><i className="fa-solid fa-envelope mr-2"></i> kontakt@printexpert.pniewy.pl</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Godziny Otwarcia</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Poniedziałek - Piątek: 08:00 - 17:00</li>
              <li>Sobota: 09:00 - 13:00</li>
              <li>Niedziela: Zamknięte</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800 mt-8 pt-8 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Print Expert Pniewy. Wszystkie prawa zastrzeżone.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
