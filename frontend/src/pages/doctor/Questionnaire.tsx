import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, HeartPulse, CheckCircle2, Loader2 } from 'lucide-react';
import { dataStore, type AssessmentRecord } from '../../services/dataStore';
import { questionnaireService, type QuestionModel } from '../../services/api';

const DoctorQuestionnaire = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<AssessmentRecord | null>(null);
  const [questions, setQuestions] = useState<QuestionModel[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const existing = dataStore.getAssessmentById(id || '');
        if (existing) {
          setAssessment(existing);
        }

        // Fetch live database questions
        const qData = await questionnaireService.getQuestionnaire('default');
        if (qData && qData.questions && qData.questions.length > 0) {
          setQuestions(qData.questions);
          // Set initial answer state to first option of each question
          const initialAns: Record<string, string> = {};
          qData.questions.forEach(q => {
            if (q.options && q.options.length > 0) {
              initialAns[q.id] = q.options[0].id;
            }
          });
          setAnswers(initialAns);
        }
      } catch (err) {
        console.warn('Failed to load questionnaire from database:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Calculate live scores from database options
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
    if (total === 0) return { vata: 40, pitta: 35, kapha: 25, dominant: 'Vata-Pitta' };

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

  const scores = calculateScores();

  const handleNext = () => {
    const updated = dataStore.saveAssessment({
      id: assessment?.id || id,
      patientId: assessment?.patientId || 'P-001',
      patientName: assessment?.patientName || 'Patient',
      calculatedScores: {
        vata: scores.vata,
        pitta: scores.pitta,
        kapha: scores.kapha,
        dominant: scores.dominant
      },
      status: 'In Progress'
    });

    navigate(`/doctor/assessments/${updated.id}/observation`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 text-[#2b2721] animate-spin" />
        <p className="text-xs font-semibold text-[#2b2721]/70">Fetching official CCRAS questions from database...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#2b2721]">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <Link 
          to="/doctor/assessments/create" 
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#2b2721] hover:underline"
        >
          <ArrowLeft size={14} />
          <span>Change Assessment Setup</span>
        </Link>
        <span className="text-xs font-mono font-bold text-[#2b2721]/70 bg-white/70 px-3 py-1 rounded-full border border-[#2b2721]/15">
          Patient: {assessment?.patientName || 'Patient'}
        </span>
      </div>

      {/* Title & Live Score Bar */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[28px] border border-[#2b2721]/15 shadow-sm space-y-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2b2721]/60 mb-1">
            <HeartPulse size={14} className="text-amber-700" />
            <span>CCRAS Clinical Questionnaire</span>
          </div>
          <h1 className="text-2.5xl font-serif font-bold text-[#2b2721]">Deha Prakriti Trait Analysis</h1>
          <p className="text-xs text-[#2b2721]/70 mt-1 font-medium">
            Evaluate classical anatomical, physiological, and behavioral parameters stored in the database.
          </p>
        </div>

        {/* Live Score Ticker */}
        <div className="p-4 bg-white/80 rounded-2xl border border-[#2b2721]/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="text-xs font-bold text-[#2b2721]">
              Estimated Dominance: <span className="font-serif text-amber-900 text-sm">{scores.dominant}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono font-bold">
            <span className="text-amber-800">Vata: {scores.vata}%</span>
            <span className="text-red-800">Pitta: {scores.pitta}%</span>
            <span className="text-emerald-800">Kapha: {scores.kapha}%</span>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-3">
            <h3 className="text-sm font-serif font-bold text-[#2b2721]">
              {idx + 1}. {q.question_text}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {q.options?.map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setAnswers({ ...answers, [q.id]: opt.id })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    answers[q.id] === opt.id
                      ? 'bg-[#2b2721] text-[#ece7dc] border-[#2b2721] shadow-md'
                      : 'bg-white/70 text-[#2b2721] border-[#2b2721]/15 hover:bg-white'
                  }`}
                >
                  <p className="text-xs font-bold mb-1">{opt.option_text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-[#2b2721] hover:bg-[#1a1714] text-[#ece7dc] text-xs font-bold tracking-widest uppercase rounded-full shadow-md transition-all flex items-center space-x-2"
        >
          <span>Proceed to Practitioner Observations</span>
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
};

export default DoctorQuestionnaire;
