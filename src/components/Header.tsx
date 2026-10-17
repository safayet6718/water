import React from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Droplets,
  Languages,
  Menu,
  Shield,
  Bike,
  Calculator,
  RotateCcw,
  UserCheck,
  UserPlus,
  LogIn,
  LogOut,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    currentUser,
    users,
    switchUserById,
    openUserDetailsModal,
    openUserEditModal,
    setActiveTab,
    language,
    setLanguage,
    settings,
    logout,
  } = useApp();

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                    {language === 'bn' && settings.nameBn ? settings.nameBn : settings.name || 'AquaTrack'}
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-black bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 uppercase tracking-wider">
                    QR PWA
                  </span>
                </div>
                <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-xs">
                  {settings.tagline}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Actions, Role Selector & Language */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer shadow-2xs"
              title="Switch Language"
            >
              <Languages className="w-3.5 h-3.5 text-sky-600" />
              <span>{language === 'bn' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Active Workspace / Role Indicator Badge */}
            {currentUser.role === 'admin' ? (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-black text-xs">
                <Shield className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</span>
              </div>
            ) : currentUser.role === 'customer' ? (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 font-black text-xs">
                <Droplets className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'গ্রাহক পোর্টাল' : 'Customer Portal'}</span>
              </div>
            ) : currentUser.role === 'delivery' ? (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-black text-xs">
                <Bike className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'রাইডার পোর্টাল' : 'Rider App'}</span>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 font-black text-xs">
                <Calculator className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ম্যানেজার প্যানেল' : 'Manager Panel'}</span>
              </div>
            )}

            {/* User Profile & Account Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openUserDetailsModal(currentUser)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  title={language === 'bn' ? 'প্রোফাইল বিবরণ দেখতে ক্লিক করুন' : 'Click to view profile'}
                >
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-lg object-cover border border-sky-400"
                    />
                  ) : currentUser.role === 'admin' ? (
                    <Shield className="w-4 h-4 text-amber-600" />
                  ) : currentUser.role === 'delivery' ? (
                    <Bike className="w-4 h-4 text-emerald-600" />
                  ) : currentUser.role === 'customer' ? (
                    <Droplets className="w-4 h-4 text-cyan-600" />
                  ) : (
                    <Calculator className="w-4 h-4 text-purple-600" />
                  )}
                  <div className="text-left hidden sm:block">
                    <div className="font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[110px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {currentUser.phone}
                    </div>
                  </div>
                </button>
              </div>

              {/* User Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                {/* Active user info */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 mb-2 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2.5">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-xl object-cover border border-sky-400"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black">
                        {currentUser.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {currentUser.phone}
                      </div>
                      <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 mt-0.5">
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => openUserDetailsModal(currentUser)}
                      className="py-1 px-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-sky-50 text-sky-700 dark:text-sky-300 font-bold text-[10px] text-center border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                    >
                      {language === 'bn' ? 'বিবরণ দেখুন' : 'View Profile'}
                    </button>
                    <button
                      onClick={() => openUserEditModal(currentUser)}
                      className="py-1 px-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] text-center shadow-xs transition cursor-pointer"
                    >
                      {language === 'bn' ? 'ছবি ও পাসওয়ার্ড' : 'Edit & Password'}
                    </button>
                  </div>
                </div>

                {/* Role Specific Actions */}
                <div className="space-y-1">
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="w-full text-left p-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition cursor-pointer font-bold"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                      <span>{language === 'bn' ? 'কর্মী ও ইউজার ম্যানেজমেন্ট' : 'Manage Users & Staff'}</span>
                    </button>
                  )}

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => setActiveTab('customer-portal')}
                      className="w-full text-left p-2 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition cursor-pointer"
                    >
                      <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{language === 'bn' ? 'গ্রাহক ভিউ প্রিভিউ করুন' : 'Preview Customer View'}</span>
                    </button>
                  )}

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => setActiveTab('new-delivery')}
                      className="w-full text-left p-2 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition cursor-pointer"
                    >
                      <Bike className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'bn' ? 'রাইডার ভিউ প্রিভিউ করুন' : 'Preview Rider View'}</span>
                    </button>
                  )}

                  {/* LOGOUT BUTTON */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                    <button
                      onClick={logout}
                      className="w-full text-left p-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition cursor-pointer font-bold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'লগআউট করুন' : 'Sign Out / Logout'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Direct Logout Button */}
            <button
              onClick={logout}
              className="sm:hidden p-1.5 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
              title={language === 'bn' ? 'লগআউট' : 'Logout'}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
