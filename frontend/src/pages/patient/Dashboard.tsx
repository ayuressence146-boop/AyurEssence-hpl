import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Activity, FileText, Calendar, ArrowRight, Award, Sparkles, CheckCircle2, Loader2, Clock } from 'lucide-react';
import { authService, patientService, type AssessmentModel } from '../../services/api';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const currentUser = authService.getStoredUser();
  const [loading, setLoading] = useState(true);
  const [latestAssessment, setLatestAssessment] = useState<AssessmentModel | null>(null);
  const [patientName, setPatientName] = useState(currentUser?.full_name || 'Patient');

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      try {
        // Fetch patient's own assessments from backend
        const assessments = await patientService.getPatientAssessments(currentUser.id);
        if (assessments.length > 0) {
          setLatestAssessment(assessments[0]);
        }
      } catch (err) {
        console.warn('Failed to fetch patient data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Extract real result scores from the assessment's results array
  const result = (latestAssessment as any)?.results?.[0];
  const hasResult = !!result;
  const scores = hasResult
    ? { vata: parseFloat(result.vata_percentage), pitta: parseFloat(result.pitta_percentage), kapha: parseFloat(result.kapha_percentage), dominant: result.dominant_dosha }
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-amber-800" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-[#2b2721]">
      
      {/* Welcome Hero Banner */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-8 rounded-[28px] border border-[#2b2721]/15 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <img 
          src="/landing-pages/meng-to-sketchbook/bloom.png" 
          alt="" 
          className="absolute right-0 top-0 w-[220px] opacity-15 pointer-events-none select-none z-0" 
        />
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2b2721]/60">
            <Sparkles size={14} className="text-amber-700" />
            <span>Ayurvedic Personal Wellness Portal</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#2b2721]">Namaste, {patientName}</h1>
          {scores ? (
            <p className="text-xs text-[#2b2721]/75 leading-relaxed font-medium">
              Your primary Prakriti constitution is <span className="font-bold underline">{scores.dominant}</span>. Explore your personalized Ahara (Diet), Vihara (Lifestyle), and verified health certificates.
            </p>
          ) : (
            <p className="text-xs text-[#2b2721]/75 leading-relaxed font-medium">
              Welcome to AyurEssence! Your Prakriti assessment will be conducted by an assigned student or doctor. You'll see your results here once complete.
            </p>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Prakriti Breakdown or Empty State */}
        <div className="lg:col-span-2 space-y-6">
          
          {scores ? (
            <>
              {/* Prakriti Profile Card */}
              <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-serif font-bold text-[#2b2721]">Your Prakriti Profile</h3>
                  <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-900 border border-emerald-500/20">
                    {latestAssessment?.status === 'finalized' ? 'Verified by Doctor' : `Status: ${latestAssessment?.status || 'Pending'}`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-600/20">
                    <span className="text-xs font-bold text-amber-900 uppercase block">Vata</span>
                    <span className="text-3xl font-serif font-bold text-amber-950 block my-1">{scores.vata}%</span>
                    <p className="text-[10px] text-amber-900/70 font-medium">Air & Ether Elements</p>
                  </div>

                  <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-600/20">
                    <span className="text-xs font-bold text-orange-900 uppercase block">Pitta</span>
                    <span className="text-3xl font-serif font-bold text-orange-950 block my-1">{scores.pitta}%</span>
                    <p className="text-[10px] text-orange-900/70 font-medium">Fire & Water Elements</p>
                  </div>

                  <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-600/20">
                    <span className="text-xs font-bold text-emerald-900 uppercase block">Kapha</span>
                    <span className="text-3xl font-serif font-bold text-emerald-950 block my-1">{scores.kapha}%</span>
                    <p className="text-[10px] text-emerald-900/70 font-medium">Earth & Water Elements</p>
                  </div>
                </div>
              </div>

              {/* Guidance Summary */}
              <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-3">
                <h3 className="text-lg font-serif font-bold text-[#2b2721]">Daily Dinacharya & Diet Summary</h3>
                <div className="p-4 bg-white/70 rounded-2xl border border-[#2b2721]/10 space-y-2 text-xs">
                  <p className="text-[#2b2721]/80 leading-relaxed font-medium">
                    To balance your dominant <span className="font-bold">{scores.dominant}</span> constitution, prioritize warm cooked grains, ghee, sweet ripe fruits, and warm herbal milk. Avoid raw cold salads, iced beverages, and dry foods.
                  </p>
                  <Link 
                    to="/patient/recommendation"
                    className="mt-2 inline-flex items-center space-x-1.5 font-bold text-[#2b2721] hover:underline"
                  >
                    <span>View Full Ayurvedic Guidance</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </>
          ) : (
            /* No Assessment Yet — Empty State */
            <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-10 rounded-[28px] border border-[#2b2721]/15 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-800/10 border border-amber-800/20 flex items-center justify-center">
                <Clock size={28} className="text-amber-800" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#2b2721]">Assessment Pending</h3>
              <p className="text-xs text-[#2b2721]/75 font-medium max-w-md mx-auto leading-relaxed">
                Your Prakriti assessment has not been conducted yet. An assigned <span className="font-bold">Student</span> or <span className="font-bold">Doctor</span> will complete the assessment questionnaire and clinical observations on your behalf. Your results will appear here automatically once available.
              </p>
              {latestAssessment && (
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-800/10 rounded-xl text-xs font-bold text-amber-900">
                  <Activity size={14} />
                  <span>Assessment in progress — Status: {latestAssessment.status}</span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right 1 Col: Quick Links */}
        <div className="space-y-6">
          <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-[#2b2721]">Quick Actions</h3>

            <div className="space-y-2 text-xs">
              {scores && (
                <Link 
                  to="/patient/result"
                  className="w-full flex items-center p-3 bg-white/70 hover:bg-white rounded-xl border border-[#2b2721]/10 font-bold transition-all shadow-sm"
                >
                  <Award size={16} className="mr-3 text-amber-700" />
                  <span>View Prakriti Certificate</span>
                </Link>
              )}

              <Link 
                to="/patient/assessment"
                className="w-full flex items-center p-3 bg-white/70 hover:bg-white rounded-xl border border-[#2b2721]/10 font-bold transition-all shadow-sm"
              >
                <Heart size={16} className="mr-3 text-rose-700" />
                <span>My Assessments</span>
              </Link>

              {scores && (
                <Link 
                  to="/patient/reports"
                  className="w-full flex items-center p-3 bg-white/70 hover:bg-white rounded-xl border border-[#2b2721]/10 font-bold transition-all shadow-sm"
                >
                  <FileText size={16} className="mr-3 text-emerald-700" />
                  <span>Download Health Reports</span>
                </Link>
              )}

              <Link 
                to="/patient/timeline"
                className="w-full flex items-center p-3 bg-white/70 hover:bg-white rounded-xl border border-[#2b2721]/10 font-bold transition-all shadow-sm"
              >
                <Calendar size={16} className="mr-3 text-[#2b2721]" />
                <span>Check Health Timeline</span>
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default PatientDashboard;
