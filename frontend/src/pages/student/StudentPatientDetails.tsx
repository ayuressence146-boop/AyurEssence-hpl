import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Calendar, Phone, Mail, MapPin, Activity, FileText, ArrowLeft, BookOpen, Clock, ShieldCheck, Heart } from 'lucide-react';
import { getPatientById, type Patient } from '../../services/dataStore';

const StudentPatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (id) {
      const p = getPatientById(id);
      if (p) {
        setPatient(p);
      } else {
        const allP = getPatientById('1');
        setPatient(allP || null);
      }
    }
  }, [id]);

  if (!patient) {
    return (
      <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-12 text-center">
        <User size={48} className="mx-auto text-amber-900/30 mb-3" />
        <h2 className="text-xl font-serif font-bold text-amber-950">Patient Record Not Found</h2>
        <button
          onClick={() => navigate('/student/tasks')}
          className="mt-4 px-4 py-2 bg-amber-800 text-amber-50 rounded-xl text-sm font-medium"
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/student/tasks')}
          className="flex items-center space-x-2 text-sm font-medium text-amber-900 hover:text-amber-950 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Assigned Tasks</span>
        </button>
        <span className="text-xs px-3 py-1 rounded-full bg-amber-800/10 text-amber-900 font-mono font-medium">
          Assigned Case: {patient.id}
        </span>
      </div>

      {/* Main Patient Info Banner */}
      <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-800/10 border border-amber-900/20 flex items-center justify-center font-serif font-bold text-amber-900 text-2xl">
            {patient.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-serif font-bold text-amber-950">{patient.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-900">
                Active Student Case
              </span>
            </div>
            <p className="text-amber-900/70 text-sm mt-1">
              {patient.age} years old • {patient.gender} • Blood Group: O+
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={() => navigate(`/student/assessments/conduct?patientId=${patient.id}`)}
            className="flex-1 md:flex-initial px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-xl font-medium text-sm transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <BookOpen size={18} />
            <span>Conduct Assessment</span>
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Demographics & Vitals */}
        <div className="space-y-6">
          <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-serif font-bold text-amber-950 mb-4 pb-2 border-b border-amber-900/10">
              Patient Profile
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 text-amber-900/80">
                <Phone size={16} className="text-amber-800 shrink-0" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-amber-900/80">
                <Mail size={16} className="text-amber-800 shrink-0" />
                <span>{patient.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-amber-900/80">
                <MapPin size={16} className="text-amber-800 shrink-0" />
                <span>{patient.city}</span>
              </div>
              <div className="flex items-center space-x-3 text-amber-900/80">
                <Calendar size={16} className="text-amber-800 shrink-0" />
                <span>Registered: {patient.lastVisit}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-serif font-bold text-amber-950 mb-4 pb-2 border-b border-amber-900/10 flex items-center space-x-2">
              <Heart size={18} className="text-amber-800" />
              <span>Ayurvedic Baseline Vitals</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/60 p-3 rounded-xl border border-amber-900/10">
                <span className="text-xs text-amber-800/60 block">Agni (Digestive Fire)</span>
                <span className="font-bold text-amber-950 text-sm">Vishamagni</span>
              </div>
              <div className="bg-white/60 p-3 rounded-xl border border-amber-900/10">
                <span className="text-xs text-amber-800/60 block">Koshtha (Bowel Type)</span>
                <span className="font-bold text-amber-950 text-sm">Krura</span>
              </div>
              <div className="bg-white/60 p-3 rounded-xl border border-amber-900/10">
                <span className="text-xs text-amber-800/60 block">Bala (Strength)</span>
                <span className="font-bold text-amber-950 text-sm">Madhyama</span>
              </div>
              <div className="bg-white/60 p-3 rounded-xl border border-amber-900/10">
                <span className="text-xs text-amber-800/60 block">Satva (Mind Power)</span>
                <span className="font-bold text-amber-950 text-sm">Pravara</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Chief Complaint & Case History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-serif font-bold text-amber-950 mb-3">Chief Clinical Presentation</h3>
            <div className="bg-amber-800/10 border border-amber-900/15 rounded-xl p-4 text-amber-950 font-medium text-sm leading-relaxed">
              "{patient.chiefComplaint}"
            </div>

            <h4 className="text-sm font-bold text-amber-950 mt-6 mb-2">Medical History & Lifestyle Notes</h4>
            <p className="text-xs text-amber-900/80 leading-relaxed bg-white/50 p-4 rounded-xl border border-amber-900/10">
              {patient.medicalHistory || 'Patient reports chronic digestive discomfort aggravated after evening meals. Irregular sleep cycles and high work stress.'}
            </p>

            <h4 className="text-sm font-bold text-amber-950 mt-6 mb-2">Student Learning Instructions</h4>
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-800/20 text-xs text-purple-950 leading-relaxed">
              <span className="font-bold block mb-1">Faculty Guidance Instructions:</span>
              "Please focus on Sparshanam (pulse & skin moisture evaluation). Check if the Vata imbalance is primary or secondary to Pitta turnover in the Gastro-Intestinal tract."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPatientDetails;

