import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, UserPlus, Eye, Clock, HeartPulse, Filter } from 'lucide-react';
import { dataStore, type PatientRecord } from '../../services/dataStore';

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [doshaFilter, setDoshaFilter] = useState<string>('All');

  useEffect(() => {
    setPatients(dataStore.getPatients());
    dataStore.fetchPatientsLive().then(res => {
      setPatients(res);
    });
  }, []);

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDosha = doshaFilter === 'All' || p.prakriti.includes(doshaFilter);
    return matchesSearch && matchesDosha;
  });

  return (
    <div className="space-y-6 text-[#2b2721]">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm">
        <div>
          <h1 className="text-2.5xl font-serif font-bold text-[#2b2721]">Patient Roster & Records</h1>
          <p className="text-xs text-[#2b2721]/70 mt-1 font-medium">
            Search, manage, and inspect patient Prakriti evaluations and medical dossiers.
          </p>
        </div>

        <Link
          to="/doctor/patients/add"
          className="px-5 py-2.5 bg-[#2b2721] hover:bg-[#1a1714] text-[#ece7dc] text-xs font-bold rounded-full transition-all shadow-md flex items-center space-x-2 self-start md:self-auto"
        >
          <UserPlus size={16} />
          <span>Add New Patient</span>
        </Link>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-4 rounded-[20px] border border-[#2b2721]/15 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2b2721]/50" />
          <input 
            type="text" 
            placeholder="Search by name, ID, or city..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/80 border border-[#2b2721]/20 rounded-xl text-xs text-[#2b2721] placeholder-[#2b2721]/40 focus:outline-none focus:ring-2 focus:ring-[#2b2721]/20"
          />
        </div>

        {/* Dosha Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter size={14} className="text-[#2b2721]/50 mr-1 hidden sm:inline" />
          {['All', 'Vata', 'Pitta', 'Kapha'].map(dosha => (
            <button
              key={dosha}
              onClick={() => setDoshaFilter(dosha)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                doshaFilter === dosha 
                  ? 'bg-[#2b2721] text-[#ece7dc] shadow-sm' 
                  : 'bg-white/60 hover:bg-white text-[#2b2721]/70 border border-[#2b2721]/15'
              }`}
            >
              {dosha}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Table Card */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md rounded-[24px] border border-[#2b2721]/15 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2b2721]/10 bg-[#2b2721]/5 text-[11px] font-bold uppercase tracking-wider text-[#2b2721]/70">
                <th className="py-3.5 px-5">Patient Name & ID</th>
                <th className="py-3.5 px-4">Demographics</th>
                <th className="py-3.5 px-4">Prakriti Dosha</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Visit</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2b2721]/10 text-xs">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#2b2721]/60 font-medium">
                    No patients matching criteria.
                  </td>
                </tr>
              ) : (
                filteredPatients.map(p => (
                  <tr key={p.id} className="hover:bg-white/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-[#2b2721] text-[#ece7dc] flex items-center justify-center font-serif font-bold text-xs shadow-sm">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[#2b2721]">{p.name}</p>
                          <p className="text-[10px] font-mono text-[#2b2721]/60">{p.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-[#2b2721]/80">
                      {p.age} yrs · {p.gender}
                      <span className="block text-[10px] text-[#2b2721]/50">{p.city}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-[#2b2721]/10 text-[#2b2721] border border-[#2b2721]/15">
                        {p.prakriti}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-900 border border-amber-500/20">
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#2b2721]/70 font-mono text-[11px]">
                      {p.lastVisit}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => navigate(`/doctor/patients/${p.id}`)}
                          className="p-1.5 bg-white hover:bg-[#2b2721] hover:text-[#ece7dc] border border-[#2b2721]/20 rounded-lg transition-all shadow-sm"
                          title="View Patient Dossier"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => navigate(`/doctor/patients/${p.id}/timeline`)}
                          className="p-1.5 bg-white hover:bg-[#2b2721] hover:text-[#ece7dc] border border-[#2b2721]/20 rounded-lg transition-all shadow-sm"
                          title="View Patient Clinical Timeline"
                        >
                          <Clock size={14} />
                        </button>
                        <button 
                          onClick={() => navigate(`/doctor/assessments/create?patientId=${p.id}`)}
                          className="p-1.5 bg-[#2b2721] text-[#ece7dc] hover:bg-[#1a1714] rounded-lg transition-all shadow-sm"
                          title="Initiate Assessment"
                        >
                          <HeartPulse size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default PatientList;
