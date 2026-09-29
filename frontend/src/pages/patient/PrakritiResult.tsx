import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, ArrowRight, FileText, Heart, Sparkles } from 'lucide-react';
import { dataStore } from '../../services/dataStore';

const PrakritiResult = () => {
  const navigate = useNavigate();
  const assessment = dataStore.getAssessments()[0];
  const scores = assessment?.calculatedScores || { vata: 48, pitta: 35, kapha: 17, dominant: 'Vata-Pitta' };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#2b2721]">
      
      {/* Header */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 sm:p-8 rounded-[28px] border border-[#2b2721]/15 shadow-sm text-center relative overflow-hidden space-y-4">
        <img 
          src="/landing-pages/meng-to-sketchbook/bloom.png" 
          alt="" 
          className="absolute right-4 top-4 w-[160px] opacity-15 pointer-events-none select-none z-0" 
        />

        <div className="relative z-10 max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#2b2721]/10 text-[#2b2721] text-xs font-bold uppercase tracking-wider">
            <Award size={14} />
            <span>Prakriti Constitutional Result</span>
          </div>
          
          <h1 className="text-3.5xl font-serif font-bold text-[#2b2721]">{scores.dominant} Prakriti</h1>
          <p className="text-xs text-[#2b2721]/75 font-medium">
            Your unique biological constitution combines <span className="font-bold">Air (Vata)</span> & <span className="font-bold">Fire (Pitta)</span> qualities.
          </p>
        </div>

        {/* Dosha Breakdown Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 relative z-10">
          <div className="p-5 bg-amber-500/10 rounded-2xl border border-amber-600/20 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Vata Dosha</span>
            <span className="text-4xl font-serif font-bold text-amber-950 block my-2">{scores.vata}%</span>
            <p className="text-[11px] text-amber-900/80 font-medium">Light, Mobile, Creative, Fast thinker</p>
          </div>

          <div className="p-5 bg-orange-500/10 rounded-2xl border border-orange-600/20 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-900">Pitta Dosha</span>
            <span className="text-4xl font-serif font-bold text-orange-950 block my-2">{scores.pitta}%</span>
            <p className="text-[11px] text-orange-900/80 font-medium">Focused, Sharp digestion, Warm body</p>
          </div>

          <div className="p-5 bg-emerald-500/10 rounded-2xl border border-emerald-600/20 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">Kapha Dosha</span>
            <span className="text-4xl font-serif font-bold text-emerald-950 block my-2">{scores.kapha}%</span>
            <p className="text-[11px] text-emerald-900/80 font-medium">Calm, Stable, Strong endurance</p>
          </div>
        </div>
      </div>

      {/* Trait Insights */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-4">
        <h3 className="text-lg font-serif font-bold text-[#2b2721]">Key Characteristics of {scores.dominant}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-white/80 rounded-2xl border border-[#2b2721]/10 space-y-1">
            <h4 className="font-bold text-[#2b2721]">Physical Attributes</h4>
            <p className="text-[#2b2721]/80 leading-relaxed font-medium">
              Slender to medium build, quick active movements, warm skin touch with sensitive digestion.
            </p>
          </div>

          <div className="p-4 bg-white/80 rounded-2xl border border-[#2b2721]/10 space-y-1">
            <h4 className="font-bold text-[#2b2721]">Mental Disposition</h4>
            <p className="text-[#2b2721]/80 leading-relaxed font-medium">
              Creative, quick learner, goal-driven focus, prone to restlessness under stress.
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4">
        <Link 
          to="/patient/recommendation"
          className="px-6 py-3.5 bg-[#2b2721] hover:bg-[#1a1714] text-[#ece7dc] text-xs font-bold rounded-full transition-all shadow-md inline-flex items-center space-x-2"
        >
          <span>View My Ayurvedic Recommendations</span>
          <ArrowRight size={15} />
        </Link>
      </div>

    </div>
  );
};

export default PrakritiResult;
