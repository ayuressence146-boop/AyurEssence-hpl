import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, User, FileText, CheckCircle2, Clock, ChevronRight, BookOpen } from 'lucide-react';
import { getPatients, getAssessments, Patient, Assessment } from '../../services/dataStore';

const AssignedAssessments = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  useEffect(() => {
    setPatients(getPatients());
    setAssessments(getAssessments());
  }, []);

  const studentTasks = patients.map((patient, idx) => {
    const asm = assessments.find(a => a.patientId === patient.id);
    const status = asm ? asm.status : (idx % 2 === 0 ? 'Pending Assessment' : 'Under Mentor Review');
    const dueDate = '2025-10-05';
    return {
      patient,
      assessment: asm,
      status,
      dueDate,
      assignedBy: 'Dr. Ananya Rao',
    };
  });

  const filteredTasks = studentTasks.filter(task => {
    const matchesSearch = task.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.patient.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-800/10 text-amber-900 border border-amber-800/20">
              Student Workspace
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-950 mt-1">
            Assigned Clinical Tasks & Assessments
          </h1>
          <p className="text-amber-900/70 text-sm mt-0.5">
            Complete assigned patient assessments and submit your diagnostic interpretations for mentor review.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-900/50" />
          <input
            type="text"
            placeholder="Search by patient name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/70 border border-amber-900/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/30 text-amber-950 placeholder:text-amber-900/40"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter size={16} className="text-amber-900/60 ml-1 shrink-0" />
          {['All', 'Pending Assessment', 'In Progress', 'Under Mentor Review', 'Completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                filterStatus === status
                  ? 'bg-amber-800 text-amber-50 shadow-sm'
                  : 'bg-amber-800/10 text-amber-900 hover:bg-amber-800/20'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-12 text-center">
            <FileText size={48} className="mx-auto text-amber-900/30 mb-3" />
            <h3 className="text-lg font-serif font-bold text-amber-950">No assigned tasks found</h3>
            <p className="text-sm text-amber-900/60 mt-1">Try adjusting your search query or filter selection.</p>
          </div>
        ) : (
          filteredTasks.map(({ patient, assessment, status, dueDate, assignedBy }) => (
            <div
              key={patient.id}
              className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-800/10 border border-amber-900/20 flex items-center justify-center font-serif font-bold text-amber-900 text-lg shrink-0">
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif font-bold text-amber-950 text-lg">{patient.name}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-800/10 text-amber-900 font-mono">
                      {patient.patientId}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      status === 'Completed' ? 'bg-emerald-500/15 text-emerald-900 border border-emerald-800/20' :
                      status === 'Under Mentor Review' ? 'bg-purple-500/15 text-purple-900 border border-purple-800/20' :
                      'bg-amber-500/15 text-amber-900 border border-amber-800/20'
                    }`}>
                      {status}
                    </span>
                  </div>

                  <p className="text-xs text-amber-900/70 mt-1">
                    {patient.age} yrs • {patient.gender} • Chief Complaint: <span className="font-semibold">{patient.primaryComplaint}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-amber-800/60 font-medium">
                    <span className="flex items-center space-x-1">
                      <User size={14} />
                      <span>Mentor: {assignedBy}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>Due: {dueDate}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-amber-900/10">
                <button
                  onClick={() => navigate(`/student/patients/${patient.id}`)}
                  className="px-4 py-2 rounded-xl border border-amber-900/20 text-xs font-medium text-amber-900 hover:bg-amber-800/10 transition-colors"
                >
                  View Case
                </button>
                <button
                  onClick={() => navigate(`/student/assessments/conduct?patientId=${patient.id}`)}
                  className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-medium transition-colors shadow-sm flex items-center space-x-1.5"
                >
                  <BookOpen size={14} />
                  <span>Conduct Assessment</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignedAssessments;

