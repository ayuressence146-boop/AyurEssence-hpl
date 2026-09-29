import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Heart, CheckCircle2 } from 'lucide-react';
import { dataStore } from '../../services/dataStore';

const QUESTIONS = [
  {
    id: 'q1',
    title: 'Physical Frame & Body Build',
    options: [
      { label: 'Thin, slender, irregular frame', dosha: 'vata' as const },
      { label: 'Medium build, athletic, symmetrical', dosha: 'pitta' as const },
      { label: 'Broad, heavy, solid build', dosha: 'kapha' as const },
    ]
  },
  {
    id: 'q2',
    title: 'Skin Tendency & Touch',
    options: [
      { label: 'Dry, rough, cool skin', dosha: 'vata' as const },
      { label: 'Warm, reddish, sensitive', dosha: 'pitta' as const },
      { label: 'Thick, smooth, oily, cool', dosha: 'kapha' as const },
    ]
  },
  {
    id: 'q3',
    title: 'Appetite & Digestion',
    options: [
      { label: 'Irregular & unpredictable hunger', dosha: 'vata' as const },
      { label: 'Strong & sharp hunger, gets irritable if late', dosha: 'pitta' as const },
      { label: 'Slow & steady appetite', dosha: 'kapha' as const },
    ]
  },
  {
    id: 'q4',
    title: 'Sleep Habits',
    options: [
      { label: 'Light sleep, easily awakened', dosha: 'vata' as const },
      { label: 'Moderate, sound sleep', dosha: 'pitta' as const },
      { label: 'Deep, heavy, prolonged sleep', dosha: 'kapha' as const },
    ]
  },
];

const PatientQuestionnaire = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, 'vata' | 'pitta' | 'kapha'>>({
    q1: 'vata',
    q2: 'pitta',
    q3: 'vata',
    q4: 'kapha'
  });

  const total = Object.keys(answers).length;
  const vataCount = Object.values(answers).filter(v => v === 'vata').length;
  const pittaCount = Object.values(answers).filter(v => v === 'pitta').length;
  const kaphaCount = Object.values(answers).filter(v => v === 'kapha').length;

  const vataPct = Math.round((vataCount / total) * 100);
  const pittaPct = Math.round((pittaCount / total) * 100);
  const kaphaPct = 100 - vataPct - pittaPct;

  const getDominant = () => {
    if (vataPct >= pittaPct && vataPct >= kaphaPct) return 'Vata-Pitta';
    if (pittaPct >= vataPct && pittaPct >= kaphaPct) return 'Pitta-Kapha';
    return 'Kapha-Vata';
  };

  const handleFinish = () => {
    const patient = dataStore.getPatients()[0];
    const dominant = getDominant();
    dataStore.saveAssessment({
      patientId: patient.id,
      patientName: patient.name,
      evaluatorRole: 'patient',
      evaluatorName: patient.name,
      status: 'Reviewed',
      calculatedScores: {
        vata: vataPct,
        pitta: pittaPct,
        kapha: kaphaPct,
        dominant
      }
    });

    navigate('/patient/result');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-[#2b2721]">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link 
          to="/patient/assessment" 
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#2b2721] hover:underline"
        >
          <ArrowLeft size={14} />
          <span>Back to Assessment Portal</span>
        </Link>
        <span className="text-xs font-mono font-bold text-[#2b2721]/70 bg-white/70 px-3 py-1 rounded-full border border-[#2b2721]/15">
          Self-Guided Evaluation
        </span>
      </div>

      {/* Hero */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[28px] border border-[#2b2721]/15 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2b2721]/60">
          <Heart size={14} className="text-emerald-700" />
          <span>Prakriti Diagnostic Questionnaire</span>
        </div>
        <h1 className="text-2.5xl font-serif font-bold text-[#2b2721]">Discover Your Constitutional Dosha</h1>
        <p className="text-xs text-[#2b2721]/75 font-medium">
          Select the options that best describe your natural physical and mental traits.
        </p>

        {/* Live Gauges */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs font-bold pt-2">
          <div className="p-2.5 bg-amber-500/10 rounded-xl">Vata: {vataPct}%</div>
          <div className="p-2.5 bg-orange-500/10 rounded-xl">Pitta: {pittaPct}%</div>
          <div className="p-2.5 bg-emerald-500/10 rounded-xl">Kapha: {kaphaPct}%</div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {QUESTIONS.map((q, idx) => (
          <div key={q.id} className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2b2721]/60">
              Question {idx + 1} of {QUESTIONS.length}
            </span>
            <h3 className="font-serif font-bold text-base text-[#2b2721]">{q.title}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {q.options.map(opt => {
                const isSelected = answers[q.id] === opt.dosha;
                return (
                  <div
                    key={opt.dosha}
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.dosha }))}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-[#2b2721] text-[#ece7dc] border-[#2b2721] shadow-md' 
                        : 'bg-white/80 hover:bg-white text-[#2b2721] border-[#2b2721]/15'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold capitalize">{opt.dosha} Trait</span>
                      {isSelected && <CheckCircle2 size={14} className="text-amber-300" />}
                    </div>
                    <p className="text-[11px] font-medium leading-tight">{opt.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Complete Button */}
      <div className="flex items-center justify-end pt-4">
        <button
          onClick={handleFinish}
          className="px-6 py-3.5 bg-[#2b2721] hover:bg-[#1a1714] text-[#ece7dc] text-xs font-bold rounded-full transition-all shadow-md flex items-center space-x-2"
        >
          <span>Calculate My Prakriti & View Results</span>
          <ArrowRight size={15} />
        </button>
      </div>

    </div>
  );
};

export default PatientQuestionnaire;
