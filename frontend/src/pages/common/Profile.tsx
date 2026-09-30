import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Award, Save, CheckCircle2, Camera, Shield, BookOpen, Calendar, HeartPulse, GraduationCap } from 'lucide-react';
import { authService, type UserProfile } from '../../services/api';

const Profile = () => {
  const storedUser = authService.getStoredUser();
  const [profile, setProfile] = useState<UserProfile | null>(storedUser);
  const [fullName, setFullName] = useState(storedUser?.full_name || '');
  const [email, setEmail] = useState(storedUser?.email || '');
  const [phone, setPhone] = useState(storedUser?.phone || '');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [bio, setBio] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    authService.getMe().then(me => {
      if (me) {
        setProfile(me);
        setFullName(me.full_name || '');
        setEmail(me.email || '');
        setPhone(me.phone || '');
      }
    }).catch(() => {});
  }, []);

  const role = profile?.role?.toLowerCase() || storedUser?.role?.toLowerCase() || 'patient';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'doctor':
        return 'Ayurvedic Doctor / Senior Vaidya Profile';
      case 'student':
        return 'Student Practitioner Profile';
      case 'patient':
      default:
        return 'Patient Health Profile';
    }
  };

  const getRoleBadge = () => {
    switch (role) {
      case 'doctor':
        return 'DOCTOR PORTAL';
      case 'student':
        return 'STUDENT PORTAL';
      case 'patient':
      default:
        return 'PATIENT PORTAL';
    }
  };

  const initials = (fullName || 'User')
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-800/10 text-amber-900 border border-amber-800/20">
            {getRoleBadge()}
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-950 mt-1">
            {getRoleTitle()}
          </h1>
          <p className="text-amber-900/70 text-sm mt-0.5">
            Manage your personal profile, contact information, and account details.
          </p>
        </div>

        {isSaved && (
          <div className="px-4 py-2 bg-emerald-800 text-emerald-50 rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm">
            <CheckCircle2 size={16} />
            <span>Profile Updated Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Banner Card */}
        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-amber-800/15 border-2 border-amber-900/20 flex items-center justify-center font-serif font-bold text-amber-950 text-3xl shadow-inner">
              {initials}
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 p-2 bg-amber-800 text-amber-50 rounded-full hover:bg-amber-900 transition-colors shadow-md"
              title="Change Photo"
            >
              <Camera size={14} />
            </button>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-serif font-bold text-amber-950">{fullName || 'User Profile'}</h2>
            <p className="text-xs font-semibold text-amber-800">{getRoleBadge()}</p>
            <p className="text-xs text-amber-900/70 font-mono">{email || 'No email provided'}</p>
          </div>
        </div>

        {/* Common Contact Details */}
        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-serif font-bold text-amber-950 border-b border-amber-900/10 pb-2">
            Personal &amp; Contact Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-amber-950 mb-1">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-900/50" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full pl-9 pr-4 py-2 bg-white/70 border border-amber-900/20 rounded-xl text-sm text-amber-950 focus:ring-2 focus:ring-amber-800/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-950 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-900/50" />
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full pl-9 pr-4 py-2 bg-amber-900/5 border border-amber-900/15 rounded-xl text-sm text-amber-900/70 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-950 mb-1">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-900/50" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter contact number"
                  className="w-full pl-9 pr-4 py-2 bg-white/70 border border-amber-900/20 rounded-xl text-sm text-amber-950 focus:ring-2 focus:ring-amber-800/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-950 mb-1">Residential / Clinic Address</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-900/50" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="City, State, Country"
                  className="w-full pl-9 pr-4 py-2 bg-white/70 border border-amber-900/20 rounded-xl text-sm text-amber-950 focus:ring-2 focus:ring-amber-800/30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Role-Specific Fields */}
        {role === 'doctor' && (
          <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-serif font-bold text-amber-950 border-b border-amber-900/10 pb-2 flex items-center space-x-2">
              <Shield size={18} className="text-amber-800" />
              <span>Medical Credentials &amp; Clinical Bio</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">AYUSH Registration Number</label>
                <input
                  type="text"
                  value={registrationNo}
                  onChange={(e) => setRegistrationNo(e.target.value)}
                  placeholder="e.g. AYU-KA-XXXX"
                  className="w-full px-4 py-2 bg-white/70 border border-amber-900/20 rounded-xl text-sm text-amber-950 font-mono focus:ring-2 focus:ring-amber-800/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">Clinical Specialization</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Kayachikitsa &amp; Nadi Pariksha"
                  className="w-full px-4 py-2 bg-white/70 border border-amber-900/20 rounded-xl text-sm text-amber-950 focus:ring-2 focus:ring-amber-800/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-950 mb-1">Clinical Biography</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your clinical background, experience, and area of expertise..."
                className="w-full p-4 bg-white/70 border border-amber-900/20 rounded-xl text-sm text-amber-950 focus:ring-2 focus:ring-amber-800/30 leading-relaxed"
              />
            </div>
          </div>
        )}

        {role === 'student' && (
          <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-serif font-bold text-amber-950 border-b border-amber-900/10 pb-2 flex items-center space-x-2">
              <GraduationCap size={18} className="text-amber-800" />
              <span>Academic &amp; Student Credentials</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">Student Roll / ID Number</label>
                <input
                  type="text"
                  value={registrationNo}
                  onChange={(e) => setRegistrationNo(e.target.value)}
                  placeholder="e.g. STU-2026-001"
                  className="w-full px-4 py-2 bg-white/70 border border-amber-900/20 rounded-xl text-sm text-amber-950 font-mono focus:ring-2 focus:ring-amber-800/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">Specialization / Department Interest</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Panchakarma &amp; Dravyaguna"
                  className="w-full px-4 py-2 bg-white/70 border border-amber-900/20 rounded-xl text-sm text-amber-950 focus:ring-2 focus:ring-amber-800/30"
                />
              </div>
            </div>
          </div>
        )}

        {role === 'patient' && (
          <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-serif font-bold text-amber-950 border-b border-amber-900/10 pb-2 flex items-center space-x-2">
              <HeartPulse size={18} className="text-amber-800" />
              <span>Patient Medical Info &amp; Preferences</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-2 bg-white/70 border border-amber-900/20 rounded-xl text-sm text-amber-950 focus:ring-2 focus:ring-amber-800/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2 bg-white/70 border border-amber-900/20 rounded-xl text-sm text-amber-950 focus:ring-2 focus:ring-amber-800/30"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-xl font-medium text-sm transition-all shadow-md flex items-center space-x-2"
          >
            <Save size={18} />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
