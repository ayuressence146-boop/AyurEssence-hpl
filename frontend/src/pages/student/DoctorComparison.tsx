import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, ArrowLeft, UserCheck, Loader2, AlertCircle } from 'lucide-react';
import { patientService } from '../../services/api';

interface AssessmentData {
  id: string;
  patient_id: string;
  status: string;
  calculated_scores?: {
    vata?: number;
    pitta?: number;
    kapha?: number;
    dominant?: string;
  };
  clinical_observations?: {
    nadi?: string;
    jihva?: string;
    twak?: string;
    notes?: string;
    reviewed_by?: string;
    accuracy_score?: number;
    doctor_vata?: number;
    doctor_pitta?: number;
    doctor_kapha?: number;
    doctor_prakriti?: string;
    doctor_nadi?: string;
    doctor_jihva?: string;
    doctor_twak?: string;
    doctor_feedback?: string;
  };
  completed_at?: string;
}

const DoctorComparison = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!id) { setError('No assessment ID provided.'); setLoading(false); return; }
      setLoading(true);
      try {
        // Try to get assessment by fetching all patient assessments and find matching one
        const patients = await patientService.listPatients();
        let found: AssessmentData | null = null;
        for (const p of patients) {
          const asms = await patientService.getPatientAssessments(p.id) as AssessmentData[];
          const match = asms.find(a => a.id === id);
          if (match) { found = match; break; }
        }
        setAssessment(found);
        if (!found) setError('Assessment not found.');
      } catch (err) {
        console.error('Failed to load assessment:', err);
        setError('Failed to load assessment data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-amber-800 mr-3" size={28} />
        <span className="text-amber-900 font-medium">Loading comparison…</span>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertCircle className="text-amber-700" size={40} />
        <p className="text-amber-900 font-semibold text-lg">{error || 'Assessment not found.'}</p>
        <button
          onClick={() => navigate('/student/dashboard')}
          className="text-sm text-amber-800 underline"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const obs = (assessment.clinical_observations as any) || {};
  const scores = assessment.calculated_scores || {};

  const studentData = {
    prakriti: scores.dominant || 'Not Determined',
    vataScore: scores.vata ?? 0,
    pittaScore: scores.pitta ?? 0,
    kaphaScore: scores.kapha ?? 0,
    nadi: obs.nadi || '—',
    jihva: obs.jihva || '—',
    twak: obs.twak || '—',
  };

  const doctorData = {
    prakriti: obs.doctor_prakriti || null,
    vataScore: obs.doctor_vata ?? null,
    pittaScore: obs.doctor_pitta ?? null,
    kaphaScore: obs.doctor_kapha ?? null,
    nadi: obs.doctor_nadi || null,
    jihva: obs.doctor_jihva || null,
    twak: obs.doctor_twak || null,
    feedback: obs.doctor_feedback || obs.notes || null,
  };

  const matchPercentage = obs.accuracy_score ?? null;
  const hasDoctorReview = doctorData.prakriti || doctorData.feedback;

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
        {matchPercentage !== null && (
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-900 border border-emerald-800/20 font-bold">
            {matchPercentage >= 85 ? 'High Diagnostic Correlation' : matchPercentage >= 70 ? 'Moderate Correlation' : 'Needs Improvement'}
          </span>
        )}
      </div>

      {/* Main Header Banner */}
      <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Comparative Clinical Evaluation</span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-950 mt-1">
            Doctor vs. Student Diagnostic Comparison
          </h1>
          <p className="text-amber-900/70 text-sm mt-0.5">
            Compare your Prakriti &amp; Vikriti findings directly against Senior Vaidya recommendations.
          </p>
        </div>

        <div className="bg-amber-800/10 border border-amber-900/20 rounded-2xl p-4 text-center shrink-0 min-w-[160px]">
          <div className="flex items-center justify-center space-x-1 text-amber-900 mb-1">
            <Award size={20} />
            <span className="text-xs font-bold uppercase">Accuracy Match</span>
          </div>
          {matchPercentage !== null
            ? <><span className="text-3xl font-serif font-bold text-amber-950">{matchPercentage}%</span>
                <span className="text-[11px] text-amber-900/70 block mt-0.5">Verified by Senior Panel</span></>
            : <><span className="text-lg font-serif font-bold text-amber-950/50">Pending</span>
                <span className="text-[11px] text-amber-900/50 block mt-0.5">Awaiting Doctor Review</span></>
          }
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
              <p className="text-xs text-amber-900/60">Submitted Patient Case</p>
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
              <p className="text-xs text-amber-900/60">Senior Clinical Faculty (MD Ayurveda)</p>
            </div>
          </div>

          {!hasDoctorReview ? (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
              <UserCheck className="text-amber-800/30" size={40} />
              <p className="text-sm text-amber-900/60 font-medium">Doctor Review Pending</p>
              <p className="text-xs text-amber-900/40">Your submission is awaiting senior faculty evaluation.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-800/20">
                <span className="text-xs text-emerald-900/70 block font-semibold">Canonical Prakriti Diagnosis</span>
                <span className="font-serif font-bold text-emerald-950 text-lg">{doctorData.prakriti || '—'}</span>
              </div>

              {doctorData.vataScore !== null && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-medium text-amber-900">
                    <span>Vata: {doctorData.vataScore}%</span>
                    <span>Pitta: {doctorData.pittaScore}%</span>
                    <span>Kapha: {doctorData.kaphaScore}%</span>
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden bg-amber-900/10">
                    <div style={{ width: `${doctorData.vataScore}%` }} className="bg-amber-700" />
                    <div style={{ width: `${doctorData.pittaScore ?? 0}%` }} className="bg-red-700" />
                    <div style={{ width: `${doctorData.kaphaScore ?? 0}%` }} className="bg-emerald-700" />
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-3 text-xs">
                {doctorData.nadi && (
                  <div className="flex justify-between p-2 rounded-lg bg-white/40 border border-amber-900/10">
                    <span className="text-amber-900/70">Nadi (Pulse):</span>
                    <span className="font-medium text-amber-950">{doctorData.nadi}</span>
                  </div>
                )}
                {doctorData.jihva && (
                  <div className="flex justify-between p-2 rounded-lg bg-white/40 border border-amber-900/10">
                    <span className="text-amber-900/70">Jihva (Tongue):</span>
                    <span className="font-medium text-amber-950">{doctorData.jihva}</span>
                  </div>
                )}
                {doctorData.twak && (
                  <div className="flex justify-between p-2 rounded-lg bg-white/40 border border-amber-900/10">
                    <span className="text-amber-900/70">Twak (Skin):</span>
                    <span className="font-medium text-amber-950">{doctorData.twak}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mentor Feedback Banner */}
      {doctorData.feedback ? (
        <div className="bg-amber-800 text-amber-50 rounded-2xl p-6 shadow-md space-y-2">
          <h4 className="text-lg font-serif font-bold flex items-center space-x-2">
            <UserCheck size={20} />
            <span>Doctor's Feedback &amp; Key Insight</span>
          </h4>
          <p className="text-sm text-amber-100/90 leading-relaxed">
            "{doctorData.feedback}"
          </p>
        </div>
      ) : (
        <div className="bg-amber-800/10 border border-amber-900/15 text-amber-900/70 rounded-2xl p-6 shadow-sm text-center">
          <UserCheck className="mx-auto mb-2 opacity-40" size={28} />
          <p className="text-sm font-medium">No feedback recorded yet.</p>
          <p className="text-xs mt-1 opacity-70">Doctor's insights and feedback will appear here after review.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorComparison;
