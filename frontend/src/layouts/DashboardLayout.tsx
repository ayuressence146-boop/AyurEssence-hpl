import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Activity, FileText, ClipboardList, 
  Settings, UserCircle, Bell, Search, Menu, 
  LogOut, Heart, GraduationCap, Stethoscope, ChevronRight,
  Calendar, Award, MessageSquare, BarChart2, ShieldAlert
} from 'lucide-react';
import { authService } from '../services/api';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const getNavigation = (role: string): SidebarItem[] => {
  switch(role) {
    case 'doctor':
      return [
        { icon: Activity, label: 'Doctor Dashboard', path: '/doctor' },
        { icon: Users, label: 'Patient List', path: '/doctor/patients' },
        { icon: Users, label: 'Add Patient', path: '/doctor/patients/add' },
        { icon: ClipboardList, label: 'Create Assessment', path: '/doctor/assessments/create' },
        { icon: FileText, label: 'Reports & Export', path: '/doctor/reports/generate' },
        { icon: Calendar, label: 'Follow-ups & Reminders', path: '/doctor/follow-ups' },
        { icon: UserCircle, label: 'My Profile', path: '/doctor/profile' },
        { icon: Bell, label: 'Notifications', path: '/doctor/notifications' },
        { icon: Settings, label: 'Settings', path: '/doctor/settings' },
      ];
    case 'student':
      return [
        { icon: Activity, label: 'Student Dashboard', path: '/student' },
        { icon: ClipboardList, label: 'Assigned Assessments', path: '/student/tasks' },
        { icon: GraduationCap, label: 'Conduct Assessment', path: '/student/assessments/conduct' },
        { icon: MessageSquare, label: 'Mentor Feedback', path: '/student/feedback' },
        { icon: BarChart2, label: 'Student Analytics', path: '/student/analytics' },
        { icon: UserCircle, label: 'My Profile', path: '/student/profile' },
        { icon: Bell, label: 'Notifications', path: '/student/notifications' },
        { icon: Settings, label: 'Settings', path: '/student/settings' },
      ];
    case 'patient':
      return [
        { icon: Activity, label: 'Patient Dashboard', path: '/patient' },
        { icon: Heart, label: 'My Prakriti Assessment', path: '/patient/assessment' },
        { icon: Award, label: 'Prakriti Result', path: '/patient/result' },
        { icon: FileText, label: 'Ayurvedic Recommendations', path: '/patient/recommendation' },
        { icon: FileText, label: 'My Health Reports', path: '/patient/reports' },
        { icon: Calendar, label: 'Timeline & Reminders', path: '/patient/timeline' },
        { icon: UserCircle, label: 'My Profile', path: '/patient/profile' },
        { icon: Bell, label: 'Notifications', path: '/patient/notifications' },
        { icon: Settings, label: 'Settings', path: '/patient/settings' },
      ];
    default:
      return [];
  }
}

const DashboardLayout = ({ role }: { role: string }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = getNavigation(role);
  const currentUser = authService.getStoredUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/auth/login');
  };

  const getRoleIcon = () => {
    if (role === 'doctor') return Stethoscope;
    if (role === 'student') return GraduationCap;
    return Heart;
  };

  const RoleIcon = getRoleIcon();

  return (
    <div 
      className="flex h-screen w-full overflow-hidden text-[#2b2721] selection:bg-[#2b2721] selection:text-[#ece7dc]"
      style={{
        backgroundImage: 'url(/landing-pages/meng-to-sketchbook/bg-wash.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      
      {/* DESKTOP SIDEBAR */}
      <motion.aside 
        initial={{ width: 260 }}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="hidden md:flex flex-col bg-[#fcfaf4]/90 backdrop-blur-md border-r border-[#2b2721]/15 shadow-sm z-20 transition-all duration-300 relative overflow-hidden"
      >
        {/* Botany Accent */}
        <img 
          src="/landing-pages/meng-to-sketchbook/botany-left.png" 
          alt="" 
          className="absolute left-0 bottom-0 w-[140px] opacity-15 pointer-events-none select-none z-0" 
        />

        {/* Sidebar Header Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#2b2721]/10 relative z-10">
          <Link to="/landing" className={`flex items-center space-x-2.5 ${!sidebarOpen && 'justify-center w-full'}`}>
            <div className="w-9 h-9 rounded-full bg-[#2b2721] text-[#ece7dc] flex items-center justify-center shrink-0 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            {sidebarOpen && (
              <span className="font-serif italic font-bold text-[#2b2721] text-xl whitespace-nowrap tracking-tight">
                AyurEssence
              </span>
            )}
          </Link>
        </div>

        {/* User Role Badge Card */}
        {sidebarOpen && (
          <div className="mx-3 mt-4 mb-2 p-3 bg-[#2b2721]/6 border border-[#2b2721]/10 rounded-2xl flex items-center space-x-3 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-[#2b2721] text-[#ece7dc] flex items-center justify-center shrink-0 shadow-sm">
              <RoleIcon size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-[#2b2721] truncate">
                {currentUser?.full_name || (role === 'doctor' ? 'Dr. Practitioner' : role === 'student' ? 'Ayurvedic Scholar' : 'Ayur Essence Patient')}
              </h4>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2b2721]/60 block">
                {role} Portal
              </span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 py-3 px-3 space-y-1 overflow-y-auto relative z-10">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link key={item.path} to={item.path}>
                <div className={`
                  flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all group relative font-medium text-xs sm:text-sm
                  ${isActive 
                    ? 'bg-[#2b2721] text-[#ece7dc] shadow-md shadow-[#2b2721]/20 font-bold' 
                    : 'text-[#2b2721]/75 hover:bg-[#2b2721]/8 hover:text-[#2b2721]'}
                `}>
                  <Icon size={18} className={isActive ? 'text-[#ece7dc]' : 'text-[#2b2721]/60 group-hover:text-[#2b2721]'} />
                  {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
                  
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#2b2721] text-[#ece7dc] text-xs rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                      {item.label}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Logout Action */}
        <div className="p-3 border-t border-[#2b2721]/10 relative z-10">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center space-x-3 px-3 py-2.5 text-red-700/80 hover:text-red-800 hover:bg-red-500/10 rounded-xl transition-all font-semibold text-xs"
           >
             <LogOut size={18} />
             {sidebarOpen && <span>Sign Out</span>}
           </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        
        {/* Top Header Navbar */}
        <header className="h-16 bg-[#fcfaf4]/80 backdrop-blur-md border-b border-[#2b2721]/10 flex items-center justify-between px-4 sm:px-6 z-10">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 rounded-xl text-[#2b2721] hover:bg-[#2b2721]/10 transition-colors hidden md:block"
            >
              <Menu size={18} />
            </button>

            <div className="flex items-center space-x-2 text-xs text-[#2b2721]/60 font-medium">
               <span className="capitalize font-bold text-[#2b2721]">{role} Workspace</span>
               <ChevronRight size={14} />
               <span className="text-[#2b2721]/80 font-serif capitalize">
                 {location.pathname.split('/')[2] || 'Dashboard'}
               </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
             <div className="relative hidden md:block">
               <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2b2721]/40" />
               <input 
                 type="text" 
                 placeholder="Search Prakriti, patients, reports..." 
                 className="pl-9 pr-4 py-1.5 bg-[#2b2721]/5 border border-[#2b2721]/15 rounded-full text-xs text-[#2b2721] placeholder-[#2b2721]/40 focus:outline-none focus:ring-2 focus:ring-[#2b2721]/20 w-56 sm:w-64 transition-all" 
               />
             </div>
             
             <Link 
               to={`/${role}/notifications`} 
               className="relative p-2 text-[#2b2721]/80 hover:bg-[#2b2721]/10 rounded-full transition-colors"
             >
               <Bell size={18} />
               <span className="absolute top-1 right-1 w-2 h-2 bg-amber-600 rounded-full border border-white"></span>
             </Link>
             
             <Link 
               to={`/${role}/profile`} 
               className="w-8 h-8 rounded-full bg-[#2b2721] text-[#ece7dc] flex items-center justify-center font-serif font-bold text-xs shadow-md"
             >
               {currentUser?.full_name?.charAt(0) || role.charAt(0).toUpperCase()}
             </Link>
          </div>
        </header>

        {/* Dynamic Page Outlet with Smooth Motion */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;

