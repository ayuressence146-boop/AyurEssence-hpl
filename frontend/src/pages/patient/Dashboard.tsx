import React from 'react';
import { FileText, ClipboardList, Clock, ArrowRight } from 'lucide-react';

const PatientDashboard = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-[var(--color-primary)] text-white rounded-2xl p-8 relative overflow-hidden shadow-lg shadow-[var(--color-primary)]/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-serif font-bold mb-2">Hello, Sarah</h1>
          <p className="text-white/80 max-w-md text-sm leading-relaxed">
            Welcome to your Ayurvedic wellness journey. Your latest assessment is ready for review.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[var(--color-border)] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Your Prakriti Profile</h3>
              <span className="text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-3 py-1 rounded-full">
                Updated Oct 12, 2026
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* Mock Donut Chart area */}
              <div className="w-32 h-32 rounded-full border-[12px] border-[var(--color-pitta)] border-l-[var(--color-vata)] border-t-[var(--color-vata)] flex items-center justify-center relative">
                 <div className="text-center">
                   <p className="text-xs text-gray-500 font-medium">Dominant</p>
                   <p className="text-sm font-bold text-[var(--color-primary)]">Vata-Pitta</p>
                 </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Vata</span>
                    <span className="font-bold text-[var(--color-primary)]">40%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-[var(--color-vata)] h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Pitta</span>
                    <span className="font-bold text-[var(--color-primary)]">35%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-[var(--color-pitta)] h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Kapha</span>
                    <span className="font-bold text-[var(--color-primary)]">25%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-[var(--color-kapha)] h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[var(--color-border)] shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor's Recommendations</h3>
            <div className="p-4 bg-[var(--color-sand)] rounded-xl border border-[var(--color-border)]">
              <p className="text-sm text-gray-700 leading-relaxed">
                Based on your Vata-Pitta dominance, prioritize warm, grounding foods. Establish a regular daily routine (Dinacharya) to balance Vata, and avoid excessive spicy foods which may aggravate Pitta.
              </p>
              <button className="mt-4 flex items-center text-sm font-medium text-[var(--color-primary)] hover:underline">
                View Full Report <ArrowRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[var(--color-border)] shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h3>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <Clock className="text-blue-600 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-medium text-blue-900">Follow-up Assessment</p>
                <p className="text-xs text-blue-700 mt-1">Scheduled in 2 weeks.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-[var(--color-border)] shadow-sm">
             <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
             <div className="space-y-2">
               <button className="w-full flex items-center p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                 <ClipboardList size={16} className="mr-3 text-gray-400" />
                 Start Questionnaire
               </button>
               <button className="w-full flex items-center p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                 <FileText size={16} className="mr-3 text-gray-400" />
                 Download Digital Report
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
