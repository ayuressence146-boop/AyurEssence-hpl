import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, ArrowRight, FileText, Heart, Sparkles, Loader2, Clock } from 'lucide-react';
import { authService, patientService, type AssessmentModel } from '../../services/api';

const PrakritiResult = () => {
  const navigate = useNavigate();
  const currentUser = authService.getStoredUser();
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<{ vata: number; pitta: number; kapha: number; dominant: string } | null>(null);
  const [assessmentStatus, setAssessmentStatus] = useState<string>('');

  useEffect(() => {
    const fetchResult = async () => {
      if (!currentUser) return;
      try {
        const assessments = await patientService.getPatientAssessments(currentUser.id);
        if (assessments.length > 0) {
          const latest = assessments[0] as any;
          setAssessmentStatus(latest.status || '');
          const result = latest.results?.[0];
          if (result) {
            setScores({
              vata: parseFloat(result.vata_percentage),
              pitta: parseFloat(result.pitta_percentage),
              kapha: parseFloat(result.kapha_percentage),
              dominant: result.dominant_dosha
            });
          }
        }
      } catch (err) {
        console.warn('Failed to fetch result:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-amber-800" />
      </div>
    );
  }

  if (!scores) {
    return (
      <div className="max-w-4xl mx-auto text-[#2b2721]">
        <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-10 rounded-[28px] border border-[#2b2721]/15 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-800/10 border border-amber-800/20 flex items-center justify-center">
            <Clock size={28} className="text-amber-800" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#2b2721]">No Result Available</h3>
          <p className="text-xs text-[#2b2721]/75 font-medium max-w-md mx-auto leading-relaxed">
            Your Prakriti result will appear here after a student or doctor completes and calculates your assessment.
          </p>
          <Link to="/patient" className="inline-flex items-center space-x-2 text-xs font-bold text-amber-800 hover:underline">
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  // Dynamic descriptions per dosha
  const doshaDescriptions: Record<string, { physical: string; mental: string }> = {
    'Vata': { physical: 'Slender build, dry cool skin, quick active movements, irregular digestion.', mental: 'Creative, quick learner, multitasker, prone to anxiety and restlessness under stress.' },
    'Pitta': { physical: 'Medium athletic build, warm flushed skin, strong sharp digestion, heat-sensitive.', mental: 'Focused, goal-driven, sharp intellect, prone to frustration and impatience under stress.' },
    'Kapha': { physical: 'Broad solid build, smooth oily skin, slow steady metabolism, strong stamina.', mental: 'Calm, compassionate, steady, prone to lethargy and attachment under stress.' },
  };
  const primary = scores.dominant.split('-')[0];
  const desc = doshaDescriptions[primary] || doshaDescriptions['Vata'];

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
            Your unique biological constitution determined by practitioner assessment.
          </p>
          {assessmentStatus && (
            <span className="inline-block text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-900 border border-emerald-500/20">
              {assessmentStatus === 'finalized' ? 'Doctor Verified' : `Status: ${assessmentStatus.replace('_', ' ')}`}
            </span>
          )}
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
            <p className="text-[#2b2721]/80 leading-relaxed font-medium">{desc.physical}</p>
          </div>

          <div className="p-4 bg-white/80 rounded-2xl border border-[#2b2721]/10 space-y-1">
            <h4 className="font-bold text-[#2b2721]">Mental Disposition</h4>
            <p className="text-[#2b2721]/80 leading-relaxed font-medium">{desc.mental}</p>
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
        <button
          onClick={() => window.print()}
          className="px-6 py-3.5 bg-white border border-[#2b2721]/20 text-[#2b2721] hover:bg-[#fcfaf4] text-xs font-bold rounded-full transition-all shadow-sm inline-flex items-center space-x-2"
        >
          <FileText size={15} />
          <span>Download PDF</span>
        </button>
      </div>

    </div>
  );
};

export default PrakritiResult;
