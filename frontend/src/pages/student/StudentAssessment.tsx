import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, CheckCircle, ArrowRight, User, Stethoscope, Sparkles, AlertCircle } from 'lucide-react';
import { getPatients, saveAssessment, Patient } from '../../services/dataStore';

const StudentAssessment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedPatientId = searchParams.get('patientId');

  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(preSelectedPatientId || '');
  const [step, setStep] = useState<number>(1);

  // Assessment State
  const [vataScore, setVataScore] = useState(40);
  const [pittaScore, setPittaScore] = useState(35);
  const [kaphaScore, setKaphaScore] = useState(25);
  const [nadiType, setNadiType] = useState('Sarpa (Snake / Vata)');
  const [jihvaType, setJihvaType] = useState('Sama (Coated / Agni Mandya)');
  const [twakType, setTwakType] = useState('Ruksha (Dry / Rough)');
  const [studentNotes, setStudentNotes] = useState('');

  useEffect(() => {
    const list = getPatients();
    setPatients(list);
    if (!selectedPatientId && list.length > 0) {
      setSelectedPatientId(list[0].id);
    }
  }, [preSelectedPatientId]);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const newAsm = {
      id: `asm-${Date.now()}`,
      patientId: selectedPatient.id,
      date: new Date().toISOString().split('T')[0],
      prakriti: vataScore > pittaScore && vataScore > kaphaScore ? 'Vata-Pitta' : 'Pitta-Kapha',
      vataScore,
      pittaScore,
      kaphaScore,
      status: 'Completed' as const,
      practitionerNotes: studentNotes || 'Student diagnostic evaluation submitted for review.',
      recommendations: [
        'Avoid cold dry raw foods during early morning',
        'Incorporate Warm Sesame Oil Abhyanga',
        'Triphala Churna at bedtime with warm water'
      ]
    };

    saveAssessment(newAsm);
    navigate(`/student/assessments/${newAsm.id}/interpretation`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-800/10 text-amber-900 border border-amber-800/20">
            Clinical Training Module
          </span>
          <span className="text-xs text-amber-800/60 font-medium">Trividha & Astavidha Pariksha</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-950 mt-1">
          Student Prakriti & Vikriti Assessment
        </h1>
        <p className="text-amber-900/70 text-sm mt-0.5">
          Record physical observations, pulse diagnosis (Nadi), and patient questionnaire responses.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-amber-900/10 pb-4">
          <div className="flex items-center space-x-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 1 ? 'bg-amber-800 text-amber-50' : 'bg-amber-800/10 text-amber-900'
            }`}>
              1
            </span>
            <span className="text-xs font-medium text-amber-950">Patient Selection</span>
          </div>
          <div className="h-0.5 w-12 bg-amber-900/10" />
          <div className="flex items-center space-x-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 2 ? 'bg-amber-800 text-amber-50' : 'bg-amber-800/10 text-amber-900'
            }`}>
              2
            </span>
            <span className="text-xs font-medium text-amber-950">Clinical Observation</span>
          </div>
          <div className="h-0.5 w-12 bg-amber-900/10" />
          <div className="flex items-center space-x-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 3 ? 'bg-amber-800 text-amber-50' : 'bg-amber-800/10 text-amber-900'
            }`}>
              3
            </span>
            <span className="text-xs font-medium text-amber-950">Interpretation</span>
          </div>
        </div>

        {/* Step 1: Patient Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-amber-950">Select Patient Case</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {patients.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedPatientId === p.id
                      ? 'bg-amber-800/15 border-amber-800 ring-2 ring-amber-800/20'
                      : 'bg-white/60 border-amber-900/10 hover:border-amber-900/30'
                  }`}
                >
                  <div>
                    <p className="font-bold text-amber-950 text-sm">{p.name}</p>
                    <p className="text-xs text-amber-900/70">{p.patientId} • {p.age} yrs • {p.gender}</p>
                  </div>
                  {selectedPatientId === p.id && <CheckCircle size={18} className="text-amber-800" />}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-xl font-medium text-sm transition-all shadow-md flex items-center space-x-2"
              >
                <span>Proceed to Clinical Observation</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Clinical Observation */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-serif font-bold text-amber-950">Astavidha Pariksha (8 Clinical Signals)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1.5">Nadi Pariksha (Pulse)</label>
                <select
                  value={nadiType}
                  onChange={(e) => setNadiType(e.target.value)}
                  className="w-full px-3 py-2 bg-white/70 border border-amber-900/20 rounded-xl text-sm text-amber-950 focus:ring-2 focus:ring-amber-800/30"
                >
                  <option value="Sarpa (Snake / Vata)">Sarpa Gati (Irregular/Fast - Vata)</option>
                  <option value="Manduka (Frog / Pitta)">Manduka Gati (Jumping/Warm - Pitta)</option>
                  <option value="Hamsa (Swan / Kapha)">Hamsa Gati (Slow/Smooth - Kapha)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1.5">Jihva (Tongue Examination)</label>
                <select
                  value={jihvaType}
                  onChange={(e) => setJihvaType(e.target.value)}
                  className="w-full px-3 py-2 bg-white/70 border border-amber-900/20 rounded-xl text-sm text-amber-950 focus:ring-2 focus:ring-amber-800/30"
                >
                  <option value="Sama (Coated / Agni Mandya)">Sama (Thick Coating / Ama Present)</option>
                  <option value="Nirama (Clean)">Nirama (Pink & Clean)</option>
                  <option value="Rakta (Red / Pitta)">Rakta (Red / Inflamed)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1.5">Twak (Skin Texture)</label>
                <select
                  value={twakType}
                  onChange={(e) => setTwakType(e.target.value)}
                  className="w-full px-3 py-2 bg-white/70 border border-amber-900/20 rounded-xl text-sm text-amber-950 focus:ring-2 focus:ring-amber-800/30"
                >
                  <option value="Ruksha (Dry / Rough)">Ruksha (Dry / Rough - Vata)</option>
                  <option value="Ushna (Warm / Red)">Ushna (Warm / Moist - Pitta)</option>
                  <option value="Snigdha (Oily / Soft)">Snigdha (Oily / Soft - Kapha)</option>
                </select>
              </div>
            </div>

            {/* Dosha Scores Input sliders */}
            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-bold text-amber-950">Estimated Dosha Ratio (%)</h4>
              
              <div>
                <div className="flex justify-between text-xs font-semibold text-amber-900 mb-1">
                  <span>Vata Prakriti Score</span>
                  <span>{vataScore}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={vataScore}
                  onChange={(e) => setVataScore(Number(e.target.value))}
                  className="w-full accent-amber-800"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-amber-900 mb-1">
                  <span>Pitta Prakriti Score</span>
                  <span>{pittaScore}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={pittaScore}
                  onChange={(e) => setPittaScore(Number(e.target.value))}
                  className="w-full accent-amber-800"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-amber-900 mb-1">
                  <span>Kapha Prakriti Score</span>
                  <span>{kaphaScore}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={kaphaScore}
                  onChange={(e) => setKaphaScore(Number(e.target.value))}
                  className="w-full accent-amber-800"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-amber-900/20 text-xs font-medium text-amber-900 rounded-xl"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-xl font-medium text-sm transition-all shadow-md flex items-center space-x-2"
              >
                <span>Proceed to Diagnostic Notes</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Diagnostic Reasoning & Submit */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-amber-950">Student Diagnostic Notes</h3>
            <p className="text-xs text-amber-900/70">
              Explain why you assigned these Dosha ratios based on classical Ayurvedic references.
            </p>

            <textarea
              rows={5}
              value={studentNotes}
              onChange={(e) => setStudentNotes(e.target.value)}
              placeholder="e.g. Patient exhibits Sarpa Nadi with dryness in skin indicating Vata aggravation. Digestion shows Agni Mandya with Sama Jihva..."
              className="w-full p-4 bg-white/70 border border-amber-900/20 rounded-xl text-sm text-amber-950 focus:ring-2 focus:ring-amber-800/30"
            />

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-amber-900/20 text-xs font-medium text-amber-900 rounded-xl"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-xl font-medium text-sm transition-all shadow-md flex items-center space-x-2"
              >
                <CheckCircle size={18} />
                <span>Submit Student Assessment</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default StudentAssessment;

