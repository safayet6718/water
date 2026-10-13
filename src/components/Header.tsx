import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import { AuthModal } from './AuthModal';
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
    resetAllData,
  } = useApp();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

            {/* Quick Role Switcher / Account Button */}
            <div className="relative group">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openUserDetailsModal(currentUser)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  title={language === 'bn' ? 'প্রোফাইল দেখতে ক্লিক করুন' : 'Click to view profile'}
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

              {/* Dropdown to test roles quickly and edit profile */}
              <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                {/* Active user header with quick edit */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 mb-2 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2.5">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-9 h-9 rounded-xl object-cover border border-sky-400"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black">
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
                      {language === 'bn' ? 'ছবি ও তথ্য এডিট' : 'Edit Profile'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span>{language === 'bn' ? 'ইউজার নির্বাচন করুন' : 'Switch Demo User'}</span>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-sky-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>{language === 'bn' ? 'নতুন ইউজার' : 'New User'}</span>
                  </button>
                </div>

                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => switchUserById(u.id)}
                      className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                        u.id === currentUser.id
                          ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {u.avatar ? (
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : u.role === 'admin' ? (
                          <Shield className="w-3.5 h-3.5 text-amber-600" />
                        ) : u.role === 'delivery' ? (
                          <Bike className="w-3.5 h-3.5 text-emerald-600" />
                        ) : u.role === 'customer' ? (
                          <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                        ) : (
                          <Calculator className="w-3.5 h-3.5 text-purple-600" />
                        )}
                        <div>
                          <div className="truncate max-w-[130px]">{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{u.phone}</div>
                        </div>
                      </div>
                      {u.id === currentUser.id && <UserCheck className="w-3.5 h-3.5 text-sky-600" />}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-1.5 space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                    }}
                    className="w-full text-left p-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition cursor-pointer font-bold"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                    <span>{language === 'bn' ? 'সকল ইউজার ম্যানেজমেন্ট' : 'Manage All Users'}</span>
                  </button>

                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full text-left p-2 rounded-xl text-xs text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/40 flex items-center gap-2 transition cursor-pointer font-bold"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'লগইন বা রেজিস্টার' : 'Login / Register'}</span>
                  </button>

                  <button
                    onClick={resetAllData}
                    className="w-full text-left p-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'ডেমো ডেটা রিসেট' : 'Reset Demo Data'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};
