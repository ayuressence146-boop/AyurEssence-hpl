import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Award, Clock } from 'lucide-react';
import { dataStore } from '../../services/dataStore';

const MyAssessment = () => {
  const assessment = dataStore.getAssessments()[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#2b2721]">
      
      {/* Header */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 sm:p-8 rounded-[28px] border border-[#2b2721]/15 shadow-sm space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2b2721]/60">
          <Heart size={14} className="text-amber-700" />
          <span>Self-Guided Assessment Portal</span>
        </div>
        <h1 className="text-2.5xl font-serif font-bold text-[#2b2721]">My Prakriti Evaluation</h1>
        <p className="text-xs text-[#2b2721]/75 font-medium max-w-xl">
          Complete the 15-question CCRAS Prakriti questionnaire to discover your unique Vata-Pitta-Kapha elemental balance.
        </p>
      </div>

      {/* Action Banner */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#2b2721]">Take New Prakriti Questionnaire</h3>
          <p className="text-xs text-[#2b2721]/70 mt-0.5">Answer questions regarding body structure, digestion, and sleep.</p>
        </div>

        <Link
          to="/patient/assessment/questionnaire"
          className="px-6 py-3 bg-[#2b2721] hover:bg-[#1a1714] text-[#ece7dc] text-xs font-bold rounded-full transition-all shadow-md flex items-center space-x-2 self-start sm:self-auto"
        >
          <span>Start Assessment Now</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* Existing Assessment Card */}
      {assessment && (
        <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-[#2b2721]">Latest Completed Evaluation</h3>
            <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-900 border border-emerald-500/20">
              Verified
            </span>
          </div>

          <div className="p-4 bg-white/80 rounded-2xl border border-[#2b2721]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono font-bold text-[#2b2721]/60">ID: {assessment.id} · Date: {assessment.date}</p>
              <p className="text-lg font-serif font-bold text-[#2b2721] mt-0.5">Result: {assessment.calculatedScores.dominant} Prakriti</p>
            </div>

            <Link
              to="/patient/result"
              className="px-4 py-2 bg-white hover:bg-[#2b2721] hover:text-[#ece7dc] border border-[#2b2721]/20 text-xs font-bold rounded-xl transition-all shadow-sm inline-flex items-center space-x-1.5 self-start sm:self-auto"
            >
              <Award size={14} />
              <span>View Full Result</span>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyAssessment;
