import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to landing after a 2.5-second splash animation
    const timer = setTimeout(() => {
      navigate('/landing');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#fbf7ee] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Botanical Parchment Background Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-multiply pointer-events-none" 
        style={{ backgroundImage: 'url(/landing-pages/meng-to-sketchbook/bg-wash.jpg)' }}
      />
      
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-amber-900/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-900/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 flex flex-col items-center justify-center text-center p-6 w-full max-w-2xl"
      >
        <motion.div 
          animate={{ scale: [1, 1.025, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex items-center justify-center w-full"
        >
          <img 
            src="/Ayur_Essence_logo.png" 
            alt="AyurEssence Logo" 
            className="w-[85vw] max-w-md md:max-w-lg h-auto max-h-[70vh] object-contain drop-shadow-2xl"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Splash;
