import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, FileText, CheckCircle, BarChart3, ArrowRight, BookOpen, Sparkles, Award, Loader2, AlertCircle } from 'lucide-react';
import { assessmentService, patientService, authService, type AssessmentModel, type PatientModel } from '../../services/api';

interface AssignedItem {
  assessment: AssessmentModel;
  patient: PatientModel | null;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const currentUser = authService.getStoredUser();
  const [assignedItems, setAssignedItems] = useState<AssignedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async (isBackground = false) => {
      if (!isBackground) setLoading(true);
      try {
        const assigned = await assessmentService.getMyAssigned();

        // Fetch patient data for each assigned assessment
        const patientCache: Record<string, PatientModel | null> = {};
        const enriched: AssignedItem[] = await Promise.all(
          assigned.map(async (asm) => {
            if (!patientCache[asm.patient_id]) {
              try {
                patientCache[asm.patient_id] = await patientService.getPatient(asm.patient_id);
              } catch {
                patientCache[asm.patient_id] = null;
              }
            }
            return { assessment: asm, patient: patientCache[asm.patient_id] };
          })
        );
        setAssignedItems(enriched);
      } catch (err) {
        console.warn('Failed to fetch assigned assessments:', err);
      } finally {
        if (!isBackground) setLoading(false);
      }
    };
    fetchData();

    const intervalId = setInterval(() => fetchData(true), 5000);
    return () => clearInterval(intervalId);
  }, []);

  const completedCount = assignedItems.filter(i => ['submitted', 'reviewed', 'finalized'].includes(i.assessment.status)).length;
  const pendingCount = assignedItems.filter(i => ['draft', 'in_progress'].includes(i.assessment.status)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-800/10 text-amber-900 border border-amber-800/20">
              Ayurvedic Scholar Portal
            </span>
            <span className="text-xs text-amber-800/60 font-medium">Batch 2025-26</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-950 mt-1">
            Welcome, {currentUser?.full_name?.split(' ')[0] || 'Scholar'}
          </h1>
          <p className="text-amber-900/70 text-sm mt-0.5">
            Track your doctor-assigned assessments, diagnostic interpretations, and mentor evaluations.
          </p>
        </div>
        <button
          onClick={() => navigate('/student/tasks')}
          className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-xl font-medium text-sm transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
        >
          <ClipboardList size={18} />
          <span>View All Tasks</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800/60">Assigned Cases</p>
              <h3 className="text-2xl font-serif font-bold text-amber-950 mt-1">
                {loading ? <Loader2 size={20} className="animate-spin text-amber-800" /> : assignedItems.length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-800/10 flex items-center justify-center text-amber-800">
              <ClipboardList size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-amber-800/70">
            <span>{pendingCount} pending action</span>
          </div>
        </div>

        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800/60">Completed Cases</p>
              <h3 className="text-2xl font-serif font-bold text-amber-950 mt-1">
                {loading ? <Loader2 size={20} className="animate-spin text-amber-800" /> : completedCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-800/10 flex items-center justify-center text-emerald-800">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-emerald-800 font-medium">
            <span>Submitted to Senior Vaidyas</span>
          </div>
        </div>

        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800/60">Diagnostic Match</p>
              <h3 className="text-2xl font-serif font-bold text-amber-950 mt-1">N/A</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-800/10 flex items-center justify-center text-purple-800">
              <BarChart3 size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-purple-900 font-medium">
            <Award size={14} className="mr-1" />
            <span>After doctor reviews your case</span>
          </div>
        </div>

        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800/60">Pending Reviews</p>
              <h3 className="text-2xl font-serif font-bold text-amber-950 mt-1">
                {loading ? <Loader2 size={20} className="animate-spin text-amber-800" /> : pendingCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-600/10 flex items-center justify-center text-amber-800">
              <FileText size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-amber-800 font-medium">
            <span>Requires your action</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Assigned Assessments */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-amber-950">Doctor-Assigned Cases</h3>
                <p className="text-xs text-amber-800/60">Select a case to conduct your Prakriti assessment and submit.</p>
              </div>
              <button
                onClick={() => navigate('/student/tasks')}
                className="text-xs font-bold text-amber-900 hover:text-amber-950 underline"
              >
                View All
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="animate-spin text-amber-800 mr-2" size={22} />
                <span className="text-sm text-amber-900/60">Loading assigned cases…</span>
              </div>
            ) : assignedItems.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center space-y-2">
                <AlertCircle className="text-amber-800/30" size={36} />
                <p className="text-sm font-medium text-amber-900/60">No cases assigned yet</p>
                <p className="text-xs text-amber-900/40 max-w-xs">
                  Your supervising doctor will assign patient cases to you. Check back later.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {assignedItems.slice(0, 4).map(({ assessment, patient }) => (
                  <div
                    key={assessment.id}
                    className="bg-white/60 border border-amber-900/10 rounded-xl p-4 hover:border-amber-900/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-amber-800/10 border border-amber-900/15 flex items-center justify-center font-serif font-bold text-amber-900">
                        {(patient?.full_name || 'P').charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-amber-950 text-sm">{patient?.full_name || 'Patient'}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            assessment.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                            assessment.status === 'in_progress' ? 'bg-amber-100 text-amber-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {assessment.status === 'draft' ? 'Not Started' : assessment.status === 'in_progress' ? 'In Progress' : 'Submitted'}
                          </span>
                        </div>
                        <p className="text-xs text-amber-800/70 mt-0.5">
                          {patient?.age ? `${patient.age} yrs` : 'Age N/A'} • {patient?.gender || 'N/A'}
                          {patient?.prakriti ? ` • Prakriti: ${patient.prakriti}` : ' • Prakriti: Pending'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      {patient && (
                        <button
                          onClick={() => navigate(`/student/patients/${patient.id}`)}
                          className="px-3 py-1.5 rounded-lg border border-amber-900/20 text-xs font-medium text-amber-900 hover:bg-amber-800/10 transition-colors"
                        >
                          Info
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/student/assessments/conduct?patientId=${patient?.id}&assessmentId=${assessment.id}`)}
                        className="px-3 py-1.5 rounded-lg bg-amber-800 text-amber-50 hover:bg-amber-900 text-xs font-medium transition-colors flex items-center space-x-1"
                      >
                        <BookOpen size={13} />
                        <span>{assessment.status === 'draft' ? 'Start' : 'Continue'}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clinical Tip */}
          <div className="bg-amber-900 text-amber-50 rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <div className="flex items-center space-x-2 text-amber-200 text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={16} />
                <span>Ayurvedic Clinical Tip of the Day</span>
              </div>
              <h4 className="text-lg font-serif font-bold">Evaluating Trividha Pariksha</h4>
              <p className="text-xs text-amber-100/80 leading-relaxed max-w-xl">
                "Darshanam (Observation), Sparshanam (Touch & Pulse), and Prashnam (Interrogation) must be synthesized together. 
                Never rely purely on patient questionnaire self-reports for Vata-Prakriti without verifying Nadi and Twak dryness."
              </p>
              <div className="pt-2">
                <span className="text-[11px] text-amber-200/60 italic">— Ashtanga Hridaya, Sutrasthana</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mentor Feedback */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-bold text-amber-950">Recent Mentor Feedback</h3>
              <button
                onClick={() => navigate('/student/feedback')}
                className="text-xs font-bold text-amber-900 hover:text-amber-950 underline"
              >
                All Feedback
              </button>
            </div>
            <div className="flex flex-col items-center py-8 text-center space-y-2">
              <Award className="text-amber-800/20" size={36} />
              <p className="text-sm font-medium text-amber-900/50">No feedback yet</p>
              <p className="text-xs text-amber-900/40 max-w-xs">
                Mentor reviews appear here after your doctor evaluates your submitted assessments.
              </p>
              <button
                onClick={() => navigate('/student/feedback')}
                className="mt-2 text-xs px-4 py-2 rounded-xl bg-amber-800/10 hover:bg-amber-800/20 text-amber-900 font-medium transition-colors"
              >
                Go to Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
