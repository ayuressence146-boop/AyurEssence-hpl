import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, CheckCircle2, AlertTriangle, ArrowLeft, UserCheck, Stethoscope, Sparkles, HelpCircle } from 'lucide-react';
import { getAssessmentById, Assessment, getPatients, Patient } from '../../services/dataStore';

const DoctorComparison = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);

  useEffect(() => {
    if (id) {
      const asm = getAssessmentById(id);
      setAssessment(asm || getAssessmentById('asm-101') || null);
    }
  }, [id]);

  const studentData = {
    prakriti: assessment?.prakriti || 'Vata-Pitta',
    vataScore: assessment?.vataScore || 45,
    pittaScore: assessment?.pittaScore || 35,
    kaphaScore: assessment?.kaphaScore || 20,
    nadi: 'Sarpa Gati (Irregular Vata Pulse)',
    jihva: 'Sama (Thick Coat / Agni Mandya)',
    twak: 'Ruksha (Dry Skin Texture)'
  };

  const doctorData = {
    prakriti: 'Vata-Pitta',
    vataScore: 48,
    pittaScore: 32,
    kaphaScore: 20,
    nadi: 'Sarpa-Manduka Gati (Vata-Pitta Mixed)',
    jihva: 'Sama Jihva with mild Rakta edges',
    twak: 'Ruksha & Sheetala (Dry & Cold)'
  };

  const matchPercentage = 92;

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center space-x-2 text-sm font-medium text-amber-900 hover:text-amber-950 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Learning Dashboard</span>
        </button>
        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-900 border border-emerald-800/20 font-bold">
          High Diagnostic Correlation
        </span>
      </div>

      {/* Main Header Banner */}
      <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Comparative Clinical Evaluation</span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-950 mt-1">
            Doctor vs. Student Diagnostic Comparison
          </h1>
          <p className="text-amber-900/70 text-sm mt-0.5">
            Compare your Prakriti & Vikriti findings directly against Senior Vaidya Dr. Ananya Rao.
          </p>
        </div>

        <div className="bg-amber-800/10 border border-amber-900/20 rounded-2xl p-4 text-center shrink-0 min-w-[160px]">
          <div className="flex items-center justify-center space-x-1 text-amber-900 mb-1">
            <Award size={20} />
            <span className="text-xs font-bold uppercase">Accuracy Match</span>
          </div>
          <span className="text-3xl font-serif font-bold text-amber-950">{matchPercentage}%</span>
          <span className="text-[11px] text-amber-900/70 block mt-0.5">Verified by Senior Panel</span>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Column */}
        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-amber-900/10">
            <div className="w-10 h-10 rounded-xl bg-amber-800/10 border border-amber-900/20 flex items-center justify-center font-bold text-amber-900">
              S
            </div>
            <div>
              <h3 className="font-serif font-bold text-amber-950 text-base">Your Assessment (Student)</h3>
              <p className="text-xs text-amber-900/60">Submitted for Case AE-1001</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white/60 p-3 rounded-xl border border-amber-900/10">
              <span className="text-xs text-amber-800/60 block">Diagnosed Prakriti</span>
              <span className="font-serif font-bold text-amber-950 text-lg">{studentData.prakriti}</span>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-medium text-amber-900">
                <span>Vata: {studentData.vataScore}%</span>
                <span>Pitta: {studentData.pittaScore}%</span>
                <span>Kapha: {studentData.kaphaScore}%</span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden bg-amber-900/10">
                <div style={{ width: `${studentData.vataScore}%` }} className="bg-amber-700" />
                <div style={{ width: `${studentData.pittaScore}%` }} className="bg-red-700" />
                <div style={{ width: `${studentData.kaphaScore}%` }} className="bg-emerald-700" />
              </div>
            </div>

            <div className="space-y-2 pt-3 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-white/40 border border-amber-900/10">
                <span className="text-amber-900/70">Nadi (Pulse):</span>
                <span className="font-medium text-amber-950">{studentData.nadi}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-white/40 border border-amber-900/10">
                <span className="text-amber-900/70">Jihva (Tongue):</span>
                <span className="font-medium text-amber-950">{studentData.jihva}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-white/40 border border-amber-900/10">
                <span className="text-amber-900/70">Twak (Skin):</span>
                <span className="font-medium text-amber-950">{studentData.twak}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Column */}
        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-amber-900/10">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/10 border border-emerald-900/20 flex items-center justify-center font-bold text-emerald-900">
              Dr
            </div>
            <div>
              <h3 className="font-serif font-bold text-amber-950 text-base">Senior Vaidya Assessment</h3>
              <p className="text-xs text-amber-900/60">Dr. Ananya Rao (MD Ayurveda)</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-800/20">
              <span className="text-xs text-emerald-900/70 block font-semibold">Canonical Prakriti Diagnosis</span>
              <span className="font-serif font-bold text-emerald-950 text-lg">{doctorData.prakriti}</span>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-medium text-amber-900">
                <span>Vata: {doctorData.vataScore}%</span>
                <span>Pitta: {doctorData.pittaScore}%</span>
                <span>Kapha: {doctorData.kaphaScore}%</span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden bg-amber-900/10">
                <div style={{ width: `${doctorData.vataScore}%` }} className="bg-amber-700" />
                <div style={{ width: `${doctorData.pittaScore}%` }} className="bg-red-700" />
                <div style={{ width: `${doctorData.kaphaScore}%` }} className="bg-emerald-700" />
              </div>
            </div>

            <div className="space-y-2 pt-3 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-white/40 border border-amber-900/10">
                <span className="text-amber-900/70">Nadi (Pulse):</span>
                <span className="font-medium text-amber-950">{doctorData.nadi}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-white/40 border border-amber-900/10">
                <span className="text-amber-900/70">Jihva (Tongue):</span>
                <span className="font-medium text-amber-950">{doctorData.jihva}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-white/40 border border-amber-900/10">
                <span className="text-amber-900/70">Twak (Skin):</span>
                <span className="font-medium text-amber-950">{doctorData.twak}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mentor Feedback Banner */}
      <div className="bg-amber-800 text-amber-50 rounded-2xl p-6 shadow-md space-y-2">
        <h4 className="text-lg font-serif font-bold flex items-center space-x-2">
          <UserCheck size={20} />
          <span>Doctor's Feedback & Key Insight</span>
        </h4>
        <p className="text-sm text-amber-100/90 leading-relaxed">
          "Your Vata evaluation was spot on. Note that the tongue redness at the margin indicates secondary Pitta aggravation due to improper digestivion (Agni Mandya). Great observation work on skin texture!"
        </p>
      </div>
    </div>
  );
};

export default DoctorComparison;

