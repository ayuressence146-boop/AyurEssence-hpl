import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { HeartPulse, ArrowLeft, ArrowRight, CheckCircle2, Stethoscope, GraduationCap, Loader2, Users } from 'lucide-react';
import { patientService, authService, assessmentService, questionnaireService, type PatientModel, type StudentProfile } from '../../services/api';

const CreateAssessment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPatientId = searchParams.get('patientId') || '';

  const [patients, setPatients] = useState<PatientModel[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [questionnaire, setQuestionnaire] = useState<{ id: string; name: string } | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [evaluatorType, setEvaluatorType] = useState<'doctor' | 'student'>('doctor');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [assignedSuccess, setAssignedSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load patients (only real patients — filtered by backend RBAC)
        const [patientList, studentList, qList] = await Promise.all([
          patientService.listPatients(),
          authService.listStudents(),
          questionnaireService.listQuestionnaires(),
        ]);

        setPatients(patientList);
        setStudents(studentList);

        // Pick the first active questionnaire
        const activeQ = qList.find(q => q.id) || qList[0];
        if (activeQ) setQuestionnaire({ id: activeQ.id, name: activeQ.name });

        if (!initialPatientId && patientList.length > 0) {
          setSelectedPatientId(patientList[0].id);
        }
        if (studentList.length > 0) {
          setSelectedStudentId(studentList[0].id);
        }
      } catch (err) {
        console.warn('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [initialPatientId]);

  const handleStart = async () => {
    setError(null);
    const selectedPatient = patients.find(p => p.id === selectedPatientId);
    if (!selectedPatient) { setError('Please select a patient.'); return; }
    if (!questionnaire) { setError('No active questionnaire found. Please contact admin.'); return; }

    setSubmitting(true);
    try {
      if (evaluatorType === 'doctor') {
        // Doctor conducts assessment directly — create in backend, navigate to questionnaire
        const asm = await assessmentService.createAssessment({
          patient_id: selectedPatient.id,
          questionnaire_id: questionnaire.id,
        });
        navigate(`/doctor/assessments/${asm.id}/questionnaire`);
      } else {
        // Assign to student — create assessment in backend with assigned_to
        if (!selectedStudentId) { setError('Please select a student to assign this assessment to.'); setSubmitting(false); return; }
        await assessmentService.createAssessment({
          patient_id: selectedPatient.id,
          questionnaire_id: questionnaire.id,
          assigned_to: selectedStudentId,
        });
        setAssignedSuccess(true);
      }
    } catch (err: any) {
      const detail = err?.response?.data?.detail || err?.message || 'Failed to create assessment.';
      setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-3">
        <Loader2 className="w-8 h-8 text-[#2b2721] animate-spin" />
        <p className="text-xs font-semibold text-[#2b2721]/70">Loading patient roster...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-[#2b2721]">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link 
          to="/doctor" 
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#2b2721] hover:underline"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#2b2721]/60">
          Standard CCRAS Protocol
        </span>
      </div>

      {/* Main Form Card */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md rounded-[28px] border border-[#2b2721]/15 shadow-sm p-7 sm:p-9 space-y-6">
        
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2b2721]/60 mb-1">
            <HeartPulse size={14} className="text-amber-700" />
            <span>Evaluation Setup Wizard</span>
          </div>
          <h1 className="text-2.5xl font-serif font-bold text-[#2b2721]">Initiate Prakriti Assessment</h1>
          <p className="text-xs text-[#2b2721]/70 mt-1 font-medium">
            Select patient profile and clinical assessment mode to begin 15-item CCRAS Prakriti questionnaire.
          </p>
        </div>

        {assignedSuccess ? (
          <div className="p-6 bg-emerald-500/10 border border-emerald-800/20 rounded-2xl text-center space-y-3">
            <CheckCircle2 size={40} className="mx-auto text-emerald-800" />
            <h3 className="text-lg font-serif font-bold text-[#2b2721]">Assessment Assigned to Student</h3>
            <p className="text-xs text-[#2b2721]/80 max-w-md mx-auto">
              The case has been assigned to{' '}
              <strong>{students.find(s => s.id === selectedStudentId)?.full_name || 'the student'}</strong>.
              They can now view and conduct this assessment from their Student Portal dashboard.
            </p>
            <div className="pt-2 flex justify-center space-x-3">
              <button
                onClick={() => { setAssignedSuccess(false); setError(null); }}
                className="px-4 py-2 border border-[#2b2721]/20 rounded-xl text-xs font-bold text-[#2b2721] hover:bg-white/60 transition-all"
              >
                Assign Another Patient
              </button>
              <Link
                to="/doctor"
                className="px-5 py-2 bg-[#2b2721] text-[#ece7dc] rounded-xl text-xs font-bold hover:bg-[#1a1714] transition-all shadow-md inline-flex items-center space-x-1.5"
              >
                <span>Return to Dashboard</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Error */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-600/20 rounded-xl text-xs text-red-800 font-medium">
                {error}
              </div>
            )}

            {/* Questionnaire Info */}
            {questionnaire && (
              <div className="p-3 bg-amber-500/10 border border-amber-700/20 rounded-xl text-xs text-[#2b2721] font-medium">
                📋 Questionnaire: <strong>{questionnaire.name}</strong>
              </div>
            )}
            {!questionnaire && (
              <div className="p-3 bg-red-500/10 border border-red-600/20 rounded-xl text-xs text-red-800 font-medium">
                ⚠️ No active questionnaire found. Please contact the administrator to seed questionnaire data.
              </div>
            )}

            {/* Patient Selection Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#2b2721]/80 ml-1">Select Patient Profile</label>
              {patients.length === 0 ? (
                <div className="p-3 bg-amber-500/10 border border-amber-600/20 rounded-xl text-xs text-[#2b2721]">
                  No patients registered yet. <Link to="/doctor/patients/add" className="underline font-bold">Add a patient first.</Link>
                </div>
              ) : (
                <select
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                  className="w-full p-3 bg-white/80 border border-[#2b2721]/20 rounded-xl text-xs text-[#2b2721] font-bold focus:outline-none focus:ring-2 focus:ring-[#2b2721]/20"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.full_name || p.name} — {p.age ? `${p.age} yrs` : 'Age N/A'}, {p.gender || 'N/A'} [{p.prakriti || 'Pending Evaluation'}]
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Evaluator Mode Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#2b2721]/80 ml-1">Assessment Conducted By</label>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => setEvaluatorType('doctor')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${
                    evaluatorType === 'doctor' 
                      ? 'bg-[#2b2721] text-[#ece7dc] border-[#2b2721] shadow-md' 
                      : 'bg-white/70 text-[#2b2721] border-[#2b2721]/20 hover:bg-white'
                  }`}
                >
                  <Stethoscope size={20} />
                  <div>
                    <h4 className="text-xs font-bold">Practitioner Direct</h4>
                    <p className="text-[10px] opacity-75">Senior Doctor Conducted</p>
                  </div>
                </div>

                <div 
                  onClick={() => setEvaluatorType('student')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${
                    evaluatorType === 'student' 
                      ? 'bg-[#2b2721] text-[#ece7dc] border-[#2b2721] shadow-md' 
                      : 'bg-white/70 text-[#2b2721] border-[#2b2721]/20 hover:bg-white'
                  }`}
                >
                  <GraduationCap size={20} />
                  <div>
                    <h4 className="text-xs font-bold">Supervised Scholar</h4>
                    <p className="text-[10px] opacity-75">Assign to Student Doctor</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Selection — only shown when Supervised Scholar mode */}
            {evaluatorType === 'student' && (
              <div className="space-y-2 animate-fade-in">
                <label className="text-xs font-bold text-[#2b2721]/80 ml-1 flex items-center space-x-1.5">
                  <Users size={13} />
                  <span>Assign to Student Scholar</span>
                </label>
                {students.length === 0 ? (
                  <div className="p-3 bg-amber-500/10 border border-amber-600/20 rounded-xl text-xs text-[#2b2721]">
                    No student accounts registered yet. Students need to sign up with the "Student" role first.
                  </div>
                ) : (
                  <select
                    value={selectedStudentId}
                    onChange={e => setSelectedStudentId(e.target.value)}
                    className="w-full p-3 bg-white/80 border border-amber-700/40 rounded-xl text-xs text-[#2b2721] font-bold focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.full_name} {s.phone ? `— ${s.phone}` : ''}
                      </option>
                    ))}
                  </select>
                )}
                <p className="text-[10px] text-[#2b2721]/50 ml-1">
                  The assessment will appear in the selected student's portal for them to conduct and submit.
                </p>
              </div>
            )}

            <button 
              onClick={handleStart}
              disabled={patients.length === 0 || !questionnaire || submitting || (evaluatorType === 'student' && students.length === 0)}
              className="w-full mt-4 bg-[#2b2721] hover:bg-[#1a1714] disabled:opacity-50 text-[#ece7dc] py-3.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-md shadow-[#2b2721]/20 flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <><Loader2 size={14} className="animate-spin" /><span>Processing...</span></>
              ) : (
                <>
                  <span>
                    {evaluatorType === 'doctor' ? 'Begin Questionnaire & Observations' : 'Assign Assessment to Student'}
                  </span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </>
        )}

      </div>

    </div>
  );
};

export default CreateAssessment;
