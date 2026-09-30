import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, HeartPulse, FileText, Sparkles, Clock, Loader2, Activity } from 'lucide-react';
import { authService, patientService } from '../../services/api';

const PatientTimeline = () => {
  const currentUser = authService.getStoredUser();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchTimeline = async () => {
      if (!currentUser) return;
      try {
        const data = await patientService.getTimeline(currentUser.id);
        setEvents(data);
      } catch (err) {
        console.warn('Failed to fetch timeline:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-amber-800" />
      </div>
    );
  }

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
        {events.length === 0 ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-800/10 border border-amber-800/20 flex items-center justify-center">
              <Clock size={28} className="text-amber-800" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#2b2721]">No Timeline Events</h3>
            <p className="text-xs text-[#2b2721]/70 font-medium max-w-sm mx-auto">
              Your health journey timeline will populate as assessments and follow-ups are completed.
            </p>
          </div>
        ) : (
          <div className="relative border-l-2 border-[#2b2721]/20 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
            {events.map((evt, idx) => {
              const Icon = evt.status === 'finalized' ? CheckCircle2 : evt.dominant_dosha ? FileText : Activity;
              const badge = evt.status === 'finalized' ? 'Finalized' : evt.status || 'In Progress';
              const description = evt.dominant_dosha
                ? `Prakriti: ${evt.dominant_dosha} — Vata ${evt.vata_percentage}%, Pitta ${evt.pitta_percentage}%, Kapha ${evt.kapha_percentage}%`
                : `Assessment status: ${evt.status}`;

              return (
                <div key={evt.assessment_id || idx} className="relative group">
                  <div className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full bg-[#2b2721] text-[#ece7dc] flex items-center justify-center shadow-md">
                    <Icon size={16} />
                  </div>

                  <div className="bg-white/80 p-5 rounded-2xl border border-[#2b2721]/12 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#2b2721]/60 flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{evt.date || 'N/A'}</span>
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#2b2721]/10 text-[#2b2721]">
                        {badge}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-[#2b2721]">
                      {evt.dominant_dosha ? `${evt.dominant_dosha} Prakriti Assessment` : 'Assessment'}
                    </h3>
                    <p className="text-xs text-[#2b2721]/75 font-medium leading-relaxed">{description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default PatientTimeline;
