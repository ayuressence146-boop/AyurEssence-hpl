import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, HeartPulse, FileText, User, Phone, Mail, MapPin, Activity, ShieldCheck } from 'lucide-react';
import { dataStore } from '../../services/dataStore';

const DoctorPatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const patient = dataStore.getPatientById(id || 'AE-2041') || dataStore.getPatients()[0];

  return (
    <div className="space-y-6 text-[#2b2721]">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link 
          to="/doctor/patients" 
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#2b2721] hover:underline"
        >
          <ArrowLeft size={14} />
          <span>Back to Patient Roster</span>
        </Link>
        <span className="text-xs font-mono font-bold text-[#2b2721]/70 bg-white/70 px-3 py-1 rounded-full border border-[#2b2721]/15">
          Dossier ID: {patient.id}
        </span>
      </div>

      {/* Patient Profile Banner */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 sm:p-8 rounded-[28px] border border-[#2b2721]/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <img 
          src="/landing-pages/meng-to-sketchbook/botanic-gardens.png" 
          alt="" 
          className="absolute right-0 top-0 w-[240px] opacity-10 pointer-events-none select-none z-0" 
        />
        
        <div className="flex items-start space-x-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#2b2721] text-[#ece7dc] flex items-center justify-center font-serif font-bold text-2xl shadow-md shrink-0">
            {patient.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl font-serif font-bold text-[#2b2721]">{patient.name}</h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#2b2721] text-[#ece7dc]">
                {patient.prakriti}
              </span>
            </div>
            <p className="text-xs text-[#2b2721]/70 font-medium">
              {patient.age} years old · {patient.gender} · {patient.city}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#2b2721]/80">
              <span className="flex items-center space-x-1.5"><Phone size={13} /><span>{patient.phone}</span></span>
              <span className="flex items-center space-x-1.5"><Mail size={13} /><span>{patient.email}</span></span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button 
            onClick={() => navigate(`/doctor/patients/${patient.id}/timeline`)}
            className="px-4 py-2.5 bg-white hover:bg-[#2b2721] hover:text-[#ece7dc] border border-[#2b2721]/20 text-xs font-bold rounded-full transition-all shadow-sm flex items-center space-x-2"
          >
            <Clock size={15} />
            <span>View Clinical Timeline</span>
          </button>
          <button 
            onClick={() => navigate(`/doctor/assessments/create?patientId=${patient.id}`)}
            className="px-5 py-2.5 bg-[#2b2721] hover:bg-[#1a1714] text-[#ece7dc] text-xs font-bold rounded-full transition-all shadow-md flex items-center space-x-2"
          >
            <HeartPulse size={15} />
            <span>New Prakriti Evaluation</span>
          </button>
        </div>
      </div>

      {/* Grid Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Prakriti Breakdown & Clinical History */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Prakriti Dosha Gauge Cards */}
          <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#2b2721] flex items-center space-x-2">
              <Activity size={18} className="text-amber-700" />
              <span>Prakriti Constitutional Balance</span>
            </h3>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-600/20">
                <span className="text-xs font-bold text-amber-900 block uppercase tracking-wider">Vata (Air/Ether)</span>
                <span className="text-3xl font-serif font-bold text-amber-950 block mt-1">{patient.vataScore}%</span>
                <div className="w-full bg-amber-200 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: `${patient.vataScore}%` }} />
                </div>
              </div>

              <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-600/20">
                <span className="text-xs font-bold text-orange-900 block uppercase tracking-wider">Pitta (Fire/Water)</span>
                <span className="text-3xl font-serif font-bold text-orange-950 block mt-1">{patient.pittaScore}%</span>
                <div className="w-full bg-orange-200 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-orange-600 h-full rounded-full" style={{ width: `${patient.pittaScore}%` }} />
                </div>
              </div>

              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-600/20">
                <span className="text-xs font-bold text-emerald-900 block uppercase tracking-wider">Kapha (Earth/Water)</span>
                <span className="text-3xl font-serif font-bold text-emerald-950 block mt-1">{patient.kaphaScore}%</span>
                <div className="w-full bg-emerald-200 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${patient.kaphaScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Chief Complaints & History */}
          <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#2b2721]">Chief Complaints & Clinical Observations</h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-4 bg-white/70 rounded-xl border border-[#2b2721]/10">
                <h4 className="font-bold text-[#2b2721] mb-1 uppercase tracking-wider text-[10px]">Primary Symptoms</h4>
                <p className="text-[#2b2721]/80 leading-relaxed font-medium">{patient.chiefComplaint}</p>
              </div>

              <div className="p-4 bg-white/70 rounded-xl border border-[#2b2721]/10">
                <h4 className="font-bold text-[#2b2721] mb-1 uppercase tracking-wider text-[10px]">Medical History</h4>
                <p className="text-[#2b2721]/80 leading-relaxed font-medium">{patient.medicalHistory}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Assigned Care Team & Actions */}
        <div className="space-y-6">
          <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-[#2b2721]">Assigned Clinical Team</h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-xl border border-[#2b2721]/10">
                <ShieldCheck size={18} className="text-emerald-700 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#2b2721]/50 block">Attending Practitioner</span>
                  <p className="font-bold text-[#2b2721]">{patient.assignedDoctor}</p>
                </div>
              </div>

              {patient.assignedStudent && (
                <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-xl border border-[#2b2721]/10">
                  <User size={18} className="text-amber-700 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#2b2721]/50 block">Assigned Ayurvedic Scholar</span>
                    <p className="font-bold text-[#2b2721]">{patient.assignedStudent}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#2b2721]/10 space-y-2">
              <button 
                onClick={() => navigate(`/doctor/reports/generate`)}
                className="w-full py-2.5 bg-[#2b2721] hover:bg-[#1a1714] text-[#ece7dc] text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2"
              >
                <FileText size={15} />
                <span>Generate CCRAS Clinical Report</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DoctorPatientDetails;
