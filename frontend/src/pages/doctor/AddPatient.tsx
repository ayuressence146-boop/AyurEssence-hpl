import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, FileText, ArrowLeft, CheckCircle, HeartPulse } from 'lucide-react';
import { dataStore } from '../../services/dataStore';

const AddPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: 30,
    gender: 'Female' as 'Male' | 'Female' | 'Other',
    phone: '',
    email: '',
    city: 'Udupi, Karnataka',
    chiefComplaint: '',
    medicalHistory: '',
    assignedDoctor: 'Dr. Suresh Bhat'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient = dataStore.addPatient({
      name: formData.name.trim(),
      age: Number(formData.age),
      gender: formData.gender,
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      city: formData.city.trim(),
      chiefComplaint: formData.chiefComplaint.trim() || 'General Prakriti Consultation',
      medicalHistory: formData.medicalHistory.trim() || 'No prior severe illness declared.',
      assignedDoctor: formData.assignedDoctor
    });

    setSubmitted(true);
    setTimeout(() => {
      navigate(`/doctor/patients/${newPatient.id}`);
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-[#2b2721]">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          to="/doctor/patients" 
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#2b2721] hover:underline"
        >
          <ArrowLeft size={14} />
          <span>Back to Patient List</span>
        </Link>
        <span className="text-[11px] font-mono text-[#2b2721]/60 uppercase tracking-widest">
          Form Ref: REG-2026-CCRAS
        </span>
      </div>

      {/* Main Registration Card */}
      <div className="bg-[#fcfaf4]/90 backdrop-blur-md rounded-[28px] border border-[#2b2721]/15 shadow-sm p-7 sm:p-9 relative overflow-hidden">
        
        {/* Decorative Shimmer Line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#2b2721]/30 to-transparent" />

        <div className="mb-6">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#2b2721]/60 mb-1">
            <HeartPulse size={14} className="text-emerald-700" />
            <span>Clinical Registration Portal</span>
          </div>
          <h1 className="text-2.5xl font-serif font-bold text-[#2b2721]">Register New Patient</h1>
          <p className="text-xs text-[#2b2721]/70 mt-1 font-medium">
            Enter patient demographics and clinical complaints to create a new Prakriti dossier.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center bg-emerald-500/10 border border-emerald-600/20 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-700 text-[#ece7dc] mx-auto flex items-center justify-center shadow-md">
              <CheckCircle size={24} />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#2b2721]">Patient Registered Successfully!</h3>
            <p className="text-xs text-[#2b2721]/70">Redirecting to patient dossier page...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2b2721]/80 ml-1">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2b2721]/40" />
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Sanya Mukherji"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-[#2b2721]/20 rounded-xl text-xs text-[#2b2721] focus:outline-none focus:ring-2 focus:ring-[#2b2721]/20 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2b2721]/80 ml-1">Age</label>
                  <input 
                    type="number" 
                    required
                    min={1}
                    max={120}
                    value={formData.age}
                    onChange={e => setFormData({...formData, age: Number(e.target.value)})}
                    className="w-full px-3.5 py-2.5 bg-white/80 border border-[#2b2721]/20 rounded-xl text-xs text-[#2b2721] focus:outline-none focus:ring-2 focus:ring-[#2b2721]/20 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2b2721]/80 ml-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({...formData, gender: e.target.value as any})}
                    className="w-full px-3 py-2.5 bg-white/80 border border-[#2b2721]/20 rounded-xl text-xs text-[#2b2721] focus:outline-none focus:ring-2 focus:ring-[#2b2721]/20 font-medium"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2b2721]/80 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2b2721]/40" />
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91 98450 00000"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-[#2b2721]/20 rounded-xl text-xs text-[#2b2721] focus:outline-none focus:ring-2 focus:ring-[#2b2721]/20 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2b2721]/80 ml-1">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2b2721]/40" />
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="patient@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-[#2b2721]/20 rounded-xl text-xs text-[#2b2721] focus:outline-none focus:ring-2 focus:ring-[#2b2721]/20 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2b2721]/80 ml-1">City / Region</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2b2721]/40" />
                <input 
                  type="text" 
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  placeholder="Udupi, Karnataka"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-[#2b2721]/20 rounded-xl text-xs text-[#2b2721] focus:outline-none focus:ring-2 focus:ring-[#2b2721]/20 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2b2721]/80 ml-1">Chief Complaint / Symptoms</label>
              <textarea 
                rows={3}
                value={formData.chiefComplaint}
                onChange={e => setFormData({...formData, chiefComplaint: e.target.value})}
                placeholder="Describe current health concerns, digestive issues, sleep patterns..."
                className="w-full p-3 bg-white/80 border border-[#2b2721]/20 rounded-xl text-xs text-[#2b2721] focus:outline-none focus:ring-2 focus:ring-[#2b2721]/20 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2b2721]/80 ml-1">Medical & Lifestyle History</label>
              <textarea 
                rows={2}
                value={formData.medicalHistory}
                onChange={e => setFormData({...formData, medicalHistory: e.target.value})}
                placeholder="Prior diagnoses, allergies, current medications..."
                className="w-full p-3 bg-white/80 border border-[#2b2721]/20 rounded-xl text-xs text-[#2b2721] focus:outline-none focus:ring-2 focus:ring-[#2b2721]/20 font-medium"
              />
            </div>

            <button 
              type="submit"
              className="w-full mt-4 bg-[#2b2721] hover:bg-[#1a1714] text-[#ece7dc] py-3.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-md shadow-[#2b2721]/20"
            >
              Save Patient & Initiate Dossier
            </button>
          </form>
        )}

      </div>

    </div>
  );
};

export default AddPatient;
