import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, ArrowRight, BookOpen, CheckCircle, BarChart2 } from 'lucide-react';
import { getAssessmentById, getPatients, type Assessment, type Patient } from '../../services/dataStore';

const StudentInterpretation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (id) {
      const asm = getAssessmentById(id);
      if (asm) {
        setAssessment(asm);
        const patients = getPatients();
        const p = patients.find(item => item.id === asm.patientId);
        setPatient(p || patients[0]);
      } else {
        const patients = getPatients();
        const asmList = getAssessmentById('asm-101');
        setAssessment(asmList || null);
        setPatient(patients[0] || null);
      }
    }
  }, [id]);

  if (!assessment || !patient) {
    return (
      <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-12 text-center">
        <BookOpen size={48} className="mx-auto text-amber-900/30 mb-3" />
        <h2 className="text-xl font-serif font-bold text-amber-950">Assessment Record Not Found</h2>
        <button
          onClick={() => navigate('/student/tasks')}
          className="mt-4 px-4 py-2 bg-amber-800 text-amber-50 rounded-xl text-sm font-medium"
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-800/10 text-amber-900 border border-amber-800/20">
              Student Diagnostic Interpretation
            </span>
            <span className="text-xs text-amber-800/60 font-mono">ID: {assessment.id}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-950 mt-1">
            Prakriti Diagnosis Breakdown for {patient.name}
          </h1>
          <p className="text-amber-900/70 text-sm mt-0.5">
            Evaluated by Student Scholar • Submitted for Vaidya Review
          </p>
        </div>

        <button
          onClick={() => navigate(`/student/assessments/${assessment.id}/comparison`)}
          className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-xl font-medium text-sm transition-all shadow-md flex items-center space-x-2"
        >
          <BarChart2 size={18} />
          <span>View Doctor Comparison</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Dosha Pie / Bar Breakdown */}
        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-serif font-bold text-amber-950 border-b border-amber-900/10 pb-2">
            Derived Prakriti Distribution
          </h3>

          <div className="text-center p-4 bg-amber-800/10 rounded-2xl border border-amber-900/15">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Primary Phenotype</span>
            <h2 className="text-3xl font-serif font-bold text-amber-950 mt-1">{assessment.calculatedScores?.dominant || 'Vata-Pitta'}</h2>
            <span className="text-xs text-amber-900/70 block mt-1">Dvandvaja (Dual-Dosha Dominance)</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-amber-950 mb-1">
                <span>Vata Dosha</span>
                <span>{assessment.calculatedScores?.vata || 40}%</span>
              </div>
              <div className="w-full bg-amber-900/10 h-3 rounded-full overflow-hidden">
                <div className="bg-amber-700 h-full rounded-full" style={{ width: `${assessment.calculatedScores?.vata || 40}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-amber-950 mb-1">
                <span>Pitta Dosha</span>
                <span>{assessment.calculatedScores?.pitta || 35}%</span>
              </div>
              <div className="w-full bg-amber-900/10 h-3 rounded-full overflow-hidden">
                <div className="bg-red-700 h-full rounded-full" style={{ width: `${assessment.calculatedScores?.pitta || 35}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-amber-950 mb-1">
                <span>Kapha Dosha</span>
                <span>{assessment.calculatedScores?.kapha || 25}%</span>
              </div>
              <div className="w-full bg-amber-900/10 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-700 h-full rounded-full" style={{ width: `${assessment.calculatedScores?.kapha || 25}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Reasoning & Notes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-serif font-bold text-amber-950 border-b border-amber-900/10 pb-2 flex items-center space-x-2">
              <BookOpen size={18} className="text-amber-800" />
              <span>Student Clinical Rationale</span>
            </h3>

            <div className="bg-white/60 p-4 rounded-xl border border-amber-900/10 text-sm text-amber-950 leading-relaxed">
              {'Patient demonstrated classic Vata-Pitta symptoms including irregular digestion, dry skin, and heightened heat sensitivity in afternoon.'}
            </div>

            <h4 className="text-sm font-bold text-amber-950 mt-4">Formulated Ahara & Vihara Plan</h4>
            <div className="space-y-2">
              {(assessment.recommendations?.lifestyle || ['Triphala Churna at bedtime with warm water']).map((rec: string, i: number) => (
                <div key={i} className="flex items-center space-x-3 p-3 bg-white/40 border border-amber-900/10 rounded-xl text-xs text-amber-950">
                  <CheckCircle size={16} className="text-amber-800 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInterpretation;

