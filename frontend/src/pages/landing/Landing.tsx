import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Stethoscope, User, GraduationCap, Sparkles } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#ece7dc]">
      {/* Top Banner Navigation bar (always visible over iframe) */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[#ece7dc]/90 backdrop-blur-md border-b border-amber-900/15 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-amber-900/15 border border-amber-900/20 flex items-center justify-center font-serif font-bold text-amber-950 text-lg">
            अ
          </div>
          <div>
            <h1 className="font-serif font-bold text-amber-950 text-lg leading-none">AyurEssence</h1>
            <p className="text-[10px] text-amber-900/70 font-mono tracking-wider uppercase mt-0.5">Clinical Prakriti Platform</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/auth/select-role')}
            className="px-4 py-2 bg-amber-900 hover:bg-amber-950 text-amber-50 rounded-xl text-xs font-medium transition-all shadow-sm flex items-center space-x-1.5"
          >
            <span>Select Role & Login</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* Embed HTML Landing Page */}
      <iframe
        src="/landing-pages/meng-to-sketchbook.html"
        className="w-full h-full border-none pt-16"
        onLoad={() => setIframeLoaded(true)}
        title="AyurEssence Landing Page"
      />

      {/* Backup Native Content if iframe takes time or fails */}
      {!iframeLoaded && (
        <div 
          className="absolute inset-0 pt-20 px-6 flex flex-col items-center justify-center text-center bg-cover bg-center"
          style={{ backgroundImage: 'url(/landing-pages/meng-to-sketchbook/bg-wash.jpg)' }}
        >
          <div className="bg-[#fbf7ee]/90 border border-amber-900/20 rounded-3xl p-8 max-w-xl shadow-xl backdrop-blur-md space-y-6">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-800/10 text-amber-900 border border-amber-800/20">
              Ayurvedic Assessment Suite
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-950">
              Precision Prakriti & Vikriti Diagnostics
            </h2>
            <p className="text-sm text-amber-900/80 leading-relaxed">
              Integrative platform connecting Doctors, Students, and Patients through Trividha and Astavidha Pariksha.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => navigate('/doctor')}
                className="p-3 bg-amber-800 text-amber-50 rounded-xl text-xs font-semibold flex flex-col items-center space-y-1 hover:bg-amber-900 transition-colors"
              >
                <Stethoscope size={18} />
                <span>Doctor Portal</span>
              </button>

              <button
                onClick={() => navigate('/patient')}
                className="p-3 bg-emerald-800 text-emerald-50 rounded-xl text-xs font-semibold flex flex-col items-center space-y-1 hover:bg-emerald-900 transition-colors"
              >
                <User size={18} />
                <span>Patient Portal</span>
              </button>

              <button
                onClick={() => navigate('/student')}
                className="p-3 bg-purple-800 text-purple-50 rounded-xl text-xs font-semibold flex flex-col items-center space-y-1 hover:bg-purple-900 transition-colors"
              >
                <GraduationCap size={18} />
                <span>Student Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;

