import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, CheckCircle2, Sparkles, AlertCircle, Loader2, Clock } from 'lucide-react';
import { authService, patientService, recommendationService } from '../../services/api';

const MyRecommendation = () => {
  const currentUser = authService.getStoredUser();
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState<any>(null);

  useEffect(() => {
    const fetchRec = async () => {
      if (!currentUser) return;
      try {
        const assessments = await patientService.getPatientAssessments(currentUser.id);
        // Find the latest assessment with results (finalized or reviewed)
        const completed = assessments.find((a: any) =>
          a.status === 'finalized' || a.status === 'reviewed'
        );
        if (completed) {
          try {
            const rec = await recommendationService.getByAssessment(completed.id);
            setRecommendation(rec);
          } catch (e) {
            // No recommendation yet
          }
        }
      } catch (err) {
        console.warn('Failed to fetch recommendation:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRec();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-amber-800" />
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="max-w-4xl mx-auto text-[#2b2721]">
        <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-10 rounded-[28px] border border-[#2b2721]/15 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-800/10 border border-amber-800/20 flex items-center justify-center">
            <Clock size={28} className="text-amber-800" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#2b2721]">No Recommendation Available</h3>
          <p className="text-xs text-[#2b2721]/75 font-medium max-w-md mx-auto leading-relaxed">
            Your personalized Ayurvedic guidance will appear here after the doctor reviews and approves recommendations based on your Prakriti assessment.
          </p>
          <Link to="/patient" className="inline-flex items-center space-x-2 text-xs font-bold text-amber-800 hover:underline">
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  // The recommendation text can be displayed as-is from the backend
  const recText = recommendation.approved_text || recommendation.draft_text || '';
  const isApproved = recommendation.status === 'approved';

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#2b2721]">
      
      {/* Header */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 sm:p-8 rounded-[28px] border border-[#2b2721]/15 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2b2721]/60">
          <Sparkles size={14} className="text-amber-700" />
          <span>{isApproved ? 'Doctor Approved Guidance' : 'Draft Guidance (Pending Approval)'}</span>
        </div>
        <h1 className="text-2.5xl font-serif font-bold text-[#2b2721]">Ayurvedic Ahara & Vihara Guidance</h1>
        <p className="text-xs text-[#2b2721]/75 font-medium">
          Personalized dietary rules, daily Dinacharya routines, and prescribed formulations tailored to your Prakriti.
        </p>
        {isApproved && (
          <span className="inline-block text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-900 border border-emerald-500/20">
            <CheckCircle2 size={12} className="inline mr-1" /> Doctor Approved
          </span>
        )}
      </div>

      {/* Recommendation Content */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-3">
        <h3 className="text-base font-serif font-bold text-[#2b2721]">Your Personalized Guidance</h3>
        <div className="p-5 bg-white/80 rounded-2xl border border-[#2b2721]/10 text-xs text-[#2b2721]/85 leading-relaxed font-medium whitespace-pre-line">
          {recText}
        </div>
        {recommendation.recommended_followup_weeks && (
          <p className="text-xs text-[#2b2721]/60 font-medium">
            Recommended follow-up in <span className="font-bold">{recommendation.recommended_followup_weeks} weeks</span>.
          </p>
        )}
      </div>

    </div>
  );
};

export default MyRecommendation;
