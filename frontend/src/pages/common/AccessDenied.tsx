import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, RefreshCw, LogIn, Home } from 'lucide-react';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: 'url(/landing-pages/meng-to-sketchbook/bg-wash.jpg)' }}
    >
      <div className="bg-[#fbf7ee]/90 border border-amber-900/20 rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-xl backdrop-blur-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-800/10 border border-amber-900/20 flex items-center justify-center mx-auto text-amber-900 shadow-inner">
          <ShieldAlert size={44} />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-800/10 text-amber-900 border border-amber-800/20">
            HTTP 403 • Unauthorized Access
          </span>
          <h1 className="text-3xl font-serif font-bold text-amber-950 mt-3">
            Access Restricted
          </h1>
          <p className="text-amber-900/70 text-sm mt-2 leading-relaxed">
            You do not have the required clinical permissions to view this portal module. Please check your assigned role or re-authenticate.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <button
            onClick={() => navigate('/auth/select-role')}
            className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-xl font-medium text-sm transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <LogIn size={18} />
            <span>Switch Role / Re-login</span>
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full py-2.5 bg-amber-800/10 hover:bg-amber-800/20 text-amber-950 border border-amber-900/20 rounded-xl font-medium text-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <ArrowLeft size={16} />
            <span>Return to Previous Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;

