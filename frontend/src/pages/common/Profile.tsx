import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Award, Save, CheckCircle2, Camera, Shield, BookOpen } from 'lucide-react';
import { authService, type UserProfile } from '../../services/api';

const Profile = () => {
  const storedUser = authService.getStoredUser();
  const [user, setUser] = useState({
    name: storedUser?.full_name || 'Practitioner User',
    email: storedUser?.email || 'doctor@ayuressence.org',
    role: storedUser?.role ? `${storedUser.role.toUpperCase()} PORTAL` : 'Senior Ayurvedic Practitioner',
    phone: storedUser?.phone || '+91 98765 43210',
    location: 'AyurEssence Wellness Center, Bengaluru',
    registrationNumber: 'AYU-KA-2026-9402',
    specialization: 'Kayachikitsa & Nadi Pariksha Specialist',
    bio: 'Clinical practitioner experience in Prakriti assessment, Panchakarma therapy design, and integrative lifestyle medicine.',
  });

  useEffect(() => {
    authService.getMe().then(me => {
      if (me) {
        setUser(prev => ({
          ...prev,
          name: me.full_name || prev.name,
          email: me.email || prev.email,
          phone: me.phone || prev.phone,
          role: me.role ? `${me.role.toUpperCase()} PORTAL` : prev.role
        }));
      }
    }).catch(() => {});
  }, []);

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-800/10 text-amber-900 border border-amber-800/20">
            User Account Settings
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-950 mt-1">
            Personal & Practitioner Profile
          </h1>
          <p className="text-amber-900/70 text-sm mt-0.5">
            Manage your credentials, clinical contact information, and public profile details.
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
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 p-2 bg-amber-800 text-amber-50 rounded-full hover:bg-amber-900 transition-colors shadow-md"
              title="Change Photo"
            >
              <Camera size={14} />
            </button>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-xl font-serif font-bold text-amber-950">{user.name}</h2>
            <p className="text-xs font-semibold text-amber-800 mt-0.5">{user.role}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-amber-900/70 font-mono">
              <span>{user.registrationNumber}</span>
              <span>•</span>
              <span>{user.location}</span>
            </div>
          </div>
        </div>

        {/* Form Details */}
        <div className="bg-[#fbf7ee]/80 border border-amber-900/15 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-serif font-bold text-amber-950 border-b border-amber-900/10 pb-2">
            Contact & Clinical Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-amber-950 mb-1">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-900/50" />
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
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
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full pl-9 pr-4 py-2 bg-white/70 border border-amber-900/20 rounded-xl text-sm text-amber-950 focus:ring-2 focus:ring-amber-800/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-950 mb-1">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-900/50" />
                <input
                  type="text"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="w-full pl-9 pr-4 py-2 bg-white/70 border border-amber-900/20 rounded-xl text-sm text-amber-950 focus:ring-2 focus:ring-amber-800/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-950 mb-1">AYUSH Registration Number</label>
              <div className="relative">
                <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-900/50" />
                <input
                  type="text"
                  value={user.registrationNumber}
                  onChange={(e) => setUser({ ...user, registrationNumber: e.target.value })}
                  className="w-full pl-9 pr-4 py-2 bg-white/70 border border-amber-900/20 rounded-xl text-sm text-amber-950 font-mono focus:ring-2 focus:ring-amber-800/30"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-950 mb-1">Specialization & Focus Areas</label>
            <input
              type="text"
              value={user.specialization}
              onChange={(e) => setUser({ ...user, specialization: e.target.value })}
              className="w-full px-4 py-2 bg-white/70 border border-amber-900/20 rounded-xl text-sm text-amber-950 focus:ring-2 focus:ring-amber-800/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-950 mb-1">Clinical Biography</label>
            <textarea
              rows={4}
              value={user.bio}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
              className="w-full p-4 bg-white/70 border border-amber-900/20 rounded-xl text-sm text-amber-950 focus:ring-2 focus:ring-amber-800/30 leading-relaxed"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-xl font-medium text-sm transition-all shadow-md flex items-center space-x-2"
            >
              <Save size={18} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;

