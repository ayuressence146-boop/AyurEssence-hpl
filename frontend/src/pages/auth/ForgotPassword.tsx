import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full text-[#2b2721]">
      <div className="text-center mb-6">
        <h2 className="text-2.5xl font-serif font-bold text-[#2b2721] mb-1 tracking-tight">Reset Password</h2>
        <p className="text-xs text-[#2b2721]/65 font-medium">Enter your email to receive recovery instructions</p>
      </div>

      {submitted ? (
        <div className="text-center py-4 space-y-4">
          <div className="p-4 bg-[#2b2721]/5 border border-[#2b2721]/15 rounded-xl text-xs text-[#2b2721] leading-relaxed">
            Password reset instructions have been sent to <span className="font-bold">{email}</span>.
          </div>
          <Link 
            to="/auth/login"
            className="inline-flex items-center space-x-2 text-xs font-bold text-[#2b2721] hover:underline"
          >
            <ArrowLeft size={14} />
            <span>Return to Sign In</span>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
          <div className="space-y-1.5">
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
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="group w-full mt-3 flex items-center justify-center space-x-2 bg-[#2b2721] hover:bg-[#1a1714] text-[#ece7dc] py-3.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 shadow-md shadow-[#2b2721]/20"
          >
            {loading ? (
               <Loader2 size={16} className="animate-spin" />
            ) : (
               <>
                 <span>Send Reset Link</span>
                 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </>
            )}
          </button>

          <div className="mt-4 text-center">
            <Link to="/auth/login" className="inline-flex items-center space-x-1 text-xs text-[#2b2721]/70 hover:text-[#2b2721] font-semibold">
              <ArrowLeft size={13} />
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
