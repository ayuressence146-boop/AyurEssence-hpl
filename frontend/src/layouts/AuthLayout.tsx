import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { authService } from '../services/api';

const sdmImages = [
  {
    src: '/landing-pages/meng-to-sketchbook/SDM1.png',
    title: 'SDM College of Ayurveda',
    place: 'Udyavara · Udupi',
  },
  {
    src: '/landing-pages/meng-to-sketchbook/SDM2.png',
    title: 'Ayurvedic Hospital Wing',
    place: 'Clinical Care Unit',
  },
  {
    src: '/landing-pages/meng-to-sketchbook/SDM3.png',
    title: 'Observation & Diagnosis',
    place: 'Practitioner Workspace',
  },
  {
    src: '/landing-pages/meng-to-sketchbook/SDM4.png',
    title: 'Treatment & Nadi Pariksha',
    place: 'Therapy & Follow-up',
  }
];

const AuthLayout = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getStoredUser();
    if (user) {
      navigate(`/${user.role}`);
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % sdmImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-[#2b2721] selection:bg-[#2b2721] selection:text-[#ece7dc]">
      
      {/* FULL-SCREEN BACKGROUND SLIDESHOW */}
      <div className="fixed inset-0 w-full h-full z-0 bg-[#1a1714]">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIdx}
            src={sdmImages[activeIdx].src}
            alt={sdmImages[activeIdx].title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>

        {/* Full-Screen Dark Overlay for High Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/60 backdrop-blur-[2px] pointer-events-none" />
      </div>

      {/* FLOATING TOP NAVIGATION BAR */}
      <header className="fixed top-0 left-0 right-0 z-30 p-4 sm:p-6 flex items-center justify-between pointer-events-auto">
        <Link 
          to="/landing" 
          className="group flex items-center space-x-3 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-lg transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-[#ece7dc] text-[#2b2721] flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <span className="font-serif italic text-xl font-bold text-[#ece7dc] tracking-tight">
            AyurEssence
          </span>
        </Link>

        <Link
          to="/landing"
          className="flex items-center space-x-2 text-xs font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full transition-all shadow-md"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </header>

      {/* CENTERED GLASSMORPHISM FORM CONTAINER */}
      <main className="relative z-20 min-h-screen flex items-center justify-center px-4 py-20 sm:px-6">
        <div className="w-full max-w-[480px] relative">
          
          {/* Ambient Glow behind Card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-teal-500/20 rounded-[32px] blur-xl opacity-75 pointer-events-none" />

          {/* Glassmorphic Card */}
          <div className="relative bg-[#1c1917]/75 backdrop-blur-2xl border border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.65)] rounded-[28px] p-7 sm:p-9 text-[#ece7dc] overflow-hidden">
            {/* Shimmer Line Top */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#ece7dc]/40 to-transparent" />

            {/* Decorative Botany Accent */}
            <img 
              src="/landing-pages/meng-to-sketchbook/botany-left.png" 
              alt="" 
              className="absolute left-0 bottom-0 w-[140px] opacity-15 invert pointer-events-none select-none z-0" 
            />

            {/* Form Content */}
            <div className="relative z-10">
              <Outlet />
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-[10px] text-white/60 tracking-widest font-mono mt-4 drop-shadow">
            CCRAS-PRKRITI-001-v1.0 Traceable Engine
          </p>
        </div>
      </main>

      {/* FLOATING BOTTOM CAPTION & SLIDE DOTS */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 p-4 sm:p-6 flex items-end justify-between pointer-events-auto">
        
        {/* Caption Pill */}
        <div className="hidden sm:flex items-center space-x-3 bg-black/40 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl text-white shadow-lg max-w-xs">
          <Sparkles size={16} className="text-amber-300 flex-shrink-0" />
          <div className="min-w-0">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/60 block">
              SDM Sketchbook Campus
            </span>
            <p className="text-xs font-serif font-bold text-white truncate">
              {sdmImages[activeIdx].title}
            </p>
            <p className="text-[10px] text-white/75 truncate">
              {sdmImages[activeIdx].place}
            </p>
          </div>
        </div>

        {/* Slide Indicator Dots */}
        <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md border border-white/20 px-3 py-2 rounded-full shadow-lg ml-auto">
          {sdmImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIdx === i ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </footer>

    </div>
  );
};

export default AuthLayout;

