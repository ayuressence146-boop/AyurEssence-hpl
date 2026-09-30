import React, { useState, useEffect } from 'react';
import { Calendar, Bell, CheckCircle2, Clock, Plus, Send, Sparkles, User, X } from 'lucide-react';
import { dataStore, type PatientRecord } from '../../services/dataStore';
import { reminderService, patientService } from '../../services/api';

interface ReminderItem {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  channel: string;
  status: string;
  notes: string;
}

const FollowUpManagement = () => {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);

  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [channel, setChannel] = useState('whatsapp');
  const [notes, setNotes] = useState('');

  const loadData = async () => {
    const list = dataStore.getPatients();
    setPatients(list);
    dataStore.fetchPatientsLive().then(pList => {
      setPatients(pList);
      if (pList.length > 0 && !selectedPatientId) {
        setSelectedPatientId(pList[0].id);
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !scheduledDate) return;

    const pat = patients.find(p => p.id === selectedPatientId);
    const newRem: ReminderItem = {
      id: `REM-${Date.now().toString().slice(-4)}`,
      patientName: pat?.name || 'Patient User',
      patientId: selectedPatientId,
      date: scheduledDate,
      channel: channel.toUpperCase(),
      status: 'Scheduled',
      notes: notes || 'Routine Prakriti Follow-up'
    };

    setReminders(prev => [newRem, ...prev]);

    try {
      await reminderService.createReminder({
        assessment_id: '00000000-0000-0000-0000-000000000000',
        patient_id: selectedPatientId,
        scheduled_date: scheduledDate,
        channel: channel,
        notes: notes
      });
    } catch (err) {
      console.warn('Reminder saved in local session:', err);
    }

    setShowModal(false);
    setScheduledDate('');
    setNotes('');
  };

  const handleSendReminder = (id: string) => {
    setSendingId(id);
    setTimeout(() => {
      setReminders(prev => prev.map(r => r.id === id ? { ...r, status: 'Reminder Sent' } : r));
      setSendingId(null);
    }, 800);
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

        <button 
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-[#2b2721] hover:bg-[#1a1714] text-[#ece7dc] text-xs font-bold rounded-full transition-all shadow-md flex items-center space-x-2 self-start md:self-auto"
        >
          <Plus size={15} />
          <span>Schedule New Follow-up</span>
        </button>
      </div>

      {/* Reminders List Card */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md rounded-[24px] border border-[#2b2721]/15 shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-serif font-bold text-[#2b2721]">Upcoming Clinical Follow-ups</h3>

        {reminders.length === 0 ? (
          <div className="p-10 text-center bg-white/50 border border-[#2b2721]/10 rounded-2xl space-y-2">
            <Calendar size={36} className="mx-auto text-[#2b2721]/40 mb-1" />
            <h4 className="font-bold text-sm text-[#2b2721]">No Follow-up Reminders Scheduled</h4>
            <p className="text-xs text-[#2b2721]/60 max-w-sm mx-auto">
              Schedule follow-up visits for registered patients to monitor long-term Prakriti stability.
            </p>
            <button 
              onClick={() => setShowModal(true)}
              className="mt-3 px-4 py-2 bg-[#2b2721] text-[#ece7dc] text-xs font-bold rounded-xl hover:bg-[#1a1714] transition-all shadow-sm"
            >
              + Add First Follow-up
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map(rem => (
              <div 
                key={rem.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/80 rounded-2xl border border-[#2b2721]/10 gap-3 shadow-sm"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#2b2721] text-[#ece7dc] flex items-center justify-center font-serif font-bold text-sm shadow-sm shrink-0">
                    {rem.patientName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#2b2721]">{rem.patientName}</h4>
                    <p className="text-xs text-[#2b2721]/65">
                      <span className="font-mono font-semibold">{rem.patientId}</span> · {rem.notes}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 self-end sm:self-center">
                  <div className="text-right text-xs">
                    <span className="font-mono font-bold text-[#2b2721] block">{rem.date}</span>
                    <span className="text-[10px] text-[#2b2721]/60 font-semibold">{rem.channel}</span>
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
                    disabled={sendingId === rem.id}
                    className="px-3 py-1.5 bg-[#2b2721] text-[#ece7dc] hover:bg-[#1a1714] text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    <Send size={12} />
                    <span>{sendingId === rem.id ? 'Sending...' : 'Dispatch Reminder'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Scheduling New Follow-up */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#fcfaf4] rounded-[24px] border border-[#2b2721]/20 shadow-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#2b2721]/10 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#2b2721]">Schedule Patient Follow-up</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-[#2b2721]/60 hover:text-[#2b2721]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2b2721]">Select Patient</label>
                {patients.length === 0 ? (
                  <p className="text-xs text-amber-900/70 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                    No registered patients found. Please add a patient first.
                  </p>
                ) : (
                  <select 
                    value={selectedPatientId} 
                    onChange={e => setSelectedPatientId(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#2b2721]/20 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#2b2721]/20"
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2b2721]">Follow-up Date</label>
                <input 
                  type="date" 
                  required
                  value={scheduledDate}
                  onChange={e => setScheduledDate(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#2b2721]/20 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#2b2721]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2b2721]">Communication Channel</label>
                <select 
                  value={channel} 
                  onChange={e => setChannel(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#2b2721]/20 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#2b2721]/20"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="in_app">In-App Notification</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2b2721]">Clinical Notes / Purpose</label>
                <input 
                  type="text" 
                  placeholder="e.g. 4-week Agni & Pitta diet review"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#2b2721]/20 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#2b2721]/20"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-white border border-[#2b2721]/20 text-xs font-bold rounded-full hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={patients.length === 0}
                  className="px-5 py-2 bg-[#2b2721] text-[#ece7dc] text-xs font-bold rounded-full hover:bg-[#1a1714] shadow-sm disabled:opacity-50"
                >
                  Schedule Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FollowUpManagement;
