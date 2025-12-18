
import React from 'react';
import { Link } from 'react-router-dom';
import MapSection from '../components/MapSection';

const Home: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
            <img 
              src="https://images.unsplash.com/photo-1616422285623-13ff0167443c?q=80&w=2070&auto=format&fit=crop" 
              alt="Serwis drukarek - wnętrze urządzenia" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">Twoja drukarka odmówiła posłuszeństwa?</h1>
            <p className="text-xl text-slate-300 mb-10">Jesteśmy specjalistami od HP, Epson, Brother i Canon. Naprawiamy usterki szybko i skutecznie, abyś mógł wrócić do pracy bez opóźnień.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-center text-lg shadow-xl shadow-blue-900/20 transition-all transform hover:-translate-y-1">Zarejestruj się teraz</Link>
              <Link to="/login" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-xl font-bold text-center text-lg transition-all">Śledź swoją naprawę</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">Co oferujemy?</h2>
          <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: 'fa-wrench', title: 'Serwis Techniczny', desc: 'Naprawa podzespołów, wymiana rolek, czyszczenie głowic.' },
            { icon: 'fa-microchip', title: 'Diagnostyka AI', desc: 'Nasz system automatycznie analizuje opisy usterek dla szybszej wyceny.' },
            { icon: 'fa-truck-fast', title: 'Szybki Termin', desc: 'Większość napraw wykonujemy w ciągu 48 godzin od dostarczenia.' }
          ].map((item, i) => (
            <div key={i} className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6 mx-auto group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Location */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">Znajdź nas w Pniewach</h2>
            <p className="text-lg text-slate-700">Nasza siedziba mieści się w dogodnej lokalizacji. Zapraszamy z urządzeniem do bezpłatnej wyceny!</p>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-blue-600 flex-shrink-0">
                  <i className="fa-solid fa-map-pin"></i>
                </div>
                <div>
                  <p className="font-bold">Adres:</p>
                  <p className="text-slate-600">ul. Promienista 16, 62-045 Pniewy</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-blue-600 flex-shrink-0">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div>
                  <p className="font-bold">Telefon:</p>
                  <p className="text-slate-600">+48 600 123 456</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full">
            <MapSection />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
