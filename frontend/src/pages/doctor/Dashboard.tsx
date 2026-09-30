import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Activity, CheckCircle, Clock, Plus, ArrowRight, FileText, Calendar, Sparkles, HeartPulse } from 'lucide-react';
import { dataStore, type PatientRecord } from '../../services/dataStore';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientRecord[]>([]);

  useEffect(() => {
    setPatients(dataStore.getPatients());
    dataStore.fetchPatientsLive().then(res => {
      setPatients(res);
    });
  }, []);

  const stats = [
    { label: 'Total Registered Patients', value: patients.length.toString(), icon: Users, badge: 'Live DB' },
    { label: 'Active Prakriti Assessments', value: '0', icon: Activity, badge: 'In Progress' },
    { label: 'Pending Review & Approval', value: '0', icon: Clock, badge: 'Needs Sign-off' },
    { label: 'Finalized Clinical Reports', value: '0', icon: CheckCircle, badge: 'Verified' },
  ];

  return (
    <div className="space-y-6 text-[#2b2721]">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm relative overflow-hidden">
        <img 
          src="/landing-pages/meng-to-sketchbook/botany-right.png" 
          alt="" 
          className="absolute right-0 top-0 w-[180px] opacity-15 pointer-events-none select-none z-0" 
        />
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2b2721]/60 mb-1">
            <Sparkles size={14} className="text-amber-700" />
            <span>Ayurvedic Clinical Workspace</span>
          </div>
          <h1 className="text-2.5xl font-serif font-bold text-[#2b2721]">Doctor Dashboard</h1>
          <p className="text-xs text-[#2b2721]/70 mt-1 max-w-xl font-medium">
            Manage patient records, verify Prakriti evaluation scores, conduct Nadi Pariksha observations, and issue CCRAS-compliant reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link 
            to="/doctor/patients/add"
            className="px-4 py-2.5 bg-white/80 hover:bg-white text-[#2b2721] border border-[#2b2721]/20 text-xs font-bold rounded-full transition-all shadow-sm flex items-center space-x-2"
          >
            <Plus size={15} />
            <span>Add New Patient</span>
          </Link>
          <Link 
            to="/doctor/assessments/create"
            className="px-5 py-2.5 bg-[#2b2721] hover:bg-[#1a1714] text-[#ece7dc] text-xs font-bold rounded-full transition-all shadow-md flex items-center space-x-2"
          >
            <HeartPulse size={15} />
            <span>New Prakriti Assessment</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-[#fcfaf4]/90 backdrop-blur-md p-5 rounded-[22px] border border-[#2b2721]/15 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#2b2721] text-[#ece7dc] flex items-center justify-center shadow-md">
                  <Icon size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2b2721]/10 text-[#2b2721]/80">
                  {stat.badge}
                </span>
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-[#2b2721]">{stat.value}</p>
                <p className="text-xs text-[#2b2721]/70 font-semibold mt-0.5">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid: Recent Patients & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Registered Patients */}
        <div className="lg:col-span-2 bg-[#fcfaf4]/90 backdrop-blur-md rounded-[24px] border border-[#2b2721]/15 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-serif font-bold text-[#2b2721]">Active Patient Roster</h3>
              <p className="text-xs text-[#2b2721]/60">Recent clinical registrations and assigned profiles</p>
            </div>
            <Link 
              to="/doctor/patients"
              className="text-xs font-bold text-[#2b2721] hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {patients.length === 0 ? (
              <div className="p-8 text-center text-[#2b2721]/60 bg-white/40 border border-[#2b2721]/10 rounded-2xl">
                <Users size={32} className="mx-auto mb-2 text-[#2b2721]/40" />
                <p className="font-bold text-xs">No registered patients in Supabase database yet.</p>
                <p className="text-[11px] text-[#2b2721]/50 mt-0.5">Click "Add New Patient" above to create a profile in Supabase.</p>
              </div>
            ) : (
              patients.slice(0, 4).map((p) => (
                <div 
                  key={p.id}
                  onClick={() => navigate(`/doctor/patients/${p.id}`)}
                  className="flex items-center justify-between p-3.5 bg-white/70 hover:bg-white rounded-2xl border border-[#2b2721]/10 hover:border-[#2b2721]/30 transition-all cursor-pointer shadow-sm group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#2b2721] text-[#ece7dc] flex items-center justify-center font-serif font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#2b2721] group-hover:underline">{p.name}</h4>
                      <p className="text-xs text-[#2b2721]/65">
                        ID: <span className="font-mono font-semibold">{p.id}</span> · {p.age} yrs · {p.gender}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#2b2721]/10 text-[#2b2721] border border-[#2b2721]/15">
                      {p.prakriti}
                    </span>
                    <p className="text-[10px] text-[#2b2721]/50 mt-0.5">Last visit: {p.lastVisit}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Review & Action Tasks */}
        <div className="bg-[#fcfaf4]/90 backdrop-blur-md rounded-[24px] border border-[#2b2721]/15 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#2b2721] mb-1">Pending Actions</h3>
            <p className="text-xs text-[#2b2721]/60 mb-4">Task items requiring doctor review & approval</p>

            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-600/20 text-[#2b2721]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Student Evaluation</span>
                  <span className="text-[10px] text-[#2b2721]/60">2 hrs ago</span>
                </div>
                <h4 className="text-xs font-bold">Rahul Verma submitted evaluation for Ananya Sharma</h4>
                <p className="text-[11px] text-[#2b2721]/70 mt-1">Accuracy match: 94.5%. Practitioner Nadi sign-off required.</p>
                <Link 
                  to="/doctor/assessments/ASM-1001/recommendation"
                  className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#2b2721] text-[#ece7dc] text-[11px] font-bold rounded-lg hover:bg-[#1a1714] transition-all shadow-sm"
                >
                  <span>Review & Approve</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-600/20 text-[#2b2721]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Report Ready</span>
                  <span className="text-[10px] text-[#2b2721]/60">Today</span>
                </div>
                <h4 className="text-xs font-bold">Generate Certificate for Rajesh Hegde</h4>
                <p className="text-[11px] text-[#2b2721]/70 mt-1">Pitta-Kapha assessment complete. Ready for signature.</p>
                <Link 
                  to="/doctor/reports/generate"
                  className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#2b2721] text-[#ece7dc] text-[11px] font-bold rounded-lg hover:bg-[#1a1714] transition-all shadow-sm"
                >
                  <span>Generate Report</span>
                  <FileText size={12} />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#2b2721]/10 text-center">
            <Link 
              to="/doctor/follow-ups" 
              className="text-xs font-bold text-[#2b2721] hover:underline inline-flex items-center space-x-1"
            >
              <Calendar size={14} />
              <span>Manage Follow-up Calendar</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DoctorDashboard;
