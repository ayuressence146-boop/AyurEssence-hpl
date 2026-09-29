import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { authService } from '../../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedRole = searchParams.get('role') || 'patient';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: selectedRole
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authService.register({
        email: formData.email.trim(),
        password: formData.password,
        full_name: formData.name.trim(),
        role: formData.role
      });

      const role = res.profile?.role?.toLowerCase() || formData.role;
      if (role === 'doctor') navigate('/doctor');
      else if (role === 'student') navigate('/student');
      else navigate('/patient');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full text-[#2b2721]">
      <div className="text-center mb-5">
        <h2 className="text-2.5xl font-serif font-bold text-[#2b2721] mb-1 tracking-tight">Create Account</h2>
        <p className="text-xs text-[#2b2721]/65 font-medium">Join the AyurEssence platform</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-3.5 flex-1 flex flex-col">
        {error && (
          <div className="p-3 text-xs bg-red-100/60 text-red-700 rounded-xl border border-red-200">
            {error}
          </div>
        )}
        
        {/* Selected Role Display Banner */}
        <div className="flex items-center justify-between bg-white/45 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/70 shadow-sm mb-0.5">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-[#2b2721]/70 uppercase tracking-wider font-semibold">Role:</span>
            <span className="text-xs font-bold capitalize text-[#2b2721] bg-[#2b2721]/10 px-2 py-0.5 rounded-md border border-[#2b2721]/10">
              {formData.role}
            </span>
          </div>
          <Link to="/auth/select-role" className="text-[11px] font-bold text-[#2b2721] hover:underline">
            Change
          </Link>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#2b2721]/80 ml-1">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#2b2721]/50">
              <User size={16} strokeWidth={2} />
            </div>
            <input 
              type="text" 
              required
              className="w-full pl-10 pr-4 py-2.5 bg-white/40 hover:bg-white/60 focus:bg-white/80 backdrop-blur-md border border-white/70 focus:border-[#2b2721]/50 rounded-xl text-sm text-[#2b2721] placeholder-[#2b2721]/45 focus:outline-none focus:ring-2 focus:ring-[#2b2721]/15 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]"
              placeholder={formData.role === 'doctor' ? "Dr. Full Name" : "Full Name"}
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#2b2721]/80 ml-1">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#2b2721]/50">
              <Mail size={16} strokeWidth={2} />
            </div>
            <input 
              type="email" 
              required
              className="w-full pl-10 pr-4 py-2.5 bg-white/40 hover:bg-white/60 focus:bg-white/80 backdrop-blur-md border border-white/70 focus:border-[#2b2721]/50 rounded-xl text-sm text-[#2b2721] placeholder-[#2b2721]/45 focus:outline-none focus:ring-2 focus:ring-[#2b2721]/15 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]"
              placeholder="email@example.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#2b2721]/80 ml-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#2b2721]/50">
              <Lock size={16} strokeWidth={2} />
            </div>
            <input 
              type="password" 
              required
              className="w-full pl-10 pr-4 py-2.5 bg-white/40 hover:bg-white/60 focus:bg-white/80 backdrop-blur-md border border-white/70 focus:border-[#2b2721]/50 rounded-xl text-sm text-[#2b2721] placeholder-[#2b2721]/45 focus:outline-none focus:ring-2 focus:ring-[#2b2721]/15 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]"
              placeholder="Create a password"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="group w-full mt-2 flex items-center justify-center space-x-2 bg-[#2b2721] hover:bg-[#1a1714] text-[#ece7dc] py-3 rounded-full font-bold text-xs tracking-widest uppercase transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 shadow-md shadow-[#2b2721]/20"
        >
          {loading ? (
             <Loader2 size={16} className="animate-spin" />
          ) : (
             <>
               <span>Register Account</span>
               <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
             </>
          )}
        </button>
      </form>

      <div className="mt-5 text-center text-xs text-[#2b2721]/65">
        Already have an account? <Link to="/auth/login" className="text-[#2b2721] font-bold hover:underline ml-0.5">Sign in</Link>
      </div>
    </div>
  );
};

export default Register;
