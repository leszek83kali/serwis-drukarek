
import React, { useState, useMemo } from 'react';
import { RepairRequest, RepairStatus } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

interface AdminDashboardProps {
  repairs: RepairRequest[];
  onUpdateRepair: (repair: RepairRequest) => void;
  onImportRepairs: (repairs: RepairRequest[]) => void;
}

const COLORS = {
  [RepairStatus.PENDING]: '#EAB308',   // Yellow-500
  [RepairStatus.DIAGNOSING]: '#3B82F6', // Blue-500
  [RepairStatus.REPAIRING]: '#6366F1',  // Indigo-500
  [RepairStatus.READY]: '#22C55E',      // Green-500
  [RepairStatus.COMPLETED]: '#64748B',  // Slate-500
  [RepairStatus.CANCELLED]: '#EF4444',  // Red-500
};

type SortKey = 'id' | 'clientName' | 'printerModel' | 'status' | 'createdAt';
type SortDirection = 'asc' | 'desc';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ repairs, onUpdateRepair, onImportRepairs }) => {
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'createdAt',
    direction: 'desc'
  });

  const stats = useMemo(() => ({
    total: repairs.length,
    pending: repairs.filter(r => r.status === RepairStatus.PENDING).length,
    completed: repairs.filter(r => r.status === RepairStatus.COMPLETED || r.status === RepairStatus.READY).length,
  }), [repairs]);

  const chartData = useMemo(() => {
    // Status distribution
    const statusCounts = repairs.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const statusChart = Object.entries(statusCounts).map(([name, value]) => ({ 
      name, 
      value,
      color: COLORS[name as RepairStatus] || '#CBD5E1'
    }));

    // Repairs over time
    const dateCounts = repairs.reduce((acc, r) => {
      const date = new Date(r.createdAt).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const timelineChart = Object.entries(dateCounts)
      .sort((a, b) => {
        const [da, ma] = a[0].split('.');
        const [db, mb] = b[0].split('.');
        return new Date(2024, parseInt(ma)-1, parseInt(da)).getTime() - new Date(2024, parseInt(mb)-1, parseInt(db)).getTime();
      })
      .map(([date, count]) => ({ date, count }));

    return { statusChart, timelineChart };
  }, [repairs]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedRepairs = useMemo(() => {
    let result = repairs.filter(r => {
      const matchesSearch = r.printerModel.toLowerCase().includes(filter.toLowerCase()) || 
                           r.id.toLowerCase().includes(filter.toLowerCase()) ||
                           (r.clientName && r.clientName.toLowerCase().includes(filter.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [repairs, filter, statusFilter, sortConfig]);

  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(repairs, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `print_expert_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const exportToCsv = () => {
    const headers = ["ID", "Klient", "Model", "SN", "Status", "Data"];
    const rows = repairs.map(r => [
      r.id, 
      r.clientName || r.clientId, 
      r.printerModel, 
      r.serialNumber, 
      r.status, 
      new Date(r.createdAt).toLocaleDateString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "print_expert_repairs.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImportRepairs(json);
          alert('Dane zaimportowane pomyślnie!');
        }
      } catch (err) {
        alert('Błąd podczas importu pliku. Upewnij się, że to poprawny format JSON.');
      }
    };
    reader.readAsText(file);
  };

  const updateStatus = (repair: RepairRequest, newStatus: RepairStatus) => {
    onUpdateRepair({ ...repair, status: newStatus, updatedAt: new Date().toISOString() });
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortConfig.key !== column) return <i className="fa-solid fa-sort ml-1 opacity-30"></i>;
    return sortConfig.direction === 'asc' ? 
      <i className="fa-solid fa-sort-up ml-1 text-blue-600"></i> : 
      <i className="fa-solid fa-sort-down ml-1 text-blue-600"></i>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center">
            <i className="fa-solid fa-gauge-high mr-3 text-indigo-600"></i>
            Panel Administratora
          </h1>
          <p className="text-slate-500 mt-1">Zarządzaj wszystkimi zgłoszeniami i danymi serwisu.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <input 
              type="file" 
              id="importFile" 
              className="hidden" 
              accept=".json"
              onChange={handleImport}
            />
            <label 
              htmlFor="importFile"
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition font-bold cursor-pointer inline-flex items-center shadow-sm"
            >
              <i className="fa-solid fa-file-import mr-2"></i> Import JSON
            </label>
          </div>
          <button 
            onClick={exportToJson}
            className="bg-slate-800 text-white px-4 py-2.5 rounded-xl hover:bg-slate-900 transition font-bold inline-flex items-center shadow-sm"
          >
            <i className="fa-solid fa-file-export mr-2"></i> Eksport JSON
          </button>
          <button 
            onClick={exportToCsv}
            className="bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 transition font-bold inline-flex items-center shadow-sm"
          >
            <i className="fa-solid fa-file-csv mr-2"></i> Eksport CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-bold text-slate-400 uppercase">Wszystkie naprawy</p>
          <p className="text-4xl font-black text-slate-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-yellow-500">
          <p className="text-sm font-bold text-slate-400 uppercase">Nowe zgłoszenia</p>
          <p className="text-4xl font-black text-slate-900 mt-2">{stats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-green-500">
          <p className="text-sm font-bold text-slate-400 uppercase">Zakończone / Gotowe</p>
          <p className="text-4xl font-black text-slate-900 mt-2">{stats.completed}</p>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center">
            <i className="fa-solid fa-chart-pie mr-2 text-blue-500"></i>
            Rozkład statusów
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.statusChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.statusChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center">
            <i className="fa-solid fa-chart-line mr-2 text-indigo-500"></i>
            Zgłoszenia w czasie
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.timelineChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="font-bold text-slate-800">Lista zgłoszeń</h2>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
             <div className="relative flex-grow md:flex-grow-0 md:w-48">
                <i className="fa-solid fa-filter absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <select 
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white appearance-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Wszystkie statusy</option>
                  {Object.values(RepairStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
             </div>
             <div className="relative flex-grow md:flex-grow-0 md:w-64">
                <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <input 
                  type="text"
                  placeholder="Szukaj modelu lub ID..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
             </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
              <tr>
                <th 
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                  onClick={() => requestSort('id')}
                >
                  ID <SortIcon column="id" />
                </th>
                <th 
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                  onClick={() => requestSort('clientName')}
                >
                  Klient <SortIcon column="clientName" />
                </th>
                <th 
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                  onClick={() => requestSort('printerModel')}
                >
                  Urządzenie <SortIcon column="printerModel" />
                </th>
                <th 
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                  onClick={() => requestSort('status')}
                >
                  Status <SortIcon column="status" />
                </th>
                <th 
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                  onClick={() => requestSort('createdAt')}
                >
                  Data <SortIcon column="createdAt" />
                </th>
                <th className="px-6 py-4 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedRepairs.map((repair) => (
                <tr key={repair.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{repair.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-700">{repair.clientName || 'Nieznany'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-800">{repair.printerModel}</p>
                    <p className="text-xs text-slate-400">S/N: {repair.serialNumber}</p>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={repair.status}
                      onChange={(e) => updateStatus(repair, e.target.value as RepairStatus)}
                      className="text-xs font-bold border rounded-lg px-2 py-1 outline-none bg-white focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.values(RepairStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(repair.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 group-hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                      Szczegóły
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {processedRepairs.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <i className="fa-solid fa-folder-open text-2xl"></i>
              </div>
              <p className="text-slate-400 italic">Brak zgłoszeń spełniających kryteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
