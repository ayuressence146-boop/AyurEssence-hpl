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
    <div className="flex flex-col h-full text-[#ece7dc]">
      <div className="text-center mb-6">
        <h2 className="text-2.5xl font-serif font-bold text-[#ece7dc] mb-1 tracking-tight">Reset Password</h2>
        <p className="text-xs text-[#ece7dc]/75 font-medium">Enter your email to receive recovery instructions</p>
      </div>

      {submitted ? (
        <div className="text-center py-4 space-y-4">
          <div className="p-4 bg-white/10 border border-white/20 rounded-xl text-xs text-[#ece7dc] leading-relaxed backdrop-blur-md">
            Password reset instructions have been sent to <span className="font-bold">{email}</span>.
          </div>
          <Link 
            to="/auth/login"
            className="inline-flex items-center space-x-2 text-xs font-bold text-[#ece7dc] hover:underline"
          >
            <ArrowLeft size={14} />
            <span>Return to Sign In</span>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#ece7dc]/85 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#ece7dc]/50">
                <Mail size={16} strokeWidth={2} />
              </div>
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-2.5 bg-black/35 hover:bg-black/50 focus:bg-black/65 backdrop-blur-md border border-white/20 focus:border-[#ece7dc]/60 rounded-xl text-sm text-[#ece7dc] placeholder-[#ece7dc]/40 focus:outline-none focus:ring-2 focus:ring-[#ece7dc]/20 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
                placeholder="email@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                 <span>Send Reset Link</span>
                 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </>
            )}
          </button>

          <div className="mt-4 text-center">
            <Link to="/auth/login" className="inline-flex items-center space-x-1 text-xs text-[#ece7dc]/75 hover:text-[#ece7dc] font-semibold">
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
