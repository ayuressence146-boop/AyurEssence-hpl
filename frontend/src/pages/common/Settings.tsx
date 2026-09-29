import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock, Database, Globe, Shield, Save, CheckCircle2 } from 'lucide-react';

const Settings = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [autoReportPDF, setAutoReportPDF] = useState(true);
  const [studentReviewReq, setStudentReviewReq] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-800/10 text-amber-900 border border-amber-800/20">
            Platform Configuration
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-950 mt-1">
            Application & Security Settings
          </h1>
          <p className="text-amber-900/70 text-sm mt-0.5">
            Configure notification channels, clinical report preferences, and data privacy options.
          </p>
        </div>

        {saved && (
          <div className="px-4 py-2 bg-emerald-800 text-emerald-50 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm">
            <CheckCircle2 size={16} />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Notifications Section */}
        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-serif font-bold text-amber-950 border-b border-amber-900/10 pb-2 flex items-center space-x-2">
            <Bell size={18} className="text-amber-800" />
            <span>Notification Preferences</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-amber-900/10 cursor-pointer">
              <div>
                <span className="font-bold text-amber-950 text-sm block">Email Alerts</span>
                <span className="text-xs text-amber-900/70">Receive email summaries for scheduled follow-ups & reports.</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-5 h-5 accent-amber-800 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-amber-900/10 cursor-pointer">
              <div>
                <span className="font-bold text-amber-950 text-sm block">SMS Notifications</span>
                <span className="text-xs text-amber-900/70">Send SMS reminders directly to patients for consultations.</span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-5 h-5 accent-amber-800 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Clinical Protocol Settings */}
        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-serif font-bold text-amber-950 border-b border-amber-900/10 pb-2 flex items-center space-x-2">
            <Shield size={18} className="text-amber-800" />
            <span>Clinical & Student Protocols</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-amber-900/10 cursor-pointer">
              <div>
                <span className="font-bold text-amber-950 text-sm block">Auto-generate PDF Reports</span>
                <span className="text-xs text-amber-900/70">Automatically build PDF report upon completing Practitioner Observation.</span>
              </div>
              <input
                type="checkbox"
                checked={autoReportPDF}
                onChange={(e) => setAutoReportPDF(e.target.checked)}
                className="w-5 h-5 accent-amber-800 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-amber-900/10 cursor-pointer">
              <div>
                <span className="font-bold text-amber-950 text-sm block">Mandatory Senior Sign-off for Student Cases</span>
                <span className="text-xs text-amber-900/70">Require mentor approval before releasing student Prakriti reports.</span>
              </div>
              <input
                type="checkbox"
                checked={studentReviewReq}
                onChange={(e) => setStudentReviewReq(e.target.checked)}
                className="w-5 h-5 accent-amber-800 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-xl font-medium text-sm transition-all shadow-md flex items-center space-x-2"
          >
            <Save size={18} />
            <span>Save Application Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;

