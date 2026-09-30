import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, FileText, BookOpen, Loader2, ClipboardList, User, ChevronRight } from 'lucide-react';
import { assessmentService, patientService, type AssessmentModel, type PatientModel } from '../../services/api';

interface AssignedItem {
  assessment: AssessmentModel;
  patient: PatientModel | null;
}

const statusColor = (status: string) => {
  switch (status) {
    case 'draft': return 'bg-gray-400/15 text-gray-700 border border-gray-400/30';
    case 'in_progress': return 'bg-amber-400/15 text-amber-800 border border-amber-500/30';
    case 'submitted': return 'bg-blue-400/15 text-blue-800 border border-blue-500/30';
    case 'reviewed': return 'bg-purple-400/15 text-purple-800 border border-purple-500/30';
    case 'finalized': return 'bg-emerald-400/15 text-emerald-800 border border-emerald-600/30';
    default: return 'bg-gray-400/15 text-gray-700 border border-gray-400/30';
  }
};

const statusLabel = (status: string) => {
  switch (status) {
    case 'draft': return 'Assigned – Not Started';
    case 'in_progress': return 'In Progress';
    case 'submitted': return 'Submitted';
    case 'reviewed': return 'Under Review';
    case 'finalized': return 'Finalized';
    default: return status;
  }
};

const AssignedAssessments = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<AssignedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch assessments assigned to this student
        const assigned = await assessmentService.getMyAssigned();

        // For each assessment, fetch the patient details
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
        setItems(enriched);
      } catch (err) {
        console.warn('Failed to fetch assigned assessments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = items.filter(({ patient }) => {
    if (!searchTerm) return true;
    const name = (patient?.full_name || patient?.name || '').toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-amber-800" />
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
              Student Workspace
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-950 mt-1">
            Assigned Clinical Assessments
          </h1>
          <p className="text-amber-900/70 text-sm mt-0.5">
            Assessments assigned to you by your supervising doctor. Complete and submit your diagnostic interpretation.
          </p>
        </div>
        <div className="shrink-0 text-center bg-amber-800/10 border border-amber-900/15 rounded-2xl px-5 py-3">
          <span className="text-3xl font-serif font-bold text-amber-950">{items.length}</span>
          <p className="text-xs text-amber-900/60 mt-0.5 font-medium">Total Assigned</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-4 shadow-sm flex items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-900/50" />
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/70 border border-amber-900/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/30 text-amber-950 placeholder:text-amber-900/40"
          />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-12 text-center">
            <ClipboardList size={48} className="mx-auto text-amber-900/30 mb-3" />
            <h3 className="text-lg font-serif font-bold text-amber-950">No assigned assessments</h3>
            <p className="text-sm text-amber-900/60 mt-1">
              Your supervising doctor has not assigned any assessments to you yet.
              Check back later or contact your clinical supervisor.
            </p>
          </div>
        ) : (
          filtered.map(({ assessment, patient }) => (
            <div
              key={assessment.id}
              className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-2xl bg-amber-800/10 border border-amber-900/20 flex items-center justify-center font-serif font-bold text-amber-900 text-lg shrink-0">
                  {(patient?.full_name || patient?.name || 'P').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif font-bold text-amber-950 text-lg">
                      {patient?.full_name || patient?.name || 'Patient'}
                    </h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusColor(assessment.status)}`}>
                      {statusLabel(assessment.status)}
                    </span>
                  </div>

                  <p className="text-xs text-amber-900/70 mt-1 flex items-center gap-1.5">
                    <User size={12} />
                    {patient?.age ? `${patient.age} yrs` : 'Age N/A'}
                    {patient?.gender ? ` • ${patient.gender}` : ''}
                    {patient?.prakriti ? ` • Prakriti: ${patient.prakriti}` : ' • Prakriti: Pending'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-amber-800/60 font-medium">
                    <span className="flex items-center space-x-1">
                      <Calendar size={13} />
                      <span>Assigned: {new Date(assessment.created_at).toLocaleDateString('en-IN')}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <FileText size={13} />
                      <span>Assessment ID: {assessment.id.substring(0, 8).toUpperCase()}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-amber-900/10">
                {patient && (
                  <button
                    onClick={() => navigate(`/student/patients/${patient.id}`)}
                    className="px-4 py-2 rounded-xl border border-amber-900/20 text-xs font-medium text-amber-900 hover:bg-amber-800/10 transition-colors"
                  >
                    View Patient
                  </button>
                )}
                {assessment.status === 'finalized' ? (
                  <button
                    onClick={() => navigate(`/student/assessments/${assessment.id}/result`)}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-emerald-50 text-xs font-medium transition-colors shadow-sm flex items-center space-x-1.5"
                  >
                    <ChevronRight size={14} />
                    <span>View Result</span>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/student/assessments/conduct?patientId=${patient?.id}&assessmentId=${assessment.id}`)}
                    className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-medium transition-colors shadow-sm flex items-center space-x-1.5"
                  >
                    <BookOpen size={14} />
                    <span>{assessment.status === 'draft' ? 'Start Assessment' : 'Continue Assessment'}</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignedAssessments;
