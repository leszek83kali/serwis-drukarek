
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDiagnosticSuggestion } from '../geminiService';
import { RepairRequest, RepairStatus } from '../types';

interface ReportIssueProps {
  onAddRepair: (repair: RepairRequest) => void;
  clientId: string;
}

const ReportIssue: React.FC<ReportIssueProps> = ({ onAddRepair, clientId }) => {
  const navigate = useNavigate();
  const [model, setModel] = useState('');
  const [serial, setSerial] = useState('');
  const [desc, setDesc] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiTip, setAiTip] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!model || !desc) {
        alert("Wprowadź model i opis usterki, aby skorzystać z analizy AI.");
        return;
    }
    setIsAnalyzing(true);
    const suggestion = await getDiagnosticSuggestion(model, desc);
    setAiTip(suggestion);
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model || !serial || !desc) return;

    const newRepair: RepairRequest = {
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      clientId,
      printerModel: model,
      serialNumber: serial,
      description: desc,
      status: RepairStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiSuggestion: aiTip || undefined
    };

    onAddRepair(newRepair);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Zgłoś Nową Usterkę</h1>
        <p className="text-slate-500">Wypełnij formularz poniżej, a nasz zespół zajmie się Twoją drukarką.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-1"></div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Model Drukarki</label>
              <input 
                type="text" 
                required 
                placeholder="np. HP LaserJet Pro M404"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Numer Seryjny (S/N)</label>
              <input 
                type="text" 
                required 
                placeholder="np. CNB1J..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Dokładny opis problemu</label>
            <textarea 
              required 
              rows={4}
              placeholder="Opisz co się dzieje, czy są kody błędów, kiedy występuje usterka..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            ></textarea>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-blue-800 font-bold flex items-center">
                <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
                Wstępna diagnoza AI
              </h3>
              <button 
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !desc}
                className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition disabled:bg-slate-300"
              >
                {isAnalyzing ? 'Analizowanie...' : 'Analizuj problem'}
              </button>
            </div>
            {aiTip ? (
              <p className="text-sm text-blue-700 leading-relaxed italic">"{aiTip}"</p>
            ) : (
              <p className="text-sm text-blue-400 italic">Podaj opis i kliknij analizuj, aby otrzymać wstępną diagnozę systemu.</p>
            )}
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-200 transition"
            >
              Anuluj
            </button>
            <button 
              type="submit" 
              className="flex-[2] bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
            >
              Wyślij Zgłoszenie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;
