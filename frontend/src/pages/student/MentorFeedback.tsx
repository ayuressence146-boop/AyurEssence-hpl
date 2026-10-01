import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Star, Award, CheckCircle, AlertCircle, ArrowRight, UserCheck, Calendar, Loader2 } from 'lucide-react';
import { patientService, authService, assessmentService } from '../../services/api';

interface FeedbackItem {
  id: string;
  patientName: string;
  patientId: string;
  mentor: string;
  mentorTitle: string;
  date: string;
  score: string;
  type: 'praise' | 'correction';
  title: string;
  feedback: string;
  actionableAdvice: string;
}

const MentorFeedback = () => {
  const navigate = useNavigate();
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeedback = async (isBackground = false) => {
      if (!isBackground) setLoading(true);
      try {
        const assigned = await assessmentService.getMyAssigned();
        const items: FeedbackItem[] = [];

        for (const asm of assigned) {
          if (asm.status === 'reviewed' || asm.status === 'finalized') {
            const p = await patientService.getPatient(asm.patient_id);
            
            // Extract the doctor's notes (we format it as 'Mentor Verification: ... Mentor Feedback: ...')
            const rawNotes = asm.practitionerNotes || '';
            const feedbackMatch = rawNotes.match(/Mentor Feedback:\s*([\s\S]*)/);
            const feedbackText = feedbackMatch ? feedbackMatch[1].trim() : 'Assessment evaluated by faculty mentor.';
            const isPraise = !feedbackText.toLowerCase().includes('incorrect') && !feedbackText.toLowerCase().includes('review');

            items.push({
              id: asm.id,
              patientName: p.full_name || p.name || 'Patient',
              patientId: p.patientId || p.id.substring(0, 8),
              mentor: 'Senior Clinical Vaidya',
              mentorTitle: 'Senior Clinical Faculty',
              date: asm.finalized_at ? new Date(asm.finalized_at).toISOString().split('T')[0] : new Date(asm.created_at).toISOString().split('T')[0],
              score: 'Evaluated',
              type: isPraise ? 'praise' : 'correction',
              title: 'Clinical Diagnostic Review',
              feedback: feedbackText,
              actionableAdvice: 'Review classical Ayurvedic literature for further correlation.'
            });
          }
        }
        setFeedbackList(items);
      } catch (err) {
        console.warn('Failed to load mentor feedback:', err);
        setFeedbackList([]);
      } finally {
        if (!isBackground) setLoading(false);
      }
    };
    fetchFeedback();

    const intervalId = setInterval(() => fetchFeedback(true), 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-amber-800 animate-spin" />
        <p className="text-amber-900/70 text-sm font-medium">Loading mentor evaluations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-800/10 text-amber-900 border border-amber-800/20">
              Clinical Evaluations
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-950 mt-1">
            Mentor Reviews &amp; Clinical Guidance
          </h1>
          <p className="text-amber-900/70 text-sm mt-0.5">
            Feedback provided by Senior Ayurvedic Doctors on your diagnostic submissions.
          </p>
        </div>
      </div>

      {/* Feedback List or Empty State */}
      {feedbackList.length === 0 ? (
        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-12 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-800/10 border border-amber-800/20 flex items-center justify-center mx-auto text-amber-800">
            <MessageSquare size={32} />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-serif font-bold text-amber-950">No Mentor Reviews Yet</h3>
            <p className="text-sm text-amber-900/70 leading-relaxed">
              Once a Senior Vaidya evaluates your submitted patient Prakriti &amp; Vikriti assessments, their clinical notes, accuracy scores, and actionable guidance will appear here.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => navigate('/student/assessments/conduct')}
              className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-xl font-medium text-sm transition-all shadow-md inline-flex items-center space-x-2"
            >
              <span>Conduct New Patient Assessment</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbackList.map((item) => (
            <div
              key={item.id}
              className={`bg-[#fbf7ee]/80 border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all ${
                item.type === 'correction' ? 'border-amber-800/30' : 'border-emerald-800/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/10 pb-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    item.type === 'correction' ? 'bg-amber-800/15 text-amber-950' : 'bg-emerald-800/15 text-emerald-950'
                  }`}>
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-amber-950 text-base">{item.title}</h3>
                    <p className="text-xs text-amber-900/70">
                      Patient: <span className="font-semibold text-amber-950">{item.patientName} ({item.patientId})</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <span className="text-xs text-amber-800/60 font-medium flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{item.date}</span>
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-800 text-amber-50">
                    {item.score}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-amber-950 leading-relaxed bg-white/60 p-4 rounded-xl border border-amber-900/10">
                  "{item.feedback}"
                </p>

                <div className="p-3 rounded-xl bg-amber-800/10 border border-amber-900/15 text-xs text-amber-950 font-medium flex items-start space-x-2">
                  <Star size={16} className="text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900 block">Actionable Guidance:</span>
                    <span>{item.actionableAdvice}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-amber-800/70 font-medium">
                    Reviewed by <span className="font-bold text-amber-950">{item.mentor}</span> • {item.mentorTitle}
                  </div>
                  <button
                    onClick={() => navigate(`/student/assessments/${item.id}/comparison`)}
                    className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center space-x-1"
                  >
                    <span>View Case Details</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorFeedback;
