import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Activity, FileText, ClipboardList, 
  Settings, UserCircle, Bell, Search, Menu, 
  LogOut, HeartPulse, ChevronRight 
} from 'lucide-react';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const getNavigation = (role: string): SidebarItem[] => {
  switch(role) {
    case 'doctor':
      return [
        { icon: Activity, label: 'Dashboard', path: '/doctor' },
        { icon: Users, label: 'Patients', path: '/doctor/patients' },
        { icon: ClipboardList, label: 'Assessments', path: '/doctor/assessments' },
        { icon: FileText, label: 'Reports', path: '/doctor/reports' },
      ];
    case 'student':
      return [
        { icon: Activity, label: 'Dashboard', path: '/student' },
        { icon: Users, label: 'Assigned Patients', path: '/student/patients' },
        { icon: ClipboardList, label: 'Learning Tasks', path: '/student/tasks' },
      ];
    case 'patient':
      return [
        { icon: Activity, label: 'My Journey', path: '/patient' },
        { icon: ClipboardList, label: 'Assessments', path: '/patient/assessments' },
        { icon: FileText, label: 'My Reports', path: '/patient/reports' },
      ];
    default:
      return [];
  }
}

const DashboardLayout = ({ role }: { role: string }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigation = getNavigation(role);

  return (
    <div className="flex h-screen bg-[var(--color-sand)] overflow-hidden">
      
      {/* Sidebar Desktop */}
      <motion.aside 
        initial={{ width: 260 }}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="hidden md:flex flex-col bg-white border-r border-[var(--color-border)] shadow-sm z-20 transition-all duration-300"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--color-border)]/50">
          <div className={`flex items-center space-x-2 ${!sidebarOpen && 'justify-center w-full'}`}>
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center shrink-0">
              <HeartPulse size={18} />
            </div>
            {sidebarOpen && <span className="font-serif font-semibold text-[var(--color-primary)] text-xl whitespace-nowrap">AyurEssence</span>}
          </div>
        </div>

        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link key={item.path} to={item.path}>
                <div className={`
                  flex items-center space-x-3 px-3 py-3 rounded-xl transition-all group relative
                  ${isActive 
                    ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/10' 
                    : 'text-[var(--color-foreground)]/70 hover:bg-[var(--color-background)] hover:text-[var(--color-primary)]'}
                `}>
                  <Icon size={20} className={isActive ? 'text-white' : 'text-[var(--color-primary)]/60 group-hover:text-[var(--color-primary)]'} />
                  {sidebarOpen && <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>}
                  
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-[var(--color-border)]/50">
           <Link to="/auth/login" className="flex items-center space-x-3 px-3 py-2 text-red-500/80 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
             <LogOut size={20} />
             {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
           </Link>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[var(--color-border)] flex items-center justify-between px-6 z-10">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 hidden md:block">
              <Menu size={20} />
            </button>
            <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-500 font-medium">
               <span className="capitalize">{role} Portal</span>
               <ChevronRight size={14} />
               <span className="text-[var(--color-primary)]">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
             <div className="relative hidden md:block">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input type="text" placeholder="Search..." className="pl-9 pr-4 py-1.5 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:outline-none w-64" />
             </div>
             
             <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
               <Bell size={20} />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border border-white"></span>
             </button>
             
             <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center cursor-pointer">
               <UserCircle size={24} />
             </div>
          </div>
        </header>

        {/* Page Content with Transitions */}
        <main className="flex-1 overflow-auto p-6 md:p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
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
