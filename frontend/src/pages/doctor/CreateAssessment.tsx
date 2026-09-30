import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { HeartPulse, ArrowLeft, ArrowRight, CheckCircle2, Stethoscope, GraduationCap, Loader2 } from 'lucide-react';
import { dataStore } from '../../services/dataStore';
import { patientService, type PatientModel } from '../../services/api';

const CreateAssessment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPatientId = searchParams.get('patientId') || '';
  
  const [patients, setPatients] = useState<PatientModel[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId);
  const [evaluatorType, setEvaluatorType] = useState<'doctor' | 'student'>('doctor');
  const [loading, setLoading] = useState<boolean>(true);
  const [assignedSuccess, setAssignedSuccess] = useState<boolean>(false);

  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true);
      try {
        const list = await patientService.listPatients();
        setPatients(list);
        if (!initialPatientId && list.length > 0) {
          setSelectedPatientId(list[0].id);
        }
      } catch (err) {
        console.warn('Failed to fetch patient list:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, [initialPatientId]);

  const handleStart = () => {
    const selectedPatient = patients.find(p => p.id === selectedPatientId);
    if (!selectedPatient) return;

    if (evaluatorType === 'doctor') {
      // Practitioner Direct mode: Doctor conducts assessment now
      const newAssessment = dataStore.saveAssessment({
        patientId: selectedPatient.id,
        patientName: selectedPatient.full_name || selectedPatient.name || 'Patient',
        evaluatorRole: 'doctor',
        evaluatorName: 'Attending Doctor',
        status: 'In Progress'
      });
      navigate(`/doctor/assessments/${newAssessment.id}/questionnaire`);
    } else {
      // Supervised Scholar mode: Assign to Student Workspace
      dataStore.saveAssessment({
        patientId: selectedPatient.id,
        patientName: selectedPatient.full_name || selectedPatient.name || 'Patient',
        evaluatorRole: 'student',
        evaluatorName: 'Assigned Student Scholar',
        status: 'Assigned'
      });
      setAssignedSuccess(true);
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
            <h3 className="text-lg font-serif font-bold text-[#2b2721]">Assessment Assigned to Student Workspace</h3>
            <p className="text-xs text-[#2b2721]/80 max-w-md mx-auto">
              This case has been assigned to student scholars. Students can now view this patient case under their Student Portal to conduct clinical observations.
            </p>
            <div className="pt-2 flex justify-center space-x-3">
              <button
                onClick={() => setAssignedSuccess(false)}
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
            {/* Patient Selection Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#2b2721]/80 ml-1">Select Patient Profile</label>
              {patients.length === 0 ? (
                <div className="p-3 bg-amber-500/10 border border-amber-600/20 rounded-xl text-xs text-[#2b2721]">
                  No patients registered yet. Please add a patient first.
                </div>
              ) : (
                <select
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                  className="w-full p-3 bg-white/80 border border-[#2b2721]/20 rounded-xl text-xs text-[#2b2721] font-bold focus:outline-none focus:ring-2 focus:ring-[#2b2721]/20"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.full_name || p.name} ({p.patientId || p.id.substring(0, 8)}) — {p.age ? `${p.age} yrs` : 'Age N/A'}, {p.gender || 'N/A'} [{p.prakriti || 'Pending Evaluation'}]
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

            <button 
              onClick={handleStart}
              disabled={patients.length === 0}
              className="w-full mt-4 bg-[#2b2721] hover:bg-[#1a1714] disabled:opacity-50 text-[#ece7dc] py-3.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-md shadow-[#2b2721]/20 flex items-center justify-center space-x-2"
            >
              <span>
                {evaluatorType === 'doctor' ? 'Begin Questionnaire & Observations' : 'Assign Assessment to Student Workspace'}
              </span>
              <ArrowRight size={14} />
            </button>
          </>
        )}

      </div>

    </div>
  );
};

export default CreateAssessment;
