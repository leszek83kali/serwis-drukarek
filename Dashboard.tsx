
import React from 'react';
import { Link } from 'react-router-dom';
import { RepairRequest, RepairStatus } from '../types';

interface DashboardProps {
  repairs: RepairRequest[];
}

const getStatusColor = (status: RepairStatus) => {
  switch (status) {
    case RepairStatus.PENDING: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case RepairStatus.DIAGNOSING: return 'bg-blue-100 text-blue-800 border-blue-200';
    case RepairStatus.REPAIRING: return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case RepairStatus.READY: return 'bg-green-100 text-green-800 border-green-200';
    case RepairStatus.COMPLETED: return 'bg-slate-100 text-slate-800 border-slate-200';
    default: return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const Dashboard: React.FC<DashboardProps> = ({ repairs }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Moje Naprawy</h1>
          <p className="text-slate-500 mt-1">Podgląd statusu Twoich urządzeń.</p>
        </div>
        <Link to="/report" className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-500/20">
          <i className="fa-solid fa-plus mr-2"></i> Nowe zgłoszenie
        </Link>
      </div>

      {repairs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 text-3xl">
            <i className="fa-solid fa-print"></i>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Brak aktywnych zgłoszeń</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">Jeśli masz problem z drukarką, kliknij przycisk powyżej, aby zgłosić usterkę do naszego serwisu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repairs.map((repair) => (
            <div key={repair.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{repair.id}</span>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mt-1">{repair.printerModel}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(repair.status)}`}>
                    {repair.status}
                  </span>
                </div>
                
                <p className="text-sm text-slate-600 line-clamp-2 mb-4 bg-slate-50 p-3 rounded-lg">
                  "{repair.description}"
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Numer Seryjny:</span>
                    <span className="font-medium text-slate-800">{repair.serialNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Zgłoszono:</span>
                    <span className="font-medium text-slate-800">{new Date(repair.createdAt).toLocaleDateString()}</span>
                  </div>
                  {repair.estimatedCost && (
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span className="text-slate-500 font-bold">Szacowany Koszt:</span>
                      <span className="font-bold text-blue-600">{repair.estimatedCost} PLN</span>
                    </div>
                  )}
                </div>
              </div>

              {repair.comments && repair.comments.length > 0 && (
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex-grow">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Ostatnie uwagi technika:</p>
                  <p className="text-xs text-slate-600 italic">"{repair.comments[repair.comments.length - 1]}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
