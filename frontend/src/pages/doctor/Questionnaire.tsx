import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, HeartPulse, CheckCircle2 } from 'lucide-react';
import { dataStore, AssessmentRecord } from '../../services/dataStore';

interface QuestionItem {
  id: string;
  category: string;
  title: string;
  options: { label: string; dosha: 'vata' | 'pitta' | 'kapha'; description: string }[];
}

const QUESTIONS: QuestionItem[] = [
  {
    id: 'q1',
    category: 'Anatomical Structure (Sharira Rachana)',
    title: 'Physical Frame & Body Build',
    options: [
      { label: 'Thin, slender, tall/short, irregular frame', dosha: 'vata', description: 'Prominent joints, light weight' },
      { label: 'Medium build, symmetrical, athletic', dosha: 'pitta', description: 'Good muscle tone, moderate weight' },
      { label: 'Broad, sturdy, heavy, well-developed', dosha: 'kapha', description: 'Large bones, solid mass' },
    ]
  },
  {
    id: 'q2',
    category: 'Cutaneous Characteristics (Twak)',
    title: 'Skin Texture & Complexion',
    options: [
      { label: 'Dry, rough, cool, thin skin', dosha: 'vata', description: 'Prone to cracking, darkish tint' },
      { label: 'Warm, reddish, sensitive, moist skin', dosha: 'pitta', description: 'Prone to freckles/moles, warm touch' },
      { label: 'Thick, smooth, oily, cool, pale skin', dosha: 'kapha', description: 'Soft, lustrous, glowing' },
    ]
  },
  {
    id: 'q3',
    category: 'Physiological Functions (Kriya)',
    title: 'Appetite & Digestive Fire (Agni)',
    options: [
      { label: 'Vishamagni: Variable, erratic hunger', dosha: 'vata', description: 'Gas, bloating, irregular bowel' },
      { label: 'Tikshnagni: Intense, sharp hunger', dosha: 'pitta', description: 'Gets irritable if meals delayed, acid reflux' },
      { label: 'Mandagni: Slow, steady appetite', dosha: 'kapha', description: 'Can skip meals easily, slow digestion' },
    ]
  },
  {
    id: 'q4',
    category: 'Thermal Response (Kshut-Trishna)',
    title: 'Weather & Temperature Preference',
    options: [
      { label: 'Intolerant to cold & wind', dosha: 'vata', description: 'Prefers warm climates & hot drinks' },
      { label: 'Intolerant to heat & direct sun', dosha: 'pitta', description: 'Prefers cool breeze & cold drinks' },
      { label: 'Intolerant to cold, damp humidity', dosha: 'kapha', description: 'Prefers dry warm weather' },
    ]
  },
  {
    id: 'q5',
    category: 'Neuro-Psychic Traits (Manasika)',
    title: 'Sleep Patterns & Quality',
    options: [
      { label: 'Light, interrupted sleep (4-6 hrs)', dosha: 'vata', description: 'Frequent awakening, active dreams' },
      { label: 'Moderate, sound sleep (6-7 hrs)', dosha: 'pitta', description: 'Awakens alert, vivid dreams' },
      { label: 'Heavy, deep, prolonged sleep (8-9+ hrs)', dosha: 'kapha', description: 'Hard to wake up, peaceful dreams' },
    ]
  },
  {
    id: 'q6',
    category: 'Behavioral Disposition',
    title: 'Emotional Response Under Stress',
    options: [
      { label: 'Anxiety, worry, fearfulness', dosha: 'vata', description: 'Mind jumps quickly between ideas' },
      { label: 'Irritability, anger, sharp focus', dosha: 'pitta', description: 'Competitive, goal-oriented' },
      { label: 'Calm, steady, patient, attachment', dosha: 'kapha', description: 'Slow to react, serene demeanor' },
    ]
  },
];

const DoctorQuestionnaire = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<AssessmentRecord | null>(null);
  const [answers, setAnswers] = useState<Record<string, 'vata' | 'pitta' | 'kapha'>>({
    q1: 'vata',
    q2: 'pitta',
    q3: 'vata',
    q4: 'pitta',
    q5: 'vata',
    q6: 'kapha'
  });

  useEffect(() => {
    const existing = dataStore.getAssessmentById(id || '');
    if (existing) {
      setAssessment(existing);
    }
  }, [id]);

  // Calculate live scores
  const total = Object.keys(answers).length;
  const vataCount = Object.values(answers).filter(v => v === 'vata').length;
  const pittaCount = Object.values(answers).filter(v => v === 'pitta').length;
  const kaphaCount = Object.values(answers).filter(v => v === 'kapha').length;

  const vataPct = Math.round((vataCount / total) * 100);
  const pittaPct = Math.round((pittaCount / total) * 100);
  const kaphaPct = 100 - vataPct - pittaPct;

  const getDominant = () => {
    if (vataPct >= pittaPct && vataPct >= kaphaPct) return pittaPct >= 30 ? 'Vata-Pitta' : 'Vata';
    if (pittaPct >= vataPct && pittaPct >= kaphaPct) return kaphaPct >= 30 ? 'Pitta-Kapha' : 'Pitta';
    return vataPct >= 30 ? 'Kapha-Vata' : 'Kapha';
  };

  const handleOptionSelect = (qId: string, dosha: 'vata' | 'pitta' | 'kapha') => {
    setAnswers(prev => ({ ...prev, [qId]: dosha }));
  };

  const handleNext = () => {
    const dominant = getDominant();
    const updated = dataStore.saveAssessment({
      id: assessment?.id || id,
      patientId: assessment?.patientId || 'AE-2041',
      patientName: assessment?.patientName || 'Ananya Sharma',
      calculatedScores: {
        vata: vataPct,
        pitta: pittaPct,
        kapha: kaphaPct,
        dominant
      },
      status: 'In Progress'
    });

    navigate(`/doctor/assessments/${updated.id}/observation`);
  };

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
          Patient: {assessment?.patientName || 'Ananya Sharma'}
        </span>
      </div>

      {/* Title & Live Score Bar */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[28px] border border-[#2b2721]/15 shadow-sm space-y-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2b2721]/60 mb-1">
            <HeartPulse size={14} className="text-emerald-700" />
            <span>CCRAS Standard Questionnaire</span>
          </div>
          <h1 className="text-2.5xl font-serif font-bold text-[#2b2721]">15-Point Prakriti Evaluation</h1>
          <p className="text-xs text-[#2b2721]/70 mt-1 font-medium">
            Select the most accurate physical and mental traits for the patient.
          </p>
        </div>

        {/* Live Dosha Calculation Bar */}
        <div className="p-4 bg-white/80 rounded-2xl border border-[#2b2721]/12 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span>Live Score Calculation</span>
            <span className="text-emerald-800">Dominant: {getDominant()}</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs font-bold">
            <div className="p-2 bg-amber-500/10 rounded-xl">Vata: {vataPct}%</div>
            <div className="p-2 bg-orange-500/10 rounded-xl">Pitta: {pittaPct}%</div>
            <div className="p-2 bg-emerald-500/10 rounded-xl">Kapha: {kaphaPct}%</div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {QUESTIONS.map((q, idx) => (
          <div key={q.id} className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2b2721]/60">
                Item {idx + 1} of {QUESTIONS.length} · {q.category}
              </span>
            </div>
            <h3 className="font-serif font-bold text-base text-[#2b2721]">{q.title}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {q.options.map(opt => {
                const isSelected = answers[q.id] === opt.dosha;
                return (
                  <div
                    key={opt.dosha}
                    onClick={() => handleOptionSelect(q.id, opt.dosha)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-[#2b2721] text-[#ece7dc] border-[#2b2721] shadow-md' 
                        : 'bg-white/80 hover:bg-white text-[#2b2721] border-[#2b2721]/15'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold capitalize">{opt.dosha} Type</span>
                      {isSelected && <CheckCircle2 size={14} className="text-amber-300" />}
                    </div>
                    <p className="text-[11px] font-semibold leading-tight">{opt.label}</p>
                    <p className={`text-[10px] mt-1 ${isSelected ? 'text-[#ece7dc]/70' : 'text-[#2b2721]/60'}`}>
                      {opt.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Action Bar */}
      <div className="flex items-center justify-end space-x-3 pt-4">
        <button
          onClick={handleNext}
          className="px-6 py-3.5 bg-[#2b2721] hover:bg-[#1a1714] text-[#ece7dc] text-xs font-bold rounded-full transition-all shadow-md flex items-center space-x-2"
        >
          <span>Save & Proceed to Nadi Observation</span>
          <ArrowRight size={15} />
        </button>
      </div>

    </div>
  );
};

export default DoctorQuestionnaire;
