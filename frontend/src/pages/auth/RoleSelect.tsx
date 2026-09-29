import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, GraduationCap, Heart, ArrowRight } from 'lucide-react';

const roles = [
  {
    id: 'patient',
    title: 'Patient / Individual',
    badge: 'Personalized Care',
    description: 'Take Prakriti assessments, view Vata-Pitta-Kapha analysis, and access approved diet guidance.',
    icon: Heart,
  },
  {
    id: 'student',
    title: 'Ayurvedic Student',
    badge: 'Supervised Learning',
    description: 'Conduct practice evaluations, record observations, and compare accuracy with mentor reviews.',
    icon: GraduationCap,
  },
  {
    id: 'doctor',
    title: 'Doctor / Practitioner',
    badge: 'Clinical Workspace',
    description: 'Manage patients, verify Nadi Pariksha observations, approve guidance, and issue reports.',
    icon: Stethoscope,
  },
];

const RoleSelect = () => {
  const navigate = useNavigate();

  const handleSelectRole = (roleId: string) => {
    navigate(`/auth/register?role=${roleId}`);
  };

  return (
    <div className="flex flex-col items-center text-[#ece7dc]">
      <div className="text-center mb-5">
        <h2 className="text-2.5xl font-serif font-bold text-[#ece7dc] mb-1 tracking-tight">
          Select Your Portal
        </h2>
        <p className="text-xs text-[#ece7dc]/75 max-w-sm mx-auto font-medium">
          Choose how you would like to experience the AyurEssence platform
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3.5 w-full">
        {roles.map((role, idx) => {
          const Icon = role.icon;
          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              onClick={() => handleSelectRole(role.id)}
              className="group relative cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 hover:border-white/35 rounded-2xl p-4 transition-all duration-300 shadow-lg hover:-translate-y-0.5 overflow-hidden flex items-start space-x-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-[#ece7dc] text-[#2b2721] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform mt-0.5">
                <Icon size={18} strokeWidth={2} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#ece7dc] group-hover:text-white transition-colors">
                    {role.title}
                  </h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#ece7dc]/15 backdrop-blur-sm border border-[#ece7dc]/20 text-[#ece7dc]">
                    {role.badge}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#ece7dc]/75 leading-relaxed font-medium">
                  {role.description}
                </p>
              </div>

              <div className="self-center pl-1 text-[#ece7dc]/50 group-hover:text-[#ece7dc] group-hover:translate-x-1 transition-all">
                <ArrowRight size={16} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-5 text-center text-xs text-[#ece7dc]/75">
        Already registered?{' '}
        <button
          onClick={() => navigate('/auth/login')}
          className="text-[#ece7dc] font-bold hover:underline ml-0.5 focus:outline-none"
        >
          Sign in to your account
        </button>
      </div>
    </div>
  );
};

export default RoleSelect;


