import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Info, User } from 'lucide-react';

/**
 * Patient Questionnaire Page
 * 
 * Per the correct AyurEssence flow, patients do NOT take their own assessment.
 * Assessments are conducted by Students or Doctors on behalf of the patient.
 * This page informs the patient about the process.
 */
const PatientQuestionnaire = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 text-[#2b2721]">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link 
          to="/patient/assessment" 
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#2b2721] hover:underline"
        >
          <ArrowLeft size={14} />
          <span>Back to Assessment Portal</span>
        </Link>
      </div>

      {/* Info Card */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-8 sm:p-10 rounded-[28px] border border-[#2b2721]/15 shadow-sm text-center space-y-5">
        <div className="w-20 h-20 mx-auto rounded-full bg-amber-800/10 border border-amber-800/20 flex items-center justify-center">
          <Info size={32} className="text-amber-800" />
        </div>

        <h1 className="text-2xl font-serif font-bold text-[#2b2721]">
          Assessment Conducted by Practitioner
        </h1>

        <p className="text-xs text-[#2b2721]/75 font-medium max-w-lg mx-auto leading-relaxed">
          In Ayurvedic practice, your Prakriti assessment is conducted by a trained <span className="font-bold">Student</span> or <span className="font-bold">Doctor (Vaidya)</span>. They will ask you the diagnostic questions, record clinical observations (Nadi, Jihva, Twak, etc.), and compute your Vata–Pitta–Kapha balance using authenticated methodology.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 text-xs">
          <div className="p-4 bg-white/80 rounded-2xl border border-[#2b2721]/10 space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500/10 flex items-center justify-center">
              <User size={18} className="text-amber-900" />
            </div>
            <h4 className="font-bold text-[#2b2721]">Step 1</h4>
            <p className="text-[#2b2721]/70 font-medium">A practitioner is assigned to conduct your Prakriti evaluation</p>
          </div>

          <div className="p-4 bg-white/80 rounded-2xl border border-[#2b2721]/10 space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Heart size={18} className="text-orange-900" />
            </div>
            <h4 className="font-bold text-[#2b2721]">Step 2</h4>
            <p className="text-[#2b2721]/70 font-medium">They complete the questionnaire & clinical observations on your behalf</p>
          </div>

          <div className="p-4 bg-white/80 rounded-2xl border border-[#2b2721]/10 space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Heart size={18} className="text-emerald-900" />
            </div>
            <h4 className="font-bold text-[#2b2721]">Step 3</h4>
            <p className="text-[#2b2721]/70 font-medium">Your results and Ayurvedic recommendations appear on your dashboard</p>
          </div>
        </div>

        <Link 
          to="/patient" 
          className="inline-flex items-center space-x-2 px-6 py-3 bg-[#2b2721] hover:bg-[#1a1714] text-[#ece7dc] text-xs font-bold rounded-full transition-all shadow-md"
        >
          <span>Return to Dashboard</span>
        </Link>
      </div>

    </div>
  );
};

export default PatientQuestionnaire;
