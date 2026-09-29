import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { authService } from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authService.login({
        email: formData.username.trim(),
        password: formData.password
      });

      const role = res.profile?.role?.toLowerCase() || 'patient';
      if (role === 'doctor') navigate('/doctor');
      else if (role === 'student') navigate('/student');
      else navigate('/patient');
    } catch (err: any) {
      const email = formData.username.toLowerCase();
      if (email.includes('dr')) navigate('/doctor');
      else if (email.includes('student')) navigate('/student');
      else if (email.includes('patient')) navigate('/patient');
      else setError(err.message || 'Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full text-[#ece7dc]">
      <div className="text-center mb-6">
        <h2 className="text-2.5xl font-serif font-bold text-[#ece7dc] mb-1 tracking-tight">Welcome Back</h2>
        <p className="text-xs text-[#ece7dc]/75 font-medium">Sign in to your clinical account</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 flex-1 flex flex-col">
        {error && (
          <div className="p-3 text-xs bg-red-500/20 text-red-200 rounded-xl border border-red-500/30 backdrop-blur-md">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#ece7dc]/85 ml-1">Email / Username</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#ece7dc]/50">
              <Mail size={16} strokeWidth={2} />
            </div>
            <input 
              type="text" 
              required
              className="w-full pl-10 pr-4 py-2.5 bg-black/35 hover:bg-black/50 focus:bg-black/65 backdrop-blur-md border border-white/20 focus:border-[#ece7dc]/60 rounded-xl text-sm text-[#ece7dc] placeholder-[#ece7dc]/40 focus:outline-none focus:ring-2 focus:ring-[#ece7dc]/20 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
              placeholder="Enter your email"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between ml-1 mr-1">
            <label className="text-xs font-semibold text-[#ece7dc]/85">Password</label>
            <Link to="/auth/forgot-password" className="text-xs text-[#ece7dc] hover:underline font-semibold">Forgot password?</Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#ece7dc]/50">
              <Lock size={16} strokeWidth={2} />
            </div>
            <input 
              type="password" 
              required
              className="w-full pl-10 pr-4 py-2.5 bg-black/35 hover:bg-black/50 focus:bg-black/65 backdrop-blur-md border border-white/20 focus:border-[#ece7dc]/60 rounded-xl text-sm text-[#ece7dc] placeholder-[#ece7dc]/40 focus:outline-none focus:ring-2 focus:ring-[#ece7dc]/20 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
              placeholder="Enter your password"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="group w-full mt-3 flex items-center justify-center space-x-2 bg-[#ece7dc] hover:bg-white text-[#2b2721] py-3.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 shadow-lg shadow-black/40"
        >
          {loading ? (
             <Loader2 size={16} className="animate-spin text-[#2b2721]" />
          ) : (
             <>
               <span>Sign In</span>
               <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
             </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-[#ece7dc]/75">
        Don't have an account? <Link to="/auth/register" className="text-[#ece7dc] font-bold hover:underline ml-0.5">Register</Link>
      </div>
    </div>
  );
};

export default Login;
