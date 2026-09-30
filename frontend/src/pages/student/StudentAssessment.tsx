import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, CheckCircle, ArrowRight, User, Stethoscope, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { dataStore } from '../../services/dataStore';
import { patientService, questionnaireService, type QuestionModel, type PatientModel } from '../../services/api';

const StudentAssessment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedPatientId = searchParams.get('patientId');

  const [patients, setPatients] = useState<PatientModel[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(preSelectedPatientId || '');
  const [questions, setQuestions] = useState<QuestionModel[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Astavidha & Clinical Observations State
  const [nadiType, setNadiType] = useState('Sarpa (Snake / Vata)');
  const [jihvaType, setJihvaType] = useState('Sama (Coated / Agni Mandya)');
  const [twakType, setTwakType] = useState('Ruksha (Dry / Rough)');
  const [studentNotes, setStudentNotes] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Fetch live patient list
        const pList = await patientService.listPatients();
        setPatients(pList);
        if (!selectedPatientId && pList.length > 0) {
          setSelectedPatientId(pList[0].id);
        }

        // 2. Fetch questions from database table
        const qData = await questionnaireService.getQuestionnaire('default');
        if (qData && qData.questions && qData.questions.length > 0) {
          setQuestions(qData.questions);
        }
      } catch (err) {
        console.warn('Failed to load questionnaire from database:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [preSelectedPatientId]);

  // Calculate live Dosha scores based on selected database option scores
  const calculateScores = () => {
    let vataSum = 0;
    let pittaSum = 0;
    let kaphaSum = 0;

    questions.forEach(q => {
      const selectedOptionId = answers[q.id];
      if (selectedOptionId && q.options) {
        const opt = q.options.find(o => o.id === selectedOptionId);
        if (opt) {
          vataSum += Number(opt.vata_score || 0);
          pittaSum += Number(opt.pitta_score || 0);
          kaphaSum += Number(opt.kapha_score || 0);
        }
      }
    });

    const total = vataSum + pittaSum + kaphaSum;
    if (total === 0) {
      return { vata: 40, pitta: 35, kapha: 25, dominant: 'Vata-Pitta' };
    }

    const vataPct = Math.round((vataSum / total) * 100);
    const pittaPct = Math.round((pittaSum / total) * 100);
    const kaphaPct = 100 - (vataPct + pittaPct);

    let dominant = 'Vata-Pitta';
    if (vataPct >= pittaPct && vataPct >= kaphaPct) {
      dominant = pittaPct >= kaphaPct ? 'Vata-Pitta' : 'Vata-Kapha';
    } else if (pittaPct >= vataPct && pittaPct >= kaphaPct) {
      dominant = vataPct >= kaphaPct ? 'Pitta-Vata' : 'Pitta-Kapha';
    } else {
      dominant = vataPct >= pittaPct ? 'Kapha-Vata' : 'Kapha-Pitta';
    }

    return { vata: vataPct, pitta: pittaPct, kapha: kaphaPct, dominant };
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const scores = calculateScores();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const newAsm = dataStore.saveAssessment({
      patientId: selectedPatient.id,
      patientName: selectedPatient.full_name || selectedPatient.name || 'Patient',
      evaluatorRole: 'student',
      evaluatorName: 'Student Scholar',
      status: 'Submitted',
      calculatedScores: scores,
      observation: {
        nadiGati: nadiType,
        jihva: jihvaType,
        twak: twakType,
        notes: studentNotes
      }
    });

    navigate(`/student/assessments/${newAsm.id}/interpretation`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 text-amber-800 animate-spin" />
        <p className="text-sm font-medium text-amber-900/70">Loading official Ayurvedic questions from database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-800/10 text-amber-900 border border-amber-800/20">
            Clinical Training Module
          </span>
          <span className="text-xs text-amber-800/60 font-medium">Trividha &amp; Astavidha Pariksha</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-950 mt-1">
          Student Prakriti &amp; Vikriti Assessment
        </h1>
        <p className="text-amber-900/70 text-sm mt-0.5">
          Record physical observations, pulse diagnosis (Nadi), and official database questionnaire responses.
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
            <span className="text-xs font-medium text-amber-950">Database Questionnaire</span>
          </div>
          <div className="h-0.5 w-12 bg-amber-900/10" />
          <div className="flex items-center space-x-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 3 ? 'bg-amber-800 text-amber-50' : 'bg-amber-800/10 text-amber-900'
            }`}>
              3
            </span>
            <span className="text-xs font-medium text-amber-950">Clinical Signals &amp; Notes</span>
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
                    <p className="font-bold text-amber-950 text-sm">{p.full_name || p.name}</p>
                    <p className="text-xs text-amber-900/70">{p.patientId || p.id.substring(0, 8)} • {p.age ? `${p.age} yrs` : 'Age N/A'} • {p.gender || 'N/A'}</p>
                  </div>
                  {selectedPatientId === p.id && <CheckCircle size={18} className="text-amber-800" />}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={patients.length === 0}
                className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-amber-50 rounded-xl font-medium text-sm transition-all shadow-md flex items-center space-x-2"
              >
                <span>Proceed to Questionnaire</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Database Questions */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-amber-900/10 pb-3">
              <div>
                <h3 className="text-lg font-serif font-bold text-amber-950">Database Questions</h3>
                <p className="text-xs text-amber-900/70">Official Ayurvedic questions fetched directly from the database table.</p>
              </div>
              <div className="text-xs font-mono font-bold px-3 py-1 bg-amber-800/10 rounded-full text-amber-900">
                Vata: {scores.vata}% | Pitta: {scores.pitta}% | Kapha: {scores.kapha}%
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="py-8 text-center text-xs text-amber-900/70 space-y-1">
                <p className="font-bold text-sm">No questionnaire questions found in database.</p>
                <p>Please check backend API initialization.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-white/70 rounded-xl border border-amber-900/15 space-y-3">
                    <p className="font-serif font-bold text-amber-950 text-sm">
                      {idx + 1}. {q.question_text}
                    </p>

                    <div className="space-y-2">
                      {q.options?.map((opt) => (
                        <label
                          key={opt.id}
                          className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            answers[q.id] === opt.id
                              ? 'bg-amber-800/15 border-amber-800 ring-1 ring-amber-800/20'
                              : 'bg-white/50 border-amber-900/10 hover:bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question_${q.id}`}
                            value={opt.id}
                            checked={answers[q.id] === opt.id}
                            onChange={() => setAnswers({ ...answers, [q.id]: opt.id })}
                            className="mt-0.5 accent-amber-800"
                          />
                          <span className="text-xs text-amber-950 font-medium">{opt.option_text}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

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
                <span>Proceed to Astavidha Signals</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Astavidha Signals & Diagnostic Reasoning */}
        {step === 3 && (
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
                  <option value="Nirama (Clean)">Nirama (Pink &amp; Clean)</option>
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

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-amber-950">Student Diagnostic Notes</h4>
              <textarea
                rows={4}
                value={studentNotes}
                onChange={(e) => setStudentNotes(e.target.value)}
                placeholder="Explain why you assigned these Dosha ratios based on classical Ayurvedic references..."
                className="w-full p-4 bg-white/70 border border-amber-900/20 rounded-xl text-sm text-amber-950 focus:ring-2 focus:ring-amber-800/30"
              />
            </div>

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
