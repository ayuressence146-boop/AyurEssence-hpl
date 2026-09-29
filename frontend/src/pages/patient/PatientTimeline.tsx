import React from 'react';
import { Calendar, CheckCircle2, HeartPulse, FileText, Sparkles, Clock } from 'lucide-react';

const PatientTimeline = () => {
  const events = [
    {
      date: '2026-09-28',
      title: 'Prakriti Assessment Finalized',
      description: 'Vata-Pitta Prakriti evaluation confirmed by Dr. Suresh Bhat. Ahara & Vihara guidance generated.',
      icon: FileText,
      badge: 'Completed'
    },
    {
      date: '2026-09-27',
      title: 'Nadi Pariksha Examination',
      description: 'Physical pulse rate check (78 bpm). Sarpa Gati pulse identified.',
      icon: HeartPulse,
      badge: 'Diagnosis'
    },
    {
      date: '2026-09-25',
      title: 'Initial Intake Registration',
      description: 'Registered at SDM College of Ayurveda clinical care unit.',
      icon: CheckCircle2,
      badge: 'Intake'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#2b2721]">
      
      {/* Header */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 sm:p-8 rounded-[28px] border border-[#2b2721]/15 shadow-sm space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2b2721]/60">
          <Sparkles size={14} className="text-amber-700" />
          <span>Personal Health History</span>
        </div>
        <h1 className="text-2.5xl font-serif font-bold text-[#2b2721]">My Health Journey & Timeline</h1>
        <p className="text-xs text-[#2b2721]/75 font-medium">
          Chronological record of your Prakriti assessments, diagnostic visits, and follow-up milestones.
        </p>
      </div>

      {/* Timeline */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 sm:p-8 rounded-[28px] border border-[#2b2721]/15 shadow-sm">
        <div className="relative border-l-2 border-[#2b2721]/20 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
          {events.map((evt, idx) => {
            const Icon = evt.icon;
            return (
              <div key={idx} className="relative group">
                <div className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full bg-[#2b2721] text-[#ece7dc] flex items-center justify-center shadow-md">
                  <Icon size={16} />
                </div>

                <div className="bg-white/80 p-5 rounded-2xl border border-[#2b2721]/12 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#2b2721]/60 flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>{evt.date}</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#2b2721]/10 text-[#2b2721]">
                      {evt.badge}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#2b2721]">{evt.title}</h3>
                  <p className="text-xs text-[#2b2721]/75 font-medium leading-relaxed">{evt.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default PatientTimeline;
