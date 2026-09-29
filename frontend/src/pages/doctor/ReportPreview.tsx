import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Share2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { dataStore, type AssessmentRecord, type PatientRecord } from '../../services/dataStore';

const ReportPreview = () => {
  const { id } = useParams<{ id: string }>();
  const [assessment, setAssessment] = useState<AssessmentRecord | null>(null);
  const [patient, setPatient] = useState<PatientRecord | null>(null);

  useEffect(() => {
    const record = dataStore.getAssessmentById(id || '') || dataStore.getAssessments()[0];
    if (record) {
      setAssessment(record);
      const p = dataStore.getPatientById(record.patientId);
      if (p) setPatient(p);
    }
  }, [id]);

  const scores = assessment?.calculatedScores || { vata: 48, pitta: 35, kapha: 17, dominant: 'Vata-Pitta' };
  const recs = assessment?.recommendations || {
    dietFavor: ['Warm cooked grains (basmati rice, quinoa)', 'Ghee & sesame oil', 'Sweet ripe fruits'],
    dietAvoid: ['Raw cold salads', 'Pungent chili peppers', 'Iced beverages'],
    lifestyle: ['Daily warm sesame oil Abhyanga massage', 'Regular sleep schedule (by 10:00 PM)', 'Nadi Shodhana Pranayama'],
    formulations: ['Ashwagandha Churna 3g twice daily', 'Triphala Churna 5g at bedtime']
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#2b2721]">
      
      {/* Top Controls (Hidden on Print) */}
      <div className="flex items-center justify-between print:hidden">
        <Link 
          to="/doctor/reports/generate" 
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#2b2721] hover:underline"
        >
          <ArrowLeft size={14} />
          <span>Back to Report Generator</span>
        </Link>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-white border border-[#2b2721]/20 text-xs font-bold text-[#2b2721] rounded-full hover:bg-[#2b2721] hover:text-[#ece7dc] transition-all shadow-sm flex items-center space-x-2"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>
          <button 
            onClick={handlePrint}
            className="px-5 py-2 bg-[#2b2721] text-[#ece7dc] text-xs font-bold rounded-full hover:bg-[#1a1714] transition-all shadow-md flex items-center space-x-2"
          >
            <Download size={14} />
            <span>Download PDF Certificate</span>
          </button>
        </div>
      </div>

      {/* OFFICIAL CLINICAL REPORT DOCUMENT */}
      <div 
        className="bg-[#fcfaf4] p-8 sm:p-12 rounded-[24px] border border-[#2b2721]/20 shadow-xl space-y-8 relative overflow-hidden text-[#2b2721]"
        style={{
          backgroundImage: 'url(/landing-pages/meng-to-sketchbook/bg-wash.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        
        {/* Certificate Header Stamp */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-[#2b2721]/30 pb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-[#2b2721] text-[#ece7dc] flex items-center justify-center font-serif font-bold text-2xl shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-[#2b2721] tracking-tight">AyurEssence Clinical Engine</h2>
              <p className="text-xs font-bold text-[#2b2721]/70 uppercase tracking-widest">SDM College of Ayurveda · Udupi Campus</p>
              <p className="text-[10px] text-[#2b2721]/50 font-mono">CCRAS Standard Assessment Standard Protocol</p>
            </div>
          </div>

          <div className="text-center sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-[#2b2721]/15">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-[#2b2721] text-[#ece7dc]">
              VERIFIED CLINICAL RECORD
            </span>
            <p className="text-xs font-mono font-bold text-[#2b2721] mt-2">Cert ID: {assessment?.id || id}</p>
            <p className="text-[11px] text-[#2b2721]/60">Date: {assessment?.date || '2026-09-28'}</p>
          </div>
        </div>

        {/* Patient Demographics Box */}
        <div className="p-5 bg-white/70 rounded-2xl border border-[#2b2721]/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#2b2721]/50 block">Patient Name</span>
            <p className="font-bold text-[#2b2721]">{patient?.name || assessment?.patientName || 'Ananya Sharma'}</p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-[#2b2721]/50 block">ID & Demographics</span>
            <p className="font-bold text-[#2b2721]">{patient?.id || 'AE-2041'} · {patient?.age || 34} yrs, {patient?.gender || 'Female'}</p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-[#2b2721]/50 block">Primary Prakriti</span>
            <p className="font-bold text-[#2b2721] font-serif text-sm">{scores.dominant}</p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-[#2b2721]/50 block">Attending Practitioner</span>
            <p className="font-bold text-[#2b2721]">Dr. Suresh Bhat</p>
          </div>
        </div>

        {/* Prakriti Dosha Percentages */}
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-lg text-[#2b2721]">Prakriti Constitutional Score Breakdown</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-600/20">
              <span className="text-xs font-bold text-amber-900 block">Vata Dosha</span>
              <span className="text-3xl font-serif font-bold text-amber-950 block mt-1">{scores.vata}%</span>
            </div>

            <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-600/20">
              <span className="text-xs font-bold text-orange-900 block">Pitta Dosha</span>
              <span className="text-3xl font-serif font-bold text-orange-950 block mt-1">{scores.pitta}%</span>
            </div>

            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-600/20">
              <span className="text-xs font-bold text-emerald-900 block">Kapha Dosha</span>
              <span className="text-3xl font-serif font-bold text-emerald-950 block mt-1">{scores.kapha}%</span>
            </div>
          </div>
        </div>

        {/* Ahara & Vihara Guidance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          
          <div className="p-5 bg-white/70 rounded-2xl border border-[#2b2721]/15 space-y-2">
            <h4 className="font-serif font-bold text-sm text-[#2b2721] border-b border-[#2b2721]/10 pb-1">
              Ahara: Dietary Guidance
            </h4>
            <div>
              <p className="font-bold text-emerald-800 text-[11px] mb-1">Foods to Favor:</p>
              <ul className="list-disc pl-4 space-y-1 text-[#2b2721]/80 font-medium">
                {recs.dietFavor.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div className="pt-2">
              <p className="font-bold text-red-800 text-[11px] mb-1">Foods to Avoid:</p>
              <ul className="list-disc pl-4 space-y-1 text-[#2b2721]/80 font-medium">
                {recs.dietAvoid.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>

          <div className="p-5 bg-white/70 rounded-2xl border border-[#2b2721]/15 space-y-2">
            <h4 className="font-serif font-bold text-sm text-[#2b2721] border-b border-[#2b2721]/10 pb-1">
              Vihara & Aushadhi Guidance
            </h4>
            <div>
              <p className="font-bold text-[#2b2721] text-[11px] mb-1">Daily Dinacharya Routine:</p>
              <ul className="list-disc pl-4 space-y-1 text-[#2b2721]/80 font-medium">
                {recs.lifestyle.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div className="pt-2">
              <p className="font-bold text-[#2b2721] text-[11px] mb-1">Prescribed Formulations:</p>
              <ul className="list-disc pl-4 space-y-1 text-[#2b2721]/80 font-medium">
                {recs.formulations.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>

        </div>

        {/* Verification & Signature Block */}
        <div className="pt-6 border-t-2 border-[#2b2721]/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-white border border-[#2b2721]/20 rounded-xl p-2 flex flex-col items-center justify-center text-center font-mono text-[8px] font-bold text-[#2b2721]">
              <div className="w-8 h-8 bg-[#2b2721] rounded flex items-center justify-center text-[#ece7dc] mb-0.5">
                <ShieldCheck size={16} />
              </div>
              <span>CCRAS QR SEAL</span>
            </div>
            <div className="text-xs">
              <p className="font-mono font-bold text-[#2b2721]">CCRAS-PRKRITI-001-v1.0</p>
              <p className="text-[10px] text-[#2b2721]/60">Cryptographic Verification Hash: 98a4b2f110c</p>
            </div>
          </div>

          <div className="text-center sm:text-right text-xs">
            <p className="font-serif italic font-bold text-lg text-[#2b2721]">Dr. Suresh Bhat</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#2b2721]/60">BAMS, MD (Ayurveda)</p>
            <p className="text-[10px] text-[#2b2721]/50">Senior Practitioner, SDM Hospital Wing</p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ReportPreview;
