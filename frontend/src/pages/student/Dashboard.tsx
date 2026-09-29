import React from 'react';
import { Users, FileText, CheckCircle, BarChart3, AlertCircle } from 'lucide-react';

const StudentDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[var(--color-primary)]">Student Learning Dashboard</h1>
          <p className="text-[var(--color-foreground)]/60 text-sm mt-1">Track your clinical assessments and mentor feedback.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[var(--color-border)] shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">24</p>
            <p className="text-xs text-gray-500 font-medium">Assigned Patients</p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-[var(--color-border)] shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100 text-green-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">18</p>
            <p className="text-xs text-gray-500 font-medium">Completed Assessments</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[var(--color-border)] shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-100 text-purple-600">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">85%</p>
            <p className="text-xs text-gray-500 font-medium">Diagnostic Accuracy</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
            <span>Recent Mentor Feedback</span>
            <span className="text-xs font-medium text-[var(--color-primary)] hover:underline cursor-pointer">View All</span>
          </h3>
          <div className="space-y-4">
             <div className="p-4 rounded-xl border border-yellow-100 bg-yellow-50 relative">
               <AlertCircle size={16} className="absolute top-4 right-4 text-yellow-600" />
               <p className="text-sm font-medium text-yellow-900 mb-1">Observation Correction</p>
               <p className="text-xs text-yellow-800 leading-relaxed">
                 For Patient AE-2025, you noted Kapha dominance in skin texture, but the patient presented with severe dryness indicating Vata imbalance. Please review Charaka Vimanasthana Ch 8.
               </p>
               <div className="mt-3 text-xs text-yellow-700/60 font-medium">By Dr. Ananya Rao • 2 hrs ago</div>
             </div>

             <div className="p-4 rounded-xl border border-green-100 bg-green-50 relative">
               <CheckCircle size={16} className="absolute top-4 right-4 text-green-600" />
               <p className="text-sm font-medium text-green-900 mb-1">Excellent Interpretation</p>
               <p className="text-xs text-green-800 leading-relaxed">
                 Spot on Pitta-Vata assessment for Patient AE-2022. Your correlation of dietary habits with the presented symptoms was well reasoned.
               </p>
               <div className="mt-3 text-xs text-green-700/60 font-medium">By Dr. Sharma • 1 day ago</div>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Learning Tasks</h3>
          <div className="space-y-3">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex items-center justify-between p-3 border border-[var(--color-border)] rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                 <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 rounded-lg bg-[var(--color-background)] flex items-center justify-center text-[var(--color-primary)]">
                     <FileText size={18} />
                   </div>
                   <div>
                     <p className="text-sm font-medium text-gray-900">Submit Interpretation</p>
                     <p className="text-xs text-gray-500">Patient AE-{2040+i}</p>
                   </div>
                 </div>
                 <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[var(--color-background)] text-[var(--color-foreground)] hover:bg-[var(--color-primary)] hover:text-white transition-colors border border-[var(--color-border)] hover:border-transparent">
                   Start
                 </button>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
