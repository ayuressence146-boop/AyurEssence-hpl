import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Award, Activity, HeartPulse, FileText, CheckCircle2, Sparkles } from 'lucide-react';
import { dataStore, AssessmentRecord } from '../../services/dataStore';

const DoctorAssessmentResult = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<AssessmentRecord | null>(null);

  useEffect(() => {
    const record = dataStore.getAssessmentById(id || '');
    if (record) {
      setAssessment(record);
    }
  }, [id]);

  const scores = assessment?.calculatedScores || { vata: 48, pitta: 35, kapha: 17, dominant: 'Vata-Pitta' };
  const obs = assessment?.observation;

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#2b2721]">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link 
          to="/doctor" 
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#2b2721] hover:underline"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs font-mono font-bold text-[#2b2721]/70 bg-white/70 px-3 py-1 rounded-full border border-[#2b2721]/15">
          ID: {assessment?.id || id}
        </span>
      </div>

      {/* Main Result Hero Card */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 sm:p-8 rounded-[28px] border border-[#2b2721]/15 shadow-sm text-center relative overflow-hidden space-y-4">
        <img 
          src="/landing-pages/meng-to-sketchbook/bloom.png" 
          alt="" 
          className="absolute right-4 top-4 w-[160px] opacity-15 pointer-events-none select-none z-0" 
        />

        <div className="relative z-10 max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#2b2721]/10 text-[#2b2721] text-xs font-bold uppercase tracking-wider">
            <Award size={14} />
            <span>Prakriti Constitutional Result</span>
          </div>
          
          <h1 className="text-3xl font-serif font-bold text-[#2b2721]">{scores.dominant} Prakriti</h1>
          <p className="text-xs text-[#2b2721]/75 font-medium">
            Patient: <span className="font-bold">{assessment?.patientName || 'Ananya Sharma'}</span> · Evaluation Date: {assessment?.date || '2026-09-28'}
          </p>
        </div>

        {/* Dosha Breakdown Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 relative z-10">
          <div className="p-5 bg-amber-500/10 rounded-2xl border border-amber-600/20 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Vata (Air & Ether)</span>
            <span className="text-4xl font-serif font-bold text-amber-950 block my-2">{scores.vata}%</span>
            <p className="text-[11px] text-amber-900/80 font-medium">Light, Mobile, Dry, Cold qualities</p>
          </div>

          <div className="p-5 bg-orange-500/10 rounded-2xl border border-orange-600/20 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-900">Pitta (Fire & Water)</span>
            <span className="text-4xl font-serif font-bold text-orange-950 block my-2">{scores.pitta}%</span>
            <p className="text-[11px] text-orange-900/80 font-medium">Sharp, Hot, Light, Moist qualities</p>
          </div>

          <div className="p-5 bg-emerald-500/10 rounded-2xl border border-emerald-600/20 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">Kapha (Earth & Water)</span>
            <span className="text-4xl font-serif font-bold text-emerald-950 block my-2">{scores.kapha}%</span>
            <p className="text-[11px] text-emerald-900/80 font-medium">Heavy, Slow, Cool, Oily qualities</p>
          </div>
        </div>
      </div>

      {/* Observation Summary Card */}
      {obs && (
        <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-3">
          <h3 className="text-base font-serif font-bold text-[#2b2721] flex items-center space-x-2">
            <Activity size={16} className="text-emerald-700" />
            <span>Ashtavidha Diagnostic Findings</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white/80 rounded-xl border border-[#2b2721]/10">
              <span className="text-[10px] uppercase font-bold text-[#2b2721]/50 block">Nadi Gati</span>
              <p className="font-bold text-[#2b2721]">{obs.nadiGati} ({obs.nadiRate} bpm)</p>
            </div>

            <div className="p-3 bg-white/80 rounded-xl border border-[#2b2721]/10">
              <span className="text-[10px] uppercase font-bold text-[#2b2721]/50 block">Jihva (Tongue)</span>
              <p className="font-bold text-[#2b2721]">{obs.jihva}</p>
            </div>

            <div className="p-3 bg-white/80 rounded-xl border border-[#2b2721]/10">
              <span className="text-[10px] uppercase font-bold text-[#2b2721]/50 block">Twak (Skin)</span>
              <p className="font-bold text-[#2b2721]">{obs.twak}</p>
            </div>

            <div className="p-3 bg-white/80 rounded-xl border border-[#2b2721]/10">
              <span className="text-[10px] uppercase font-bold text-[#2b2721]/50 block">Netra (Eyes)</span>
              <p className="font-bold text-[#2b2721]">{obs.netra}</p>
            </div>

            <div className="p-3 bg-white/80 rounded-xl border border-[#2b2721]/10">
              <span className="text-[10px] uppercase font-bold text-[#2b2721]/50 block">Agni (Digestion)</span>
              <p className="font-bold text-[#2b2721]">{obs.agni}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => navigate(`/doctor/assessments/${id}/recommendation`)}
          className="px-6 py-3.5 bg-[#2b2721] hover:bg-[#1a1714] text-[#ece7dc] text-xs font-bold rounded-full transition-all shadow-md flex items-center space-x-2"
        >
          <span>Customize Ahara & Vihara Guidance</span>
          <ArrowRight size={15} />
        </button>
      </div>

    </div>
  );
};

export default DoctorAssessmentResult;
