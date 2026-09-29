import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, CheckCircle2, FileText, HeartPulse, Sparkles } from 'lucide-react';
import { dataStore } from '../../services/dataStore';

const DoctorPatientTimeline = () => {
  const { id } = useParams<{ id: string }>();
  const patient = dataStore.getPatientById(id || 'AE-2041') || dataStore.getPatients()[0];

  const timelineEvents = [
    {
      date: '2026-09-28',
      title: 'Prakriti Report Issued & Signature Applied',
      description: 'CCRAS-PRKRITI-001 Certificate finalized. Vata-Pitta constitutional guidance issued to patient.',
      icon: FileText,
      badge: 'Report Verified',
      color: 'bg-emerald-600 text-white'
    },
    {
      date: '2026-09-27',
      title: 'Nadi Pariksha & Practitioner Observation',
      description: 'Sarpa Gati (78 bpm), Vishamagni pattern identified. Ahara & Vihara recommendations customized.',
      icon: HeartPulse,
      badge: 'Nadi Diagnosis',
      color: 'bg-[#2b2721] text-[#ece7dc]'
    },
    {
      date: '2026-09-26',
      title: 'Supervised Student Evaluation',
      description: 'Rahul Verma (Ayurvedic Scholar) conducted 15-question Prakriti questionnaire evaluation.',
      icon: Clock,
      badge: 'Student Analysis',
      color: 'bg-amber-600 text-white'
    },
    {
      date: '2026-09-25',
      title: 'Initial Clinical Registration',
      description: 'Patient registered at SDM Ayurvedic Hospital Wing. Primary complaint: Mild insomnia & digestive irregularity.',
      icon: CheckCircle2,
      badge: 'Patient Intake',
      color: 'bg-[#2b2721] text-[#ece7dc]'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#2b2721]">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link 
          to={`/doctor/patients/${patient.id}`}
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#2b2721] hover:underline"
        >
          <ArrowLeft size={14} />
          <span>Back to Patient Dossier</span>
        </Link>
        <span className="text-xs font-mono font-bold text-[#2b2721]/70 bg-white/70 px-3 py-1 rounded-full border border-[#2b2721]/15">
          {patient.name} ({patient.id})
        </span>
      </div>

      {/* Header Card */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[28px] border border-[#2b2721]/15 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2b2721]/60 mb-1">
            <Sparkles size={14} className="text-amber-700" />
            <span>Clinical History & Progress</span>
          </div>
          <h1 className="text-2.5xl font-serif font-bold text-[#2b2721]">Chronological Patient Timeline</h1>
          <p className="text-xs text-[#2b2721]/70 mt-1 font-medium">
            Complete audit trail of diagnoses, practitioner observations, and follow-up milestones.
          </p>
        </div>
      </div>

      {/* Timeline Events */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 sm:p-8 rounded-[28px] border border-[#2b2721]/15 shadow-sm relative overflow-hidden">
        <div className="relative border-l-2 border-[#2b2721]/20 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
          {timelineEvents.map((evt, idx) => {
            const Icon = evt.icon;
            return (
              <div key={idx} className="relative group">
                
                {/* Node Icon */}
                <div className={`absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full ${evt.color} flex items-center justify-center shadow-md`}>
                  <Icon size={16} />
                </div>

                {/* Event Card */}
                <div className="bg-white/80 p-5 rounded-2xl border border-[#2b2721]/12 shadow-sm space-y-2 hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#2b2721]/60 flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>{evt.date}</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#2b2721]/10 text-[#2b2721]">
                      {evt.badge}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#2b2721]">{evt.title}</h3>
                  <p className="text-xs text-[#2b2721]/75 leading-relaxed font-medium">{evt.description}</p>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default DoctorPatientTimeline;
