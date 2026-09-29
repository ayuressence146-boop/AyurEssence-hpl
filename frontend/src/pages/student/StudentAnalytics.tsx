import React from 'react';
import { BarChart3, TrendingUp, Award, Target, CheckCircle2, Clock, BookOpen, Sparkles } from 'lucide-react';

const StudentAnalytics = () => {
  const skillBreakdown = [
    { skill: 'Nadi Pariksha (Pulse Assessment)', score: 88, color: 'bg-amber-800' },
    { skill: 'Jihva Examination (Tongue Coating)', score: 94, color: 'bg-emerald-800' },
    { skill: 'Twak & Sparsha (Skin Moisture/Temp)', score: 82, color: 'bg-purple-800' },
    { skill: 'Questionnaire & Symptoms Synthesis', score: 96, color: 'bg-amber-900' },
    { skill: 'Ahara/Vihara Recommendation Fit', score: 90, color: 'bg-teal-800' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-800/10 text-amber-900 border border-amber-800/20">
              Diagnostic Mastery Analytics
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-950 mt-1">
            Clinical Learning & Performance Metrics
          </h1>
          <p className="text-amber-900/70 text-sm mt-0.5">
            Quantitative metrics evaluating your clinical diagnostic accuracy against senior practitioner gold standards.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800/60">Overall Diagnostic Accuracy</p>
              <h3 className="text-2xl font-serif font-bold text-amber-950 mt-1">91.4%</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-800/10 flex items-center justify-center text-amber-800">
              <Target size={20} />
            </div>
          </div>
          <p className="text-xs text-emerald-800 font-medium mt-3 flex items-center">
            <TrendingUp size={14} className="mr-1" />
            <span>+3.2% increase this month</span>
          </p>
        </div>

        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800/60">Evaluated Cases</p>
              <h3 className="text-2xl font-serif font-bold text-amber-950 mt-1">24 Cases</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-800/10 flex items-center justify-center text-emerald-800">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="text-xs text-amber-800/70 mt-3">Verified across 3 Senior Vaidyas</p>
        </div>

        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800/60">Prakriti Match Rate</p>
              <h3 className="text-2xl font-serif font-bold text-amber-950 mt-1">95%</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-800/10 flex items-center justify-center text-purple-800">
              <Award size={20} />
            </div>
          </div>
          <p className="text-xs text-purple-900 font-medium mt-3">High Dual-Dosha precision</p>
        </div>

        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800/60">Avg. Time Per Case</p>
              <h3 className="text-2xl font-serif font-bold text-amber-950 mt-1">18 Mins</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-800/10 flex items-center justify-center text-blue-800">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-xs text-amber-800/70 mt-3">Optimized clinical workflow</p>
        </div>
      </div>

      {/* Main Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Mastery */}
        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-serif font-bold text-amber-950 border-b border-amber-900/10 pb-2">
            Clinical Pariksha Competency Breakdown
          </h3>

          <div className="space-y-4">
            {skillBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-amber-950">
                  <span>{item.skill}</span>
                  <span>{item.score}%</span>
                </div>
                <div className="w-full bg-amber-900/10 h-3 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Badges & Recommendations */}
        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-serif font-bold text-amber-950 border-b border-amber-900/10 pb-2">
            Clinical Milestone Achievements
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-amber-800/10 border border-amber-900/15 flex items-start space-x-3">
              <Award size={24} className="text-amber-800 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-950">Master of Trividha Pariksha</h4>
                <p className="text-xs text-amber-900/70 mt-0.5">
                  Completed 20+ comprehensive patient assessments with >90% diagnostic alignment.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-800/20 flex items-start space-x-3">
              <Sparkles size={24} className="text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-950">Precision Nadi Reader</h4>
                <p className="text-xs text-emerald-900/70 mt-0.5">
                  Identified Sarpa & Manduka Gati pulse variations across 15 consecutive patient trials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;

