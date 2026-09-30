import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, CheckCircle, BarChart3, ArrowRight, BookOpen, Sparkles, Award, Loader2 } from 'lucide-react';
import { patientService, authService, type PatientModel } from '../../services/api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const currentUser = authService.getStoredUser();
  const [patients, setPatients] = useState<PatientModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await patientService.listPatients();
        setPatients(data);
      } catch (err) {
        console.warn('Failed to fetch patients:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const mentorFeedbacks: any[] = []; // Loaded dynamically from API — empty until real feedback exists

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
            Student Clinical Dashboard
          </h1>
          <p className="text-amber-900/70 text-sm mt-0.5">
            Track your patient assessments, diagnostic interpretations, and mentor evaluations.
          </p>
        </div>
        <button
          onClick={() => navigate('/student/assessments/conduct')}
          className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-xl font-medium text-sm transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
        >
          <BookOpen size={18} />
          <span>Conduct New Assessment</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800/60">Assigned Patients</p>
              <h3 className="text-2xl font-serif font-bold text-amber-950 mt-1">{patients.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-800/10 flex items-center justify-center text-amber-800">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-amber-800/70">
            <span>{patients.filter(p => p.status === 'Active').length} actively under evaluation</span>
          </div>
        </div>

        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800/60">Completed Cases</p>
              <h3 className="text-2xl font-serif font-bold text-amber-950 mt-1">{0}</h3>
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
            <span>High precision with doctor diagnoses</span>
          </div>
        </div>

        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800/60">Pending Reviews</p>
              <h3 className="text-2xl font-serif font-bold text-amber-950 mt-1">{0}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-600/10 flex items-center justify-center text-amber-800">
              <FileText size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-amber-800 font-medium">
            <span>Requires practitioner sign-off</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Tasks & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Assigned Cases to Evaluate */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-amber-950">Assigned Patient Cases</h3>
                <p className="text-xs text-amber-800/60">Select a case to conduct Prakriti assessment or view interpretation.</p>
              </div>
              <button 
                onClick={() => navigate('/student/tasks')}
                className="text-xs font-bold text-amber-900 hover:text-amber-950 underline"
              >
                View All Tasks
              </button>
            </div>

            <div className="space-y-3">
              {patients.slice(0, 4).map((p, idx) => (
                <div 
                  key={p.id}
                  className="bg-white/60 border border-amber-900/10 rounded-xl p-4 hover:border-amber-900/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-amber-800/10 border border-amber-900/15 flex items-center justify-center font-serif font-bold text-amber-900">
                      {(p.full_name || p.name || 'P').charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-amber-950 text-sm">{p.full_name || p.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-800/10 text-amber-900 font-mono">
                          {p.patientId}
                        </span>
                      </div>
                      <p className="text-xs text-amber-800/70 mt-0.5">
                        {p.age ? `${p.age} yrs` : 'Age N/A'} • {p.gender || 'N/A'} {p.primaryComplaint ? `• ${p.primaryComplaint}` : '• Prakriti: Pending'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <button
                      onClick={() => navigate(`/student/patients/${p.id}`)}
                      className="px-3 py-1.5 rounded-lg border border-amber-900/20 text-xs font-medium text-amber-900 hover:bg-amber-800/10 transition-colors"
                    >
                      Patient Info
                    </button>
                    <button
                      onClick={() => navigate(`/student/assessments/conduct?patientId=${p.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-amber-800 text-amber-50 hover:bg-amber-900 text-xs font-medium transition-colors flex items-center space-x-1"
                    >
                      <span>Assess</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Learning Note Card */}
          <div className="bg-amber-900 text-amber-50 rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <div className="flex items-center space-x-2 text-amber-200 text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={16} />
                <span>Ayurvedic Clinical Tip of the Day</span>
              </div>
              <h4 className="text-lg font-serif font-bold">Evaluating Trividha Pariksha</h4>
              <p className="text-xs text-amber-100/80 leading-relaxed max-w-xl">
                "Darshanam (Observation), Sparshanam (Touch & Pulse), and Prashnam (Interrogation) must be synthesized together. Never rely purely on patient questionnaire self-reports for Vata-Prakriti without verifying Nadi and Twak dryness."
              </p>
              <div className="pt-2">
                <span className="text-[11px] text-amber-200/60 italic">— Ashtanga Hridaya, Sutrasthana</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mentor Feedback & Analytics Quick View */}
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

            <div className="space-y-4">
              {mentorFeedbacks.map((fb) => (
                <div 
                  key={fb.id} 
                  className={`p-4 rounded-xl border ${
                    fb.type === 'correction' 
                      ? 'bg-amber-500/10 border-amber-800/20' 
                      : 'bg-emerald-500/10 border-emerald-800/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      fb.type === 'correction' ? 'bg-amber-800/20 text-amber-950' : 'bg-emerald-800/20 text-emerald-950'
                    }`}>
                      {fb.type === 'correction' ? 'Correction Note' : 'Validated Match'}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-900">{fb.score} Score</span>
                  </div>
                  <h4 className="text-sm font-bold text-amber-950 mt-2">{fb.title}</h4>
                  <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">{fb.content}</p>
                  <div className="mt-3 flex justify-between items-center text-[11px] text-amber-800/60 font-medium">
                    <span>{fb.mentor}</span>
                    <span>{fb.time}</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-amber-900/10 flex justify-end">
                    <button
                      onClick={() => navigate(`/student/assessments/asm-101/comparison`)}
                      className="text-xs font-medium text-amber-900 hover:text-amber-950 flex items-center space-x-1"
                    >
                      <span>View Doctor Comparison</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

