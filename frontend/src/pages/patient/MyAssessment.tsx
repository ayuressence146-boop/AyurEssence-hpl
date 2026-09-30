import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Award, Clock, Loader2, CheckCircle2, Activity } from 'lucide-react';
import { authService, patientService, type AssessmentModel } from '../../services/api';

const MyAssessment = () => {
  const navigate = useNavigate();
  const currentUser = authService.getStoredUser();
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<AssessmentModel[]>([]);

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!currentUser) return;
      try {
        const data = await patientService.getPatientAssessments(currentUser.id);
        setAssessments(data);
      } catch (err) {
        console.warn('Failed to fetch assessments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-amber-800" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'finalized':
        return 'bg-emerald-500/15 text-emerald-900 border-emerald-500/20';
      case 'reviewed':
        return 'bg-blue-500/15 text-blue-900 border-blue-500/20';
      case 'submitted':
        return 'bg-purple-500/15 text-purple-900 border-purple-500/20';
      case 'in_progress':
        return 'bg-amber-500/15 text-amber-900 border-amber-500/20';
      default:
        return 'bg-gray-500/15 text-gray-900 border-gray-500/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#2b2721]">
      
      {/* Header */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 sm:p-8 rounded-[28px] border border-[#2b2721]/15 shadow-sm space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2b2721]/60">
          <Heart size={14} className="text-amber-700" />
          <span>Assessment Portal</span>
        </div>
        <h1 className="text-2.5xl font-serif font-bold text-[#2b2721]">My Prakriti Evaluations</h1>
        <p className="text-xs text-[#2b2721]/75 font-medium max-w-xl">
          View assessments conducted by your assigned student or doctor. Results will appear here after the practitioner completes the evaluation.
        </p>
      </div>

      {/* Assessment List or Empty State */}
      {assessments.length === 0 ? (
        <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-10 rounded-[28px] border border-[#2b2721]/15 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-800/10 border border-amber-800/20 flex items-center justify-center">
            <Clock size={28} className="text-amber-800" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#2b2721]">No Assessments Yet</h3>
          <p className="text-xs text-[#2b2721]/75 font-medium max-w-md mx-auto leading-relaxed">
            Your Prakriti assessment will be conducted by a student or doctor. Once completed, your evaluation details and dosha results will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {assessments.map((asm: any) => {
            const result = asm.results?.[0];
            const hasResult = !!result;

            return (
              <div key={asm.id} className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-serif font-bold text-[#2b2721]">
                    {hasResult ? `${result.dominant_dosha} Prakriti` : 'Assessment In Progress'}
                  </h3>
                  <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${getStatusBadge(asm.status)}`}>
                    {asm.status?.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-4 bg-white/80 rounded-2xl border border-[#2b2721]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-mono font-bold text-[#2b2721]/60">
                      Date: {asm.created_at ? new Date(asm.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                    {hasResult ? (
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm font-bold text-amber-900">V: {parseFloat(result.vata_percentage).toFixed(1)}%</span>
                        <span className="text-sm font-bold text-orange-900">P: {parseFloat(result.pitta_percentage).toFixed(1)}%</span>
                        <span className="text-sm font-bold text-emerald-900">K: {parseFloat(result.kapha_percentage).toFixed(1)}%</span>
                      </div>
                    ) : (
                      <p className="text-xs text-[#2b2721]/60 mt-1 flex items-center space-x-1.5">
                        <Activity size={14} />
                        <span>Awaiting practitioner to complete evaluation</span>
                      </p>
                    )}
                  </div>

                  {hasResult && (
                    <Link
                      to="/patient/result"
                      className="px-4 py-2 bg-white hover:bg-[#2b2721] hover:text-[#ece7dc] border border-[#2b2721]/20 text-xs font-bold rounded-xl transition-all shadow-sm inline-flex items-center space-x-1.5 self-start sm:self-auto"
                    >
                      <Award size={14} />
                      <span>View Full Result</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default MyAssessment;
