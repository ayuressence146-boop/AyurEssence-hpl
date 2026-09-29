import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { dataStore, type AssessmentRecord, type PatientRecord } from '../../services/dataStore';

const ReportGeneration = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [selectedAsmId, setSelectedAsmId] = useState('');
  const [practitionerNotes, setPractitionerNotes] = useState(
    'Patient exhibits Vata-Pitta Prakriti with mild Vishamagni. Advised to follow warm Ahara diet plan and gentle Nadi Shodhana Pranayama daily.'
  );

  useEffect(() => {
    const list = dataStore.getAssessments();
    setAssessments(list);
    if (list.length > 0) {
      setSelectedAsmId(list[0].id);
    }
  }, []);

  const handleGenerate = () => {
    if (!selectedAsmId) return;
    navigate(`/doctor/reports/${selectedAsmId}/preview`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-[#2b2721]">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          to="/doctor" 
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#2b2721] hover:underline"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-[10px] font-mono text-[#2b2721]/60 uppercase tracking-widest">
          CCRAS-PRKRITI-001 Generator
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md rounded-[28px] border border-[#2b2721]/15 shadow-sm p-7 sm:p-9 space-y-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2b2721]/60 mb-1">
            <Sparkles size={14} className="text-amber-700" />
            <span>Official Clinical Document Builder</span>
          </div>
          <h1 className="text-2.5xl font-serif font-bold text-[#2b2721]">Generate Clinical Report</h1>
          <p className="text-xs text-[#2b2721]/70 mt-1 font-medium">
            Generate standard CCRAS Prakriti Certificate & Prescription Report with digital signature and verification hash.
          </p>
        </div>

        {/* Assessment Select */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#2b2721]/80 ml-1">Select Completed Evaluation</label>
          <select 
            value={selectedAsmId}
            onChange={e => setSelectedAsmId(e.target.value)}
            className="w-full p-3 bg-white border border-[#2b2721]/20 rounded-xl text-xs font-bold text-[#2b2721]"
          >
            {assessments.map(a => (
              <option key={a.id} value={a.id}>
                {a.id} — {a.patientName} ({a.calculatedScores.dominant}) [{a.date}]
              </option>
            ))}
          </select>
        </div>

        {/* Practitioner Remarks */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#2b2721]/80 ml-1">Practitioner Final Remarks</label>
          <textarea 
            rows={4}
            value={practitionerNotes}
            onChange={e => setPractitionerNotes(e.target.value)}
            className="w-full p-3.5 bg-white border border-[#2b2721]/20 rounded-xl text-xs font-medium text-[#2b2721] focus:outline-none focus:ring-2 focus:ring-[#2b2721]/20"
          />
        </div>

        {/* Signature & Seal Confirmation */}
        <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-600/20 flex items-center space-x-3 text-xs text-emerald-950 font-medium">
          <ShieldCheck size={20} className="text-emerald-700 shrink-0" />
          <div>
            <p className="font-bold">Digital Practitioner Signature Ready</p>
            <p className="text-[11px] opacity-80">Will embed Dr. Suresh Bhat signature block & CCRAS-PRKRITI-001 QR Hash.</p>
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          className="w-full bg-[#2b2721] hover:bg-[#1a1714] text-[#ece7dc] py-3.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-md flex items-center justify-center space-x-2"
        >
          <span>Generate Certificate & Preview</span>
          <FileText size={15} />
        </button>
      </div>

    </div>
  );
};

export default ReportGeneration;
