import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Download, ShieldCheck, Eye, Calendar, Loader2, Clock } from 'lucide-react';
import { authService, patientService, type AssessmentModel } from '../../services/api';

const MyReports = () => {
  const navigate = useNavigate();
  const currentUser = authService.getStoredUser();
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      try {
        const data = await patientService.getPatientAssessments(currentUser.id);
        // Only show finalized or reviewed assessments with results
        const completed = data.filter((a: any) => 
          (a.status === 'finalized' || a.status === 'reviewed') && a.results?.length > 0
        );
        setAssessments(completed);
      } catch (err) {
        console.warn('Failed to fetch assessments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
          <FileText size={14} className="text-emerald-700" />
          <span>Verified Clinical Certificates</span>
        </div>
        <h1 className="text-2.5xl font-serif font-bold text-[#2b2721]">My Health Reports & Certificates</h1>
        <p className="text-xs text-[#2b2721]/75 font-medium">
          Access, view, and download verified Prakriti Certificates issued by your practitioner.
        </p>
      </div>

      {/* Reports List */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md p-6 rounded-[24px] border border-[#2b2721]/15 shadow-sm space-y-4">
        <h3 className="text-base font-serif font-bold text-[#2b2721]">Issued Certificates</h3>

        {assessments.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-800/10 border border-amber-800/20 flex items-center justify-center">
              <Clock size={24} className="text-amber-800" />
            </div>
            <p className="text-xs text-[#2b2721]/70 font-medium max-w-sm mx-auto">
              No reports available yet. Reports will be generated after your Prakriti assessment is finalized by a doctor.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {assessments.map((a: any) => {
              const result = a.results?.[0];
              return (
                <div 
                  key={a.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/80 rounded-2xl border border-[#2b2721]/12 gap-3"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#2b2721] text-[#ece7dc] flex items-center justify-center font-serif font-bold text-sm shadow-sm shrink-0">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#2b2721]">
                        {result ? `${result.dominant_dosha} Prakriti Certificate` : 'Prakriti Certificate'}
                      </h4>
                      <p className="text-xs text-[#2b2721]/65">
                        Status: <span className="font-semibold capitalize">{a.status}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <span className="text-xs font-mono font-bold text-[#2b2721]/60 flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>{a.created_at ? new Date(a.created_at).toLocaleDateString() : 'N/A'}</span>
                    </span>

                    <button 
                      onClick={() => navigate('/patient/result')}
                      className="px-4 py-2 bg-[#2b2721] text-[#ece7dc] hover:bg-[#1a1714] text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-1.5"
                    >
                      <Eye size={14} />
                      <span>View Result</span>
                    </button>
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

export default MyReports;
