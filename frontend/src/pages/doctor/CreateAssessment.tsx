import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { HeartPulse, ArrowLeft, ArrowRight, UserCheck, Stethoscope, GraduationCap } from 'lucide-react';
import { dataStore, type PatientRecord } from '../../services/dataStore';

const CreateAssessment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPatientId = searchParams.get('patientId') || '';
  
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId);
  const [evaluatorType, setEvaluatorType] = useState<'doctor' | 'student'>('doctor');

  useEffect(() => {
    const list = dataStore.getPatients();
    setPatients(list);
    if (!initialPatientId && list.length > 0) {
      setSelectedPatientId(list[0].id);
    }
  }, [initialPatientId]);

  const handleStart = () => {
    const selectedPatient = dataStore.getPatientById(selectedPatientId);
    if (!selectedPatient) return;

    // Create a new draft assessment
    const newAssessment = dataStore.saveAssessment({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      evaluatorRole: evaluatorType,
      evaluatorName: evaluatorType === 'doctor' ? 'Dr. Suresh Bhat' : 'Rahul Verma (Scholar)',
      status: 'In Progress'
    });

    navigate(`/doctor/assessments/${newAssessment.id}/questionnaire`);
  };

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

        {/* Patient Selection Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#2b2721]/80 ml-1">Select Patient Profile</label>
          <select
            value={selectedPatientId}
            onChange={e => setSelectedPatientId(e.target.value)}
            className="w-full p-3 bg-white/80 border border-[#2b2721]/20 rounded-xl text-xs text-[#2b2721] font-bold focus:outline-none focus:ring-2 focus:ring-[#2b2721]/20"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.id}) — {p.age} yrs, {p.gender} [{p.prakriti}]
              </option>
            ))}
          </select>
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
                <p className="text-[10px] opacity-75">Student Learning Case</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleStart}
          className="w-full mt-4 bg-[#2b2721] hover:bg-[#1a1714] text-[#ece7dc] py-3.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-md shadow-[#2b2721]/20 flex items-center justify-center space-x-2"
        >
          <span>Begin Questionnaire & Observations</span>
          <ArrowRight size={14} />
        </button>

      </div>

    </div>
  );
};

export default CreateAssessment;
