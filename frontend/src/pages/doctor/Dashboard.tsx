import React from 'react';
import { Users, Activity, CheckCircle, Clock } from 'lucide-react';

const DoctorDashboard = () => {
  const stats = [
    { label: 'Total Patients', value: '142', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Active Assessments', value: '12', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Pending Reviews', value: '5', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Finalized Reports', value: '86', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[var(--color-primary)]">Clinical Dashboard</h1>
          <p className="text-[var(--color-foreground)]/60 text-sm mt-1">Overview of registered patients and assessments.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-[var(--color-border)] text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
            Register Patient
          </button>
          <button className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-xl hover:bg-[var(--color-deep-cyprus,#003A36)] transition-colors shadow-md shadow-[var(--color-primary)]/20">
            New Assessment
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-[var(--color-border)] shadow-sm flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Patients</h3>
          <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                    P{i}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Patient Name {i}</p>
                    <p className="text-xs text-gray-500">ID: AE-{2024+i} • Age: {30+i}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                    Vata-Pitta
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Actions</h3>
          <div className="space-y-4">
             <div className="p-4 rounded-xl border border-orange-100 bg-orange-50">
               <p className="text-sm font-medium text-orange-800 mb-1">Review Assessment</p>
               <p className="text-xs text-orange-600 mb-3">Rahul Verma (Student) submitted Prakriti Assessment for AE-2025.</p>
               <button className="text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-lg transition-colors">
                 Review Now
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
