import React, { useState } from 'react';
import { Calendar, Bell, CheckCircle2, Clock, Plus, Send, Sparkles, User } from 'lucide-react';
import { dataStore } from '../../services/dataStore';

const FollowUpManagement = () => {
  const [reminders, setReminders] = useState([
    { id: 'REM-1', patientName: 'Ananya Sharma', patientId: 'AE-2041', date: '2026-10-02', time: '10:30 AM', status: 'Scheduled', type: 'Prakriti Review & Agni Check' },
    { id: 'REM-2', patientName: 'Rajesh Hegde', patientId: 'AE-2042', date: '2026-10-05', time: '02:15 PM', status: 'Scheduled', type: 'Pitta Pacifying Diet Evaluation' },
    { id: 'REM-3', patientName: 'Meera Kulkarni', patientId: 'AE-2043', date: '2026-10-08', time: '11:00 AM', status: 'Reminder Sent', type: 'Kapha Weight & Metabolism Check' },
  ]);

  const [notifSentId, setNotifSentId] = useState<string | null>(null);

  const handleSendReminder = (id: string) => {
    setNotifSentId(id);
    setTimeout(() => {
      setReminders(prev => prev.map(r => r.id === id ? { ...r, status: 'Reminder Sent' } : r));
      setNotifSentId(null);
    }, 1000);
  };

  return (
    <div className="space-y-6 text-[#2b2721]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2b2721]/60 mb-1">
            <Sparkles size={14} className="text-amber-700" />
            <span>Patient Continuity & Follow-up</span>
          </div>
          <h1 className="text-2.5xl font-serif font-bold text-[#2b2721]">Follow-up & Reminder Management</h1>
          <p className="text-xs text-[#2b2721]/70 mt-1 font-medium">
            Schedule follow-up consultations, dispatch automated Prakriti reminders, and log progress milestones.
          </p>
        </div>

        <button className="px-5 py-2.5 bg-[#2b2721] hover:bg-[#1a1714] text-[#ece7dc] text-xs font-bold rounded-full transition-all shadow-md flex items-center space-x-2 self-start md:self-auto">
          <Plus size={15} />
          <span>Schedule New Follow-up</span>
        </button>
      </div>

      {/* Reminders List Card */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md rounded-[24px] border border-[#2b2721]/15 shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-serif font-bold text-[#2b2721]">Upcoming Clinical Follow-ups</h3>

        <div className="space-y-3">
          {reminders.map(rem => (
            <div 
              key={rem.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/80 rounded-2xl border border-[#2b2721]/10 gap-3"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#2b2721] text-[#ece7dc] flex items-center justify-center font-serif font-bold text-sm shadow-sm shrink-0">
                  {rem.patientName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#2b2721]">{rem.patientName}</h4>
                  <p className="text-xs text-[#2b2721]/65">
                    <span className="font-mono font-semibold">{rem.patientId}</span> · {rem.type}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 self-end sm:self-center">
                <div className="text-right text-xs">
                  <span className="font-mono font-bold text-[#2b2721] block">{rem.date}</span>
                  <span className="text-[10px] text-[#2b2721]/60">{rem.time}</span>
                </div>

                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  rem.status === 'Reminder Sent'
                    ? 'bg-emerald-500/15 text-emerald-900 border border-emerald-500/20'
                    : 'bg-amber-500/15 text-amber-900 border border-amber-500/20'
                }`}>
                  {rem.status}
                </span>

                <button 
                  onClick={() => handleSendReminder(rem.id)}
                  disabled={notifSentId === rem.id}
                  className="px-3 py-1.5 bg-[#2b2721] text-[#ece7dc] hover:bg-[#1a1714] text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Send size={12} />
                  <span>{notifSentId === rem.id ? 'Sending...' : 'Dispatch Reminder'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FollowUpManagement;
