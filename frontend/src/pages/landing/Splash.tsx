import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to landing after a 2-second splash animation
    const timer = setTimeout(() => {
      navigate('/landing');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[var(--color-sand)] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative Botanical Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1542841791-1823ebce18e2?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5 mix-blend-multiply pointer-events-none" />
      
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[var(--color-primary)]/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[var(--color-sage, #6F927D)]/20 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 flex flex-col items-center"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="relative w-24 h-24 rounded-full bg-[var(--color-primary)] flex items-center justify-center shadow-2xl shadow-[var(--color-primary)]/30 mb-8"
        >
          <Leaf size={40} className="text-[var(--color-sand)]" />
        </motion.div>

        <h1 className="text-5xl font-serif text-[var(--color-primary)] font-bold mb-4 tracking-tight">AyurEssence</h1>
        <p className="font-sans text-[var(--color-primary)]/70 tracking-[0.2em] uppercase text-sm font-semibold">
          Discover • Balance • Thrive
        </p>

        <motion.div 
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 200 }}
          transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
          className="h-[1px] bg-[var(--color-primary)]/20 mt-12"
        />
      </motion.div>
    </div>
  );
};

export default Splash;
