import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Activity, FileText, Calendar, ArrowRight, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { dataStore } from '../../services/dataStore';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const currentUser = dataStore.getPatients()[0]; // Default to first active patient (Ananya Sharma)
  const latestAssessment = dataStore.getAssessments()[0];

  const scores = latestAssessment?.calculatedScores || { vata: 48, pitta: 35, kapha: 17, dominant: 'Vata-Pitta' };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-[#2b2721]">
      
      {/* Welcome Hero Banner */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-8 rounded-[28px] border border-[#2b2721]/15 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <img 
          src="/landing-pages/meng-to-sketchbook/bloom.png" 
          alt="" 
          className="absolute right-0 top-0 w-[220px] opacity-15 pointer-events-none select-none z-0" 
        />
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2b2721]/60">
            <Sparkles size={14} className="text-amber-700" />
            <span>Ayurvedic Personal Wellness Portal</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#2b2721]">Namaste, {currentUser.name}</h1>
          <p className="text-xs text-[#2b2721]/75 leading-relaxed font-medium">
            Your primary Prakriti constitution is <span className="font-bold underline">{scores.dominant}</span>. Explore your personalized Ahara (Diet), Vihara (Lifestyle), and verified health certificates.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <Link 
            to="/patient/assessment/questionnaire"
            className="px-5 py-2.5 bg-[#2b2721] hover:bg-[#1a1714] text-[#ece7dc] text-xs font-bold rounded-full transition-all shadow-md flex items-center space-x-2"
          >
            <Heart size={15} />
            <span>Retake Self Assessment</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Prakriti Profile & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Prakriti Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Prakriti Profile Card */}
          <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-[#2b2721]">Your Prakriti Profile</h3>
              <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-[#2b2721]/10 text-[#2b2721]">
                Verified by {currentUser.assignedDoctor}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-600/20">
                <span className="text-xs font-bold text-amber-900 uppercase block">Vata</span>
                <span className="text-3xl font-serif font-bold text-amber-950 block my-1">{scores.vata}%</span>
                <p className="text-[10px] text-amber-900/70 font-medium">Air & Ether Elements</p>
              </div>

              <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-600/20">
                <span className="text-xs font-bold text-orange-900 uppercase block">Pitta</span>
                <span className="text-3xl font-serif font-bold text-orange-950 block my-1">{scores.pitta}%</span>
                <p className="text-[10px] text-orange-900/70 font-medium">Fire & Water Elements</p>
              </div>

              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-600/20">
                <span className="text-xs font-bold text-emerald-900 uppercase block">Kapha</span>
                <span className="text-3xl font-serif font-bold text-emerald-950 block my-1">{scores.kapha}%</span>
                <p className="text-[10px] text-emerald-900/70 font-medium">Earth & Water Elements</p>
              </div>
            </div>
          </div>

          {/* Prescribed Guidance Summary Card */}
          <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-3">
            <h3 className="text-lg font-serif font-bold text-[#2b2721]">Daily Dinacharya & Diet Summary</h3>
            <div className="p-4 bg-white/70 rounded-2xl border border-[#2b2721]/10 space-y-2 text-xs">
              <p className="text-[#2b2721]/80 leading-relaxed font-medium">
                To balance your dominant <span className="font-bold">{scores.dominant}</span> constitution, prioritize warm cooked grains, ghee, sweet ripe fruits, and warm herbal milk. Avoid raw cold salads, iced beverages, and dry foods.
              </p>
              <Link 
                to="/patient/recommendation"
                className="mt-2 inline-flex items-center space-x-1.5 font-bold text-[#2b2721] hover:underline"
              >
                <span>View Full Ayurvedic Guidance</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Quick Links & Follow-ups */}
        <div className="space-y-6">
          <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-[#2b2721]">Quick Actions</h3>

            <div className="space-y-2 text-xs">
              <Link 
                to="/patient/result"
                className="w-full flex items-center p-3 bg-white/70 hover:bg-white rounded-xl border border-[#2b2721]/10 font-bold transition-all shadow-sm"
              >
                <Award size={16} className="mr-3 text-amber-700" />
                <span>View Prakriti Certificate</span>
              </Link>

              <Link 
                to="/patient/reports"
                className="w-full flex items-center p-3 bg-white/70 hover:bg-white rounded-xl border border-[#2b2721]/10 font-bold transition-all shadow-sm"
              >
                <FileText size={16} className="mr-3 text-emerald-700" />
                <span>Download Health Reports</span>
              </Link>

              <Link 
                to="/patient/timeline"
                className="w-full flex items-center p-3 bg-white/70 hover:bg-white rounded-xl border border-[#2b2721]/10 font-bold transition-all shadow-sm"
              >
                <Calendar size={16} className="mr-3 text-[#2b2721]" />
                <span>Check Health Timeline</span>
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default PatientDashboard;
