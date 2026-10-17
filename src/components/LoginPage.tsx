import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import {
  Droplets,
  Phone,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  MapPin,
  ArrowRight,
  Shield,
  Bike,
  Building2,
  Languages,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, registerUser, language, setLanguage, settings } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<Role>('customer');
  const [regAddress, setRegAddress] = useState('');
  const [regArea, setRegArea] = useState('Dhanmondi');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  const isBn = language === 'bn';

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginPhone.trim()) {
      setLoginError(isBn ? 'অনুগ্রহ করে মোবাইল নম্বর লিখুন।' : 'Please enter your phone number.');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError(isBn ? 'অনুগ্রহ করে পাসওয়ার্ড দিন।' : 'Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = login(loginPhone, loginPassword);
      setIsLoading(false);
      if (!result.success) {
        setLoginError(result.message);
      }
    }, 250);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim()) {
      setRegError(isBn ? 'আপনার পূর্ণ নাম লিখুন।' : 'Please enter your full name.');
      return;
    }
    if (!regPhone.trim()) {
      setRegError(isBn ? 'আপনার মোবাইল নম্বর লিখুন।' : 'Please enter your mobile number.');
      return;
    }
    if (!regPassword.trim() || regPassword.length < 4) {
      setRegError(
        isBn
          ? 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।'
          : 'Password must be at least 4 characters long.'
      );
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError(
        isBn ? 'উভয় পাসওয়ার্ড একই হতে হবে!' : 'Passwords do not match!'
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      registerUser({
        name: regName.trim(),
        phone: regPhone.trim(),
        role: regRole,
        address: regAddress.trim() || undefined,
        area: regArea.trim() || undefined,
        password: regPassword.trim(),
      });
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 antialiased selection:bg-cyan-500 selection:text-white relative overflow-hidden">
      {/* Decorative ambient background lights */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar: Brand & Language Toggle */}
      <header className="relative z-10 max-w-md w-full mx-auto flex items-center justify-between pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
            <Droplets className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
              <span>{isBn && settings.nameBn ? settings.nameBn : settings.name || 'AquaTrack'}</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-sky-500/20 text-sky-300 border border-sky-400/30 uppercase tracking-widest">
                PORTAL
              </span>
            </h1>
            <p className="text-[11px] text-sky-200/70 truncate max-w-[200px]">
              {settings.tagline || (isBn ? 'পানি সরবরাহ ও ডিজিটাল বিলিং' : 'Water Delivery & Billing')}
            </p>
          </div>
        </div>

        {/* Language button */}
        <button
          onClick={() => setLanguage(isBn ? 'en' : 'bn')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white transition cursor-pointer backdrop-blur-md active:scale-95"
          title="Switch Language"
        >
          <Languages className="w-3.5 h-3.5 text-sky-400" />
          <span>{isBn ? 'English' : 'বাংলা'}</span>
        </button>
      </header>

      {/* Main Login / Register Card */}
      <main className="relative z-10 max-w-md w-full mx-auto my-auto">
        <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/50">
          {/* Mode Switcher: Sign In vs Sign Up */}
          <div className="flex rounded-2xl bg-slate-800/80 p-1 mb-6 border border-white/5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setLoginError(null);
                setRegError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isBn ? 'লগইন করুন' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setLoginError(null);
                setRegError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isBn ? 'নতুন নিবন্ধন' : 'Register / Sign Up'}
            </button>
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  {isBn ? 'অ্যাকাউন্টে প্রবেশ করুন' : 'Welcome Back'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isBn
                    ? 'আপনার মোবাইল নম্বর ও পাসওয়ার্ড দিয়ে লগইন করুন'
                    : 'Log in with your registered phone number & password'}
                </p>
              </div>

              {loginError && (
                <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Phone Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  {isBn ? 'মোবাইল নম্বর / ইউজার আইডি' : 'Mobile Number / User ID'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder={isBn ? 'যেমন: 017xxxxxxxx' : 'e.g. 017xxxxxxxx'}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-medium transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300">
                    {isBn ? 'পাসওয়ার্ড' : 'Password'}
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={isBn ? 'আপনার পাসওয়ার্ড লিখুন' : 'Enter your password'}
                    className="w-full pl-10 pr-11 py-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-medium transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-black text-sm shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isBn ? 'লগইন করুন' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Help & Support Info */}
              <div className="pt-3 border-t border-white/5 text-center">
                <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 flex-wrap">
                  <HelpCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>{isBn ? 'লগইন বা পাসওয়ার্ড সংক্রান্ত সহায়তায় যোগাযোগ:' : 'Need login assistance? Contact:'}</span>
                </p>
                <div className="flex items-center justify-center gap-3 mt-1.5 font-mono text-xs text-sky-400 font-bold">
                  <a href="tel:01521311748" className="hover:underline hover:text-sky-300">
                    01521311748
                  </a>
                  <span>•</span>
                  <a href="tel:01764996718" className="hover:underline hover:text-sky-300">
                    01764996718
                  </a>
                </div>
              </div>
            </form>
          )}

          {/* REGISTRATION FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  {isBn ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create an Account'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isBn
                    ? 'গ্রাহক বা কর্মী হিসেবে নতুন আইডি রেজিস্ট্রেশন করুন'
                    : 'Register as customer, delivery rider, or staff'}
                </p>
              </div>

              {regError && (
                <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              {/* Account Role Selector */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-300">
                  {isBn ? 'অ্যাকাউন্টের ধরন / পদবী' : 'Select Account Type'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('customer')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition cursor-pointer ${
                      regRole === 'customer'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-xs'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-white'
                    }`}
                  >
                    <Droplets className="w-4 h-4" />
                    <span>{isBn ? 'গ্রাহক' : 'Customer'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('delivery')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition cursor-pointer ${
                      regRole === 'delivery'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60 shadow-xs'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-white'
                    }`}
                  >
                    <Bike className="w-4 h-4" />
                    <span>{isBn ? 'রাইডার' : 'Rider'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('admin')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition cursor-pointer ${
                      regRole === 'admin'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400/60 shadow-xs'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-white'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>{isBn ? 'অ্যাডমিন' : 'Admin'}</span>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-300">
                  {isBn ? 'পূর্ণ নাম' : 'Full Name'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sky-400">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={isBn ? 'আপনার নাম' : 'Your name'}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-300">
                  {isBn ? 'মোবাইল নম্বর' : 'Phone Number'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sky-400">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Address & Area */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300">
                    {isBn ? 'এলাকা (Area)' : 'Area'}
                  </label>
                  <input
                    type="text"
                    value={regArea}
                    onChange={(e) => setRegArea(e.target.value)}
                    placeholder="ধানমন্ডি / গুলশান"
                    className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300">
                    {isBn ? 'বিস্তারিত ঠিকানা' : 'Address'}
                  </label>
                  <input
                    type="text"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="রোড / বাসা নং"
                    className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300">
                    {isBn ? 'পাসওয়ার্ড তৈরি' : 'Create Password'}
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="কমপক্ষে ৪ অক্ষর"
                    className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300">
                    {isBn ? 'নিশ্চিত করুন' : 'Confirm Password'}
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="একই পাসওয়ার্ড"
                    className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {showRegPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showRegPassword ? (isBn ? 'পাসওয়ার্ড লুকান' : 'Hide') : (isBn ? 'পাসওয়ার্ড দেখুন' : 'Show')}</span>
                </button>
              </div>

              {/* Submit Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isBn ? 'অ্যাকাউন্ট তৈরি করুন' : 'Complete Registration'}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-md w-full mx-auto text-center pt-4 text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} {settings.name} • {isBn ? 'সুরক্ষিত ও এনক্রিপ্টেড সংযোগ' : 'Secure & Encrypted'}
        </p>
      </footer>
    </div>
  );
};
